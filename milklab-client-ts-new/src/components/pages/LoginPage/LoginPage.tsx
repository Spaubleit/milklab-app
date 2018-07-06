import * as React from 'react';
import { Button, Card, InputGroup, Intent, Label, Position, Tooltip } from '@blueprintjs/core';
import './LoginPage.css';
import { bindActionCreators, Dispatch } from 'redux';
import { loginActions } from './actions';
import { connect } from 'react-redux';
import axios from 'axios';
import { store } from '../../../store';
import { push } from 'react-router-redux';

interface ComponentProps {
    setLoginInfo: typeof loginActions.setLoginInfo;
}

interface ComponentState {
    showPassword: boolean;
    authData: {
        username: string,
        password: string
    };
}

class LoginPage extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            showPassword: false,
            authData: {
                username: '',
                password: ''
            }
        };
    }

    render() {
        const eyeButton = (
            <Tooltip
                content={this.state.showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                position={Position.BOTTOM}
            >
                <Button
                    className="pt-minimal"
                    icon={this.state.showPassword ? 'eye-open' : 'eye-off'}
                    onClick={this.showPasswordClick}
                />
            </Tooltip>
        );

        return (
            <div className="LoginPage">
                <Card className="LoginCard">
                    <form>
                        <Label text="Имя пользователя">
                            <InputGroup
                                value={this.state.authData.username}
                                leftIcon="user"
                                onChange={this.usernameChange}
                            />
                        </Label>
                        <Label text="Пароль">
                            <InputGroup
                                value={this.state.authData.password}
                                type={this.state.showPassword ? 'text' : 'password'}
                                leftIcon="lock"
                                rightElement={eyeButton}
                                onChange={this.passwordChange}
                            />
                        </Label>
                        <Button
                            text="Войти"
                            className="pt-fill"
                            intent={Intent.PRIMARY}
                            onClick={this.axiosLogin}
                        />
                    </form>
                </Card>
            </div>
        );
    }

    private showPasswordClick = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({showPassword: !this.state.showPassword});
    }

    private usernameChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        const authData = Object.assign({}, this.state.authData);
        authData.username = evnt.currentTarget.value;
        this.setState({
            authData: authData
        });
    }

    private passwordChange = (evnt: React.FormEvent<HTMLInputElement>) => {
        const authData = Object.assign({}, this.state.authData);
        authData.password = evnt.currentTarget.value;
        this.setState({
            authData: authData
        });
    }

    private axiosLogin = () => {
        axios.defaults.baseURL = 'http://127.0.0.1:5000';
        axios.post(
            '/api/login',
            {
                username: 'spaubleit',
                password: 'password'
            }
            ).then(res => {
                this.props.setLoginInfo(res.data);
                store.dispatch(push('/home'));
            }
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        setLoginInfo: loginActions.setLoginInfo
    },
    dispatch);

export default connect(null, mapDispatchToProps)(LoginPage);