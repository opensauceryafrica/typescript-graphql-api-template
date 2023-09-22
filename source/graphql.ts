import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import typeDefs from './graphql/types';
import resolvers from './graphql/resolver';
import http, { Server } from 'http';
import { Application, Request } from 'express';
import authenticate from './middleware/authenticate';
import { IContext } from './types/misc/generic';

export default async function buildGraphQLServer(
    app: Application,
): Promise<{ http: Server; gql: ApolloServer<IContext> }> {
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wss = new WebSocketServer({
        server: httpServer,
        path: '/pivot/graphql/sub', // for subscriptions
    });

    const serverCleanup = useServer({ schema }, wss);

    const server = new ApolloServer<IContext>({
        schema,
        context: async ({ req }: { req: Request }) => {
            return await authenticate(req);
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
        csrfPrevention: true, // highly recommended
        introspection: true, // turn this off in production
    });

    await server.start();
    server.applyMiddleware({ app, path: '/pivot/graphql' });

    return { http: httpServer, gql: server };
}
