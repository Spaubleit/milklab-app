import { createStandardAction } from 'typesafe-actions';
import { ReactNode } from 'react';

// export const setMenu = createStandardAction('SET_MENU')<ReactNode>();
// export const setX = createStandardAction('SET_X')<number>();
export const headerActions = {
    setMenu: createStandardAction('SET_MENU')<ReactNode>(),
    setX: createStandardAction('SET_X')<number>()
};