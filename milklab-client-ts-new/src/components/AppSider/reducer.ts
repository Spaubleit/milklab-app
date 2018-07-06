import { AnyAction, combineReducers } from 'redux';
import { siderActions } from './actions';
import { getType } from 'typesafe-actions';

export type SiderState = {
    showSider: boolean
};

const returnsOfActions: AnyAction[] = [
    ...Object.keys(siderActions).map(key => siderActions[key])
];
type SiderAction = typeof returnsOfActions[number];

export const siderReducer = combineReducers<SiderState, SiderAction>({
    showSider: (state: boolean = true, action: AnyAction) => {
        switch (action.type) {
            case getType(siderActions.toggle):
                return !state;
            default:
                return state;
        }
    }
});