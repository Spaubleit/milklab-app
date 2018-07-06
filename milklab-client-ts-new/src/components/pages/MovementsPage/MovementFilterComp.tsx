import * as React from 'react';
import { Button, Card, Checkbox, FormGroup, Popover, Radio, RadioGroup, TagInput, Position } from '@blueprintjs/core';
import { containerFragment, movementFragment, MovementType } from '../../../queries-types';
import { containerFilter } from '../ContainersPage/ContainersFilterComp';

export type movementFilterFunc = (a: movementFragment) => boolean;

interface Props {
    onChange?: (fun: movementFilterFunc) => void;
}

interface State {
    income: boolean;
    outcome: boolean;
    containers: Array<string>;
    containerValue: string;
}

export default class MovementFilterComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            income: true,
            outcome: true,
            containers: [],
            containerValue: ''
        };
    }

    render() {
        return (
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Card>
                        <FormGroup label="По типу перемещения">
                            <Checkbox
                                checked={this.state.income}
                                onChange={this.incomeChange}
                            >
                                Приход
                            </Checkbox>
                            <Checkbox
                                checked={this.state.outcome}
                                onChange={this.outcomeChange}
                            >
                                Отправка
                            </Checkbox>
                        </FormGroup>
                        <FormGroup label="Участвующие контейнеры">
                            <TagInput
                                inputValue={this.state.containerValue}
                                values={this.state.containers}
                                onChange={this.containersChange}
                                placeholder="Введите номера контейнеров"
                            />
                        </FormGroup>
                    </Card>
                }
            >
                <Button text="Фильтры" icon="filter" rightIcon="caret-down"/>
            </Popover>
        );
    }

    private incomeChange = () => {
        this.setState({
            income: !this.state.income
        });
        this.filterChange();
    }

    private outcomeChange = () => {
        this.setState({
            outcome: !this.state.outcome
        });
        this.filterChange();
    }

    private containersChange = (values: Array<string>) => {
        this.setState({
            containers: values.filter((x) => !isNaN(parseInt(x, 10)))
        });
        this.filterChange();
    }

    private movementContainers = (movement: movementFragment): Array<string> => {
        return movement.containers.map(x => x.number.toString());
    }

    private filterChange = () => {
        if (this.props.onChange) {
            this.props.onChange(
                (a: movementFragment) => {
                    let type: boolean = false;
                    if (this.state.income && a.type === MovementType.INCOME) {
                        type = true;
                    }
                    if (this.state.outcome && a.type === MovementType.OUTCOME) {
                        type = true;
                    }
                    let suitable: boolean = true;
                    let containers = this.movementContainers(a);
                    if (this.state.containers.length > 0) {
                        if (this.state.containers.every(
                                (num) => containers.indexOf(num) >= 0
                            )) {
                            suitable = true;
                        } else {
                            suitable = false;
                        }
                    }
                    return type && suitable;
                }
            );
        }
    }
}