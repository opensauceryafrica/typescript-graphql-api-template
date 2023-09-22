import mongoose from 'mongoose';
import { IPayment } from './payment';
import { TUser } from '../user/user';

export interface IInvoice {
    _id: mongoose.ObjectId;
    initiator: TUser | string | mongoose.ObjectId;
    items: {
        key: string;
        name: string;
        price: number;
        occurrence: number;
        days: number;
    }[];

    amount: number;
    currency: string;
    paid: boolean;
    cancelled: boolean;
    number: string;
    payment: IPayment | string | mongoose.ObjectId;
    history: {
        description: string;
        author: TUser | mongoose.ObjectId | string;
        date: Date;
    }[];

    checksum: string;

    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export type TInvoice = mongoose.Document &
    IInvoice & {
        jsonify(): Record<string, any>;
    };
