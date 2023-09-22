import { TUser } from '../user/user';
import mongoose from 'mongoose';

export interface ICard {
    _id: mongoose.ObjectId;
    first6digits: string;
    last4digits: string;
    owner: TUser | string | mongoose.ObjectId;
    token: string;
    issuer: string;
    country: string;
    type: string;
    expiry: string;
    checksum: string;
    email: string;

    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export type TCard = mongoose.Document &
    ICard & {
        jsonify(): Record<string, any>;
    };
