import * as React from 'react';
import { roleFragment, RolesQuery } from '../../../queries-types';
import { QueryResult } from 'react-apollo';
import Query from 'react-apollo/Query';
import * as RoleQueryGql from '../../../graphql/RolesQuery.graphql';
import { Button, Label, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';

interface RolesSelectProps {
    roles?: Array<roleFragment>;
    onChange?: (roles: Array<roleFragment>) => void;
}

interface RolesSelectState {
    roles: Array<roleFragment>;
}

class RoleQueryComp extends Query<RolesQuery> {}

export default class RolesSelect extends React.Component<RolesSelectProps, RolesSelectState> {
    constructor (props: RolesSelectProps) {
        super(props);
        this.state = {
            roles: props.roles || []
        };
    }
    render () {
        const clearRoleButton = this.state.roles.length > 0 ?
            (
                <Button
                    icon="cross"
                    minimal={true}
                    onClick={this.clearRoles}
                />
            ) : null;
        return (
            <RoleQueryComp query={RoleQueryGql}>
                {
                    (roleQueryResult: QueryResult<RolesQuery>) => {
                        if (roleQueryResult.error) {
                            return <div>error</div>;
                        }
                        if (roleQueryResult.loading) {
                            return <div>loading</div>;
                        }
                        return (
                            <Label id="RoleSelect" text="Роли">
                                <MultiSelect
                                    items={roleQueryResult.data.roles}
                                    selectedItems={this.state.roles}
                                    itemRenderer={this.roleRenderer}
                                    tagRenderer={(item: roleFragment) => item.name}
                                    onItemSelect={this.roleSelectChange}
                                    tagInputProps={{
                                        onRemove: this.deselectRole,
                                        rightElement: clearRoleButton
                                    }}
                                />
                            </Label>
                        );
                    }
                }
            </RoleQueryComp>
        );
    }

    componentWillReceiveProps (props: RolesSelectProps) {
        this.setState({roles: props.roles || []});
    }

    private isRoleSelected = (role: roleFragment) => this.state.roles.indexOf(role) !== -1;

    private selectRole = (role: roleFragment) => {
        let roles = [...this.state.roles, role];
        this.setState({
            roles: roles
        });
        if (this.props.onChange) {
            this.props.onChange(roles);
        }
    }

    private deselectRole = (name: string) => {
        let roles = this.state.roles.filter((role) => role.name !== name);
        this.setState({
            roles: roles
        });
        if (this.props.onChange) {
            this.props.onChange(roles);
        }
    }

    private clearRoles = () => {
        this.setState({
            roles: []
        });
        if (this.props.onChange) {
            this.props.onChange([]);
        }
    }

    private roleRenderer: ItemRenderer<roleFragment> = (item, {handleClick}) => {
        return (
            <MenuItem
                key={item.id}
                icon={this.isRoleSelected(item) ? 'tick' : 'blank'}
                label={item.value}
                text={item.name}
                onClick={handleClick}
                shouldDismissPopover={false}
            />
        );
    }

    private roleSelectChange = (role: roleFragment) => {
        if (!this.isRoleSelected(role)) {
            this.selectRole(role);
        } else {
            this.deselectRole(role.name);
        }
    }
}