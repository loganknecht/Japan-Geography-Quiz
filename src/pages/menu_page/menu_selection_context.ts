import { type Context, createContext, type Dispatch, useContext } from "react";

import { throwMissingProviderError } from "../../utilities/throw_missing_provider_error";
import type { MenuSelectionAction, MenuSelectionState } from "./menu_selection_types";

export const MenuSelectionStateContext: Context<MenuSelectionState | null> = createContext<MenuSelectionState | null>(
    null
);

export const MenuSelectionDispatchContext: Context<Dispatch<MenuSelectionAction> | null> =
    createContext<Dispatch<MenuSelectionAction> | null>(null);

export const useMenuSelectionState = (): MenuSelectionState => {
    const menu_selection_state: MenuSelectionState | null = useContext(MenuSelectionStateContext);
    const provided_menu_selection_state: MenuSelectionState =
        menu_selection_state ?? throwMissingProviderError("MenuSelectionProvider");
    return provided_menu_selection_state;
};

export const useMenuSelectionDispatch = (): Dispatch<MenuSelectionAction> => {
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> | null = useContext(MenuSelectionDispatchContext);
    const providedDispatchMenuSelection: Dispatch<MenuSelectionAction> =
        dispatchMenuSelection ?? throwMissingProviderError("MenuSelectionProvider");
    return providedDispatchMenuSelection;
};
