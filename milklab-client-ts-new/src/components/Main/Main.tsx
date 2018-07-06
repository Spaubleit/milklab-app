import * as React from 'react';
import './Main.css';
import { Route, Switch } from 'react-router';
import LoginPage from '../pages/LoginPage/LoginPage';
import UsersPage from '../pages/UsersPage/UsersPage';
import StructurePage from '../pages/StructurePage/StructurePage';
import PositionsPage from '../pages/PositionsPage/PositionsPage';
import SessionsPage from '../pages/SessionsPage/SessionsPage';
import CowsPage from '../pages/CowsPage/CowsPage';
import MovementsPage from '../pages/MovementsPage/MovementsPage';
import ContainersPage from '../pages/ContainersPage/ContainersPage';
import AnalysisPage from '../pages/AnalysisPage/AnalysisPage';
import HomePage from '../pages/HomePage/HomePage';
import ReportsPage from '../pages/ReportsPage/ReportsPage';

export default class Main extends React.Component {
    render () {
        return (
            <main className="Main">
                <Switch>
                    <Route exact={true} path="/home" component={HomePage}/>
                    <Route exact={true} path="/login" component={LoginPage} onChange={() => {console.log(); }}/>
                    <Route exact={true} path="/users" component={UsersPage}/>
                    <Route exact={true} path="/structure" component={StructurePage}/>
                    <Route exact={true} path="/positions" component={PositionsPage}/>
                    <Route exact={true} path="/sessions" component={SessionsPage}/>
                    <Route exact={true} path="/cows" component={CowsPage}/>
                    <Route exact={true} path="/movements" component={MovementsPage}/>
                    <Route exact={true} path="/containers" component={ContainersPage}/>
                    <Route path="/containers/:containerId" component={AnalysisPage}/>
                    <Route exact={true} path="/reports" component={ReportsPage}/>
                    <Route component={LoginPage}/>
                </Switch>
            </main>
        );
    }
}