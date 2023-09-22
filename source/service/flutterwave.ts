import axios, { AxiosRequestConfig } from 'axios';
import env from '../config/env';
import { IUser } from '../types/user/user';
import { FlutterwaveConfig, FlutterwaveTx } from '../types/misc/flutterwave';

export const makePayment = (payload: FlutterwaveConfig): Promise<{ status: string; data: { link: string } }> => {
    const flutterwaveRequestObject: AxiosRequestConfig = {
        method: 'post',
        url: `${env.payment.flutterwave.v3.url}/payments`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
                env.deploymentEnv == 'production'
                    ? env.payment.flutterwave.live.secretKey
                    : env.payment.flutterwave.test.secretKey
            }`,
        },
        data: payload,
    };
    return new Promise((resolve, reject) => {
        axios(flutterwaveRequestObject)
            .then((response) => {
                return resolve(response.data);
            })
            .catch((error) => {
                return reject(error.response.data);
            });
    });
};

export const verifyTransaction = async (payload: { reference: string }): Promise<FlutterwaveTx> => {
    const flutterwaveRequestObject: AxiosRequestConfig = {
        method: 'get',
        url: `${env.payment.flutterwave.v3.url}/transactions/verify_by_reference?tx_ref=${payload.reference}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
                env.deploymentEnv == 'production'
                    ? env.payment.flutterwave.live.secretKey
                    : env.payment.flutterwave.test.secretKey
            }`,
        },
    };
    return new Promise((resolve, reject) => {
        axios(flutterwaveRequestObject)
            .then((response) => {
                return resolve(response.data);
            })
            .catch((error) => {
                return resolve(error.response.data);
            });
    });
};

export const initiateTransfer = async (
    payload: FlutterwaveConfig,
): Promise<{ status: string; data: { status: string } }> => {
    const flutterwaveRequestObject: AxiosRequestConfig = {
        method: 'post',
        url: `${env.payment.flutterwave.v3.url}/transfers`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
                env.deploymentEnv == 'production'
                    ? env.payment.flutterwave.live.secretKey
                    : env.payment.flutterwave.test.secretKey
            }`,
        },
        data: payload,
    };
    return axios(flutterwaveRequestObject)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response.data;
        });
};

export const generatePaymentObject = (
    amount: number,
    initiator: IUser,
    currency: string,
    domain: string,
    paymentOptions?: string,
): FlutterwaveConfig => {
    return {
        public_key:
            env.deploymentEnv === 'production'
                ? env.payment.flutterwave.live.publicKey
                : env.payment.flutterwave.test.publicKey,
        tx_ref: `${env.name}-${Date.now()}-${Math.floor(Math.random() * 9999999)}`,
        amount: amount,
        currency: currency,
        payment_options: paymentOptions, // if not set, all payment options will be available

        redirect_url: `${domain}/v1/payment/flutterwave/verify`,
        customer: {
            email: initiator.email as string,
            name: (initiator.firstName || initiator.email) + ' ' + (initiator.lastName || ''),
            phone_number: initiator.phone,
        },
        customizations: {
            title: env.name,
            description: `${env.name} Filing Invoice Payment`,
            logo: env.logo,
        },
    };
};
