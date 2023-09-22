import crypto from 'crypto';
import path from 'path';
import env from '../config/env';
import * as factoryRepository from '../repository/factory';

export function firstCharToUpperCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertToSentenceCase(str: string): string {
    return str
        .split(' ')
        .map((word) => firstCharToUpperCase(word))
        .join(' ');
}

export function sortDirection(direction: string): 1 | -1 | 0 {
    return !direction ? 0 : direction.toLowerCase() === 'asc' ? 1 : direction.toLowerCase() === 'desc' ? -1 : 0;
}

export function generateRandomString(length: number, uppercase = false): string {
    return uppercase
        ? crypto.randomBytes(length).toString('hex').toUpperCase()
        : crypto.randomBytes(length).toString('hex');
}

export function generateRandomNumberString(length: number): string {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

export function renderTemplateString(template: string, data: Record<string, any>): string {
    return template.replace(/{{([^}]+)}}/g, (_, key: string) => data[key]);
}

export function extractAttachments(attachments: Array<string>): Array<{
    filename: string;
    path: string;
}> {
    return attachments.map((attachment) => {
        return {
            filename: path.basename(attachment),
            path: attachment,
        };
    });
}

export function computeChecksum(payload: string): string {
    return crypto.createHash('sha256').update(payload).digest('hex');
}

export const generateId = async (key: string): Promise<string> => {
    if (!env.cursor.current) {
        let cursor = await factoryRepository.getCursorForKey(key);
        env.cursor.current = (cursor as any)[key];
        env.cursor.pointer = (cursor as any)[key] - env.cursor.step;
    }
    if (env.cursor.pointer === env.cursor.current) {
        let cursor = await factoryRepository.getCursorForKey(key);
        env.cursor.current = (cursor as any)[key];
        env.cursor.pointer = (cursor as any)[key] - env.cursor.step;
    }
    env.cursor.pointer += 1;
    return `${key.toUpperCase()}${env.cursor.pointer.toString().padStart(9, '0')}`;
};
