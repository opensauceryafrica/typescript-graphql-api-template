import { connection } from 'mongoose';
import { ModelName } from '../types/misc/model';
import { logger } from '../log/logger';

export async function createIndexes(): Promise<void> {
    try {
        await connection
            .collection(ModelName.User)
            .createIndex(
                {
                    name: 'text',
                    key: 'text',
                },
                {
                    default_language: 'english',
                },
            )
            .catch(() => {});
    } catch (error: any) {
        logger.warn(`Error creating indexes: ${error.message}`);
    }
}
