import { type JSX, type ReactNode, useReducer } from "react";

import { MenuSelectionDispatchContext, MenuSelectionStateContext } from "./menu_selection_context";
import { INITIAL_MENU_SELECTION_STATE, menuSelectionReducer } from "./menu_selection_reducer";

interface MenuSelectionProviderProps {
    children: ReactNode;
}

export const MenuSelectionProvider = ({ children }: MenuSelectionProviderProps): JSX.Element => {
    const [menu_selection_state, dispatchMenuSelection] = useReducer(
        menuSelectionReducer,
        INITIAL_MENU_SELECTION_STATE
    );

    const provider_element: JSX.Element = (
        <MenuSelectionStateContext value={menu_selection_state}>
            <MenuSelectionDispatchContext value={dispatchMenuSelection}>{children}</MenuSelectionDispatchContext>
        </MenuSelectionStateContext>
    );
    return provider_element;
};
