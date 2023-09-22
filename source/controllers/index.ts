import * as authquery from './auth/query';
import * as authmutation from './auth/mutation';
import * as profilequery from './profile/query';
import * as profilemutation from './profile/mutation';

export default {
    Query: {
        ...authquery,
        ...profilequery,
    },
    Mutation: {
        ...authmutation,
        ...profilemutation,
    },
};
