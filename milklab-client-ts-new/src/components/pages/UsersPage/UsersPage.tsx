import * as React from 'react';
import './UsersPage.css';
import { userFragment, UsersQuery } from '../../../queries-types';
import Query from 'react-apollo/Query';
import * as GetAllUsersQueryGql from '../../../graphql/Users/UsersQuery.graphql';
import { QueryResult } from 'react-apollo';
import UserItem from './UserItem';
import { Button, ButtonGroup, NonIdealState, Spinner } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { headerActions } from '../../AppHeader/actions';
import UserDialog from './UserDialog';
import UsersSortComp, { userSortFunction } from './UsersSortComp';
import UserFilterComp, { userFilterFunction } from './UserFilterComp';

interface Props {
    setMenu: typeof headerActions.setMenu;
}

interface State {
    isDialogOpen: boolean;
    user: userFragment;
    sortFunction: userSortFunction;
    filterFunction: userFilterFunction;
    test: number;
}

class UsersQueryComp extends Query<UsersQuery> {}

class UsersPage extends React.Component<Props, State> {
    private menu = (
        <ButtonGroup>
                <Button
                    text="Добавить"
                    icon="plus"
                    onClick={() => {this.createUser(); }}
                />
            <UsersSortComp onChange={this.sortChange.bind(this)}/>
            <UserFilterComp onChange={this.filterChange.bind(this)}/>
        </ButtonGroup>
    );

    constructor (props: Props) {
        super(props);
        props.setMenu(this.menu);
        this.state = {
            isDialogOpen: false,
            user: null,
            sortFunction: (a, b) => a.username > b.username ? 1 : 0,
            filterFunction: (user) => true,
            test: 0
        };
    }

    render() {
        return (
            <UsersQueryComp query={GetAllUsersQueryGql} displayName="UsersPage">
            {
                (query: QueryResult<UsersQuery>) => {
                    if (query.loading) {
                        return (
                            <NonIdealState
                                title="Загрузка данных"
                                visual={<Spinner/>}
                            />
                        );
                    }
                    if (query.error) {
                        return (
                            <NonIdealState
                                title="Ошибка загрузки"
                                visual="error"
                                description="Нет доступа к серверу или он перегружен. Попробуйте подождать и повторить снова"
                                action={<Button text="Повторить" icon="repeat"/>}
                            />
                        );
                    }
                    if (query.data.users.length === 0) {
                        return (
                            <NonIdealState
                                title="Список пуст"
                                visual="circle"
                                action={<Button text="Добавить пользователя" onClick={this.createUser} icon="plus"/>}
                            />
                        );
                    }
                    return (
                        <div className="UsersList">
                            {
                                [...query.data.users]
                                    .sort(this.state.sortFunction)
                                    .filter(this.state.filterFunction)
                                    .map((item: userFragment) => {
                                    return <UserItem key={item.id} user={item} onClick={this.userClick}/>;
                                })
                            }
                            {
                                this.state.user &&
                                <UserDialog
                                    isDialogOpen={this.state.isDialogOpen}
                                    userData={this.state.user}
                                    onClose={this.onDialogClose}
                                />
                            }
                        </div>
                    );
                }
            }
            </UsersQueryComp>
        );
    }

    private userClick = (userData: userFragment) => {
        this.setState({
            isDialogOpen: true,
            user: userData
        });
    }

    private onDialogClose = () => {
        this.setState({isDialogOpen: false});
    }

    private createUser = () => {
        this.setState({
            isDialogOpen: true,
            user: {
                id: '',
                username: '',
                firstname: '',
                lastname: '',
                middlename: '',
                email: '',
                enabled: false,
                position: null,
                roles: []
            }
        });
    }

    private sortChange(sortFunction: userSortFunction) {
        this.setState({
            sortFunction
        });
    }

    private filterChange(filterFunction: userFilterFunction) {
        this.setState({
            filterFunction
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setMenu: headerActions.setMenu
    },
    dispatch
);

export default connect(null, mapDispatchToProps)(UsersPage);