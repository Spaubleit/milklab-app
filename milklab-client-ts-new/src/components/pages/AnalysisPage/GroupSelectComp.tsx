import * as React from 'react';
import { Button, FormGroup, Intent, MenuItem, ProgressBar } from '@blueprintjs/core';
import Query from 'react-apollo/Query';
import { farmListItemFragment, groupFragment, GroupsQuery, GroupsQueryVariables } from '../../../queries-types';
import { QueryResult } from 'react-apollo';
import { ItemRenderer, Select } from '@blueprintjs/select';
import * as GroupsGql from '../../../graphql/Cow/GroupsQuery.graphql';

const GroupSelect = Select.ofType<groupFragment>();
class GroupsQueryComp extends Query<GroupsQuery, GroupsQueryVariables> {}

interface Props {
    farm: farmListItemFragment;
    data?: groupFragment;
    onChange?: (group: groupFragment) => void;
}

interface State {
    farm: farmListItemFragment;
    group: groupFragment;
}

export default class GroupSelectComp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            farm: props.farm,
            group: this.props.data
        };
    }

    render () {
        return(
            <FormGroup
                label="Выбор групппы"
            >
                {
                    !this.props.farm &&
                    <Button
                        text="Выберите ферму"
                        fill={true}
                        disabled={true}
                    />
                }
                {
                    this.props.farm &&
                    <GroupsQueryComp
                        query={GroupsGql}
                        variables={{farmId: this.state.farm.id}}
                    >
                        {
                            (query: QueryResult<GroupsQuery, GroupsQueryVariables>) => {
                                if (query.loading) {
                                    return <ProgressBar/>;
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
                                    <GroupSelect
                                        items={query.data.groups}
                                        noResults={<MenuItem disabled={true} text="Список пуст"/>}
                                        itemRenderer={this.groupRenderer}
                                        onItemSelect={this.groupSelect}
                                    >
                                        <Button className="pt-fill" rightIcon="caret-down">
                                            {this.state.group
                                                ? '№' + this.state.group.number + ' ' + this.state.group.user.lastname
                                                : 'Не выбрана'
                                            }
                                        </Button>
                                    </GroupSelect>
                                );
                            }
                        }
                    </GroupsQueryComp>
                }
            </FormGroup>
        );
    }

    componentWillReceiveProps(props: Props) {
        this.setState({
            farm: this.props.farm
        });
    }

    private groupRenderer: ItemRenderer<groupFragment> = (group, {handleClick}) => {
        return <MenuItem key={group.id} text={'№' + group.number + group.user.lastname} onClick={handleClick}/>;
    }

    private groupSelect = (group: groupFragment) => {
        if (this.props.onChange) {
            this.props.onChange(group);
        }
        this.setState({
            group
        });
    }
}