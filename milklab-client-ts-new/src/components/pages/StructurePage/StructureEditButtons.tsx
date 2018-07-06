import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { structureFragment, structureType } from './StructureTree';

interface StructureButtonsProps {
    data: structureFragment;
    dataType: structureType;
    onAdd?: (data: structureFragment, type: structureType) => void;
    onRemove?: (data: structureFragment, type: structureType) => void;
}

interface StructureButtonsState {
    isDialogOpen: boolean;
    dataType: structureType;
}

export default class StructureEditButtons extends React.Component<StructureButtonsProps, StructureButtonsState> {
    render () {
        return (
            <div>
                {
                    this.props.onAdd &&
                    <Button
                        className="pt-minimal"
                        icon="plus"
                        onClick={() => {
                            this.props.onAdd(this.props.data, this.props.dataType);
                        }}
                    />
                }
                {
                    this.props.onRemove &&
                    <Button
                        className="pt-minimal"
                        icon="trash"
                        onClick={() => {
                            this.props.onRemove(this.props.data, this.props.dataType);
                        }}
                    />
                }
            </div>
        );
    }
}