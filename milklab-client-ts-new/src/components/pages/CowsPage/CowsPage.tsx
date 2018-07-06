import * as React from 'react';
import { Button, Card, Intent, Label, MenuItem, NonIdealState } from '@blueprintjs/core';
import {
    cowFragment,
    CowsQuery, CowsQueryVariables, farmListItemFragment, FarmsQuery, groupFragment, GroupsQuery,
    GroupsQueryVariables
} from '../../../queries-types';
import Query from 'react-apollo/Query';
import { QueryResult } from 'react-apollo';
import { ItemRenderer, Select } from '@blueprintjs/select';
import * as FarmsQueryGql from '../../../graphql/Structure/Farm/FarmsQuery.graphql';
import * as GroupsQueryGql from '../../../graphql/Cow/GroupsQuery.graphql';
import * as CowsQueryGql from '../../../graphql/Cow/CowsQuery.graphql';
import './CowsPage.css';
import * as classnames from 'classnames';
import GroupDialog from './GroupDialog';
import CowDialog from './CowDialog';

class FarmsQueryComp extends Query<FarmsQuery> {}
class GroupsQueryComp extends Query<GroupsQuery, GroupsQueryVariables> {}
class CowsQueryComp extends Query<CowsQuery, CowsQueryVariables> {}

interface CowsPageState {
    farm?: farmListItemFragment; // selected farm
    group?: groupFragment; // selected group
    cow?: cowFragment; // edited cow
    isGroupDialogOpen: boolean;
    isCowDialogOpen: boolean;
}

const FarmSelect = Select.ofType<farmListItemFragment>();

