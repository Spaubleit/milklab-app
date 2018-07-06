import * as React from 'react';
import {
    GroupCreateMutation, GroupCreateMutationVariables, groupFragment, GroupInput, GroupRemoveMutation,
    GroupRemoveMutationVariables, GroupsQuery,
    GroupUpdateMutation, GroupUpdateMutationVariables, userFragment
} from '../../../queries-types';
import { Dialog, Classes, FormGroup, Button, Intent, NumericInput } from '@blueprintjs/core';
import { Mutation, MutationFn } from 'react-apollo';
import * as GroupsQueryGql from '../../../graphql/Cow/GroupsQuery.graphql';
import * as GroupRemoveGql from '../../../graphql/Cow/GroupRemoveMutation.graphql';
import * as GroupUpdateGql from '../../../graphql/Cow/GroupUpdateMutation.graphql';
import * as GroupCreateGql from '../../../graphql/Cow/GroupCreateMutation.graphql';
import UserSelect from './UserSelect';

interface GroupDialogProps {
    isOpen: boolean;
    groupData?: groupFragment;
    onClose?: () => void;
}

interface GroupDialogState {
    isOpen: boolean;
    input: GroupInput;
    user: userFragment;
}

class GroupRemoveComp extends Mutation<GroupRemoveMutation, GroupRemoveMutationVariables> {}
class GroupUpdateComp extends Mutation<GroupUpdateMutation, GroupUpdateMutationVariables> {}
class GroupCreateComp extends Mutation<GroupCreateMutation, GroupCreateMutationVariables> {}

export default class GroupDialog extends React.Component<GroupDialogProps, GroupDialogState> {
    constructor(props: GroupDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render () {
        return (
            <Dialog
                isOpen={this.state.isOpen}
                title={this.props.groupData.id === '0'
                    ? 'Добавление группы'
                    : 'Редактирование группы'}
                canOutsideClickClose={false}
                onClose={this.closeDialog}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label="Номер группы"
                    >
                        <NumericInput
                            fill={true}
                            min={0}
                            max={3000000}
                            value={this.state.input.number}
                            onValueChange={this.numberChange}
                        />
                    </FormGroup>
                    <UserSelect user={this.state.user} label="Оператор машинного доения" onChange={this.userChange} />
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.id !== '0' &&
                                <GroupRemoveComp
                                    mutation={GroupRemoveGql}
                                    variables={{id: this.state.input.id}}
                                    update={(cache, {data}) => {
                                        let query: GroupsQuery = cache.readQuery({
                                            query: GroupsQueryGql,
                                            variables: {farmId: this.state.input.farmId}
                                        });
                                        query.groups = query.groups.filter(x => x.id !== data.removeGroup);
                                        cache.writeQuery({
                                            query: GroupsQueryGql,
                                            variables: {farmId: this.state.input.farmId},
                                            data: query
                                        });
                                    }}
                                >
                                    {
                                        (remove: MutationFn<GroupRemoveMutation, GroupRemoveMutationVariables>) => {
                                            return (
                                                <Button
                                                    intent={Intent.DANGER}
                                                    onClick={() => {
                                                        remove();
                                                        this.closeDialog();
                                                    }}
                                                >
                                                    Удалить
                                                </Button>
                                            );
                                        }
                                    }
                                </GroupRemoveComp>
                        }
                        {
                            this.state.input.id !== '0' &&
                                <GroupUpdateComp
                                    mutation={GroupUpdateGql}
                                    variables={{groupInput: this.state.input}}
                                >
                                    {
                                        (update: MutationFn<GroupUpdateMutation, GroupUpdateMutationVariables>) => {
                                            return (
                                                <Button
                                                    intent={Intent.SUCCESS}
                                                    onClick={() => {
                                                        update();
                                                        this.closeDialog();
                                                    }}
                                                >
                                                    Изменить
                                                </Button>
                                            );
                                        }
                                    }
                                </GroupUpdateComp>
                        }
                        {
                            this.state.input.id === '0' &&
                                <GroupCreateComp
                                    mutation={GroupCreateGql}
                                    variables={{groupInput: this.state.input}}
                                    update={(cache, {data}) => {
                                        let query: GroupsQuery = cache.readQuery({
                                            query: GroupsQueryGql,
                                            variables: {farmId: this.state.input.farmId}
                                        });
                                        query.groups = query.groups.concat([data.createGroup]);
                                        cache.writeQuery({
                                            query: GroupsQueryGql,
                                            variables: {farmId: this.state.input.farmId},
                                            data: query
                                        });
                                    }}
                                >
                                    {
                                        (create: MutationFn<GroupCreateMutation, GroupCreateMutationVariables>) => {
                                            return (
                                                <Button
                                                    intent={Intent.SUCCESS}
                                                    onClick={() => {
                                                        create();
                                                        this.closeDialog();
                                                    }}
                                                >
                                                    Создать
                                                </Button>
                                            );
                                        }
                                    }
                                </GroupCreateComp>
                        }
                        <Button
                            onClick={this.closeDialog}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps(props: GroupDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: GroupDialogProps): GroupDialogState => {
        let input: GroupInput = {
                id: props.groupData.id || '0',
                number: props.groupData.number,
                userId: props.groupData.user ? props.groupData.user.id : null,
                farmId: props.groupData.farm.id
            };
        return ({
            isOpen: props.isOpen,
            input: input,
            user: props.groupData.user
        });
    }

    private numberChange = (value: number) => {
        let input = Object.assign({}, this.state.input);
        input.number = value;
        this.setState({
            input: input
        });
    }

    private userChange = (user: userFragment) => {
        let input = Object.assign({}, this.state.input);
        input.userId = user.id;
        this.setState({
            input: input,
            user
        });
    }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}