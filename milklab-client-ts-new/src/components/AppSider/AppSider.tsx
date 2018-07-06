import * as React from 'react';
import './AppSider.css';
import { Card, Menu, NonIdealState } from '@blueprintjs/core';
import { push } from 'react-router-redux';
import { store } from '../../store';
import NavItem from './NavItem';
import { SiderState } from './reducer';
import { connect } from 'react-redux';
import { RootState } from '../../root-reducer';
import { LoginState } from '../pages/LoginPage/reducer';
import LoginInformer from './LoginInformer';
import Query from 'react-apollo/Query';
import { UserByIdQuery, UserByIdQueryVariables } from '../../queries-types';
import * as UserByIdGql from '../../graphql/Users/UserByIdQuery.graphql';
import { QueryResult } from 'react-apollo';
import { bindActionCreators, Dispatch } from 'redux';
import { loginActions } from '../pages/LoginPage/actions';

interface ComponentProps {
    state: SiderState;
    login: LoginState;
    setLoginInfo: typeof loginActions.setLoginInfo;
}

class UserQueryComp extends Query<UserByIdQuery, UserByIdQueryVariables> {}

class AppSider extends React.Component<ComponentProps> {
    constructor(props: ComponentProps) {
        super(props);
    }

    render() {
        if (this.props.state.showSider) {
            return (
                <Card className="AppSider">
                    {
                        <UserQueryComp
                            query={UserByIdGql}
                            variables={{userId: this.props.login.loginInfo.userId}}
                        >
                            {
                                (query: QueryResult<UserByIdQuery>) => {
                                    if (query.loading) {
                                        return '';
                                    }
                                    if (query.error) {
                                        return <NonIdealState
                                            title="Войдите в программу"
                                            visual="user"
                                            description={'Список разделов недоступен'}
                                        />;
                                    }
                                    return (
                                        <div>
                                            <LoginInformer username={query.data.userById.username}/>
                                            <div id="Navigator">
                                                <Menu>
                                                    <NavItem
                                                        text={'Управление пользователями'}
                                                        link={'/users'}
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text={'Структура ферм'}
                                                        link={'/structure'}
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text={'Справочник должностей'}
                                                        link={'/positions'}
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text="Просмотр сессий пользователей"
                                                        link="/sessions"
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text={'Управление структурой стада'}
                                                        link={'/cows'}
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text={'Оборот контейнеров'}
                                                        link={'/movements'}
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text={'Управление контейнерами'}
                                                        link={'/containers'}
                                                        handlerClick={this.navClick}
                                                    />
                                                    <NavItem
                                                        text="Просмотр отчётов"
                                                        link="/reports"
                                                        handlerClick={this.navClick}
                                                    />
                                                </Menu>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                        </UserQueryComp>
                    }
                </Card>
            );
        } else {
            return(<div/>);
        }
    }

    private navClick = (link: string): void => {
        store.dispatch(push(link));
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        state: state.sider,
        login: state.login
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setLoginInfo: loginActions.setLoginInfo
    },
    dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppSider);