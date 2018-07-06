import * as React from 'react';
import { Alignment, Button, Icon, Navbar, NavbarGroup } from '@blueprintjs/core';
import { siderActions } from '../AppSider/actions';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
// import MainMenu from '../MainMenu/MainMenu';
import { RootState } from '../../root-reducer';
import { HeaderState } from './reducer';
import { store } from '../../store';
import { push, RouterState } from 'react-router-redux';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    toggle: typeof siderActions.toggle;
    menu: HeaderState;
    routerState: RouterState;
}

class AppHeader extends React.Component<HeaderProps> {
    render() {
        return (
            <Navbar id="AppHeader" className="pt-dark pt-fixed-top">
                <NavbarGroup align={Alignment.LEFT}>
                    <Button className="pt-button pt-minimal" icon="menu" onClick={this.props.toggle}/>
                    {
                        this.breadcrumb(this.props.routerState.location.pathname)
                    }
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    {this.props.menu.menu}
                </NavbarGroup>
            </Navbar>
        );
    }

    private breadcrumb = (path: string): ReactNode => {
        switch (path) {
            case '/login':
            default: return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb-current">Вход в программу</li>
                </ul>
            );
            case '/home': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb-current">Домашняя страница</li>
                </ul>
            );
            case '/users': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Пользователи</li>
                </ul>
            );
            case '/structure': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Структура ферм</li>
                </ul>
            );
            case '/positions': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Должности</li>
                </ul>
            );
            case '/sessions': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Сессии</li>
                </ul>
            );
            case '/cows': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Структура стада</li>
                </ul>
            );
            case '/movements': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Оборот контейнеров</li>
                </ul>
            );
            case '/containers': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Контейнеры</li>
                </ul>
            );
            case '/reports': return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">Отчёты</li>
                </ul>
            );
            case (path.match(/\/containers\//) || {input: ' '}).input : return (
                <ul className="pt-breadcrumbs">
                    <li className="pt-breadcrumb">
                        <Link to="/home">
                            <Icon icon="home"/>
                        </Link>
                    </li>
                    <li className="pt-breadcrumb">
                        <Link to="/containers">
                        Контейнеры
                        </Link>
                    </li>
                    <li className="pt-breadcrumb-current">{'№' + path.substr(path.lastIndexOf('/') + 1)}</li>
                </ul>
            );
        }
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        menu: {menu: state.header.menu},
        routerState: state.router
    };
};

const mapDispatchToProps =
    (dispatch: Dispatch) => bindActionCreators({toggle: siderActions.toggle}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);