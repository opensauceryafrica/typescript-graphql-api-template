import { Application, Request, Response, Router } from 'express';
import * as logger from './log/logger';
import v1 from './route/v1';

export default function handleRouting(app: Application): void {
    // version 1
    const router = Router();
    v1(router);
    app.use('/v1', router);

    // 404 Error Handler
    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({
            status: false,
            error: 'And Just Like That, You Completely Lost Your Way 😥',
        });
    });

    // Error Handler
    app.use((error: Error) => {
        logger.logErrorToConsole(error);
    });
}
