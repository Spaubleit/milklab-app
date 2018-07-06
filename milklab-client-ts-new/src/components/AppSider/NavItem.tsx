import * as React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { headerActions } from '../AppHeader/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

interface NavProps {
    text: string;
    link: string;
    handlerClick: (link: string) => void;
    setMenu: typeof headerActions.setMenu;
}

const NavItem: React.SFC<NavProps> = (props) => {
    return (
        <MenuItem
            text={props.text}
            onClick={() => {
                props.setMenu(<div/>);
                props.handlerClick(props.link);
            }}
        />
    );
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setMenu: headerActions.setMenu
    },
    dispatch);

export default connect(null, mapDispatchToProps)(NavItem);