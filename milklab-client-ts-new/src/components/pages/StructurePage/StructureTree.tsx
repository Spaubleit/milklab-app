import * as React from 'react';
import { Button, Classes, ITreeNode, Tree } from '@blueprintjs/core';
import {
    districtFragment, farmFragment, householdFragment, regionFragment,
    RegionsQuery
} from '../../../queries-types';
import RegionDialog from './Dialogs/RegionDialog';
import DistrictDialog from './Dialogs/DistrictDialog';
import HouseholdDialog from './Dialogs/HouseholdDialog';
import FarmDialog from './Dialogs/FarmDialog';

interface StructureTreeState {
    nodes: ITreeNode[];
    regionData?: regionFragment;
    districtData?: districtFragment;
    householdData?: householdFragment;
    farmData?: farmFragment;
    dataType?: structureType;
    isDialogOpen: boolean;
}

export enum structureType {
    region,
    district,
    household,
    farm,
}

export type structureFragment = regionFragment | districtFragment | householdFragment | farmFragment;

export default class StructureTree extends React.Component<RegionsQuery, StructureTreeState> {
    constructor(props: RegionsQuery) {
        super(props);
        this.state = this.propsToState(props);
    }

    render() {
        const dialog = () => {
            switch (this.state.dataType) {
                case structureType.region: return (
                    <RegionDialog
                        isOpen={this.state.isDialogOpen}
                        regionData={this.state.regionData}
                        onClose={this.onDialogClose}
                    />
                );
                case structureType.district: return (
                    <DistrictDialog
                        isOpen={this.state.isDialogOpen}
                        districtData={this.state.districtData}
                        onClose={this.onDialogClose}
                    />
                );
                case structureType.household: return (
                    <HouseholdDialog
                        isOpen={this.state.isDialogOpen}
                        householdData={this.state.householdData}
                        onClose={this.onDialogClose}
                    />
                );
                case structureType.farm: return (
                    <FarmDialog
                        isOpen={this.state.isDialogOpen}
                        farmData={this.state.farmData}
                        onClose={this.onDialogClose}
                    />
                );
                default: return null;
            }
        };
        return (
            <div>
                <Tree
                    contents={this.state.nodes}
                    onNodeExpand={this.handleNodeExpand}
                    onNodeCollapse={this.handleNodeCollapse}
                    className={Classes.ELEVATION_1}
                    onNodeClick={this.itemClick}
                />
                {
                    dialog()
                }
            </div>
        );
    }

    componentWillReceiveProps(props: RegionsQuery) {
        this.setState(this.propsToState(props));
    }

    private propsToState = (props: RegionsQuery): StructureTreeState => {
        let state: StructureTreeState = {
            nodes: [],
            isDialogOpen: false
        };
        state.nodes.push({
            id: -1,
            label: 'Области',
            childNodes: [],
            secondaryLabel: (
                <Button
                    minimal={true}
                    icon="plus"
                    onClick={(e: React.MouseEvent<HTMLElement>) => this.addClick(null, structureType.region, e)}
                />
            ),
            isExpanded: true
        });

        if (this.props.regions) {
            for (let region of props.regions) {
                let regionNode: ITreeNode = {
                    id: region.id,
                    label: region.name + ' область',
                    icon: 'home',
                    childNodes: [],
                    nodeData: region,
                    isExpanded: true
                };
                regionNode.secondaryLabel = (
                    <div>
                        <Button
                            minimal={true}
                            icon="plus"
                            onClick={(e: React.MouseEvent<HTMLElement>) =>
                                this.addClick(region, structureType.district, e)}
                        />
                    </div>
                );

                state.nodes[0].childNodes.push(regionNode);
                if (region.districts && region.districts.length > 0) {
                    for (let district of region.districts) {
                        let districtNode: ITreeNode = {
                            id: district.id,
                            label: district.name + ' район',
                            icon: 'home',
                            childNodes: [],
                            nodeData: district,
                            isExpanded: true
                        };
                        districtNode.secondaryLabel = (
                            <div>
                                <Button
                                    minimal={true}
                                    icon="plus"
                                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                                        this.addClick(district, structureType.household, e)}
                                />
                            </div>
                        );
                        regionNode.childNodes.push(districtNode);
                        if (district.households && district.households.length > 0) {
                            for (let household of district.households) {
                                let householdNode: ITreeNode = {
                                    id: household.id,
                                    label: 'Хозяйство ' + household.name,
                                    icon: 'home',
                                    childNodes: [],
                                    nodeData: household,
                                    isExpanded: true
                                };
                                householdNode.secondaryLabel = (
                                    <div>
                                        <Button
                                            minimal={true}
                                            icon="plus"
                                            onClick={(e: React.MouseEvent<HTMLElement>) =>
                                                this.addClick(household, structureType.farm, e)}
                                        />
                                    </div>
                                );
                                districtNode.childNodes.push(householdNode);
                                if (household.farms && household.farms.length > 0) {
                                    for (let farm of household.farms) {
                                        let farmNode: ITreeNode = {
                                            id: farm.id,
                                            label: 'Ферма ' + farm.name,
                                            icon: 'home',
                                            hasCaret: false,
                                            childNodes: [],
                                            nodeData: farm,
                                            isExpanded: true
                                        };
                                        householdNode.childNodes.push(farmNode);
                                    }
                                } else {
                                    householdNode.hasCaret = false;
                                }
                            }
                        } else {
                            districtNode.hasCaret = false;
                        }
                    }
                } else {
                    regionNode.hasCaret = false;
                }
            }
        }
        return state;
    }

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    }

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    }

    private itemClick = (node: ITreeNode, nodePath: number[]) => {
        console.log('edit');
        switch (nodePath.length) {
            case 2:
                this.setState({
                    isDialogOpen: true,
                    dataType: structureType.region,
                    regionData: node.nodeData as regionFragment
                });
                break;
            case 3:
                this.setState({
                    isDialogOpen: true,
                    dataType: structureType.district,
                    districtData: node.nodeData as districtFragment
                });
                break;
            case 4:
                this.setState({
                    isDialogOpen: true,
                    dataType: structureType.household,
                    householdData: node.nodeData as householdFragment
                });
                break;
            case 5:
                this.setState({
                    isDialogOpen: true,
                    dataType: structureType.farm,
                    farmData: node.nodeData as farmFragment
                });
                break;
            default:
        }
    }

    private addClick = (data: structureFragment, dataType: structureType, event: React.MouseEvent<HTMLElement>) => {
        console.log('add');
        event.stopPropagation();
        switch (dataType) {
            case structureType.region:
                this.setState({
                    isDialogOpen: true,
                    regionData: {
                        id: '0',
                        name: '',
                        user: null,
                        districts: []
                    },
                    dataType: dataType
                });
                break;
            case structureType.district:
                this.setState({
                    isDialogOpen: true,
                    districtData: {
                        id: '0',
                        name: '',
                        user: null,
                        region: data,
                        households: []
                    },
                    dataType: dataType
                });
                break;
            case structureType.household:
                this.setState({
                    isDialogOpen: true,
                    householdData: {
                        id: '0',
                        name: '',
                        iban: '',
                        user: null,
                        district: data,
                        farms: []
                    },
                    dataType: dataType
                });
                break;
            case structureType.farm:
                this.setState({
                    isDialogOpen: true,
                    farmData: {
                        id: '0',
                        name: '',
                        user: null,
                        household: data
                    },
                    dataType: dataType
                });
                break;
            default:
        }
    }

    private onDialogClose = () => {
        this.setState({
            isDialogOpen: false
        });
    }
}