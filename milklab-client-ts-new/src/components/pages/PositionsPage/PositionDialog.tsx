import * as React from 'react';
import {
    PositionCreateMutation,
    PositionCreateMutationVariables, positionFragment, PositionRemoveMutation, PositionRemoveMutationVariables,
    PositionsQuery,
    PositionUpdateMutation,
    PositionUpdateMutationVariables
} from '../../../queries-types';
import { Button, Classes, Dialog, FormGroup, Intent } from '@blueprintjs/core';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import * as PositionsQueryGql from '../../../graphql/PositionsQuery.graphql';
import * as PositionCreateGql from '../../../graphql/PositionCreateMutation.graphql';
import * as PositionUpdateGql from '../../../graphql/PositionUpdateMutation.graphql';
import * as PositionRemoveGql from '../../../graphql/PositionRemoveMutation.graphql';
import { FormEvent } from 'react';
import { single } from 'validate.js';
import { DataProxy } from 'apollo-cache';
import { validate } from 'validate.js';

interface PositionDialogProps {
    isOpen: boolean;
    position?: positionFragment;
    onClose?: () => void;
}

interface PositionDialogState {
    position: positionFragment;
    input: PositionUpdateMutationVariables;
    validate: Array<string>;
}

const constraints = {
    name: {
        presence: {
            allowEmpty: false,
            message: 'Это поле не может быть пустым'
        }
    }
};

class PositionCreateComp extends Mutation<PositionCreateMutation, PositionCreateMutationVariables> {}
class PositionUpdateComp extends Mutation<positionFragment, PositionUpdateMutationVariables> {}
class PositionRemoveComp extends Mutation<PositionRemoveMutation, PositionRemoveMutationVariables> {}

export default class PositionDialog extends React.Component<PositionDialogProps, PositionDialogState> {
    constructor (props: PositionDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render () {
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={this.state.input.positionInput.id === '0' ? 'Добавление должности' : 'Редактирование должности'}
                onClose={this.closeDialog}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        helperText={this.state.validate && this.state.validate[0]}
                        intent={Intent.DANGER}
                        label="Название"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.position.name}
                            onChange={this.nameChange}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.positionInput.id !== '0' &&
                            <PositionRemoveComp
                                mutation={PositionRemoveGql}
                                variables={{id: this.state.input.positionInput.id}}
                                update={(cache: DataProxy, {data}) => {
                                    const query: PositionsQuery = cache.readQuery({query: PositionsQueryGql});
                                    cache.writeQuery({
                                        query: PositionsQueryGql,
                                        data: {
                                            positions: query.positions.filter(
                                                item => item.id !== data.removePosition
                                            )
                                        } as PositionsQuery
                                    });
                                }}
                            >
                                {
                                    (remove: MutationFn<PositionRemoveMutation, PositionRemoveMutationVariables>) => {
                                        return (
                                            <Button
                                                intent={Intent.DANGER}
                                                onClick={() => {remove(); this.closeDialog(); }}
                                            >
                                                Удалить
                                            </Button>
                                        );
                                    }
                                }
                            </PositionRemoveComp>
                        }
                        {
                            this.state.input.positionInput.id === '0' &&
                            <PositionCreateComp
                                mutation={PositionCreateGql}
                                variables={this.state.input}
                                update={(cache: DataProxy, {data}) => {
                                    const query: PositionsQuery =
                                        cache.readQuery({query: PositionsQueryGql});
                                    cache.writeQuery({
                                        query: PositionsQueryGql,
                                        data: {
                                            positions: query.positions.concat([data.createPosition])
                                        } as PositionsQuery
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<PositionCreateMutation, PositionCreateMutationVariables>,
                                     result: MutationResult<PositionCreateMutation>) => {
                                        return (
                                            <Button
                                                intent={Intent.SUCCESS}
                                                onClick={() => {create(); this.closeDialog(); }}
                                                disabled={validate(this.state.input.positionInput, constraints)}
                                            >
                                                Создать
                                            </Button>
                                        );
                                    }
                                }
                            </PositionCreateComp>
                        }
                        {
                            this.state.input.positionInput.id !== '0' &&
                            <PositionUpdateComp
                                mutation={PositionUpdateGql}
                                variables={this.state.input}
                            >
                                {
                                    (update: MutationFn<PositionUpdateMutation, PositionUpdateMutationVariables>,
                                     result: MutationResult<positionFragment>) => {
                                        return (
                                            <div>
                                                <Button
                                                    intent={Intent.SUCCESS}
                                                    onClick={() => {
                                                        update();
                                                        this.closeDialog();
                                                    }}
                                                    disabled={!!this.state.validate}
                                                >
                                                    Сохранить
                                                </Button>
                                            </div>
                                        );
                                    }
                                }
                            </PositionUpdateComp>
                        }
                        <Button onClick={this.closeDialog}>Отмена</Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps (props: PositionDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: PositionDialogProps): PositionDialogState => {
        let input = props.position || {
        id: props.position.id || '',
            name: props.position.name || ''
        };
        return {
            position: props.position || {
                id: '0',
                name: ''
            },
            input: {
                positionInput: input
            },
            validate: single(input.name, constraints.name)
        };
    }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    private nameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let position = Object.assign({}, this.state.position);
        position.name = evnt.currentTarget.value;
        this.setState({
            position: position,
            input: {
                positionInput: position
            },
            validate: single(position.name, constraints.name)
        });
    }
}