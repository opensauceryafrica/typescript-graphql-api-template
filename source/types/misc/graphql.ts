import { HttpStatus } from './http';

export enum GraphResponse {
    Respond = 'Response',
    RespondWithUser = 'ResponseWithUser',
    RespondWithUsers = 'ResponseWithUsers',
    RespondWithUserAndToken = 'ResponseWithUserAndToken',
    RespondWithInvoice = 'ResponseWithInvoice',
    RespondWithCard = 'ResponseWithCard',
    RespondWithCards = 'ResponseWithCards',
}

export interface GraphError {
    __typename: 'Error';
    message: string;
    code: HttpStatus;
    status: number;
}
