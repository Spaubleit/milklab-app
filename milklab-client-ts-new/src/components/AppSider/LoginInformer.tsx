import * as React from 'react';
import { loginActions } from '../pages/LoginPage/actions';
import { bindActionCreators, Dispatch } from 'redux';
import { Alignment, Button, Navbar, NavbarGroup, NavbarHeading, Position, Tooltip } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { store } from '../../store';

interface Props {
    username: string;
    setUser: typeof loginActions.setUser;
    setLoginInfo: typeof loginActions.setLoginInfo;
}

class LoginInformer extends React.Component<Props> {
    render() {
        return(
            <Navbar id="UserLogin">
                <NavbarGroup>
                    <NavbarHeading className="pt-navbar-heading">
                        {this.props.username}
                    </NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Tooltip content="Выход" position={Position.RIGHT}>
                        <Button
                            className="pt-minimal"
                            icon="log-out"
                            onClick={() => {
                                this.props.setLoginInfo({
                                    userId: null,
                                    token: null
                                });
                                store.dispatch(push('/login'));
                            }}
                        />
                    </Tooltip>
                </NavbarGroup>
            </Navbar>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setUser: loginActions.setUser,
        setLoginInfo: loginActions.setLoginInfo
    },
    dispatch);

export default connect(null, mapDispatchToProps)(LoginInformer);