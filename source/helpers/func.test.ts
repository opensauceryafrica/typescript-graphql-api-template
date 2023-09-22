import * as func from './func';

describe('func', () => {
    describe('firstCharToUpperCase', () => {
        it('should convert first char to upper case', () => {
            const str = 'test';
            const result = func.firstCharToUpperCase(str);
            expect(result).toEqual('Test');
        });
    });

    describe('convertToSentenceCase', () => {
        it('should convert to sentence case', () => {
            const str = 'test string';
            const result = func.convertToSentenceCase(str);
            expect(result).toEqual('Test String');
        });
    });

    describe('sortDirection', () => {
        it('should return 1 if direction is asc', () => {
            const direction = 'asc';
            const result = func.sortDirection(direction);
            expect(result).toEqual(1);
        });
        it('should return -1 if direction is desc', () => {
            const direction = 'desc';
            const result = func.sortDirection(direction);
            expect(result).toEqual(-1);
        });
        it('should return 0 if direction is not asc or desc', () => {
            const direction = 'wrong-direction';
            const result = func.sortDirection(direction);
            expect(result).toEqual(0);
        });
        it('should return 0 if direction is empty', () => {
            const direction = '';
            const result = func.sortDirection(direction);
            expect(result).toEqual(0);
        });
    });
});
