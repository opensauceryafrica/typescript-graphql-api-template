import * as bcrypt from './bcrypt';

describe('bcrypt', () => {
    describe('generateHashedPassword', () => {
        it('should generate hashed password', () => {
            const password = 'password';
            const hashedPassword = bcrypt.generateHashedPassword(password);
            expect(hashedPassword).not.toEqual(password);
        });
    });

    describe('compareHashedPassword', () => {
        it('should return true if password is correct', () => {
            const password = 'password';
            const hashedPassword = bcrypt.generateHashedPassword(password);
            const isCorrect = bcrypt.compareHashedPassword(password, hashedPassword);
            expect(isCorrect).toEqual(true);
        });

        it('should return false if password is incorrect', () => {
            const password = 'password';
            const hashedPassword = bcrypt.generateHashedPassword(password);
            const isCorrect = bcrypt.compareHashedPassword('wrong-password', hashedPassword);
            expect(isCorrect).toEqual(false);
        });
    });
});
