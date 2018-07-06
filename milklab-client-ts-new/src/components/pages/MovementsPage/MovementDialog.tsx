import * as React from 'react';
import {
    Button,
    Classes,
    Dialog,
    FormGroup,
    Intent,
    NonIdealState,
    Radio,
    RadioGroup,
    Spinner
} from '@blueprintjs/core';
import {
    containerFragment,
    ContainersQuery,
    ContainersQueryVariables,
    ContainerState, MovementCreateMutation, MovementCreateMutationVariables,
    movementFragment,
    MovementInput, MovementsQuery,
    MovementType, MovementUpdateMutation, MovementUpdateMutationVariables
} from '../../../queries-types';
import { DateInput, TimePickerPrecision } from '@blueprintjs/datetime';
import * as moment from 'moment';
import 'moment/locale/ru';
import LocaleUtilsImp from '../../../LocaleUtilsImp';
import Query from 'react-apollo/Query';
import { Mutation, MutationFn, QueryResult } from 'react-apollo';
import ContainersSelect from './ContainersSelect';
import * as MovementsQueryGql from '../../../graphql/Movements/MovementsQuery.graphql';
import * as ContainersQueryGql from '../../../graphql/Containers/ContainersQuery.graphql';
import * as MovementUpdateGql from '../../../graphql/Movements/MovementUpdateMutation.graphql';
import * as MovementCreateGql from '../../../graphql/Movements/MovementCreateMutation.graphql';

interface MovementDialogProps {
    isOpen: boolean;
    onClose: () => void;
    movementData: movementFragment;
}

interface MovementDialogState {
    input: MovementInput;
    date: Date;
    income: Array<containerFragment>;
    outcome: Array<containerFragment>;
}

class ContainersQueryComp extends Query<ContainersQuery, ContainersQueryVariables> {}
class MovementUpdateComp extends Mutation<MovementUpdateMutation, MovementUpdateMutationVariables> {}
class MovementCreateComp extends Mutation<MovementCreateMutation, MovementCreateMutationVariables> {}

export default class MovementDialog extends React.Component<MovementDialogProps, MovementDialogState> {
    constructor(props: MovementDialogProps) {
        super (props);
        this.state = this.mapPropsToState(props);
    }

