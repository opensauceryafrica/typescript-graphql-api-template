import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import env from '../config/env';
import * as func from '../helpers/func';
import { logger } from '../log/logger';

const transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure, // true for 465, false for other ports
    auth: {
        user: env.mail.auth.user,
        pass: env.mail.auth.pass,
    },
} as SMTPTransport.Options);

export const sendMail = async (
    to: string,
    subject: string,
    template: string,
    data?: object,
    attachments?: Array<string>,
): Promise<SMTPTransport.SentMessageInfo | Error> => {
    return new Promise((resolve, reject) => {
        transporter
            .sendMail({
                to: to,
                from: {
                    name: env.mail.name,
                    address: env.mail.from,
                },
                subject: subject,
                html: func.renderTemplateString(template, data || {}),
                attachments: func.extractAttachments(attachments || []),
            })
            .then((status: SMTPTransport.SentMessageInfo) => {
                return resolve(status);
            })
            .catch((error: Error) => {
                logger.debug(`[${new Date().toISOString()}] :: error while sending mail to ${to} :: ${error.message}`);
                return reject(error);
            });
    });
};
