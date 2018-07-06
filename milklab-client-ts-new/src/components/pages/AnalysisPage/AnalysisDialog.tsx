import * as React from 'react';
import { Button, Dialog, FormGroup, Intent, NumericInput } from '@blueprintjs/core';
import { analysisFragment, AnalysisInput, cowFragment } from '../../../queries-types';
import CowSelect from './CowSelect';

interface AnalysisDialogProps {
    isOpen: boolean;
    onClose: () => void;
    data: analysisFragment;
}

interface AnalysisDialogState {
    input: AnalysisInput;
    cow?: cowFragment;
}

export default class AnalysisDialog extends React.Component<AnalysisDialogProps, AnalysisDialogState> {
    constructor(props: AnalysisDialogProps) {
        super(props);
        this.state = this.propsToState(props);
    }

    render() {
        return(
            <Dialog
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
            >
                <div className="pt-dialog-body AnalisysGroup">
                    <CowSelect data={this.state.cow}/>
                    <FormGroup
                        label="Кислотность"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Соматические клетки"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Лимонная кислота"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Электропроводность"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Белки"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Жиры"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Точка замерзания"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Лактоза"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Твёрдые вещества"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                    <FormGroup
                        label="Мочевина"
                    >
                        <NumericInput className="pt-fill"/>
                    </FormGroup>
                </div>
                <div className="pt-dialog-footer">
                    <div className="pt-dialog-footer-actions">
                        {
                            this.props.data.id !== '0' &&
                            <Button
                                text="Удалить"
                                intent={Intent.SUCCESS}
                            />
                        }
                        {
                            this.props.data.id !== '0' &&
                            <Button
                                text="Изменить"
                                intent={Intent.SUCCESS}
                            />
                        }
                        {
                            this.props.data.id === '0' &&
                            <Button
                                text="Добавить"
                                intent={Intent.SUCCESS}
                            />
                        }
                        <Button
                            text="Отмена"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }

    private propsToState = (props: AnalysisDialogProps): AnalysisDialogState => {
        return {
            input: {
                id: props.data.id || '0',
                acidity: props.data.acidity || null,
                cells: props.data.cells || null,
                citricAcid: props.data.citricAcid || null,
                conductivity: props.data.conductivity || null,
                protein: props.data.protein || null,
                fat: props.data.fat || null,
                freezingPoint: props.data.freezingPoint || null,
                lactose: props.data.lactose || null,
                solids: props.data.solids || null,
                urea: props.data.urea || null,
                containerId: props.data.container.id,
                cowId: props.data.cow ? props.data.cow.id || null : null
            }
        };
    }
}