import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';
import { siderReducer, SiderState } from './components/AppSider/reducer';
import { headerReducer, HeaderState } from './components/AppHeader/reducer';
import { loginReducer, LoginState } from './components/pages/LoginPage/reducer';

export interface RootState {
    router: RouterState;
    sider: SiderState;
    header: HeaderState;
    login: LoginState;
}

export const rootReducer = combineReducers<RootState>({
    router: routerReducer,
    sider: siderReducer,
    header: headerReducer,
    login: loginReducer
});