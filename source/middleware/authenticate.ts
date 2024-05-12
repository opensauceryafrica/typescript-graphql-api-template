import { Request } from 'express';
import * as jwt from '../helpers/jwt';
import * as accountRepository from '../repository/user';
import mongoose from 'mongoose';
import * as response from '../helpers/response';
import { IContext, MakeResponse } from '../types/misc/generic';
import { IUser } from '../types/user/user';
import { Role } from '../types/user/enum';
import { GraphError } from '../types/misc/graphql';

export default async (req: Request): Promise<IContext | GraphError> => {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string;

    const referer = (req.headers['x-typescript-graphql-api-template-dev'] as string) || req.headers.referer || '';

    const domain = req.protocol + '://' + req.get('host');

    if (
        !req ||
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ') ||
        !req.headers.authorization.split(' ')[1] ||
        !req.headers.authorization.split(' ')[1].length
    ) {
        return { ip, referer, domain };
    }

    const token = req.headers.authorization!.split(' ')[1];
    if (token) {
        const verified = await jwt.verifyToken(token);
        if (verified.status) {
            const account = await accountRepository.findById(verified.data['id'] as mongoose.ObjectId);
            if (!account) {
                return response.sendErrorResponse('Login required!', 401);
            }
            return { user: account.toJSON(), ip, referer, domain };
        }
        return response.sendErrorResponse(verified.message, verified.code);
    }
    return { ip, referer, domain };
};

export const validateAccess = (
    user: IUser,
    roles: Role[],
    permissions: string[],
    requirements: { key: string; value: any; error: string }[],
    or = false,
): MakeResponse => {
    if (!user) {
        return {
            status: false,
            message: 'Login required!',
            data: {},
            code: 401,
        };
    }

    // verify that user has the required role
    // role uses OR operation
    if (roles.length) {
        if (!roles.map((r) => r.toLowerCase()).includes(user.role.toLowerCase())) {
            return {
                status: false,
                message: "You don't have the required role!",
                data: {},
                code: 403,
            };
        }
    }

    // verify that user has the required permission
    // permission uses either OR / AND operation
    if (permissions.length) {
        let permit = user.permissions || {};
        perm: for (const permission of permissions) {
            permit = user.permissions || {};
            const permissionKeys = permission.toLowerCase().split('.');
            pkey: for (const pkey of permissionKeys) {
                if (permit && Object.keys(permit).includes(pkey)) {
                    permit = permit[pkey];
                } else {
                    permit = false;
                    continue pkey;
                }
            }

            if (or && permit === true) {
                break perm;
            } else if (!or && permit === false) {
                break perm;
            }
        }

        if ((or && permit === false) || (!or && permit !== true)) {
            return {
                status: false,
                message: "You don't have sufficient permissions to perform this action!",
                data: {},
                code: 403,
            };
        }
    }

    // verify that user meets the required requirements
    // requirements uses AND operation
    if (requirements.length) {
        for (const requirement of requirements) {
            // re-assigning user with type any for this to work
            const u: any = user;
            if (u[requirement.key] != requirement.value) {
                return {
                    status: false,
                    message: requirement.error,
                    data: {},
                    code: 403,
                };
            }
        }
    }

    return {
        status: true,
        message: 'Access granted!',
        data: {},
    };
};
