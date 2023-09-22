import mongoose from 'mongoose';

export type TFactory = mongoose.Document & {
    _id: mongoose.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    invoice: number;
};
