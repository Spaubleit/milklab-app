import { ActionType, getType } from 'typesafe-actions';
import { loginActions } from './actions';
import { combineReducers } from 'redux';
import { userFragment } from '../../../queries-types';

export type LoginState = {
    loginInfo: {
        token: string,
        userId: string,
    };
    user: userFragment;
};

export type LoginAction = ActionType<typeof  loginActions>;

export const loginReducer = combineReducers<LoginState, LoginAction>(
    {
        loginInfo: (
            state = {
                token: '',
                userId: null
            },
            action: LoginAction) => {
                switch (action.type) {
                    case getType(loginActions.setLoginInfo):
                        return state = Object.assign({}, action.payload);
                    default:
                        return state;
            }
        },
        user: (state = null, action: LoginAction) => {
            switch (action.type) {
                case getType(loginActions.setUser):
                    return state = Object.assign({}, action.payload);
                default:
                    return state;
            }
        }
    }
);