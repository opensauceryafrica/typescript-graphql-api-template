import FactoryModel from '../model/factory';
import { HydratedDocument } from 'mongoose';
import { TFactory } from '../types/misc/factory';
import env from '../config/env';

export const createNewFactory = async (data: TFactory): Promise<TFactory> => {
    return await new FactoryModel(data).save();
};

export const shiftCursor = async (key: string, step = env.cursor.step): Promise<TFactory> => {
    const query: Record<string, any> = {};
    query[key] = { $exists: true };
    const found = await FactoryModel.findOne(query);
    if (found) {
        (found as any)[key] += step;
        return await found.save();
    }
    const data: Record<string, any> = {};
    data[key] = step;
    return await new FactoryModel(data).save();
};

export const getCursorForKey = async (key: string): Promise<HydratedDocument<TFactory>> => {
    return await shiftCursor(key);
};
