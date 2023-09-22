import * as response from '../helpers/response';
import Joi from 'joi';
import { MakeResponse } from '../types/misc/generic';

export default (schema: Joi.ObjectSchema<any>, payload: Record<string, any>): MakeResponse => {
    // validate the payload
    const validated = schema.validate(payload);
    if (validated.error) {
        // validateErrorData.details[0].message;
        return response.makeResponse(false, validated.error.details[0].message.replace(/"/g, ''), {});
    }
    return response.makeResponse(true, '', {});
};
