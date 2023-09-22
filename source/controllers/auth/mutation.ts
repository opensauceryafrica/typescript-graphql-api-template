import * as response from '../../helpers/response';
import * as authvalidator from '../../validator/auth';
import * as authenticator from '../../middleware/authenticate';
import validate from '../../validator/validate';
import * as authlogic from '../../logics/auth';
import { IContext } from '../../types/misc/generic';
import { ILogin, INewUser, IOnboard, IPasswordReset, IPasswordUpdate } from '../../types/user/auth';
import { GraphResponse } from '../../types/misc/graphql';
import { logger } from '../../log/logger';
import { Role } from '../../types/user/enum';

export const deleteUser = async (_: unknown, data: { input: { email: string } }, context: IContext) => {
    const logic = await authlogic.deleteUser(data.input);
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};

export const register = async (_: unknown, data: { input: INewUser }, context: IContext) => {
    const validation = validate(authvalidator.register, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to register user ${data.input.email} with payload ${JSON.stringify(
            { ...data.input, password: '********' },
        )}`,
    );

    const logic = await authlogic.register({
        ...data.input,
        referer: context.referer,
    });
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to register user ${data.input.email} with payload ${JSON.stringify({
            ...data.input,
            password: '********',
        })} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.RespondWithUser, logic.message, logic.data);
};

export const login = async (_: unknown, data: { input: ILogin }, context: IContext) => {
    const validation = validate(authvalidator.login, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to login user ${data.input.email} with payload ${JSON.stringify({
            ...data.input,
            password: '********',
        })}`,
    );

    const logic = await authlogic.login({ ...data.input, ip: context.ip });
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to login user ${data.input.email} with payload ${JSON.stringify({
            ...data.input,
            password: '********',
        })} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.RespondWithUserAndToken, logic.message, logic.data);
};

export const onboard = async (_: unknown, data: { input: IOnboard }, context: IContext) => {
    const access = authenticator.validateAccess(
        context.user!,
        [Role.User],
        [],
        [
            {
                key: 'emailVerified',
                value: true,
                error: 'Email not verified!',
            },
            {
                key: 'onboarded',
                value: false,
                error: 'Onboarding already completed!',
            },
        ],
    );
    if (!access.status) {
        return response.sendErrorResponse(access.message, 403);
    }

    const validation = validate(authvalidator.onboard, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to onboard user ${context.user?.id} with payload ${JSON.stringify(
            data.input,
        )}`,
    );

    const logic = await authlogic.onboard(context.user!.id, data.input);
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to onboard user ${context.user?.id} with payload ${JSON.stringify(
            data.input,
        )} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.RespondWithUser, logic.message, logic.data);
};

export const requestPhoneVerification = async (_: unknown, data: { input: { phone: string } }, context: IContext) => {
    const access = authenticator.validateAccess(
        context.user!,
        [Role.User],
        [],
        [
            {
                key: 'emailVerified',
                value: true,
                error: 'Email not verified!',
            },
        ],
    );
    if (!access.status) {
        return response.sendErrorResponse(access.message, 403);
    }

    const validation = validate(authvalidator.requestPhoneVerification, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to request OTP for user ${
            context.user?.id
        } with payload ${JSON.stringify(data.input)}`,
    );

    const logic = await authlogic.requestPhoneVerification(context.user!.id, data.input);
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to request OTP for user ${
            context.user?.id
        } with payload ${JSON.stringify(data.input)} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};

export const requestEmailVerification = async (_: unknown, data: { input: ILogin }, context: IContext) => {
    const validation = validate(authvalidator.requestEmailVerification, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to request email verification for user ${
            data.input.email
        } with payload ${JSON.stringify(data.input)}`,
    );

    const logic = await authlogic.requestEmailVerification({
        ...data.input,
        referer: context.referer,
    });
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to request email verification for user ${
            data.input.email
        } with payload ${JSON.stringify(data.input)} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};

export const verifyEmail = async (_: unknown, data: { input: IPasswordReset }, context: {}) => {
    const validation = validate(authvalidator.verifyEmail, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to verify email for user ${
            data.input.token
        } with payload ${JSON.stringify(data.input)}`,
    );

    const logic = await authlogic.verifyEmail(data.input);
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to verify email for user ${
            data.input.token
        } with payload ${JSON.stringify(data.input)} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};

export const updatePassword = async (_: unknown, data: { input: IPasswordUpdate }, context: IContext) => {
    const access = authenticator.validateAccess(
        context.user!,
        [Role.User],
        [],
        [
            {
                key: 'emailVerified',
                value: true,
                error: 'Email not verified!',
            },
            {
                key: 'phoneVerified',
                value: true,
                error: 'Phone number not verified!',
            },
            {
                key: 'onboarded',
                value: true,
                error: 'Onboarding not completed!',
            },
        ],
    );
    if (!access.status) {
        return response.sendErrorResponse(access.message, 403);
    }

    const validation = validate(authvalidator.updatePassword, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(`[${new Date().toUTCString()}] :: start call to update password for user ${context.user?.id}}`);

    const logic = await authlogic.updatePassword(context.user!.id, {
        ...data.input,
        ip: context.ip,
    });
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to update password for user ${context.user?.id} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};

export const recoverPassword = async (_: unknown, data: { input: IPasswordReset }, context: IContext) => {
    const validation = validate(authvalidator.recoverPassword, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: start call to recover password for user ${
            data.input.email
        } with payload ${JSON.stringify(data.input)}`,
    );

    const logic = await authlogic.recoverPassword({
        ...data.input,
        referer: context.referer,
    });
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to recover password for user ${
            data.input.email
        } with payload ${JSON.stringify(data.input)} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};

export const resetPassword = async (_: unknown, data: { input: IPasswordReset }, context: IContext) => {
    const validation = validate(authvalidator.resetPassword, data.input);
    if (!validation.status) {
        return response.sendErrorResponse(validation.message, 400);
    }

    logger.debug(`[${new Date().toUTCString()}] :: start call to reset password for user ${data.input.token}`);

    const logic = await authlogic.resetPassword({
        ...data.input,
        ip: context.ip,
    });
    if (!logic.status) {
        return response.sendErrorResponse(logic.message, 400);
    }

    logger.debug(
        `[${new Date().toUTCString()}] :: end call to reset password for user ${data.input.token} :: ${logic.message}`,
    );

    return response.sendSuccessResponse(GraphResponse.Respond, logic.message, logic.data);
};
