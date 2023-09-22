import { IUser } from '../user/user';

export interface MakeResponse {
    status: number | boolean;
    message: string;
    data: Record<string, unknown>;
}

export interface IContext {
    user?: IUser;
    ip: string;
    referer: string;
    domain: string;
}
