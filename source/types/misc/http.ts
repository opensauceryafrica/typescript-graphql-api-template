export enum HttpStatus {
    BadRequest = 'BAD_REQUEST',
    Unauthorized = 'UNAUTHORIZED',
    Unauthenticaed = 'UNAUTHENTICATED',
    NotFound = 'NOT_FOUND',
    InternalServerError = 'INTERNAL_SERVER_ERROR',
}

export const StatusForCode: Record<number, HttpStatus> = {
    400: HttpStatus.BadRequest,
    401: HttpStatus.Unauthenticaed,
    403: HttpStatus.Unauthorized,
    404: HttpStatus.NotFound,
    500: HttpStatus.InternalServerError,
};
