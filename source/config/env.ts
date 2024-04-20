import { config } from 'dotenv';
config();

const os = Object.assign({}, process.env);

export default {
    name: os.APP_NAME || 'typescript-graphql-api-template',
    logo: process.env.APP_LOGO || '',
    domain: {
        user: {
            api: os.APP_DOMAIN_API || 'http://localhost:3000',
            web: {
                dev: os.APP_DOMAIN_WEB_DEV || 'http://localhost:3000',
                stage: os.APP_DOMAIN_WEB_STAGE || 'https://typescript-graphql-api-template-frontend-zeta.vercel.app',
            },
        },
    },
    services: {
        termii: {
            api: os.TERMII_API || 'https://api.ng.termii.com/api',
            key: os.TERMII_KEY || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        },
    },
    jwt: {
        secret: os.APP_SECRET || 'insecure@1bug.com',
        expiry: os.JWT_EXPIRY || '1d',
    },
    port: Number(os.PORT) || 3000,
    cursor: {
        step: 50, // step for factory ids
        current: 0, // current factory id
        pointer: 0, // index in current
    },
    deploymentEnv: os.DEPLOYMENT_ENV || 'development',
    database: {
        mongodb: {
            host: os.DB_HOST || 'localhost',
            port: Number(os.DB_PORT) || 27017,
            name: os.DB_NAME || 'typescript-graphql-api-template',
            user: os.DB_USER || 'typescript-graphql-api-template',
            password: os.DB_PASSWORD || 'password',
            uri: `mongodb+srv://${os.DB_USER}:${os.DB_PASSWORD}@${os.DB_HOST}/${os.DB_NAME}?retryWrites=true&authSource=admin`,
        },
        redis: {
            port: Number(os.REDIS_PORT) || 6379,
            host: os.REDIS_HOST || 'xxxx',
            username: os.REDIS_USERNAME || 'localhost',
            password: os.REDIS_PASSWORD || 'password',
            url: `redis://${os.REDIS_USERNAME}:${os.REDIS_PASSWORD}@${os.REDIS_HOST}:${Number(os.REDIS_PORT)}`,
        },
    },
    kafka: {
        cluster: os.KAFKA_CLUSTER || 'localhost:9092',
        clientId: os.KAFKA_CLIENT_ID || 'my-app',
        username: os.KAFKA_USERNAME || 'admin',
        password: os.KAFKA_PASSWORD || 'password',
    },
    payment: {
        flutterwave: {
            live: {
                publicKey: process.env.FLUTTERWAVE_LIVE_PUBLIC_KEY || 'xxxxxx',
                secretKey: process.env.FLUTTERWAVE_LIVE_SECRET_KEY || 'xxxxxx',
                encryptionKey: process.env.FLUTTERWAVE_LIVE_ENCRYPTION_KEY || 'xxxxxx',
                secretHash: process.env.FLUTTERWAVE_LIVE_SECRET_HASH || 'xxxxxx',
            },
            test: {
                publicKey: process.env.FLUTTERWAVE_TEST_PUBLIC_KEY || 'xxxxxx',
                secretKey: process.env.FLUTTERWAVE_TEST_SECRET_KEY || 'xxxxxx',
                encryptionKey: process.env.FLUTTERWAVE_TEST_ENCRYPTION_KEY || 'xxxxxx',
                secretHash: process.env.FLUTTERWAVE_TEST_SECRET_HASH || 'xxxxxx',
            },
            v3: {
                url: process.env.FLUTTERWAVE_V3_URL || 'https://api.flutterwave.com/v3',
            },
        },
    },
    mail: {
        host: os.MAIL_HOST || 'smtp.mailtrap.io',
        port: Number(os.MAIL_PORT) || 2525,
        secure: os.MAIL_SECURE === 'true' || false,
        auth: {
            user: os.MAIL_USER || 'user',
            pass: os.MAIL_PASSWORD || 'password',
        },
        from: os.MAIL_FROM || 'support@typescript-graphql-api-template.com',
        name: os.MAIL_NAME || 'typescript-graphql-api-template',
        template: {
            passwordReset: {
                subject: `Let's recover your password`,
                html: `<p>Hello {{firstName}},</p><p>As requested, Please click on the link below to reset your password.</p><p>{{link}}</p><p>This link will expire in 5 minutes.</p>`,
            },
            passwordAlert: {
                subject: `Password change alert`,
                html: `<p>Hello {{firstName}},</p><p>Your password was recently changed at {{time}} from IP address {{ip}}.</p><p>If this was you, you can ignore this email.</p><p>If this wasn't you, please reset your password immediately.</p>`,
            },
            accountActivation: {
                subject: `Verify your email address`,
                html: `<p>Hello {{firstName}},</p><p>As a part of your account completion process. Please click on the link below to verify your email.</p><p>{{link}}</p><p>This link will expire in 5 minutes.</p>`,
            },
            signinAlert: {
                subject: `Account sign-in alert`,
                html: `<p>Hello {{firstName}},</p><p>There was a new sign-in to your account at {{time}} from IP address {{ip}}.</p><p>If this was you, you can ignore this email.</p><p>If this wasn't you, please reset your password immediately.</p>`,
            },
        },
    },
};
