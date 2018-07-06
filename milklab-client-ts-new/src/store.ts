import createBrowserHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { rootReducer } from './root-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

export const history = createBrowserHistory();

const middleware = routerMiddleware(history);

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(middleware)),
);