export default class CowsPage extends React.Component<{}, CowsPageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            farm: null,
            group: null,
            isGroupDialogOpen: false,
            isCowDialogOpen: false
        };
    }

    render() {
        return (
            <div className="Page Padding">
                <div className="CowsGrid">
                    <Label className="CowsFillWidth" text="Выбор фермы">
                        <FarmsQueryComp
                            query={FarmsQueryGql}
                        >
                            {
                                (query: QueryResult<FarmsQuery>) => {
                                    if (query.loading) {
                                        return (
                                            <Button
                                                className="pt-fill"
                                                loading={true}
                                            />
                                        );
                                    }
                                    if (query.error) {
                                        return <Button
                                            className="pt-fill"
                                            text="Не удалось загрузить список ферм"
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
                    </Label>
                    {
                        !this.state.farm &&
                        <NonIdealState
                            className="CowsFillWidth"
                            title="Не выбрана ферма"
                            description="Выберите ферму, группы которой вы хотите посмотреть"
                            visual="error"
                        />
                    }
                    {
                        this.state.farm &&
                        <div className="CowsFillLeft">
                            <h6>Группы
                                <Button
                                    className="pt-inline"
                                    icon="plus"
                                    minimal={true}
                                    onClick={this.createGroup}
                                />
                            </h6>
                            <GroupsQueryComp
                                query={GroupsQueryGql}
                                variables={{farmId: this.state.farm ? this.state.farm.id : ''}}
                            >
                                {
                                    (query: QueryResult<GroupsQuery>) => {
                                        if (query.loading) {
                                            return <div>loading</div>;
                                        }
                                        if (query.error) {
                                            return <div>error</div>;
                                        }
                                        return (
                                            query.data.groups.map(group =>
                                                <Card
                                                    key={group.id}
                                                    className={classnames(
                                                        'GroupItem PaddingSmall',
                                                        (this.state.group && this.state.group.id === group.id
                                                            ? 'GroupItem PaddingSmall SelectedGroupItem'
                                                            : 'GroupItem PaddingSmall pt-interactive'))}
                                                    onClick={() => this.groupClick(group)}
                                                >
                                                    <b>{'№ ' + group.number}</b><br/>
                                                    {
                                                        group.user &&
                                                        group.user.lastname + ' ' +
                                                        group.user.firstname + ' ' +
                                                        group.user.middlename
                                                    }
                                                    <Button
                                                        className="AnchorButton"
                                                        icon="edit"
                                                        minimal={true}
                                                        onClick={() => this.updateGroup(group)}
                                                    />
                                                </Card>
                                            )
                                        );
                                    }
                                }
                            </GroupsQueryComp>
                            {
                                this.state.group &&
                                <GroupDialog
                                    isOpen={this.state.isGroupDialogOpen}
                                    groupData={this.state.group}
                                    onClose={this.closeDialog}
                                />
                            }
                        </div>
                    }
                    {
                        this.state.farm && !this.state.group &&
                        <NonIdealState
                            className="CowsFillRight"
                            title="Не выбрана группа"
                            visual="error"
                            description="Для просмотра коров необходимо выбрать группу"
                        />
                    }
                    {
                        this.state.group &&
                        <Card className="CowsFillRight">
                            <h6>Коровы
                                <Button
                                    className="pt-inline"
                                    icon="plus"
                                    minimal={true}
                                    onClick={this.createCow}
                                />
                            </h6>
                            <CowsQueryComp
                                query={CowsQueryGql}
                                variables={{groupId: this.state.group ? this.state.group.id : '0'}}
                            >
                                {
                                    (query) => {
                                        if (query.loading) {
                                            return <div>loading</div>;
                                        }
                                        if (query.error) {
                                            return (
                                                <NonIdealState
                                                    title="Ошибка зугрузки"
                                                    visual="error"
                                                    action={
                                                        <Button
                                                            text="Повторить попытку"
                                                        />
                                                    }
                                                />
                                            );
                                        }
                                        if (!query.data.cows.length) {
                                            return (
                                                <NonIdealState
                                                    title="Список пуст"
                                                    visual="circle"
                                                    // description="Создайте новую корову"
                                                    action={
                                                        <Button
                                                            text="Добавить корову"
                                                            icon="plus"
                                                            onClick={this.createCow}
                                                        />
                                                    }
                                                />
                                            );
                                        }
                                        return (
                                            query.data.cows.map(cow =>
                                                <Card
                                                    key={cow.id}
                                                    className="pt-interactive PaddingSmall CowItem"
                                                    onClick={() => this.updateCow(cow)}
                                                >
                                                    <b>{'№ ' + cow.number}</b><br/>
                                                    {cow.nickname}
                                                </Card>
                                            )
                                        );
                                    }
                                }
                            </CowsQueryComp>
                            {
                                this.state.cow &&
                                <CowDialog
                                    isOpen={this.state.isCowDialogOpen}
                                    cowData={this.state.cow}
                                    onClose={() => this.closeDialog()}
                                />
                            }
                        </Card>
                    }
                </div>
            </div>
        );
    }

    private farmRenderer: ItemRenderer<farmListItemFragment> = (farm, {handleClick}) => {
        return (
            <MenuItem key={farm.id} text={farm.name} onClick={handleClick}/>
        );
    }

    private farmSelect = (farm: farmListItemFragment) => {
        this.setState({
            farm: farm,
        });
    }

    private groupClick = (group: groupFragment) => {
        this.setState({
            group: group
        });
    }

    private createGroup = () => {
        this.setState({
            isGroupDialogOpen: true,
            group: {
                id: '0',
                number: 0,
                user: null,
                farm: this.state.farm
            }
        });
    }

    private updateGroup = (group: groupFragment) => {
        this.setState({
            isGroupDialogOpen: true
        });
    }

    private createCow = () => {
        this.setState({
            isCowDialogOpen: true,
            cow: {
                id: '0',
                number: 0,
                nickname: '',
                group: this.state.group
            }
        });
    }

    private updateCow = (cow: cowFragment) => {
        this.setState({
            isCowDialogOpen: true,
            cow: cow
        });
    }

    private closeDialog = () => {
        this.setState({
            isGroupDialogOpen: false,
            isCowDialogOpen: false,
        });
    }
}