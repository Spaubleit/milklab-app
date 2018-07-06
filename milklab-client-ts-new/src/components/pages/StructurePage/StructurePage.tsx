import * as React from 'react';
import Query from 'react-apollo/Query';
import * as RegionsQueryGql from '../../../graphql/Structure/Region/RegionsQuery.graphql';
import { QueryResult } from 'react-apollo';
import StructureTree from './StructureTree';
import { Button, Card, NonIdealState, Spinner } from '@blueprintjs/core';
import './StructurePage.css';
import { RegionsQuery } from '../../../queries-types';

class StructureQuery extends Query<RegionsQuery> {}

export default class StructurePage extends React.Component {
    render() {
        return (
            <StructureQuery query={RegionsQueryGql} displayName="StructurePage">
                {
                    (x: QueryResult<RegionsQuery>) => {
                        if (x.loading) {
                            return (
                                <NonIdealState
                                    title="Загрузка данных"
                                    visual={<Spinner/>}
                                />
                            );
                        }
                        if (x.error) {
                            return (
                                <NonIdealState
                                    title="Ошибка загрузки"
                                    visual="error"
                                    action={<Button text="Повторить" icon="repeat"/>}
                                />
                            );
                        }
                        return (
                            <Card className="Page">
                                <StructureTree regions={x.data.regions}/>
                            </Card>
                        );
                    }
                }
            </StructureQuery>
        );
    }
}