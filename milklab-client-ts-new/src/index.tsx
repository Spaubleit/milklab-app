import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';
import ApolloProvider from 'react-apollo/ApolloProvider';
import ApolloClient from 'apollo-boost';
import App from './components/App';
// import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
    uri: 'http://127.0.0.1:5000/graphql',
    request: async operation => {
        operation.setContext({
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzcGF1YmxlaXQiLCJpYXQiOjE1MjkwMzg2NzQsImV4cCI6MTUyOTY0MzQ3NH0.AP6n9AC1ymERGit43S2IxbFy51w74mBxk3lHrGRRSW9UnhmzL-kBACCZaggEaXbYaoUaheydLbP-yeK-eK6OkA'
            }
        });
    }
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App/>
            </ConnectedRouter>
        </Provider>
    </ApolloProvider>
    ,
    document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
