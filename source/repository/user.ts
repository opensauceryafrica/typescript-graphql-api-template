import UserModel from '../model/user';
import mongoose from 'mongoose';
import { IUser, TUser } from '../types/user/user';
import { INewUser } from '../types/user/auth';
import { Page } from '../types/misc/pagination';
import { Pager } from '../types/misc/pagination';
import * as func from '../helpers/func';

export const createUser = async (data: INewUser, session?: mongoose.ClientSession): Promise<TUser> => {
    return await new UserModel(data).save({ session });
};

export const findByEmail = async (email: string): Promise<TUser | null> => {
    return await UserModel.findOne({ email });
};

export const findById = async (id: mongoose.ObjectId): Promise<TUser | null> => {
    return await UserModel.findOne({ _id: id });
};

export const findByIdAndUpdate = async (
    id: mongoose.ObjectId,
    data: IUser | Partial<Record<keyof IUser, any>> | mongoose.RootQuerySelector<IUser> | mongoose.UpdateQuery<IUser>,
    session?: mongoose.ClientSession,
): Promise<TUser | null> => {
    return await UserModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
        session,
    });
};

export const findOneByMatch = async (
    data: IUser | Partial<Record<keyof IUser, any>> | mongoose.RootQuerySelector<IUser> | mongoose.UpdateQuery<IUser>,
): Promise<TUser | null> => {
    return await UserModel.findOne(data);
};

export const findAllByMatch = async (
    data: IUser | Partial<Record<keyof IUser, any>> | mongoose.RootQuerySelector<IUser> | mongoose.UpdateQuery<IUser>,
    page: Page,
): Promise<TUser[] | null> => {
    return await UserModel.find(data)
        .sort({ updatedAt: func.sortDirection(page.sort!) || Pager.Sort })
        .skip(page.offset || Pager.Offset)
        .limit(page.limit || Pager.Limit);
};

export const cascadingDelete = async (
    id: string | mongoose.ObjectId,
    session?: mongoose.ClientSession,
): Promise<boolean> => {
    // find user
    let user: TUser | null;
    if (mongoose.isValidObjectId(id)) {
        user = await findById(id as mongoose.ObjectId);
    } else {
        user = await findByEmail(id as string);
    }
    if (!user) {
        return false;
    }
    // delete user
    user.deleteOne({ session });
    return true;
};
