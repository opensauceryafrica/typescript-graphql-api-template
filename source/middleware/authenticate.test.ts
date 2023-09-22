import authenticate from './authenticate';
import * as jwt from '../helpers/jwt';
import * as accountRepository from '../repository/user';
import * as bcrypt from '../helpers/bcrypt';
import { Request } from 'express';
import * as mongodb from '../database/mongodb';
import { IUser } from '../types/user/user';
import { AccountType } from '../types/user/enum';

const user = {
    email: 'john@doe.com',
    firstName: 'John',
    lastName: 'Doe',
    password: bcrypt.generateHashedPassword('password'),
    type: AccountType.Individual,
};

describe('authenticate', () => {
    beforeEach(async () => {
        jest.setTimeout(1000 * 25);
        await mongodb.openConnection();
    });

    afterEach(async () => {
        await accountRepository.cascadingDelete((user as IUser)._id!);
    });

    it('should return an object containing the authenticated user', async () => {
        const account = await accountRepository.createUser(user);
        (user as IUser)._id = account._id;

        const token = jwt.signToken({ id: account._id });

        const req = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        } as Request;

        const result = await authenticate(req);

        expect(result).toEqual({ user: account.jsonify() });
    });

    it('should return an empty object if token is empty', async () => {
        const req = {
            headers: {
                authorization: '',
            },
        } as Request;

        const result = await authenticate(req);

        expect(result).toEqual({});
    });
    it('should throw a GraphQL error if token is invalid', async () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid-token',
            },
        } as Request;

        expect(authenticate(req)).rejects.toThrowError();
    });
});
