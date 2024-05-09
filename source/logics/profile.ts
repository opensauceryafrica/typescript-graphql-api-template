import { IUser } from '../types/user/user';
import { MakeResponse } from '../types/misc/generic';
import * as response from '../helpers/response';
import * as userRepository from '../repository/user';
import { logger } from '../log/logger';

export async function user(payload: IUser): Promise<MakeResponse> {
    try {
        const user = await userRepository.findById(payload._id!);
        if (!user) {
            return response.makeResponse(false, 'Login required!', {}, 401);
        }
        return response.makeResponse(true, 'Profile retrieved.', user);
    } catch (error: any) {
        logger.error(
            `[${new Date().toUTCString()}] :: error while fetching user ${payload.id} with payload ${JSON.stringify(
                payload,
            )} :: ${error.message}`,
        );
        return response.makeResponse(false, error.message, {});
    }
}
