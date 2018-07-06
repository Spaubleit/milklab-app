import { LocationChangeAction, RouterAction } from 'react-router-redux';
import { siderActions } from './components/AppSider/actions';
import { HeaderAction } from './components/AppHeader/reducer';
import { LoginAction } from './components/pages/LoginPage/reducer';

type SiderAction = typeof siderActions;

type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction = | ReactRouterAction | SiderAction| HeaderAction | LoginAction;