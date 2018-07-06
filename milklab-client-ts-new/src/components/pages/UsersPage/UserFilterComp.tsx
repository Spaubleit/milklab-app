import * as React from 'react';
import { Button, Card, Label, Popover, Position } from '@blueprintjs/core';
import RolesSelect from './RolesSelect';
import PositionSelect from './PositionSelect';
import { roleFragment, userFragment } from '../../../queries-types';

export type userFilterFunction = (x: userFragment) => boolean;

interface Props {
    onChange?: (fun: userFilterFunction) => void;
}

interface State {
    username: string;
    lastname: string;
    firstname: string;
    middlename: string;
    roles: Array<roleFragment>;
}

export default class UserFilterComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            lastname: '',
            firstname: '',
            middlename: '',
            roles: []
        };
    }

    render() {
        return (
            <Popover
                position={Position.BOTTOM_LEFT}
                content={
                    <Card>
                        <Label text="Название аккаунта">
                            <input
                                className="pt-input pt-fill"
                                value={this.state.username}
                                onChange={this.usernameChange}
                            />
                        </Label>
                        <Label text="Фамилия">
                            <input
                                className="pt-input pt-fill"
                                value={this.state.lastname}
                                onChange={this.lastnameChange}
                            />
                        </Label>
                        <Label text="Имя">
                            <input
                                className="pt-input pt-fill"
                                value={this.state.firstname}
                                onChange={this.firstnameChange}
                            />
                        </Label>
                        <Label text="Отчество">
                            <input
                                className="pt-input pt-fill"
                                value={this.state.middlename}
                                onChange={this.middelenameChange}
                            />
                        </Label>
                        <PositionSelect/>
                        <RolesSelect roles={this.state.roles} onChange={this.rolesChange.bind(this)}/>
                    </Card>
                }
            >
                <Button icon="filter" rightIcon="caret-down">Фильтры</Button>
            </Popover>
        );
    }

    private usernameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            username: evnt.currentTarget.value
        });
        this.changeFilter();
    }

    private lastnameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            lastname: evnt.currentTarget.value
        });
        this.changeFilter();
    }

    private firstnameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            firstname: evnt.currentTarget.value
        });
        this.changeFilter();
    }

    private middelenameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            middlename: evnt.currentTarget.value
        });
        this.changeFilter();
    }

    private rolesChange (roles: Array<roleFragment>) {
        this.setState({
            roles
        });
        this.changeFilter();
    }

    private rolesToId = (roles: Array<roleFragment>): Array<string> => {
        return roles.map((x) => x.id);
    }

    private changeFilter = () => {
        if (this.props.onChange) {
            this.props.onChange((user: userFragment) => {
                let suitable = true;
                if (this.state.username && !user.username.toLowerCase().includes(this.state.username.toLowerCase())) {
                    suitable = false;
                }
                if (this.state.lastname && !user.lastname.toLowerCase().includes(this.state.lastname.toLowerCase())) {
                    suitable = false;
                }
                if (this.state.firstname
                    && !user.firstname.toLowerCase().includes(this.state.firstname.toLowerCase())) {
                    suitable = false;
                }
                if (this.state.middlename
                    && !user.middlename.toLowerCase().includes(this.state.middlename.toLowerCase())) {
                    suitable = false;
                }
                let roles = this.rolesToId(user.roles);
                let selectedRoles = this.rolesToId(this.state.roles);
                if (this.state.roles
                    && !selectedRoles.every((x) => roles.indexOf(x) >= 0)
                ) {
                    suitable = false;
                }
                return suitable;
            });
        }
    }
}