import * as React from 'react';
import { userFragment } from '../../../queries-types';
import { Button, Card, Popover, Position, Radio, RadioGroup, Switch } from '@blueprintjs/core';
import { FormEvent } from 'react';

export type userSortFunction = (a: userFragment, b: userFragment) => number;

interface Props {
    onChange: (f: userSortFunction) => void;
}

interface State {
    backOrder: number;
    field: string;
    func: userSortFunction;
}

export default class UsersSortComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            backOrder: 1,
            field: 'username',
            func: (a, b) => a.username > b.username ? this.state.backOrder : 0
        };
    }

    render() {
        return(
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Card>
                        <Switch
                            label="Обратный порядок"
                            checked={this.state.backOrder === 1}
                            onChange={this.orderChange}
                            // onChange={() => this.props.testFunction(5)}
                        />
                        <RadioGroup
                            onChange={this.fieldChange}
                            label="Поле"
                            selectedValue={this.state.field}
                        >
                            <Radio label="Название аккаунта" value="username"/>
                            <Radio label="Фамилия" value="lastname"/>
                            <Radio label="Имя" value="firstname"/>
                            <Radio label="Отчество" value="middlename"/>
                        </RadioGroup>
                    </Card>
                }
            >
                <Button icon="sort" rightIcon="caret-down">Сортировка</Button>
            </Popover>
        );
    }

    private orderChange = () => {
        this.setState({
            backOrder: this.state.backOrder === 1 ? -1 : 1
        });
        this.changesort();
    }

    private fieldChange = (evnt: FormEvent<HTMLInputElement>) => {
        let func: userSortFunction = (a, b) => a.username > b.username ? this.state.backOrder : 0;
        switch (evnt.currentTarget.value) {
            case 'username':
                func = (a, b) => a.username > b.username ? this.state.backOrder : 0;
                break;
            case 'lastname':
                func = (a, b) => a.lastname > b.lastname ? this.state.backOrder : 0;
                break;
            case 'firstname':
                func = (a, b) => a.firstname > b.firstname ? this.state.backOrder : 0;
                break;
            case 'middlename':
                func = (a, b) => a.middlename > b.middlename ? this.state.backOrder : 0;
                break;
            default:
        }
        this.setState({
            field: evnt.currentTarget.value,
            func
        });
        this.changesort();
    }

    private changesort = () => {
        console.log('change');
        if (this.props.onChange) {
            this.props.onChange(this.state.func);
        }
    }
}