    render () {
        return (
            <Dialog
                isOpen={this.props.isOpen}
                title={this.props.movementData.id === '0'
                    ? 'Добавление перемещения'
                    : 'Изменение перемещения'}
                canOutsideClickClose={false}
                onClose={this.closeDialog}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup
                        label={'Дата перемещения'}
                    >
                        <DateInput
                            className="MovementDate"
                            value={this.state.date}
                            formatDate={(date, locale) => moment(date).locale(locale).format('HH:mm  dddd  DD.MM.YYYY')}
                            parseDate={(str, locale) => moment(str, 'HH:mm  dddd  DD.MM.YYYY').locale(locale).toDate()}
                            locale="ru"
                            localeUtils={LocaleUtilsImp}
                            timePrecision={TimePickerPrecision.MINUTE}
                            onChange={this.dateChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Тип перемещения"
                    >
                        <RadioGroup
                            inline={true}
                            onChange={this.typeChange}
                            selectedValue={this.state.input.type}
                        >
                            <Radio value={MovementType.INCOME}>
                                Приёмка
                            </Radio>
                            <Radio value={MovementType.OUTCOME}>
                                Отправка
                            </Radio>
                        </RadioGroup>
                    </FormGroup>
                    {
                        this.state.input.type === MovementType.OUTCOME &&
                        <ContainersQueryComp
                            query={ContainersQueryGql}
                            variables={{state: ContainerState.STORED}}
                        >
                        {
                            (query: QueryResult<ContainersQuery>) => {
                                if (query.loading) {
                                    return (
                                        <NonIdealState
                                            visual={<Spinner/>}
                                            title="Загрузка данных"
                                        />
                                    );
                                }
                                if (query.error) {
                                    return (
                                        <NonIdealState
                                            visual="error"
                                            title="Ошибка получения контейнеров"
                                            action={<Button text="Повторить" icon="repeat"/>}
                                        />
                                    );
                                }
                                return (
                                    <FormGroup label="Контейнеры">
                                        <div id="ContainersGrid">
                                            <ContainersSelect
                                                title="Для отправки"
                                                containers={this.state.income}
                                                onClick={this.removeFromIncome}
                                            />
                                            <ContainersSelect
                                                title="В лаборатории"
                                                containers={
                                                    this.substractContainers(query.data.containers, this.state.income)
                                                }
                                                onClick={this.addToIncome}
                                            />
                                        </div>
                                    </FormGroup>
                                );
                            }
                        }
                        </ContainersQueryComp>
                    }
                    {
                        this.state.input.type === MovementType.INCOME &&
                        <ContainersQueryComp
                            query={ContainersQueryGql}
                            variables={{state: ContainerState.SENDED}}
                        >
                        {
                            (query: QueryResult<ContainersQuery>) => {
                                if (query.loading) {
                                    return <NonIdealState title="Загрузка данных" visual={<Spinner/>}/>;
                                }
                                if (query.error) {
                                    return <NonIdealState title="Ошибка загрузки"/>;
                                }
                                return(
                                    <FormGroup label="Контейнеры">
                                        <div id="ContainersGrid">
                                            <ContainersSelect
                                                title="Отправленные"
                                                containers={
                                                    this.substractContainers(query.data.containers, this.state.outcome)
                                                }
                                                onClick={this.addToOutcome}
                                            />
                                            <ContainersSelect
                                                title="Для приёмки"
                                                containers={this.state.outcome}
                                                onClick={this.removeFromOutcome}
                                            />
                                        </div>
                                    </FormGroup>
                                );
                            }
                        }
                        </ContainersQueryComp>
                    }
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {
                            this.props.movementData.id !== '0' &&
                            <Button
                                text="Удалить"
                                intent={Intent.DANGER}
                            />
                        }
                        {
                            this.props.movementData.id !== '0' &&
                            <MovementUpdateComp
                                mutation={MovementUpdateGql}
                                variables={{movementInput: this.state.input}}
                            >
                                {
                                    (update: MutationFn<MovementUpdateMutation, MovementUpdateMutationVariables>) => {
                                        return (
                                            <Button
                                                text="Изменить"
                                                intent={Intent.SUCCESS}
                                                onClick={() => {
                                                    update();
                                                    this.closeDialog();
                                                }}
                                            />
                                        );
                                    }
                                }
                            </MovementUpdateComp>
                        }
                        {
                            this.props.movementData.id === '0' &&
                            <MovementCreateComp
                                mutation={MovementCreateGql}
                                variables={{movementInput: this.state.input}}
                                update={(cache, {data}) => {
                                    let query: MovementsQuery = cache.readQuery({query: MovementsQueryGql});
                                    query.movements = query.movements.concat([data.createMovement]);
                                    cache.writeQuery({
                                        query: MovementsQueryGql,
                                        data: query
                                    });
                                }}
                            >
                                {
                                    (create: MutationFn<MovementCreateMutation, MovementCreateMutationVariables>) => {
                                        return(
                                            <Button
                                                text="Добавить"
                                                intent={Intent.SUCCESS}
                                                onClick={() => {
                                                    create();
                                                    this.closeDialog();
                                                }}
                                            />
                                        );
                                    }
                                }
                            </MovementCreateComp>
                        }
                        <Button text="Отмена" onClick={this.closeDialog}/>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps(props: MovementDialogProps) {
        this.setState(this.mapPropsToState(props));
    }

    private mapPropsToState = (props: MovementDialogProps): MovementDialogState => {
        return ({
            input: {
                id: props.movementData.id || '0',
                date: props.movementData.date || moment.utc().format(),
                type: props.movementData.type || MovementType.INCOME
            },
            date: new Date(),
            income: [],
            outcome: []
        });
    }

    private closeDialog = () => {
        this.props.onClose();
    }

    private dateChange = (date: Date) => {
        let input = Object.assign({}, this.state.input);
        input.date = moment.utc(date).format();
        this.setState({
            date,
            input,
        });
    }

    private typeChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        let input = Object.assign({}, this.state.input);
        switch (evnt.currentTarget.value) {
            case MovementType.INCOME:
                input.type = MovementType.INCOME;
                break;
            case MovementType.OUTCOME:
                input.type = MovementType.OUTCOME;
                break;
            default:
        }
        this.setState({
            input
        });
    }

    private substractContainers = (origin: Array<containerFragment>, substact: Array<containerFragment>) => {
        return origin.filter((item) => {
            return substact.indexOf(item) < 0;
        });
    }

    private addToIncome = (container: containerFragment) => {
        let income = this.state.income;
        income = this.sortContainers(income.concat([container]));
        let input = Object.assign({}, this.state.input);
        input.containersId = income.map(x => x.id);
        this.setState({
            income: income,
            input: input
        });
    }

    private addToOutcome = (container: containerFragment) => {
        let outcome = this.state.outcome;
        outcome = this.sortContainers(outcome.concat([container]));
        let input = Object.assign({}, this.state.input);
        input.containersId = outcome.map(x => x.id);
        this.setState({
            outcome: outcome,
            input: input
        });
    }

    private removeFromIncome = (container: containerFragment) => {
        let income = this.state.income;
        income.splice(income.indexOf(container), 1);
        let input = Object.assign({}, this.state.input);
        input.containersId = income.map(x => x.id);
        this.setState({
            income: income,
            input: input
        });
    }

    private removeFromOutcome = (container: containerFragment) => {
        let outcome = this.state.outcome;
        outcome.splice(outcome.indexOf(container), 1);
        let input = Object.assign({}, this.state.input);
        input.containersId = outcome.map(x => x.id);
        this.setState({
            income: outcome,
            input: input
        });
    }

    private sortContainers = (array: Array<containerFragment>): Array<containerFragment> => {
        return array.sort((a, b) => a.number - b.number);
    }
}