import { MakeResponse } from '../types/misc/generic';
import { ValidationError } from 'joi';
import { HttpStatus, StatusForCode } from '../types/misc/http';
import { logger } from '../log/logger';
import { GraphError } from '../types/misc/graphql';
import { Response } from 'express';

export const makeResponse = (
    status: number | boolean,
    message: string,
    data: any,
    code: number = 400,
): MakeResponse => {
    return {
        status,
        message,
        data,
        code,
    };
};

export const _sendErrorResponse = (
    res: Response,
    message: string,
    data: Record<string, any>,
    statusCode: number = 400,
): Response => {
    return res.status(statusCode).json({
        status: false,
        message: message,
        data: data,
    });
};

export const _sendSuccessResponse = (
    res: Response,
    message: string,
    data: Record<string, any>,
    statusCode: number = 200,
): Response | void => {
    return res.status(statusCode).json({
        status: true,
        message: message,
        data: data,
    });
};

export const sendErrorResponse = (message: string, code: number = 400): GraphError => {
    logger.error(`[${new Date().toUTCString()}] :: error with message and code :: ${message} :: ${code}`);
    return {
        __typename: 'Error',
        message,
        code: StatusForCode[code] || HttpStatus.BadRequest,
        status: code,
    };
};

export const sendSuccessResponse = (
    typename: string,
    message: string,
    data: unknown,
): {
    __typename: string;
    message: string;
    data: unknown;
} => {
    return {
        __typename: typename,
        message,
        data,
    };
};

export const handleValidationError = (validateErrorData: ValidationError): GraphError => {
    return sendErrorResponse(validateErrorData.details[0].message, 400);
};
