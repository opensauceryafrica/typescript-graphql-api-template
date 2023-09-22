import Joi from 'joi';
import * as response from './response';

describe('response', () => {
    describe('sendErrorResponse', () => {
        it('should throw a GraphQLError', () => {
            expect(() => response.sendErrorResponse('test')).toThrowError();
        });
        it('should throw a GraphQLError with code 400', () => {
            const code = 400;
            expect(() => response.sendErrorResponse('test', code)).toThrowError();
        });
    });
    describe('handleValidationError', () => {
        it('should throw a GraphQLError', () => {
            const schema = Joi.object().keys({
                name: Joi.string().required(),
            });
            const val = schema.validate({ name: '' });
            expect(() => response.handleValidationError(val.error!)).toThrowError();
        });
    });
    describe('makeResponse', () => {
        it('should return a MakeResponse object', () => {
            const result = response.makeResponse(true, 'test', {});
            expect(result).toEqual({ status: true, message: 'test', data: {} });
        });
    });
});
