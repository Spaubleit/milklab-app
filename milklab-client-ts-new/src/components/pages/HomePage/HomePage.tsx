import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { store } from '../../../store';
import { push } from 'react-router-redux';
import './HomePage.css';

export default class HomePage extends React.Component {
    render () {
        return (
            <div className="Page Padding">
                <div className="HomePage">
                    <Button text="Управление пользователями" onClick={() => store.dispatch(push('/users'))}/>
                    <Button text="Структура ферм" onClick={() => store.dispatch(push('/structure'))}/>
                    <Button text="Справочник должностей" onClick={() => store.dispatch(push('/positions'))}/>
                    <Button text="Просмотр сессий пользователей" onClick={() => store.dispatch(push('/sessions'))}/>
                    <Button text="Управление структурой стада" onClick={() => store.dispatch(push('/cows'))}/>
                    <Button text="Оборот контейнеров" onClick={() => store.dispatch(push('/movements'))}/>
                    <Button text="Управление контейнерами" onClick={() => store.dispatch(push('/containers'))}/>
                </div>
            </div>
        );
    }
}