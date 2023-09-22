import env from '../config/env';
import axios, { AxiosError } from 'axios';
import { MakeResponse } from '../types/misc/generic';

export const sendToken = async (
    to: string,
    length: number,
    type: 'NUMERIC' | 'ALPHANUMERIC',
    ttl = 5,
): Promise<MakeResponse> => {
    try {
        const response = await axios.post(`${env.services.termii.api}/sms/otp/send`, {
            api_key: env.services.termii.key,
            message_type: type,
            to,
            from: env.name,
            channel: 'generic',
            pin_attempts: 3,
            pin_time_to_live: ttl,
            pin_length: length,
            pin_placeholder: '<1234>',
            message_text: `Use <1234> as your verification code on
          ${env.name}. This code expires in 5 minutes.`,
            pin_type: type,
        });
        return {
            status: true,
            message: 'Token sent!',
            data: response.data,
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Token not sent!',
            data: (error as AxiosError).response?.data as Record<string, unknown>,
        };
    }
};

export const verifyToken = async (pin: string, pinId: string): Promise<MakeResponse> => {
    try {
        const response = await axios.post(`${env.services.termii.api}/sms/otp/verify`, {
            api_key: env.services.termii.key,
            pin_id: pinId,
            pin,
        });
        return {
            status: true,
            message: 'Token verified!',
            data: response.data || {},
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Token not verified!',
            data: ((error as AxiosError).response?.data as Record<string, unknown>) || {},
        };
    }
};
