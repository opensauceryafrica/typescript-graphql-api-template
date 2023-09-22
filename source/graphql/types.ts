import { gql } from 'apollo-server-core';
import authdef from '../controllers/auth/type';
import genericdef from '../controllers/generic/type';
import profiledef from '../controllers/profile/type';

export default gql(genericdef + authdef + profiledef);
