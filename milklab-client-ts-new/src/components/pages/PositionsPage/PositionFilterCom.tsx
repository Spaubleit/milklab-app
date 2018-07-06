import * as React from 'react';
import { Button, Card, Label, Popover, Position } from '@blueprintjs/core';

interface Props {
    onChange?: (name: string) => void;
}

interface State {
    name: string;
}

export default class PositionFilterComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: ''
        };
    }

    render() {
        return(
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Card>
                        <Label text="Название">
                            <input
                                className="pt-input"
                                value={this.state.name}
                                onChange={this.nameChange}
                            />
                        </Label>
                    </Card>
                }
            >
                <Button icon="filter" rightIcon="caret-down">Фильтры</Button>
            </Popover>
        );
    }

    private nameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        let name = evnt.currentTarget.value.toLowerCase();
        if (this.props.onChange) {
            this.props.onChange(name);
        }
        this.setState({
            name
        });
    }
}