import * as React from 'react';
import {
    positionFragment, roleFragment, UserUpdateMutation, UserUpdateMutationVariables,
    userFragment, UserInput, UserRemoveMutation, UserRemoveMutationVariables, UserCreateMutation,
    UserCreateMutationVariables, UsersQuery
} from '../../../queries-types';
import { Button, Classes, Dialog, FormGroup, Intent, Label, Switch } from '@blueprintjs/core';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import * as ChangeUserMutationGql from '../../../graphql/Users/UserUpdateMutation.graphql';
import * as UserCreateGql from '../../../graphql/Users/UserCreateMutation.graphql';
import * as UserRemoveGql from '../../../graphql/Users/UserRemoveMutation.graphql';
import * as UsersQueryGql from '../../../graphql/Users/UsersQuery.graphql';
import { FormEvent } from 'react';
import PositionSelect from './PositionSelect';
import RolesSelect from './RolesSelect';
import { validate } from 'validate.js';
import { DataProxy } from 'apollo-cache';

class UserUpdateComp extends Mutation<userFragment, UserUpdateMutationVariables> {}
class UserCreateComp extends Mutation<UserCreateMutation, UserCreateMutationVariables> {}
class UserRemoveComp extends Mutation<UserRemoveMutation, UserRemoveMutationVariables> {}

export interface Props {
    isDialogOpen: boolean;
    userData: userFragment;
    onClose?: () => void;
}

interface State {
    isDialogOpen: boolean;
    input: UserUpdateMutationVariables;
    position: positionFragment;
    roles: Array<roleFragment>;
    validate: {
        username: Array<string>,
        firstname: Array<string>,
        lastname: Array<string>,
        middlename: Array<string>,
        email: Array<string>
    };
}

const constraints = {
    username: {
        presence: {
            allowEmpty: false,
            message: 'Это поле не может быть пустым'
        }
    },
    firstname: {
        presence: {
            allowEmpty: false,
            message: 'Это поле не может быть пустым'
        }
    },
    lastname: {
        presence: {
            allowEmpty: false,
            message: 'Это поле не может быть пустым'
        }
    },
    middlename: {
        presence: {
            allowEmpty: false,
            message: 'Это поле не может быть пустым'
        }
    }
};

class UserDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this.propsToState(props);
    }

    render() {
        return (
            <Dialog
                className="UserDialog"
                isOpen={this.state.isDialogOpen}
                title={this.state.input.userInput.id === '0'
                    ? 'Добавления пользователя'
                    : 'Редактирование пользователя'}
                onClose={this.closeDialog}
                usePortal={true}
                canOutsideClickClose={false}
            >
                <div id="UserDialogBody" className={Classes.DIALOG_BODY}>
                    <FormGroup
                        helperText={
                            this.state.validate && this.state.validate.username && this.state.validate.username[0]
                        }
                        intent={Intent.DANGER}
                        label="Имя аккаунта"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.userInput.username}
                            onChange={this.usernameChange}
                        />
                    </FormGroup>
                    <FormGroup
                        helperText={
                            this.state.validate && this.state.validate.lastname && this.state.validate.lastname[0]
                        }
                        intent={Intent.DANGER}
                        label="Фамилия"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.userInput.lastname}
                            onChange={this.lastnameChange}
                        />
                    </FormGroup>
                    <FormGroup
                        helperText={
                            this.state.validate && this.state.validate.firstname && this.state.validate.firstname[0]
                        }
                        intent={Intent.DANGER}
                        label="Имя"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.userInput.firstname}
                            onChange={this.firstnameChange}
                        />
                    </FormGroup>
                    <FormGroup
                        helperText={
                            this.state.validate && this.state.validate.middlename && this.state.validate.middlename[0]
                        }
                        intent={Intent.DANGER}
                        label="Отчество"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.userInput.middlename}
                            onChange={this.midlenameChange}
                        />
                    </FormGroup>
                    <Label text="e-mail">
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.userInput.email}
                            onChange={this.emailChange}
                        />
                    </Label>
                    <PositionSelect position={this.state.position} onChange={this.positionChange}/>
                    <RolesSelect roles={this.state.roles} onChange={this.rolesChange}/>
                    <Switch
                        label="Доступен для входа"
                        checked={this.state.input.userInput.enabled}
                        onChange={this.enabledChange}
                    />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.userInput.id !== '0' &&
                            <UserRemoveComp
                                mutation={UserRemoveGql}
                                variables={{id: this.state.input.userInput.id}}
                                update={(cache: DataProxy, {data}) => {
                                    const query: UsersQuery = cache.readQuery({query: UsersQueryGql});
                                    cache.writeQuery({
                                        query: UsersQueryGql,
                                        data: {
                                            users: query.users.filter((item) => item.id !== data.removeUser)
                                        } as UsersQuery
                                    });
                                }}
                            >
                                {
                                    (fun: MutationFn<UserRemoveMutation, UserRemoveMutationVariables>) => {
                                        return (
                                            <Button
                                                intent={Intent.DANGER}
                                                onClick={() => {
                                                    fun();
                                                    this.closeDialog();
                                                }}
                                            >
                                                Удалить
                                            </Button>
                                        );
                                    }
                                }
                            </UserRemoveComp>
                        }
                        {
                            this.state.input.userInput.id !== '0' &&
                            <UserUpdateComp
                                mutation={ChangeUserMutationGql}
                                variables={this.state.input}
                            >
                                {
                                    (update: MutationFn<UserUpdateMutation, UserUpdateMutationVariables>,
                                     result: MutationResult<userFragment>) => {
                                        return (
                                            <Button
                                                disabled={!!this.state.validate}
                                                onClick={() => {
                                                    update();
                                                    this.closeDialog();
                                                }}
                                                intent={Intent.SUCCESS}
                                            >
                                                Сохранить
                                            </Button>
                                        );
                                    }
                                }
                            </UserUpdateComp>
                        }
                        {
                            this.state.input.userInput.id === '0' &&
                            <UserCreateComp
                                mutation={UserCreateGql}
                                variables={this.state.input}
                                update={(cache: DataProxy, {data}) => {
                                    const { users } = cache.readQuery({query: UsersQueryGql});
                                    cache.writeQuery({
                                        query: UsersQueryGql,
                                        data: {
                                            users: users.concat([data.createUser])
                                        } as UsersQuery
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<UserCreateMutation, UserCreateMutationVariables>,
                                     result: MutationResult<UserCreateMutation>) => {
                                        return (
                                            <Button
                                                disabled={!!this.state.validate}
                                                onClick={() => {
                                                    create();
                                                    this.closeDialog();
                                                }}
                                                intent={Intent.SUCCESS}
                                            >
                                                Создать
                                            </Button>
                                        );
                                    }
                                }
                            </UserCreateComp>
                        }
                        <Button onClick={this.closeDialog}>Отмена</Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps(props: Props) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: Props): State => {
        let input: UserInput = {
            id: props.userData.id || '0',
            username: props.userData.username || '',
            firstname: props.userData.firstname || '',
            lastname: props.userData.lastname || '',
            middlename: props.userData.middlename || '',
            email: props.userData.email || '',
            enabled: this.props.userData.enabled || false,
            positionId: '',
            rolesId: []
        };
        if (props.userData.position != null) {
            input.positionId = props.userData.position.id;
        }
        if (props.userData.roles != null) {
            input.rolesId = props.userData.roles.map(role => role.id);
        }
        return {
            isDialogOpen: props.isDialogOpen,
            input: {
                userInput: input
            },
            position: props.userData.position,
            roles: props.userData.roles,
            validate: validate(input, constraints, {fullMessages: false})
        };
    }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
        this.setState({
            isDialogOpen: !this.state.isDialogOpen
        });
    }
    private usernameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.username = evnt.currentTarget.value;
        this.setState({
            input: {userInput: input},
            validate: validate(input, constraints, {fullMessages: false})
        });
    }
    private lastnameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.lastname = evnt.currentTarget.value;
        this.setState({
            input: {userInput: input},
            validate: validate(input, constraints, {fullMessages: false})
        });
    }
    private firstnameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.firstname = evnt.currentTarget.value;
        this.setState({
            input: {
                userInput: input
            },
            validate: validate(input, constraints, {fullMessages: false})
        });
    }
    private midlenameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.middlename = evnt.currentTarget.value;
        this.setState({
            input: {
                userInput: input
            },
            validate: validate(input, constraints, {fullMessages: false})
        });
    }
    private emailChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.email = evnt.currentTarget.value;
        this.setState({input: {userInput: input}});
    }
    private enabledChange = () => {
        let input = Object.assign({}, this.state.input.userInput);
        input.enabled = !input.enabled;
        this.setState({input: {userInput: input}});
    }
    private positionChange = (position: positionFragment) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.positionId = position.id;
        this.setState({
            input: {userInput: input}
        });
    }
    private rolesChange = (roles: Array<roleFragment>) => {
        let input = Object.assign({}, this.state.input.userInput);
        input.rolesId = roles.map((role) => role.id);
        this.setState({
            roles: roles,
            input: {
                userInput: input
            }
        });
    }
}

export default UserDialog;