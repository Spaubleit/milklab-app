import * as React from 'react';
import { userFragment, UsersQuery } from '../../../queries-types';
import Query from 'react-apollo/Query';
import { QueryResult } from 'react-apollo';
import { Alignment, Button, Intent, Label, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, Select } from '@blueprintjs/select';
import * as UserQueryGql from '../../../graphql/Users/UsersQuery.graphql';

interface Props {
    label: string;
    user?: userFragment;
    onChange?: (user: userFragment) => void;
}

interface State {
    user: userFragment;
}

class UsersQueryComp extends Query<UsersQuery> {}
const UserSelectComp = Select.ofType<userFragment>();

export default class UserSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super (props);
        this.state = {
            user: props.user
        };
    }

    render () {
        return (
            <UsersQueryComp
                query={UserQueryGql}
            >
                {
                    (result: QueryResult<UsersQuery>) => {
                        if (result.loading) {
                            return <Button loading={true}/>;
                        }
                        if (result.error) {
                            return <Button text="Ошибка загрузки" intent={Intent.DANGER} rightIcon="refresh"/>;
                        }
                        return (
                            <Label text={this.props.label}>
                                <UserSelectComp
                                    noResults={<MenuItem text="Нет результатов"/>}
                                    items={result.data.users}
                                    itemRenderer={this.userRenderer}
                                    onItemSelect={this.userSelect}
                                >
                                    <Button
                                        className="pt-fill"
                                        rightIcon="caret-down"
                                        alignText={Alignment.LEFT}
                                    >
                                        {this.state.user
                                            ? this.state.user.lastname + ' ' +
                                                this.state.user.firstname + ' ' +
                                                this.state.user.middlename
                                            : 'Не выбран'}
                                    </Button>
                                </UserSelectComp>
                            </Label>
                        );
                    }
                }
            </UsersQueryComp>
        );
    }

    componentWillReceiveProps(props: Props) {
        this.setState({
            user: this.props.user
        });
    }

    private userSelect = (user: userFragment) => {
        this.setState({
            user: user
        });
        if (this.props.onChange) {
            this.props.onChange(user);
        }
    }

    private userRenderer: ItemRenderer<userFragment> = (item, {handleClick}) => {
        return (
            <MenuItem
                key={item.id}
                text={item.lastname + ' ' + item.firstname + ' ' + item.middlename}
                labelElement={item.position ? item.position.name : null}
                onClick={handleClick}
            />
        );
    }
}