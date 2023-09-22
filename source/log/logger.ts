import winston from 'winston';
import morgan from 'morgan';

const colors: { [key: string]: string } = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

const logger = winston.createLogger({
    level: 'debug',
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [new winston.transports.Console()],
});

winston.addColors(colors);

const handleLogs: morgan.StreamOptions = {
    write: (log: string) => {
        logger.http(log);
    },
};

const logan = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: handleLogs,
});

const logErrorToConsole = (err: Error) => {
    logger.error('AN ERROR OCCURRED WITH STACK TRACE:');
    logger.warn(err.stack);
};

export { logan, logErrorToConsole, logger };
