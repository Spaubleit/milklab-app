import * as React from 'react';
import { Button, Card, Intent, Label, NumericInput, Popover } from '@blueprintjs/core';
import { Mutation, MutationFn } from 'react-apollo';
import { ContainersCreateMutation, ContainersCreateMutationVariables, ContainersQuery } from '../../../queries-types';
import * as ContainersCreateGql from '../../../graphql/Containers/ContainersCreateMutation.graphql';
import * as ContainersQueryGql from '../../../graphql/Containers/ContainersQuery.graphql';
import { SyntheticEvent } from 'react';

class ContainersCreateComp extends Mutation<ContainersCreateMutation, ContainersCreateMutationVariables> {}

interface ContainersCreateButtonProps {
    text: string;
}

interface ContainersCreateButtonState {
    count: number;
    isOpen: boolean;
}

export default class ContainersCreateButton
    extends React.Component <ContainersCreateButtonProps, ContainersCreateButtonState> {
    constructor(props: ContainersCreateButtonProps) {
        super(props);
        this.state = {
            count: 1,
            isOpen: false
        };
    }

    render () {
        return (
            <Popover
                isOpen={this.state.isOpen}
                // onClose={this.popoverToggle}
                content={
                    <Card>
                        <Label text="Количество">
                            <NumericInput
                                min={1}
                                max={100}
                                minorStepSize={null}
                                value={this.state.count}
                                onValueChange={(count) => this.setState({count: count})}
                            />
                        </Label>
                        <ContainersCreateComp
                            mutation={ContainersCreateGql}
                            variables={{count: this.state.count}}
                            update={(cache, {data}) => {
                                let query: ContainersQuery = cache.readQuery({query: ContainersQueryGql});
                                query.containers = query.containers.concat(data.createContainers);
                                cache.writeQuery({
                                    query: ContainersQueryGql,
                                    data: query
                                });
                            }}
                        >
                            {
                                (create: MutationFn<ContainersCreateMutation, ContainersCreateMutationVariables>) => {
                                    return (
                                        <Button
                                            text="Подтвердить"
                                            icon="tick"
                                            intent={Intent.SUCCESS}
                                            onClick={() => {
                                                create();
                                                this.popoverToggle(undefined);
                                            }}
                                        />
                                    );
                                }
                            }
                        </ContainersCreateComp>
                    </Card>
                }
            >
                <Button text={this.props.text} icon="plus" onClick={this.popoverToggle}/>
            </Popover>
        );
    }

    private popoverToggle = (evnt: SyntheticEvent<HTMLElement>) => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}