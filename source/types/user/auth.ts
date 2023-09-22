export interface INewUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    type: string;
    companyName?: string;
    website?: string;
    role?: string;
    referer?: string;
}

export interface IOnboard {
    monthlyRecurringRevenue: number;
    operationCountry: string;
    reportingCurrency: string;
    phone: string;
    otp: string;
    companySize: number;
}

export interface ILogin {
    email: string;
    password: string;
    ip: string;
    referer: string;
}

export interface IVerifyEmail {
    token: string;
}

export interface IRequestOTP {
    phone: string;
}

export interface IPasswordUpdate {
    oldPassword: string;
    newPassword: string;
    ip: string;
}

export interface IPasswordReset {
    token: string;
    password: string;
    email: string;
    ip: string;
    referer: string;
}
