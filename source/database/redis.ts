import { RedisClientType, createClient } from 'redis';
import env from '../config/env';
import { logger } from '../log/logger';

let redisClient: RedisClientType;
let isReady: boolean;

export async function createConnection(): Promise<RedisClientType> {
    if (!isReady) {
        redisClient = createClient({
            url: `redis://${env.database.redis.username}:${env.database.redis.password}@${env.database.redis.host}:${env.database.redis.port}`,
        });
        redisClient.on('error', (err: Error) => logger.error(`Redis Error: ${err}`));
        redisClient.on('connect', () => logger.debug('Redis connected'));
        redisClient.on('reconnecting', () => logger.debug('Redis reconnecting'));
        redisClient.on('ready', () => {
            isReady = true;
            logger.debug('Redis ready!');
        });
        await redisClient.connect();
    }
    return redisClient;
}
