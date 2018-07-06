import * as React from 'react';
import { Dialog, Classes, Button, Intent, FormGroup } from '@blueprintjs/core';
import {
    HouseholdCreateMutation, HouseholdCreateMutationVariables, householdFragment, HouseholdInput,
    HouseholdRemoveMutation,
    HouseholdRemoveMutationVariables,
    HouseholdUpdateMutation,
    HouseholdUpdateMutationVariables, RegionsQuery,
} from '../../../../queries-types';
import { Mutation, MutationFn } from 'react-apollo';
import * as RegionsQueryGql from '../../../../graphql/Structure/Region/RegionsQuery.graphql';
import * as HouseholdCreateGql from '../../../../graphql/Structure/Household/HouseholdCreateMutation.graphql';
import * as HouseholdUpdateGql from '../../../../graphql/Structure/Household/HouseholdUpdateMutation.graphql';
import * as HouseholdRemoveGql from '../../../../graphql/Structure/Household/HouseholdRemoveMutation.graphql';
import { FormEvent } from 'react';
import { single } from 'validate.js';

class HouseholdCreateComp extends Mutation<HouseholdCreateMutation, HouseholdCreateMutationVariables> {}
class HouseholdUpdateComp extends Mutation<HouseholdUpdateMutation, HouseholdUpdateMutationVariables> {}
class HouseholdRemoveComp extends Mutation<HouseholdRemoveMutation, HouseholdRemoveMutationVariables> {}

interface HouseholdDialogProps {
    isOpen: boolean;
    householdData: householdFragment;
    onClose?: () => void;
}

interface HouseholdDialogState {
    input: HouseholdUpdateMutationVariables;
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

export default class HouseholdDialog extends React.Component<HouseholdDialogProps, HouseholdDialogState> {
    constructor(props: HouseholdDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render() {
        return(
            <Dialog
                isOpen={this.props.isOpen}
                title={this.state.input.householdInput.id === '0'
                    ? 'Добавление хозяйства'
                    : 'Изменение хозяйства'}
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
                            value={this.state.input.householdInput.name}
                            onChange={this.nameChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label="iban"
                    >
                        <input
                            className="pt-input pt-fill"
                            value={this.state.input.householdInput.iban}
                            onChange={this.ibanChange}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.householdInput.id !== '0' &&
                            <HouseholdRemoveComp
                                mutation={HouseholdRemoveGql}
                                variables={{id: this.state.input.householdInput.id}}
                                update={(cache, {data}) => {
                                    const query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    for (let region of query.regions) {
                                        for (let district of region.districts) {
                                            district.households = district.households.filter(
                                                (household) => household.id !== data.removeHousehold);
                                        }
                                    }
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (remove: MutationFn<HouseholdRemoveMutation, HouseholdRemoveMutationVariables>) => {
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
                            </HouseholdRemoveComp>
                        }
                        {
                            this.state.input.householdInput.id !== '0' &&
                            <HouseholdUpdateComp
                                mutation={HouseholdUpdateGql}
                                variables={this.state.input}
                            >
                                {
                                    (update: MutationFn<HouseholdUpdateMutation, HouseholdUpdateMutationVariables>) => {
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
                            </HouseholdUpdateComp>
                        }
                        {
                            this.state.input.householdInput.id === '0' &&
                            <HouseholdCreateComp
                                mutation={HouseholdCreateGql}
                                variables={this.state.input}
                                update={(cache, {data}) => {
                                    const query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    for (let region of query.regions) {
                                        for (let district of region.districts) {
                                            district.households = district.households.concat([data.createHousehold]);
                                        }
                                    }
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<HouseholdCreateMutation, HouseholdCreateMutationVariables>) => {
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
                            </HouseholdCreateComp>
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

    componentWillReceiveProps(props: HouseholdDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: HouseholdDialogProps): HouseholdDialogState => {
        let input: HouseholdInput = {
            id: props.householdData.id || '0',
            name: props.householdData.name || '',
            iban: props.householdData.iban || '',
            districtId: props.householdData.district.id
        };
        if (props.householdData.user != null) {
            input.userId = props.householdData.user.id;
        }
        return ({
            input: { householdInput: input },
            validate: single(input.name, constraints.name)
        });
    }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    private nameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = this.state.input.householdInput;
        input.name = evnt.currentTarget.value;
        this.setState({
            input: { householdInput: input },
            validate: single(input.name, constraints.name)
        });
    }

    private ibanChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = this.state.input.householdInput;
        input.iban = evnt.currentTarget.value;
        this.setState({
            input: { householdInput: input }
        });
    }
}