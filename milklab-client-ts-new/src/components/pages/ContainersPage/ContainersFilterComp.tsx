import * as React from 'react';
import { Button, Card, Checkbox, Label, Popover } from '@blueprintjs/core';
import { containerFragment, ContainerState } from '../../../queries-types';

export type containerFilter = (x: containerFragment) => boolean;

interface Props {
    onChange?: (fun: containerFilter) => void;
}

interface State {
    states: Array<ContainerState>;
}

export default class ContainersFilterComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            states: [
                ContainerState.STORED,
                ContainerState.SENDED,
                ContainerState.RECIVED,
                ContainerState.LOST
            ]
        };
    }

    render () {
        return (
            <Popover
                content={
                    <Card>
                        <Label text="Состояние"/>
                        <Checkbox
                            checked={this.state.states.indexOf(ContainerState.STORED) > -1}
                            value={ContainerState.STORED}
                            onChange={this.valueChange}
                        >
                            На хранении
                        </Checkbox>
                        <Checkbox
                            checked={this.state.states.indexOf(ContainerState.SENDED) > -1}
                            value={ContainerState.SENDED}
                            onChange={this.valueChange}
                        >
                            Отправлен
                        </Checkbox>
                        <Checkbox
                            checked={this.state.states.indexOf(ContainerState.RECIVED) > -1}
                            value={ContainerState.RECIVED}
                            onChange={this.valueChange}
                        >
                            Принят
                        </Checkbox>
                        <Checkbox
                            checked={this.state.states.indexOf(ContainerState.LOST) > -1}
                            value={ContainerState.LOST}
                            onChange={this.valueChange}
                        >
                            Утерян
                        </Checkbox>
                    </Card>
                }
            >
                <Button text="Фильтры" icon="filter"/>
            </Popover>
        );
    }

    private valueChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        let states = [...this.state.states];
        let value = evnt.currentTarget.value as ContainerState;
        let index = states.indexOf(value);
        if (index < 0) {
            states = states.concat([value]);
        } else {
            states.splice(index, 1);
        }
        this.setState({
            states
        });
        if (this.props.onChange) {
            this.props.onChange((x) => states.indexOf(x.state) > -1);
        }
    }
}