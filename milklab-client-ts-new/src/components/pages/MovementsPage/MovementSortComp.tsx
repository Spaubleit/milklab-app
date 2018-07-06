import * as React from 'react';
import { Button, Card, FormGroup, Popover, Radio, RadioGroup } from '@blueprintjs/core';
import { movementFragment } from '../../../queries-types';
import * as moment from 'moment';

export type movementSortFunc = (a: movementFragment, b: movementFragment) => number;

interface Props {
    onChange?: (fun: movementSortFunc) => void;
}

interface State {
    sortDirection: number;
}

export default class MovementSortComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sortDirection: -1
        };
    }

    render () {
        return (
            <Popover
                content={
                    <Card>
                        <FormGroup label="По дате перемещения">
                            <RadioGroup
                                onChange={this.directionChanged}
                                selectedValue={this.state.sortDirection === -1 ? 'asc' : 'desc'}
                            >
                                <Radio value="asc">По убыванию</Radio>
                                <Radio value="desc">По возрастанию</Radio>
                            </RadioGroup>
                        </FormGroup>
                    </Card>
                }
            >
                <Button text="Сортировка" icon="sort" rightIcon="caret-down"/>
            </Popover>
        );
    }

    private directionChanged = (evnt: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            sortDirection: evnt.currentTarget.value === 'asc' ? -1 : 1
        });
        if (this.props.onChange) {
            this.props.onChange((a, b) => moment(a.date) > moment(b.date) ? this.state.sortDirection : 0 );
        }
    }
}