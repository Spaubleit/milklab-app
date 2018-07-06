import * as React from 'react';
import { Card } from '@blueprintjs/core';
import { containerFragment } from '../../../queries-types';

interface ContainersSelectProps {
    title: string;
    containers: Array<containerFragment>;
    onClick: (item: containerFragment) => void;
}

const ContainersSelect: React.SFC<ContainersSelectProps> = (props: ContainersSelectProps) => {
    return(
        <Card className="ContainerSelect PaddingSmall">
            <h6>{props.title}</h6>
            {
                props.containers.map(container => {
                    return (
                        <span
                            key={container.id}
                            className="pt-tag pt-interactive"
                            onClick={() => props.onClick(container)}
                        >
                            {container.number}
                        </span>
                    );
                })
            }
        </Card>
    );
};

export default ContainersSelect;