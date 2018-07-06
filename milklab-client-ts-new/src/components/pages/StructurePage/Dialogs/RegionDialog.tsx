import * as React from 'react';
import { FormEvent } from 'react';
import { Button, Classes, Dialog, FormGroup, Intent } from '@blueprintjs/core';
import {
    RegionCreateMutation,
    RegionCreateMutationVariables,
    regionFragment,
    RegionInput,
    RegionRemoveMutation,
    RegionRemoveMutationVariables,
    RegionsQuery,
    RegionUpdateMutation,
    RegionUpdateMutationVariables
} from '../../../../queries-types';
import { Mutation, MutationFn } from 'react-apollo';
import { single } from 'validate.js';
import * as RegionsQueryGql from '../../../../graphql/Structure/Region/RegionsQuery.graphql';
import * as RegionCreateGql from '../../../../graphql/Structure/Region/RegionCreateMutation.graphql';
import * as RegionUpdateGql from '../../../../graphql/Structure/Region/RegionUpdateMutation.graphql';
import * as RegionRemoveGql from '../../../../graphql/Structure/Region/RegionRemoveMutation.graphql';

class RegionCreateComp extends Mutation<RegionCreateMutation, RegionCreateMutationVariables> {}
class RegionUpdateComp extends Mutation<RegionUpdateMutation, RegionUpdateMutationVariables> {}
class RegionRemoveComp extends Mutation<RegionRemoveMutation, RegionRemoveMutationVariables> {}

interface RegionDialogProps {
    isOpen: boolean;
    regionData: regionFragment;
    onClose?: () => void;
}

interface RegionDialogState {
    input: RegionUpdateMutationVariables;
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

export default class RegionDialog extends React.Component<RegionDialogProps, RegionDialogState> {
    constructor(props: RegionDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render () {
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={this.state.input.regionInput.id === '0'
                    ? 'Добавление области'
                    : 'Редактирование области'}
                onClose={() => this.props.onClose()}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label="Название"
                        intent={Intent.DANGER}
                        helperText={this.state.validate && this.state.validate[0]}
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.regionInput.name}
                            onChange={this.nameChange}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.regionInput.id !== '0' &&
                            <RegionRemoveComp
                                mutation={RegionRemoveGql}
                                variables={{id: this.state.input.regionInput.id}}
                                update={(cache, {data}) => {
                                    const query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: {
                                            regions: query.regions.filter(
                                                (item) => item.id !== data.removeRegion)
                                        } as RegionsQuery
                                    });
                                }}
                            >
                                {
                                    (remove: MutationFn<RegionRemoveMutation, RegionRemoveMutationVariables>) => {
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
                            </RegionRemoveComp>
                        }
                        {
                            this.state.input.regionInput.id !== '0' &&
                            <RegionUpdateComp
                                mutation={RegionUpdateGql}
                                variables={this.state.input}
                            >
                                {
                                    (update: MutationFn<RegionUpdateMutation, RegionUpdateMutationVariables>) => {
                                        return (
                                            <Button
                                                intent={Intent.SUCCESS}
                                                disabled={!!this.state.validate}
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
                            </RegionUpdateComp>
                        }
                        {
                            this.state.input.regionInput.id === '0' &&
                            <RegionCreateComp
                                mutation={RegionCreateGql}
                                variables={this.state.input}
                                update={(cache, {data}) => {
                                    const query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    console.log(query.regions);
                                    const test = query.regions.concat(data.createRegion);
                                    console.log(test);
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: {
                                            regions: test
                                        } as RegionsQuery
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<RegionCreateMutation, RegionCreateMutationVariables>) => {
                                        return(
                                            <Button
                                                intent={Intent.SUCCESS}
                                                disabled={!!this.state.validate}
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
                            </RegionCreateComp>
                        }
                        <Button onClick={this.closeDialog}>Отмена</Button>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps(props: RegionDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: RegionDialogProps): RegionDialogState => {
        let input: RegionInput = {
            id: props.regionData.id || '0',
            name: props.regionData.name || ''
        };
        if (props.regionData.user != null) {
            input.userId = props.regionData.user.id;
        }
        return {
            input: { regionInput: input },
            validate: single(input.name, constraints.name)
        };
    }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    private nameChange = (evnt: FormEvent<HTMLInputElement>) => {
        this.setState({
            input: {regionInput: {
                    id: this.state.input.regionInput.id,
                    name: evnt.currentTarget.value
                }},
            validate: single(evnt.currentTarget.value, constraints.name)
        });
    }
}