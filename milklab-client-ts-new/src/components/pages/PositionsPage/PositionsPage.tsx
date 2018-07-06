import * as React from 'react';
import './PositionsPage.css';
import * as PositionsQueryGql from '../../../graphql/PositionsQuery.graphql';
import Query from 'react-apollo/Query';
import { positionFragment, PositionInput, PositionsQuery } from '../../../queries-types';
import { QueryResult } from 'react-apollo';
import { Button, ButtonGroup, NonIdealState, Spinner } from '@blueprintjs/core';
import PositionItem from './PositionItem';
import { headerActions } from '../../AppHeader/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import PositionDialog from './PositionDialog';
import PositionFilterComp from './PositionFilterCom';

interface PositionsPageProps {
    setMenu: typeof headerActions.setMenu;
}

interface PositionsPageState {
    isDialogOpen: boolean;
    position: positionFragment;
    filterName: string;
}

class PositionsQueryComp extends Query<PositionsQuery> {}

class PositionsPage extends React.Component<PositionsPageProps, PositionsPageState> {
    private menu = (
        <ButtonGroup>
            <Button text="Добавить" icon="add" onClick={() => {this.createPosition(); }}/>
            <PositionFilterComp onChange={this.filterChange.bind(this)}/>
        </ButtonGroup>
    );

    constructor (props: PositionsPageProps) {
        super(props);
        props.setMenu(this.menu);
        this.state = {
            isDialogOpen: false,
            position: {
                id: '',
                name: ''
            },
            filterName: ''
        };
    }

    render () {
        return (
            <PositionsQueryComp query={PositionsQueryGql} displayName="PositionsPage">
            {
                (query: QueryResult<PositionsQuery>) => {
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
                                action={<Button text="Повторить" icon="repeat" onClick={() => query.refetch()}/>}
                            />
                        );
                    }
                    if (query.data.positions.length === 0) {
                        return (
                            <NonIdealState
                                title="Список пуст"
                                visual="circle"
                                action={<Button text="Добавить должность" icon="plus" onClick={this.createPosition}/>}
                            />
                        );
                    }
                    let processed: Array<positionFragment> = [...query.data.positions];
                    processed = processed.filter(x => x.name.toLowerCase().includes(this.state.filterName));
                    return (
                        <div className="Page Padding">
                            <div className="PositionsPage">
                                {
                                    processed.map((item: positionFragment) => {
                                        return <PositionItem
                                            key={item.id}
                                            position={item}
                                            onClick={this.positionClick}
                                        />;
                                    })

                                }
                                {
                                    <PositionDialog
                                        position={this.state.position}
                                        isOpen={this.state.isDialogOpen}
                                        onClose={this.formClose}
                                    />
                                }
                            </div>
                        </div>
                    );
                }
            }
            </PositionsQueryComp>
        );
    }

    private positionClick = (positionData: PositionInput) => {
        this.setState({
            isDialogOpen: true,
            position: {
                id: positionData.id,
                name: positionData.name
            }
        });
    }

    private formClose = () => this.setState({
        isDialogOpen: false
    })

    private createPosition = () => {
        this.setState({
            isDialogOpen: true,
            position: {
                id: '0',
                name: ''
            }
        });
    }

    private filterChange (name: string) {
        this.setState({
            filterName: name
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setMenu: headerActions.setMenu
    },
    dispatch);

export default connect(null, mapDispatchToProps)(PositionsPage);