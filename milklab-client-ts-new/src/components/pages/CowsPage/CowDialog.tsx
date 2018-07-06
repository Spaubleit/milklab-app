import * as React from 'react';
import { Dialog, Classes, Button, Intent, FormGroup, NumericInput } from '@blueprintjs/core';
import {
    CowCreateMutation, CowCreateMutationVariables,
    cowFragment, CowInput, CowRemoveMutation, CowRemoveMutationVariables, CowsQuery, CowsQueryVariables,
    CowUpdateMutation, CowUpdateMutationVariables
} from '../../../queries-types';
import { Mutation, MutationFn } from 'react-apollo';
import * as CowsQueryGql from '../../../graphql/Cow/CowsQuery.graphql';
import * as CowRemoveGql from '../../../graphql/Cow/CowRemoveMutation.graphql';
import * as CowUpdateGql from '../../../graphql/Cow/CowUpdateMutation.graphql';
import * as CowCreateGql from '../../../graphql/Cow/CowCreateMutation.graphql';
import { Simulate } from 'react-dom/test-utils';
import input = Simulate.input;

interface CowDialogProps {
    isOpen: boolean;
    cowData: cowFragment;
    onClose?: () => void;
}

interface CowDialogState {
    isOpen: boolean;
    input: CowInput;
}

class CowRemoveComp extends Mutation<CowRemoveMutation, CowRemoveMutationVariables> {}
class CowUpdateComp extends Mutation<CowUpdateMutation, CowUpdateMutationVariables> {}
class CowCreateComp extends Mutation<CowCreateMutation, CowCreateMutationVariables> {}

export default class CowDialog extends React.Component<CowDialogProps, CowDialogState> {
    constructor(props: CowDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render () {
        return (
            <Dialog
                isOpen={this.state.isOpen}
                title={this.props.cowData.id === '0'
                    ? 'Добавление коровы'
                    : 'Редактирование коровы'}
                canOutsideClickClose={false}
                onClose={this.closeDialog}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label="Номер коровы"
                    >
                        <NumericInput
                            fill={true}
                            min={0}
                            max={3000000}
                            value={this.state.input.number}
                            onValueChange={this.numberChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Кличка"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.nickname}
                            onChange={this.nicknameChange}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.id !== '0' &&
                            <CowRemoveComp
                                mutation={CowRemoveGql}
                                variables={{id: this.state.input.id}}
                                update={(cache, {data}) => {
                                    const query: CowsQuery = cache.readQuery({
                                        query: CowsQueryGql,
                                        variables: {groupId: this.state.input.groupId}
                                    });
                                    query.cows = query.cows.filter(x => x.id !== data.removeCow);
                                    cache.writeQuery({
                                        query: CowsQueryGql,
                                        variables: {groupId: this.state.input.groupId},
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (remove: MutationFn<CowRemoveMutation, CowRemoveMutationVariables>) => {
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
                            </CowRemoveComp>
                        }
                        {
                            this.state.input.id !== '0' &&
                            <CowUpdateComp
                                mutation={CowUpdateGql}
                                variables={{cowInput: this.state.input}}
                            >
                                {
                                    (update: MutationFn<CowUpdateMutation, CowUpdateMutationVariables>) => {
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
                            </CowUpdateComp>
                        }
                        {
                            this.state.input.id === '0' &&
                            <CowCreateComp
                                mutation={CowCreateGql}
                                variables={{cowInput: this.state.input}}
                                update={(cache, {data}) => {
                                    const query: CowsQuery = cache.readQuery({
                                        query: CowsQueryGql,
                                        variables: {groupId: this.state.input.groupId} as CowsQueryVariables,
                                    });
                                    query.cows = query.cows.concat([data.createCow]);
                                    cache.writeQuery({
                                        query: CowsQueryGql,
                                        variables: {groupId: this.state.input.groupId},
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<CowCreateMutation, CowCreateMutationVariables>) => {
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
                            </CowCreateComp>
                        }
                        <Button onClick={this.closeDialog}>Отмена</Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps(props: CowDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: CowDialogProps): CowDialogState => {
        let cowInput: CowInput = {
            id: props.cowData.id || '0',
            number: props.cowData.number,
            nickname: props.cowData.nickname || '',
            groupId: this.props.cowData.group ? this.props.cowData.group.id : null
        };
        return ({
            isOpen: props.isOpen,
            input: cowInput
        });
    }

    private numberChange = (value: number) => {
        let cowInput = Object.assign({}, this.state.input);
        cowInput.number = value;
        this.setState({
            input: cowInput
        });
    }

    private nicknameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        let cowInput = Object.assign({}, this.state.input);
        cowInput.nickname = evnt.currentTarget.value;
        this.setState({
            input: cowInput
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