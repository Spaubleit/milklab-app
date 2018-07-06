import * as React from 'react';
import AppHeader from './AppHeader/AppHeader';
import AppSider from './AppSider/AppSider';
import Main from './Main/Main';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <AppHeader/>
                <div id="AllPage">
                    <AppSider/>
                    <Main/>
                </div>
            </div>
        );
    }
}

export default App;