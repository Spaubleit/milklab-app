import * as React from 'react';
import { Card, Label } from '@blueprintjs/core';
import FarmSelectComp from './FarmSelectComp';
import GroupSelectComp from './GroupSelectComp';
import { farmFragment, farmListItemFragment, groupFragment } from '../../../queries-types';

interface State {
    farm: farmListItemFragment;
    group: groupFragment;
}

export default class ContainerConfig extends React.Component <{}, State> {
    constructor() {
        super({});
        this.state = {
            farm: null,
            group: null
        };
    }
    render () {
        return (
            <Card>
                <Label text="Перед изменением анализов необходимо выбрать ферму и группу из которой пришёл контейнер"/>
                <FarmSelectComp onChange={this.farmChanged}/>
                <GroupSelectComp farm={this.state.farm}/>
            </Card>
        );
    }

    private farmChanged = (farm: farmListItemFragment) => {
        this.setState({
            farm
        });
    }
}