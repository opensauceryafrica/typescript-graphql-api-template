import * as response from '../helpers/response';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export default (
    schema: Joi.ObjectSchema<any>,
    intercept: {
        query?: boolean;
        body?: boolean;
        params?: boolean;
        headers?: boolean;
    },
    allowUnknown = false,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        //   handle the payload interception
        let payload = {};
        if (intercept.query) {
            payload = { ...payload, query: req.query };
        }
        if (intercept.body) {
            payload = { ...payload, body: req.body };
        }
        if (intercept.params) {
            payload = { ...payload, params: req.params };
        }
        if (intercept.headers) {
            payload = { ...payload, headers: req.headers };
        }

        // validate the payload
        const validated = schema.validate(payload, { allowUnknown });
        if (validated.error) {
            return response._sendErrorResponse(res, validated.error.details[0].message.replace(/"/g, ''), {}, 400);
        }
        // continue to the next middleware
        return next();
    };
};
