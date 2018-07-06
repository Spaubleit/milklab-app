import * as React from 'react';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import { ReactNode } from 'react';

interface MainMenuState {
    items: Array<{
        id: string,
        icon: IconName,
        text: string,
        items?: Array<{
            id: string,
            icon: IconName,
            text: string
        }>
    }>;
}

export default class MainMenu extends React.Component<null, MainMenuState> {
    public state: MainMenuState = {
        items: [
            {
                id: 'add',
                icon: 'add',
                text: 'Создать',
                items: [
                    {
                        id: 'here',
                        icon: 'plus',
                        text: 'Сюда'
                    },
                    {
                        id: 'there',
                        icon: 'minus',
                        text: 'туда'
                    }
                ]
            }
        ]
    };

    render() {
        return (
            <div>
            {
                this.state.items.map((item) => {
                    let button = <Button key={item.id} icon={item.icon}>{item.text}</Button>;
                    let menuItems: Array<ReactNode> = item.items.map((childItem) => {
                        return <MenuItem key={item.id} text={childItem.text}/>;
                    });
                    if (menuItems.length > 0) {
                        // button.props.rightIcon = 'caret-down';
                        return<Popover content={<Menu>{menuItems}</Menu>}>{button}</Popover>;
                    } else {
                        return button;
                    }
                })
            }
            </div>
        );
    }
}