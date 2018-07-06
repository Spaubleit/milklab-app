import { createStandardAction } from 'typesafe-actions';
import { userFragment } from '../../../queries-types';

export const loginActions = {
    setLoginInfo: createStandardAction('SET_LOGIN_INFO')<{
        token: string,
        userId: string
    }>(),
    setUser: createStandardAction('SET_USER')<userFragment>()
};