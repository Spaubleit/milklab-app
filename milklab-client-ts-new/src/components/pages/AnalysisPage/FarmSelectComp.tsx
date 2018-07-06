import * as React from 'react';
import { Button, FormGroup, Intent, IPopoverProps, MenuItem, ProgressBar } from '@blueprintjs/core';
import { ItemRenderer, Select } from '@blueprintjs/select';
import { farmListItemFragment, FarmsQuery } from '../../../queries-types';
import Query from 'react-apollo/Query';
import * as FarmsQueryGql from '../../../graphql/Structure/Farm/FarmsQuery.graphql';
import { QueryResult } from 'react-apollo';

class FarmsQueryComp extends Query<FarmsQuery> {}
const FarmSelect = Select.ofType<farmListItemFragment>();

interface Props {
    data?: farmListItemFragment;
    onChange?: (farm: farmListItemFragment) => void;
}

interface State {
    farm: farmListItemFragment;
}

export default class FarmSelectComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            farm: props.data || null
        };
    }

    render () {
        return(
            <FormGroup
                label="Ферма"
            >
                <FarmsQueryComp
                    query={FarmsQueryGql}
                >
                    {
                        (query: QueryResult<FarmsQuery>) => {
                            if (query.loading) {
                                return (
                                    <ProgressBar/>
                                );
                            }
                            if (query.error) {
                                return <Button
                                    text="Ошибка загрузки"
                                    className="pt-fill"
                                    icon="refresh"
                                    intent={Intent.DANGER}
                                    onClick={() => query.refetch()}
                                />;
                            }
                            return (
                                <FarmSelect
                                    items={query.data.farms}
                                    noResults={<MenuItem disabled={true} text="Список пуст"/>}
                                    itemRenderer={this.farmRenderer}
                                    onItemSelect={this.farmSelect}
                                >
                                    <Button className="pt-fill" rightIcon="caret-down">
                                        {this.state.farm ? this.state.farm.name : 'Не выбрана'}
                                    </Button>
                                </FarmSelect>
                            );
                        }
                    }
                </FarmsQueryComp>
            </FormGroup>
        );
    }

    private farmRenderer: ItemRenderer<farmListItemFragment> = (farm, {handleClick}) => {
        return (
            <MenuItem key={farm.id} text={farm.name} onClick={handleClick}/>
        );
    }

    private farmSelect = (farm: farmListItemFragment) => {
        if (this.props.onChange) {
            this.props.onChange(farm);
        }
        this.setState({
            farm
        });
    }
}