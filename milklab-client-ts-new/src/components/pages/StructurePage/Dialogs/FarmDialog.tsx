import * as React from 'react';
import { Dialog, Classes, Button, FormGroup, Intent } from '@blueprintjs/core';
import {
    FarmCreateMutation, FarmCreateMutationVariables, farmFragment, FarmInput, FarmRemoveMutation,
    FarmRemoveMutationVariables, FarmUpdateMutation,
    FarmUpdateMutationVariables, householdFragment, RegionsQuery
} from '../../../../queries-types';
import { Mutation, MutationFn } from 'react-apollo';
import { FormEvent } from 'react';
import * as RegionsQueryGql from '../../../../graphql/Structure/Region/RegionsQuery.graphql';
import * as FarmCreateGql from '../../../../graphql/Structure/Farm/FarmCreateMutation.graphql';
import * as FarmUpdateGql from '../../../../graphql/Structure/Farm/FarmUpdateMutation.graphql';
import * as FarmRemoveGql from '../../../../graphql/Structure/Farm/FarmRemoveMutation.graphql';
import UserSelect from '../../CowsPage/UserSelect';
import { single } from 'validate.js';

class FarmCreateComp extends Mutation<FarmCreateMutation, FarmCreateMutationVariables> {}
class FarmUpdateComp extends Mutation<FarmUpdateMutation, FarmUpdateMutationVariables> {}
class FarmRemoveComp extends Mutation<FarmRemoveMutation, FarmRemoveMutationVariables> {}

interface FarmDialogProps {
    isOpen: boolean;
    farmData: farmFragment;
    onClose: () => void;
}

interface FarmDialogState {
    input: FarmUpdateMutationVariables;
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

export default class FarmDialog extends React.Component<FarmDialogProps, FarmDialogState> {
    constructor(props: FarmDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render () {
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={this.props.farmData.id === '0'
                    ? 'Добавление фермы'
                    : 'Редактирование фермы'}
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
                            value={this.state.input.farmInput.name}
                            onChange={this.nameChanged}
                        />
                    </FormGroup>
                    <UserSelect label="Руководитель фермы"/>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.farmInput.id !== '0' &&
                            <FarmRemoveComp
                                mutation={FarmRemoveGql}
                                variables={{id: this.state.input.farmInput.id}}
                                update={(cache, {data}) => {
                                    const query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    for (let region of query.regions) {
                                        for (let district of region.districts) {
                                            for (let household of district.households) {
                                                household.farms = household.farms.filter(
                                                    (item) => item.id !== data.removeFarm);
                                            }
                                        }
                                    }
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (remove: MutationFn<FarmRemoveMutation, FarmRemoveMutationVariables>) => {
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
                            </FarmRemoveComp>
                        }
                        {
                            this.state.input.farmInput.id !== '0' &&
                            <FarmUpdateComp
                                mutation={FarmUpdateGql}
                                variables={this.state.input}
                            >
                                {
                                    (update: MutationFn<FarmUpdateMutation, FarmUpdateMutationVariables>) => {
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
                            </FarmUpdateComp>
                        }
                        {
                            this.state.input.farmInput.id === '0' &&
                            <FarmCreateComp
                                mutation={FarmCreateGql}
                                variables={this.state.input}
                                update={(cache, {data}) => {
                                    const query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    let household = this.findHousehold(query, data.createFarm.household.id);
                                    household.farms = household.farms.concat([data.createFarm]);
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<FarmCreateMutation, FarmCreateMutationVariables>) => {
                                        return (
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
                            </FarmCreateComp>
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

    componentWillReceiveProps(props: FarmDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: FarmDialogProps): FarmDialogState => {
        let input: FarmInput = {
            id: props.farmData.id || '0',
            name: props.farmData.name || '',
            householdId: props.farmData.household.id
        };
        if (props.farmData.user != null) {
            input.userId = props.farmData.user.id;
        }
        return ({
            input: { farmInput: input },
            validate: single(input.name, constraints.name)
        });
    }

    private closeDialog = () => {
        if (this.props.onClose != null) {
            this.props.onClose();
        }
    }

    private nameChanged = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.farmInput);
        input.name = evnt.currentTarget.value;
        this.setState({
            input: { farmInput: input },
            validate: single(input.name, constraints.name)
        });
    }

    private findHousehold = (query: RegionsQuery, id: string): householdFragment => {
        for (let region of query.regions) {
            for (let district of region.districts) {
                for (let household of district.households) {
                    if (household.id === id) {
                        return household;
                    }
                }
            }
        }
        return undefined;
    }
}