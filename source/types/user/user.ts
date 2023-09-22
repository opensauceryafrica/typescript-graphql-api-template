import mongoose from 'mongoose';

export interface IUser {
    _id: mongoose.ObjectId;
    id: mongoose.ObjectId;

    firstName: string;
    lastName: string;
    email: string;
    password: string;
    type: string;
    companyName?: string;
    website?: string;

    monthlyRecurringRevenue?: number;
    operationCountry?: string;
    reportingCurrency?: string;
    phone?: string;

    otp?: string; // now used to store the pin id from Termii
    expiry?: Date; // currently not used due to a switch to Termii
    emailVerified: boolean;
    phoneVerified: boolean;
    onboarded: boolean;

    role: string;
    permissions?: any;

    createdAt: Date;
    updatedAt: Date;
}

export type TUser = mongoose.Document &
    IUser & {
        jsonify(): Record<string, any>;
    };
