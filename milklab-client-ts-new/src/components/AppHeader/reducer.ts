import { ReactNode } from 'react';
import { combineReducers } from 'redux';
// import * as headerActions from './actions';
import { ActionType, getType } from 'typesafe-actions';
import { headerActions } from './actions';

export type HeaderState = {
    menu: ReactNode;
    x: number;
};

export type HeaderAction = ActionType<typeof headerActions>;

export const headerReducer = combineReducers<HeaderState, HeaderAction>(
    {
        menu: (state: ReactNode = null, action: HeaderAction) => {
            switch (action.type) {
                case getType(headerActions.setMenu):
                    return state = Object.assign({}, action.payload);
                default:
                    return state;
            }
        },
        x: (state: number = 0, action: HeaderAction) => {
            switch (action.type) {
                case getType(headerActions.setX):
                    return state + action.payload;
                default:
                    return state;
            }
        }
    }
);