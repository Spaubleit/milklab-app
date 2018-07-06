import * as React from 'react';
import { Button, Card, NonIdealState, Spinner } from '@blueprintjs/core';
import * as SessionsByDateGql from '../../../graphql/Session/SessionsByDate.graphql';
import './SessionPage.css';
import { Mutation, MutationFn, QueryResult } from 'react-apollo';
import {
    sessionByDateFragment,
    sessionFragment,
    SessionRemoveMutation,
    SessionRemoveMutationVariables,
    SessionsByDateQuery
} from '../../../queries-types';
import Query from 'react-apollo/Query';
import * as SessionRemoveGql from '../../../graphql/Session/SessionRemoveMutation.graphql';
import * as moment from 'moment';

interface SessionItemProps {
    session: sessionFragment;
}

class SessionRemoveComp extends Mutation<SessionRemoveMutation, SessionRemoveMutationVariables> {}

const SessionItem: React.SFC<SessionItemProps> = props => {
    return (
        <Card className="SessionItem">
            <h6>{props.session.time}</h6>
            <div>{props.session.user.username}</div>
            <SessionRemoveComp
                mutation={SessionRemoveGql}
                variables={{id: props.session.id}}
                update={(cache, {data}) => {
                    let query: SessionsByDateQuery = cache.readQuery({query: SessionsByDateGql});
                    for (let date of query.sessionsByDate) {
                        let index = date.sessions.findIndex((session) => session.id === data.removeSession);
                        if (index > -1) {
                            date.sessions = date.sessions.splice(index, 1);
                            break;
                        }
                    }
                    cache.writeQuery({
                        query: SessionsByDateGql,
                        data: query
                    });
                }}
            >
                {
                    (remove: MutationFn<SessionRemoveMutation, SessionRemoveMutationVariables>) => {
                        return(
                            <Button
                                className="SessionRemoveButton"
                                icon="cross"
                                minimal={true}
                                onClick={() => remove()}
                            />
                        );
                    }
                }
            </SessionRemoveComp>
        </Card>
    );
};

class SessionsByDateComp extends Query<SessionsByDateQuery> {}

export default class SessionsPage extends React.Component {
    render() {
        return (
            <SessionsByDateComp
                query={SessionsByDateGql}
                displayName="SessionsPage"
                pollInterval={5000}
            >
                {
                    (query: QueryResult<SessionsByDateQuery>) => {
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
                                    visual="circle"
                                    action={<Button text="Повторить" icon="error"/>}
                                />
                            );
                        }
                        if (query.data.sessionsByDate.length === 0) {
                            return (
                                <NonIdealState
                                    title="Список пуст"
                                    visual="circle"
                                    description="Пока ни один пользователь не входил в программу"
                                />
                            );
                        }
                        return (
                            <div className="Page Padding">
                                {
                                    query.data.sessionsByDate.map((item: sessionByDateFragment) => {
                                        return (
                                            <div key={item.date}>
                                                <h5>{moment(item.date).format('DD.MM.YYYY')}</h5>
                                                <div className="SessionGroup">
                                                    {
                                                        item.sessions.map((session: sessionFragment) => {
                                                            return (
                                                                <SessionItem key={session.id} session={session}/>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    }
                }
            </SessionsByDateComp>
        );
    }
}