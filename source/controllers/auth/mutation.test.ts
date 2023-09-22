import * as accountRepository from '../../repository/user';
import buildGraphQLServer from '../../graphql';
import express from 'express';
import * as mongodb from '../../database/mongodb';
import { ApolloServer } from 'apollo-server-express';
import { IContext } from '../../types/misc/generic';

const lifecycle: Record<string, any> = {};

beforeAll(async () => {
    jest.setTimeout(1000 * 25);

    const frame = await buildGraphQLServer(express());
    lifecycle.graphql = frame.gql;

    await mongodb.openConnection();
});

afterAll(async () => {
    await accountRepository.cascadingDelete(lifecycle.user.id);
});

describe('account', () => {
    it('should create a new account', async () => {
        const query = `
      mutation {
        register(
          email: "Youn@doe.com"
          firstName: "Youn"
          lastName: "Doe"
          password: "insecure@1bug.com"
        ) {
          id
          email
          firstName
          lastName
        }
      }
    `;

        const result = await (lifecycle.graphql as ApolloServer<IContext>).executeOperation({
            query,
        });

        expect(result.data).toEqual({
            register: {
                id: expect.any(String),
                email: expect.any(String),
                name: expect.any(String),
            },
        });

        lifecycle.user = result.data?.register;
    });

    it('should login an existing account', async () => {
        const query = `
      mutation {
        login(
          email: "youn@doe.com"
          password: "insecure@1bug.com"
        ) {
          account {
            id
            email
            name
          }
          token
        }
      }
    `;
        const result = await (lifecycle.graphql as ApolloServer<IContext>).executeOperation({
            query,
        });

        expect(result.data).toEqual({
            login: {
                account: {
                    id: expect.any(String),
                    email: expect.any(String),
                    name: expect.any(String),
                },
                token: expect.any(String),
            },
        });
    });
});
