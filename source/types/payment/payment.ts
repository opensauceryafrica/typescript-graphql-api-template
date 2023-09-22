import { FlutterwaveConfig } from '../misc/flutterwave';
import { TUser } from '../user/user';
import { IInvoice } from './invoice';
import mongoose from 'mongoose';

export interface IPayment {
    _id: mongoose.ObjectId;
    reference: string;
    initiator: TUser | string | mongoose.ObjectId;
    invoice: IInvoice | string | mongoose.ObjectId;
    initialConfig: FlutterwaveConfig;
    finalConfig: object;
    paymentLink?: string;
    amount: number;
    history: {
        description: string;
        author: TUser | mongoose.ObjectId | string;
        date: Date;
    }[];
    currency: string;
    paidAt: Date;
    paid: boolean;
    cancelled: boolean;
    cancelledAt: Date;

    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export type TPayment = mongoose.Document &
    IPayment & {
        jsonify(): Record<string, any>;
    };
