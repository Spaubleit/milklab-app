import * as React from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    FormGroup,
    Label,
    NonIdealState,
    Popover,
    Spinner
} from '@blueprintjs/core';
import { headerActions } from '../../AppHeader/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Cell, Column, Table } from '@blueprintjs/table';
import { RouteComponentProps } from 'react-router';
import Query from 'react-apollo/Query';
import {
    AnalysesQuery,
    AnalysesQueryVariables,
    analysisFragment,
    ContainerByIdQuery,
    ContainerByIdQueryVariables
} from '../../../queries-types';
import { QueryResult } from 'react-apollo';
import * as AnalysesGql from '../../../graphql/Analyses/AnalysesQuery.graphql';
import * as ContainerByIdGql from '../../../graphql/Containers/ContainerByIdQuery.graphql';
import { store } from '../../../store';
import { push } from 'react-router-redux';
import AnalysisDialog from './AnalysisDialog';
import './AnalysisPage.css';
import FarmSelectComp from './FarmSelectComp';
import ContainerConfig from './ContainerConfig';

interface MatchParams {
    containerId: string;
}

interface Props extends RouteComponentProps<MatchParams> {
    setMenu: typeof headerActions.setMenu;
}

interface State {
    columns: Array<TableColumn>;
    isDialogOpen: boolean;
    analysis: analysisFragment;
}

interface TableColumn {
    // name: string;
    title: string;
    visible: boolean;
}

class ContainerByIdComp extends Query<ContainerByIdQuery, ContainerByIdQueryVariables> {}
class AnalysesComp extends Query<AnalysesQuery, AnalysesQueryVariables> {}

class AnalysisPage extends React.Component<Props, State> {
    private menu = (
        <ButtonGroup>
            <Button text="Добавить" icon="plus"/>
            <Button text="Сформировать" icon="document"/>
            <Button text="Сортировка" icon="sort"/>
            <Popover
                content={
                    <Card>
                        <Label text="Видимые столбцы"/>
                        <Checkbox
                            // checked={this.state.columns[0].visible}
                        >
                            Кислотность
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[1].visible}
                        >
                            Соматические клетки
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[2].visible}
                        >
                            Лимонная кислота
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[3].visible}
                        >
                            Электропроводность
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[4].visible}
                        >
                            Белки
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[5].visible}
                        >
                            Жиры
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[6].visible}
                        >
                            Точка росы
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[7].visible}
                        >
                            Лактоза
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[8].visible}
                        >
                            Твёрдые вещества
                        </Checkbox>
                        <Checkbox
                            // checked={this.state.columns[9].visible}
                        >
                            Мочевина
                        </Checkbox>
                    </Card>
                }
            >
                <Button text="Фильтры" icon="filter"/>
            </Popover>
        </ButtonGroup>
    );

    constructor(props: Props) {
        super(props);
        props.setMenu(this.menu);
        this.state = {
            isDialogOpen: false,
            analysis: null,
            columns: [
                {
                    title: 'Кислотность',
                    visible: true,
                },
                {
                    title: 'Соматические клетки',
                    visible: true,
                },
                {
                    title: 'Лимонная кислота',
                    visible: true,
                },
                {
                    title: 'Электропроводность',
                    visible: true,
                },
                {
                    title: 'Белки',
                    visible: true,
                },
                {
                    title: 'Жиры',
                    visible: true
                },
                {
                    title: 'Точка росы',
                    visible: true,
                },
                {
                    title: 'Лактоза',
                    visible: true,
                },
                {
                    title: 'Твёрдые вещества',
                    visible: true,
                },
                {
                    title: 'Мочевина',
                    visible: true,
                }
            ]
        };
    }

    render() {
        return(
            <div className="Page Padding">
                <ContainerByIdComp
                    query={ContainerByIdGql}
                    variables={{containerId: this.props.match.params.containerId}}
                >
                    {
                        (query: QueryResult<ContainerByIdQuery>) => {
                            if (query.loading) {
                                return (
                                    <NonIdealState
                                        title="Загрузка данных о контейнере"
                                        visual={<Spinner/>}
                                    />
                                );
                            }
                            if (query.error) {
                                return (
                                    <NonIdealState
                                        title="Ошибка загрузки"
                                        visual="error"
                                        description="Выбранный контейнер отсутствует или удалён"
                                    />
                                );
                            }
                            if (!query.data.containerById.group) {
                                return <ContainerConfig/>;
                            }
                            return (
                                'контейнер успешно загружен'
                            );
                        }
                    }
                </ContainerByIdComp>
                <AnalysesComp
                    query={AnalysesGql}
                    variables={{containerId: this.props.match.params.containerId}}
                >
                    {
                        (query: QueryResult<AnalysesQuery, AnalysesQueryVariables>) => {
                            if (query.loading) {
                                return (
                                    <NonIdealState
                                        className="AnalisysFill"
                                        title="Загрузка данных"
                                        visual={<Spinner/>}
                                    />
                                );
                            }
                            if (query.error) {
                                return (
                                    <NonIdealState
                                        className="AnalisysFill"
                                        title="Ошибка загрузки"
                                        visual="error"
                                        description="Нет доступа к серверу или этот контейнер удалён"
                                        action={
                                            <ButtonGroup>
                                                <Button text="Повторить" icon="repeat"/>
                                                <Button
                                                    text="Вернуться"
                                                    icon="undo"
                                                    onClick={() => store.dispatch(push('/containers'))}
                                                />
                                            </ButtonGroup>
                                        }
                                    />
                                );
                            }
                            if (query.data.analyses.length === 0) {
                                return (
                                    <NonIdealState
                                        className="AnalisysFill"
                                        title="Список пуст"
                                        visual="circle"
                                        action={
                                            <Button
                                                text="Добавить анализ"
                                                icon="plus"
                                                onClick={this.createAnalysis}
                                            />
                                        }
                                    />
                                );
                            }
                            return(
                                <div>
                                    <Table numRows={10}>
                                        {
                                            this.state.columns.map(column => {
                                                if (column.visible) {
                                                    return (
                                                        <Column
                                                            key={column.title}
                                                            name={column.title}
                                                        />
                                                    );
                                                }
                                                return undefined;
                                            })
                                        }
                                    </Table>
                                </div>
                            );
                        }
                    }
                </AnalysesComp>
                {
                    this.state.analysis &&
                    <AnalysisDialog
                        isOpen={this.state.isDialogOpen}
                        onClose={this.closeDialog}
                        data={this.state.analysis}
                    />
                }
            </div>
        );
    }

    private cellRenderer = () => {
        return <Cell>{(Math.random() * 100).toFixed(2)}</Cell>;
    }

    private closeDialog = () => {
        this.setState({
            isDialogOpen: !this.state.isDialogOpen
        });
    }

    private createAnalysis = () => {
        this.setState({
            isDialogOpen: true,
            analysis: {
                id: '0',
                acidity: null,
                cells: null,
                citricAcid: null,
                conductivity: null,
                fat: null,
                freezingPoint: null,
                lactose: null,
                protein: null,
                solids: null,
                urea: null,
                container: {
                    id: this.props.match.params.containerId
                },
                cow: null
            }
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setMenu: headerActions.setMenu
    },
    dispatch);

export default connect(null, mapDispatchToProps)(AnalysisPage);