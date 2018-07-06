import * as React from 'react';
import { cowFragment, CowsQuery, CowsQueryVariables } from '../../../queries-types';
import { Button, FormGroup, ProgressBar } from '@blueprintjs/core';
import Query from 'react-apollo/Query';
import { QueryResult } from 'react-apollo';
import * as CowsQueryGql from '../../../graphql/Cow/CowsQuery.graphql';

class CowsQueryComp extends Query<CowsQuery, CowsQueryVariables> {}

interface CowSelectProps {
    data: cowFragment;
    onChange?: (cow: cowFragment) => void;
}

interface CowSelectState {
    data: cowFragment;
}

export default class CowSelect extends React.Component<CowSelectProps, CowSelectState> {
    constructor(props: CowSelectProps) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    render() {
        return(
            <CowsQueryComp
                query={CowsQueryGql}
                variables={{groupId: this.props.data.group.id}}
            >
                {
                    (query: QueryResult<CowsQuery>) => {
                        if (query.loading) {
                            return <ProgressBar/>;
                        }
                        return (
                            <FormGroup
                                label="Корова"
                            >
                                <Button
                                >
                                    {this.state.data
                                        ? '№' + this.state.data.number + ' ' + this.state.data.nickname
                                        : 'Не выбрана'}
                                </Button>
                            </FormGroup>
                        );
                    }
                }
            </CowsQueryComp>
        );
    }
}