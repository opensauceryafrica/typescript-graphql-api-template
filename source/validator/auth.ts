import Joi from 'joi';
import { AccountType } from '../types/user/enum';
import { ILogin, INewUser, IOnboard, IPasswordReset, IPasswordUpdate } from '../types/user/auth';
import { Currency } from '../types/misc/currency';
import { Country } from '../types/misc/country';

export const register = Joi.object<INewUser>({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    type: Joi.string()
        .valid(...Object.values(AccountType).map((type) => type.toUpperCase()))
        .required(),
    companyName: Joi.string().when('type', {
        is: AccountType.Company,
        then: Joi.required(),
    }),
    website: Joi.string().when('type', {
        is: AccountType.Company,
        then: Joi.required(),
    }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#?.&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one number, one letter and one special character',
            'string.min': 'Password must be at least 8 characters long',
        }),
}).required();

export const login = Joi.object<ILogin>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).required();

export const onboard = Joi.object<IOnboard>({
    monthlyRecurringRevenue: Joi.number().required(),
    operationCountry: Joi.string()
        .required()
        .valid(...Object.values(Country)),
    reportingCurrency: Joi.string()
        .required()
        .valid(...Object.values(Currency)),
    phone: Joi.string().required(),
    otp: Joi.string().required(),
}).required();

export const requestPhoneVerification = Joi.object<{ phone: string }>({
    phone: Joi.string().required(),
}).required();

export const requestEmailVerification = Joi.object<ILogin>({
    email: Joi.string().email().required(),
}).required();

export const verifyEmail = Joi.object<IPasswordReset>({
    token: Joi.string().required(),
}).required();

export const updatePassword = Joi.object<IPasswordUpdate>({
    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#?.&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one number, one letter and one special character',
            'string.min': 'Password must be at least 8 characters long',
        }),
    oldPassword: Joi.string().required(),
}).required();

export const recoverPassword = Joi.object<IPasswordReset>({
    email: Joi.string().email().required(),
}).required();

export const resetPassword = Joi.object<IPasswordReset>({
    token: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#?.&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one number, one letter and one special character',
            'string.min': 'Password must be at least 8 characters long',
        }),
}).required();
