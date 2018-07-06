import * as React from 'react';
import { Dialog, Classes, FormGroup, Button, Intent } from '@blueprintjs/core';
import {
    DistrictCreateMutation, DistrictCreateMutationVariables, districtFragment, DistrictInput, DistrictRemoveMutation,
    DistrictRemoveMutationVariables,
    DistrictUpdateMutation,
    DistrictUpdateMutationVariables, RegionsQuery
} from '../../../../queries-types';
import { Mutation, MutationFn } from 'react-apollo';
import { FormEvent } from 'react';
import { single } from 'validate.js';
import * as RegionsQueryGql from '../../../../graphql/Structure/Region/RegionsQuery.graphql';
import * as DistrictCreateGql from '../../../../graphql/Structure/District/DistrictCreateMutation.graphql';
import * as DistrictUpdateGql from '../../../../graphql/Structure/District/DistrictUpdateMutation.graphql';
import * as DistrictRemoveGql from '../../../../graphql/Structure/District/DistrictRemoveMutation.graphql';

class DistrictCreateComp extends Mutation<DistrictCreateMutation, DistrictCreateMutationVariables> {}
class DistrictUpdateComp extends Mutation<DistrictUpdateMutation, DistrictUpdateMutationVariables> {}
class DistrictRemoveComp extends Mutation<DistrictRemoveMutation, DistrictRemoveMutationVariables> {}

interface DistrictDialogProps {
    isOpen: boolean;
    districtData: districtFragment;
    onClose?: () => void;
}

interface DistrictDialogState {
    input: DistrictUpdateMutationVariables;
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

export default class DistrictDialog extends React.Component<DistrictDialogProps, DistrictDialogState> {
    constructor(props: DistrictDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render() {
        return(
            <Dialog
                isOpen={this.props.isOpen}
                title={this.state.input.districtInput.id === '0'
                    ? 'Добавление района'
                    : 'Редактирование района'}
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
                            value={this.state.input.districtInput.name}
                            onChange={this.nameChange}
                        />
                    </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.state.input.districtInput.id !== '0' &&
                            <DistrictRemoveComp
                                mutation={DistrictRemoveGql}
                                variables={{id: this.state.input.districtInput.id}}
                                update={(cache, {data}) => {
                                    let query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    for (let region of query.regions) {
                                        region.districts = region.districts.filter(
                                            x => x.id !== data.removeDistrict);
                                    }
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (remove: MutationFn<DistrictRemoveMutation, DistrictRemoveMutationVariables>) => {
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
                            </DistrictRemoveComp>
                        }
                        {
                            this.state.input.districtInput.id !== '0' &&
                            <DistrictUpdateComp
                                mutation={DistrictUpdateGql}
                                variables={this.state.input}
                            >
                                {
                                    (update: MutationFn<DistrictUpdateMutation, DistrictUpdateMutationVariables>) => {
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
                            </DistrictUpdateComp>
                        }
                        {
                            this.state.input.districtInput.id === '0' &&
                            <DistrictCreateComp
                                mutation={DistrictCreateGql}
                                variables={this.state.input}
                                update={(cache, {data}) => {
                                    let query: RegionsQuery = cache.readQuery({query: RegionsQueryGql});
                                    let region = query.regions.find(x => x.id === data.createDistrict.region.id);
                                    // console.log(region.districts.concat([data.createDistrict]));
                                    region.districts = region.districts.concat([data.createDistrict]);
                                    cache.writeQuery({
                                        query: RegionsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<DistrictCreateMutation, DistrictCreateMutationVariables>) => {
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
                            </DistrictCreateComp>
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

    componentWillReceiveProps(props: DistrictDialogProps) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: DistrictDialogProps): DistrictDialogState => {
        let input: DistrictInput = {
            id: props.districtData.id || '0',
            name: props.districtData.name || '',
            regionId: props.districtData.region.id
        };
        if (props.districtData.user != null) {
            input.userId = props.districtData.user.id;
        }
        return ({
            input: { districtInput: input },
            validate: single(input.name, constraints.name)
        });
    }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    private nameChange = (evnt: FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input.districtInput);
        input.name = evnt.currentTarget.value;
        this.setState({
            input: { districtInput: input },
            validate: single(input.name, constraints.name)
        });
    }
}