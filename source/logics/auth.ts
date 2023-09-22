import { MakeResponse } from '../types/misc/generic';
import * as response from '../helpers/response';
import * as userRepository from '../repository/user';
import * as bcrypt from '../helpers/bcrypt';
import mongoose from 'mongoose';
import * as jwt from '../helpers/jwt';
import * as func from '../helpers/func';
import * as mailjet from '../service/mailjet';
import * as termii from '../service/termii';
import { ILogin, INewUser, IOnboard, IPasswordReset, IPasswordUpdate } from '../types/user/auth';
import { logger } from '../log/logger';
import env from '../config/env';

export async function deleteUser(payload: { email: string }): Promise<MakeResponse> {
    await userRepository.cascadingDelete(payload.email);
    return response.makeResponse(true, 'User deleted.', {});
}

export async function register(payload: INewUser): Promise<MakeResponse> {
    try {
        let user = await userRepository.findByEmail(payload.email.toLowerCase());
        if (user) {
            return response.makeResponse(false, 'Email already in use!', {});
        }

        // create user user
        user = await userRepository.createUser({
            password: bcrypt.generateHashedPassword(payload.password),
            email: payload.email.toLowerCase(),
            firstName: payload.firstName,
            lastName: payload.lastName,
            type: payload.type,
            companyName: payload.companyName || '',
            website: payload.website || '',
        });
        if (!user) {
            return response.makeResponse(false, 'User creation failed!', {});
        }

        const token = jwt.signToken({ email: user.email }, '5m');
        await mailjet.sendMail(
            user.email,
            env.mail.template.accountActivation.subject,
            env.mail.template.accountActivation.html,
            {
                firstName: user.firstName,
                link: `${
                    payload.referer?.includes('localhost') ? env.domain.user.web.dev : env.domain.user.web.stage
                }/verify-email?token=${token}&email=${user.email}`,
            },
        );

        return response.makeResponse(true, 'Registration successful.', user);
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while registering user ${
                payload.email
            } with payload ${JSON.stringify(payload)} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function login(payload: ILogin): Promise<MakeResponse> {
    try {
        const user = await userRepository.findByEmail(payload.email.toLowerCase());
        if (!user) {
            return response.makeResponse(false, 'Invalid login credentials!', {});
        }

        if (!bcrypt.compareHashedPassword(payload.password, user.password)) {
            return response.makeResponse(false, 'Invalid login credentials!', {});
        }

        await mailjet.sendMail(user.email, env.mail.template.signinAlert.subject, env.mail.template.signinAlert.html, {
            firstName: user.firstName,
            time: new Date().toUTCString(),
            ip: payload.ip || 'unknown',
        });

        return response.makeResponse(true, 'Login successful.', {
            user: user,
            token: jwt.signToken({ id: user._id }),
        });
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while logging in user ${
                payload.email
            } with payload ${JSON.stringify({ email: payload.email })} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function onboard(userId: mongoose.ObjectId, payload: IOnboard): Promise<MakeResponse> {
    try {
        let user = await userRepository.findById(userId);
        if (!user) {
            return response.makeResponse(false, 'Login required!', {});
        }

        // verify otp
        const res = await termii.verifyToken(payload.otp, user.otp!);
        if (!res.status || !res.data.verified) {
            return response.makeResponse(false, 'Invalid or expired OTP!', {});
        }

        // verify phone
        const duplicatePhone = await userRepository.findOneByMatch({
            phone: payload.phone,
        });
        if (duplicatePhone) {
            return response.makeResponse(false, 'Phone number already in use!', {});
        }

        // @TODO: phone number normalization

        user = await userRepository.findByIdAndUpdate(
            userId,
            Object.assign(payload, {
                otp: undefined,
                expiry: undefined,
                phoneVerified: true,
                onboarded: true,
            }),
        );
        if (!user) {
            return response.makeResponse(false, 'Onboarding failed!', {});
        }
        return response.makeResponse(true, 'Onboarding successful.', user);
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while onboarding user ${userId} with payload ${JSON.stringify(
                payload,
            )} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function requestPhoneVerification(
    userId: mongoose.ObjectId,
    payload: { phone: string },
): Promise<MakeResponse> {
    try {
        const user = await userRepository.findById(userId);
        if (!user) {
            return response.makeResponse(false, 'Login required!', {});
        }

        if (user.phoneVerified) {
            return response.makeResponse(false, 'Phone number already verified!', {});
        }

        // @TODO: rate limit otp requests

        // verify phone
        const duplicatePhone = await userRepository.findOneByMatch({
            phone: payload.phone,
        });
        if (duplicatePhone && duplicatePhone._id.toString() !== userId) {
            return response.makeResponse(false, 'Phone number already in use!', {});
        }

        if (duplicatePhone && duplicatePhone.phoneVerified) {
            return response.makeResponse(false, 'Phone number already verified!', {});
        }

        const res = await termii.sendToken(payload.phone, 4, 'NUMERIC');
        logger.debug(`[${new Date().toUTCString()}] :: intercepted Termii response ${JSON.stringify(res)}`);
        if (!res.status || !res.data.pinId) {
            return response.makeResponse(false, 'Failed to send OTP! Please retry.', {});
        }

        await userRepository.findByIdAndUpdate(userId, {
            otp: res.data.pinId,
        });

        return response.makeResponse(true, 'OTP sent.', {});
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while requesting OTP for user ${userId} with phone ${
                payload.phone
            } :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function updatePassword(userId: mongoose.ObjectId, payload: IPasswordUpdate): Promise<MakeResponse> {
    try {
        let user = await userRepository.findById(userId);
        if (!user) {
            return response.makeResponse(false, 'Login required!', {});
        }
        if (!bcrypt.compareHashedPassword(payload.oldPassword, user.password)) {
            return response.makeResponse(false, 'Password incorrect!', {});
        }
        const password = bcrypt.generateHashedPassword(payload.newPassword);
        user = await userRepository.findByIdAndUpdate(userId, { password });
        if (!user?.isModified) {
            return response.makeResponse(false, 'Password update failed!', {});
        }
        await mailjet.sendMail(
            user.email,
            env.mail.template.passwordAlert.subject,
            env.mail.template.passwordAlert.html,
            {
                firstName: user.firstName,
                time: new Date().toUTCString(),
                ip: payload.ip || 'unknown',
            },
        );
        return response.makeResponse(true, 'Password updated.', {});
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while updating password for user ${userId} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function recoverPassword(payload: IPasswordReset): Promise<MakeResponse> {
    try {
        let user = await userRepository.findOneByMatch({
            email: payload.email.toLowerCase(),
        });
        if (!user) {
            return response.makeResponse(false, 'Login required!', {});
        }
        const token = jwt.signToken({ email: user.email }, '5m');

        await mailjet.sendMail(
            user.email,
            env.mail.template.passwordReset.subject,
            env.mail.template.passwordReset.html,
            {
                firstName: user.firstName,
                link: `${
                    payload.referer?.includes('localhost') ? env.domain.user.web.dev : env.domain.user.web.stage
                }/reset-password?token=${token}`,
            },
        );

        return response.makeResponse(true, 'Password recovery initiated', {});
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while recovering password user ${
                payload.email
            } with payload ${JSON.stringify({
                email: payload.email,
                token: payload.token,
            })} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function resetPassword(payload: IPasswordReset): Promise<MakeResponse> {
    try {
        const verified = await jwt.verifyToken(payload.token);
        if (!verified.status) {
            return response.makeResponse(false, 'Reset link is invalid or has expired!', {});
        }
        let user = await userRepository.findOneByMatch({
            email: verified.data['email'] as string,
        });
        if (!user) {
            return response.makeResponse(false, 'Reset link is invalid!', {});
        }
        let password = bcrypt.generateHashedPassword(payload.password);
        user = await userRepository.findByIdAndUpdate(user._id, { password });
        if (!user?.isModified) {
            return response.makeResponse(false, 'Password reset failed!', {});
        }
        await mailjet.sendMail(
            user.email,
            env.mail.template.passwordAlert.subject,
            env.mail.template.passwordAlert.html,
            {
                firstName: user.firstName,
                time: new Date().toUTCString(),
                ip: payload.ip || 'unknown',
            },
        );
        return response.makeResponse(true, 'Password reset successful.', {});
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while reseting password user ${
                payload.email
            } with payload ${JSON.stringify({
                email: payload.email,
                token: payload.token,
            })} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function requestEmailVerification(payload: ILogin): Promise<MakeResponse> {
    try {
        let user = await userRepository.findOneByMatch({
            email: payload.email.toLowerCase(),
        });
        if (!user) {
            return response.makeResponse(false, 'Login required!', {});
        }

        const token = jwt.signToken({ email: user.email }, '5m');

        await mailjet.sendMail(
            user.email,
            env.mail.template.accountActivation.subject,
            env.mail.template.accountActivation.html,
            {
                firstName: user.firstName,
                link: `${
                    payload.referer?.includes('localhost') ? env.domain.user.web.dev : env.domain.user.web.stage
                }/verify-email?token=${token}&email=${user.email}}`,
            },
        );

        return response.makeResponse(true, 'Verification link sent.', {});
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while requesting email verification user ${
                payload.email
            } with payload ${JSON.stringify({
                email: payload.email,
            })} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}

export async function verifyEmail(payload: IPasswordReset): Promise<MakeResponse> {
    try {
        const verified = await jwt.verifyToken(payload.token);
        if (!verified.status) {
            return response.makeResponse(false, 'Verification link is invalid or has expired!', {});
        }
        let user = await userRepository.findOneByMatch({
            email: verified.data['email'] as string,
        });
        if (!user) {
            return response.makeResponse(false, 'Verification link is invalid!', {});
        }
        user = await userRepository.findByIdAndUpdate(user._id, {
            emailVerified: true,
        });
        if (!user?.isModified) {
            return response.makeResponse(false, 'Email verification failed!', {});
        }
        return response.makeResponse(true, 'Email verification successful.', {});
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while verifying email for user ${
                payload.email
            } with payload ${JSON.stringify({
                email: payload.email,
            })} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}
