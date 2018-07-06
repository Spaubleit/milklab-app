import * as React from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    FormGroup,
    Icon,
    Intent,
    NonIdealState,
    Popover,
    Radio,
    RadioGroup,
    Spinner,
    TagInput,
} from '@blueprintjs/core';
import './MovementsPage.css';
import { bindActionCreators, Dispatch } from 'redux';
import { headerActions } from '../../AppHeader/actions';
import { connect } from 'react-redux';
import Query from 'react-apollo/Query';
import { movementFragment, MovementsQuery, MovementType } from '../../../queries-types';
import { QueryResult } from 'react-apollo';
import * as MovementsQueryGql from '../../../graphql/Movements/MovementsQuery.graphql';
import MovementDialog from './MovementDialog';
import * as moment from 'moment';
import MovementSortComp, { movementSortFunc } from './MovementSortComp';
import MovementFilterComp, { movementFilterFunc } from './MovementFilterComp';

interface ContainersPageProps {
    setMenu: typeof headerActions.setMenu;
}

interface MovementsPageState {
    isDialogOpen: boolean;
    movement?: movementFragment;
    sortFunc: movementSortFunc;
    filterFunc: movementFilterFunc;
}

class MovementsQueryComp extends Query<MovementsQuery> {
}

class MovementsPage extends React.Component<ContainersPageProps, MovementsPageState> {
    private menu = (
        <ButtonGroup>
            <Button
                icon={<Icon icon="plus" intent={Intent.SUCCESS}/>}
                text="Добавить"
                onClick={() => this.createMovement()}
            />
            <MovementSortComp onChange={this.sortChange.bind(this)}/>
            <MovementFilterComp onChange={this.filterChange.bind(this)}/>
        </ButtonGroup>
    );

    constructor(props: ContainersPageProps) {
        super(props);
        props.setMenu(this.menu);
        this.state = {
            isDialogOpen: false,
            movement: null,
            sortFunc: (a, b) => moment(a.date) > moment(b.date) ? -1 : 0,
            filterFunc: () => true
        };
    }

    render() {
        return (
            <div className="Page Padding">
                <MovementsQueryComp
                    query={MovementsQueryGql}
                >
                    {
                        (query: QueryResult<MovementsQuery>) => {
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
                                        action={<Button text="Повторить" icon="repeat"/>}
                                    />
                                );
                            }
                            if (query.data.movements.length === 0) {
                                return (
                                    <NonIdealState
                                        title="Список пуст"
                                        visual="circle"
                                        action={
                                            <Button
                                                text="Добавить перемещение"
                                                icon="plus"
                                                onClick={this.createMovement}
                                            />
                                        }
                                    />
                                );
                            }
                            let processed = [...query.data.movements];
                            processed = processed.filter(this.state.filterFunc);
                            processed = processed.sort(this.state.sortFunc);
                            return (
                                <div>
                                    {
                                        processed.map(movement => {
                                            return (
                                                <div key={movement.id}>
                                                    <h6>
                                                        <Icon
                                                            icon={movement.type === MovementType.INCOME
                                                                ? 'import'
                                                                : 'export'}
                                                            intent={movement.type === MovementType.INCOME
                                                                ? Intent.SUCCESS
                                                                : Intent.DANGER}
                                                        />
                                                            {moment(movement.date).format('  HH:mm  dddd  DD.MM.YYYY')}
                                                        </h6>
                                                    <Card
                                                        className={movement.type === MovementType.INCOME
                                                            ? 'Spacing pt-interactive'
                                                            : 'Spacing pt-interactive pt-dark'}
                                                        onClick={() => this.editMovement(movement)}
                                                    >
                                                        <h6>Контейнеты</h6>
                                                        {
                                                            movement.containers.map(container => {
                                                                return (
                                                                    <span
                                                                        key={container.id}
                                                                        className="pt-tag"
                                                                    >
                                                                        {container.number}
                                                                    </span>
                                                                );
                                                            })
                                                        }
                                                    </Card>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        }
                    }
                </MovementsQueryComp>
                {
                    this.state.movement &&
                    <MovementDialog
                        isOpen={this.state.isDialogOpen}
                        movementData={this.state.movement}
                        onClose={this.closeDialog}
                    />
                }
            </div>
        );
    }

    private createMovement = () => {
        this.setState({
            isDialogOpen: true,
            movement: {
                id: '0',
                type: MovementType.INCOME,
                date: null,
                containers: []
            }
        });
    }

    private editMovement = (movement: movementFragment) => {
        this.setState({
            isDialogOpen: true,
            movement: movement
        });
    }

    private closeDialog = () => {
        this.setState({
            isDialogOpen: false
        });
    }

    private sortChange (fun: movementSortFunc) {
        this.setState({
            sortFunc: fun
        });
    }

    private filterChange (fun: movementFilterFunc) {
        this.setState({
            filterFunc: fun
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setMenu: headerActions.setMenu
    },
    dispatch
);

export default connect(null, mapDispatchToProps)(MovementsPage);