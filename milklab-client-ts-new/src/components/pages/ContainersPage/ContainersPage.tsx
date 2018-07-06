import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { ContainersQuery } from '../../../queries-types';
import { Button, ButtonGroup, Card, Checkbox, Label, NonIdealState, Popover, Spinner } from '@blueprintjs/core';
import Query from 'react-apollo/Query';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { headerActions } from '../../AppHeader/actions';
import * as ContainersQueryGql from '../../../graphql/Containers/ContainersQuery.graphql';
import './ContainersPage.css';
import ContainersCreateButton from './ContainersCreateButton';
import ContainerDialog from './ContainerDialog';
import ContainerItem from './ContainerItem';
import ContainersFilterComp, { containerFilter } from './ContainersFilterComp';

interface ContainersPageProps {
    setMenu: typeof headerActions.setMenu;
}

interface ContainersPageState {
    isDialogOpen: boolean;
    filterFun: containerFilter;
}

class ContainersQueryComp extends Query<ContainersQuery> {}

class ContainersPage extends React.Component<ContainersPageProps, ContainersPageState> {
    constructor(props: ContainersPageProps) {
        super(props);
        props.setMenu(this.menu);
        this.state = {
            isDialogOpen: false,
            filterFun: () => true
        };
    }

    public menu = (
        <ButtonGroup>
            <ContainersCreateButton text="Добавить"/>
            <ContainersFilterComp onChange={this.changeFilters.bind(this)}/>
        </ButtonGroup>
    );

    render () {
        return (
            <div className="Page Padding ContainersList">
                <ContainersQueryComp
                    query={ContainersQueryGql}
                >
                    {
                        (query: QueryResult<ContainersQuery>) => {
                            if (query.loading) {
                                return (
                                    <NonIdealState
                                        title="Загрузка данных"
                                        visual={<Spinner/>}
                                    />
                                );
                            }
                            if (query.error) {
                                return (
                                    <NonIdealState
                                        title="Ошибка загрузки"
                                        visual="error"
                                        action={<Button text="Повторить" icon="repeat" onClick={query.refetch}/>}
                                    />
                                );
                            }
                            if (query.data.containers.length === 0) {
                                return (
                                    <NonIdealState
                                        title="Список пуст"
                                        visual="circle"
                                        action={<ContainersCreateButton text="Добавить контейнеры"/>}
                                    />
                                );
                            }
                            return (
                                query.data.containers.filter(this.state.filterFun).map(container => {
                                    return (
                                        <ContainerItem
                                            key={container.id}
                                            data={container}
                                        />
                                    );
                                })
                            );
                        }
                    }
                </ContainersQueryComp>
                <ContainerDialog isOpen={this.state.isDialogOpen} onClose={this.closeDialog} data={null}/>
            </div>
        );
    }

    private closeDialog = () => {
        this.setState({
            isDialogOpen: false
        });
    }

    private changeFilters (fun: containerFilter) {
        this.setState({
            filterFun: fun
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setMenu: headerActions.setMenu
    },
    dispatch
);

export default connect(null, mapDispatchToProps)(ContainersPage);