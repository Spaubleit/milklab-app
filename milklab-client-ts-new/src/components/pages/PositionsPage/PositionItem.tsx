import * as React from 'react';
import { Card } from '@blueprintjs/core';
import { MouseEvent } from 'react';
import { positionFragment } from '../../../queries-types';

export interface StructureProps {
    position: positionFragment;
    onClick: (position: positionFragment, evnt: MouseEvent<HTMLInputElement>) => void;
}

class PositionItem extends React.Component<StructureProps> {
    render () {
        return (
            <Card className="pt-interactive" onClick={this.props.onClick.bind(null, this.props.position)}>
                <h5>{this.props.position.name}</h5>
            </Card>
        );
    }
}

export default PositionItem;