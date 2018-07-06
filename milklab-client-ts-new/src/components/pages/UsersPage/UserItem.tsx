import * as React from 'react';
import './UserItem.css';
import { Card } from '@blueprintjs/core';
import { MouseEvent } from 'react';
import { userFragment } from '../../../queries-types';

export interface UserProps {
    onClick: (user: userFragment, evnt: MouseEvent<HTMLElement>) => void;
    user: userFragment;
}

class UserItem extends React.Component<UserProps> {
    render () {
        return (
            <Card className="UserItem pt-interactive" onClick={this.props.onClick.bind(null, this.props.user)}>

                <span className="PositionText"> {
                    this.props.user.position !== null ? this.props.user.position.name : ''
                }</span>
                <h5>{this.props.user.username}</h5>
                <p>{this.props.user.lastname + ' ' + this.props.user.firstname + ' ' + this.props.user.middlename}</p>
                {
                    this.props.user.roles != null &&
                        this.props.user.roles.map((item: {id: string; name: string}) => {
                            return <span className="pt-tag" key={item.id}>{item.name}</span>;
                        })
                }
            </Card>
        );
    }
}

export default UserItem;