import * as jwt from './jwt';

describe('jwt', () => {
    describe('signToken', () => {
        it('should sign token', () => {
            const payload = { id: 'id' };
            const token = jwt.signToken(payload);
            expect(token).not.toEqual('');
        });
    });

    describe('verifyToken', () => {
        it('should verify token', async () => {
            const payload = { id: 'id' };
            const token = jwt.signToken(payload);
            const decoded = await jwt.verifyToken(token);
            expect(decoded.data.id).toEqual(payload.id);
        });
        it('should return false if token is empty', async () => {
            const decoded = await jwt.verifyToken('');
            expect(decoded.status).toEqual(false);
        });
        it('should return false if token is invalid', async () => {
            const decoded = await jwt.verifyToken('invalid-token');
            expect(decoded.status).toEqual(false);
        });
    });
});
