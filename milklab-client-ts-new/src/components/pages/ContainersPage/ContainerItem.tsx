import * as React from 'react';
import { ReactNode } from 'react';
import { Button, Card, Intent, Label, Popover, Switch } from '@blueprintjs/core';
import {
    containerFragment,
    ContainerState,
    ContainerUpdateMutation,
    ContainerUpdateMutationVariables,
} from '../../../queries-types';
import { Mutation, MutationFn } from 'react-apollo';
import * as ContainerUpdateGql from '../../../graphql/Containers/ContainerUpdateMutation.graphql';
import { push } from 'react-router-redux';
import { store } from '../../../store';

interface Props {
    data: containerFragment;
}

interface State {
    data: containerFragment;
    // farm: farmListItemFragment;
    // groupId?: string;
}

class ContainerUpdateComp extends Mutation<ContainerUpdateMutation, ContainerUpdateMutationVariables> {}

export default class ContainerItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this.propsToState(props);
    }

    render() {
        return(
            <Popover
                onClose={() => this.setState({data: this.props.data})}
                content={
                    <Card>
                        {this.setDescription(this.props.data.state)}
                        <Switch
                            checked={this.state.data.state === ContainerState.LOST}
                            onChange={this.checkedChange}
                        >
                            {
                                this.state.data.state === ContainerState.LOST
                                    ? 'Контейнер утерян'
                                    : 'Отметить как утерянный'
                            }
                        </Switch>
                        {
                            this.props.data.state === ContainerState.RECIVED &&
                            <div>
                                <Button
                                    text="Редактировать анализы"
                                    className="pt-fill"
                                    icon="tint"
                                    intent={Intent.PRIMARY}
                                    onClick={() =>
                                        store.dispatch(push('/containers/' + this.props.data.id))
                                    }
                                />
                            </div>

                        }
                        {
                            JSON.stringify(this.props.data) !== JSON.stringify(this.state.data) &&
                            <ContainerUpdateComp
                                mutation={ContainerUpdateGql}
                                variables={{
                                    containerInput: {
                                        id: this.state.data.id,
                                        state: this.state.data.state
                                    }
                                }}
                            >
                                {
                                    (update: MutationFn<ContainerUpdateMutation, ContainerUpdateMutationVariables>) => {
                                        return(
                                            <Button
                                                text="Подтвердить"
                                                className="pt-fill"
                                                intent={Intent.SUCCESS}
                                                onClick={() => { update(); }}
                                            />
                                        );
                                    }
                                }
                            </ContainerUpdateComp>
                        }
                    </Card>
                }
            >
                <Button
                    className="Margin pt-large"
                    intent={this.setIntent(this.props.data.state)}
                >
                    {'№' + this.state.data.number}
                </Button>
            </Popover>
        );
    }

    componentWillReceiveProps(props: Props) {
        this.setState(props);
    }

    private propsToState = (props: Props): State => {
        return {
            data: props.data
        };
    }

    private setIntent = (state: ContainerState): Intent => {
        switch (state) {
            default:
            case ContainerState.STORED:
                return Intent.NONE;
            case ContainerState.SENDED:
                return Intent.PRIMARY;
            case ContainerState.LOST:
                return Intent.DANGER;
            case ContainerState.RECIVED:
                return Intent.SUCCESS;
        }
    }

    private setDescription = (state: ContainerState): ReactNode => {
        switch (state) {
            case ContainerState.STORED:
                return <Label text="Готов для отправки"/>;
            case ContainerState.SENDED:
                return <Label text="Контейнер отправлен"/>;
            // case ContainerState.LOST:
            //     return <Label text="Контейнер утерян"/>;
            case ContainerState.RECIVED:
                return <Label text="Принят с анализами"/>;
            default:
                return <div/>;
        }
    }

    private checkedChange = () => {
        let data = Object.assign({}, this.state.data);
        if (this.state.data.state === ContainerState.LOST) {
            data.state = ContainerState.STORED;
        } else {
            data.state = ContainerState.LOST;
        }
        this.setState({
            data
        });
    }
}