import * as React from 'react';
import { Alignment, Button, Label, MenuItem } from '@blueprintjs/core';
import { positionFragment, PositionsQuery } from '../../../queries-types';
import { QueryResult } from 'react-apollo';
import { ItemRenderer, Select } from '@blueprintjs/select';
import Query from 'react-apollo/Query';
import * as PositionsQueryGql from '../../../graphql/PositionsQuery.graphql';

interface PositionSelectProps {
    position?: positionFragment;
    onChange?: (position: positionFragment) => void;
}

interface PositionSelectState {
    position: positionFragment;
}

class PositionsQueryComp extends Query<PositionsQuery> {}
const PositionSelectComp = Select.ofType<positionFragment>();

class PositionSelect extends React.Component<PositionSelectProps, PositionSelectState> {
    constructor (props: PositionSelectProps) {
        super(props);
        this.state = {
            position: props.position
        };
    }
    render () {
        return (
            <PositionsQueryComp query={PositionsQueryGql}>
                {
                    (positionsQueryResult: QueryResult<PositionsQuery>) => {
                        if (positionsQueryResult.error) {
                            return <div>error</div>;
                        }
                        if (positionsQueryResult.loading) {
                            return <div>loading</div>;
                        }
                        return (
                            <Label text="Должность">
                                <PositionSelectComp
                                    popoverProps={{usePortal: false}}
                                    filterable={false}
                                    noResults={<MenuItem disabled={true} text="Нет результатов"/>}
                                    items={positionsQueryResult.data.positions}
                                    itemRenderer={this.positionRenderer}
                                    onItemSelect={this.positionSelect}
                                >
                                    <Button
                                        id="PositionSelect"
                                        className="pt-fill"
                                        rightIcon="caret-down"
                                        alignText={Alignment.LEFT}
                                    >
                                        {this.state.position ? this.state.position.name : 'Не выбрана'}
                                    </Button>
                                </PositionSelectComp>
                            </Label>
                        );
                    }
                }
            </PositionsQueryComp>
        );
    }

    componentWillReceiveProps (props: PositionSelectProps) {
        // this.setState({position: props.position});
    }

    private positionSelect = (item: positionFragment) => {
        this.setState({
            position: Object.assign({}, item)
        });
        if (this.props.onChange) {
            this.props.onChange(item);
        }
    }

    private positionRenderer: ItemRenderer<positionFragment> = (item, {handleClick}) => {
        return (
            <MenuItem key={item.id} text={item.name} onClick={handleClick}/>
        );
    }
}
export default PositionSelect;