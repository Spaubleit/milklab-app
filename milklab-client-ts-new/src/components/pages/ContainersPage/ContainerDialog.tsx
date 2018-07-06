import * as React from 'react';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { containerFragment } from '../../../queries-types';

interface ContainerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    data: containerFragment;
}

interface ContainerDialogState {
}

export default class ContainerDialog extends React.Component<ContainerDialogProps, containerFragment> {
    constructor(props: ContainerDialogProps) {
        super(props);
    }

    render() {
        return(
            <Dialog
                isOpen={this.props.isOpen}
                title="Контейнер №5"
                onClose={this.closeDialog}
            >
                <div className="pt-dialog-body">
                    hello
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        <Button text="Изменить" intent={Intent.SUCCESS}/>
                        <Button text="Отмена" onClick={this.closeDialog}/>
                    </div>
                </div>
            </Dialog>
        );
    }

    componentWillReceiveProps(props: ContainerDialogProps) {
        //
    }

    // private propsToState = (props: ContainerDialogProps): containerFragment => {
    //     return {
    //
    //     }
    // }

    private closeDialog = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
        // this.setState({
        //     isOpen: false
        // });
    }
}