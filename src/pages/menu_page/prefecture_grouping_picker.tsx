import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { OptionGroup } from "../../components/option_group";
import { TranslatedText } from "../../components/translated_text";
import { PREFECTURE_GROUPING_LABEL_KEYS } from "../../quiz/quiz_setup_labels";
import type { PrefectureGrouping } from "../../quiz/quiz_setup_types";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";

const AREA_BY_AREA_GROUPINGS: readonly PrefectureGrouping[] = ["island", "region"];

const TOTAL_AREA_GROUPINGS: readonly PrefectureGrouping[] = ["none", "island", "region"];

export const PrefectureGroupingPicker = (): JSX.Element => {
    const { progression_style, prefecture_grouping } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();
    const is_area_by_area = progression_style === "area_by_area";
    const available_groupings: readonly PrefectureGrouping[] =
        is_area_by_area === true ? AREA_BY_AREA_GROUPINGS : TOTAL_AREA_GROUPINGS;

    const grouping_buttons: JSX.Element[] = available_groupings.map((grouping: PrefectureGrouping): JSX.Element => {
        const is_selected = grouping === prefecture_grouping;
        const selectGrouping = (): void => {
            dispatchMenuSelection({ type: "setPrefectureGrouping", prefecture_grouping: grouping });
        };
        const grouping_button: JSX.Element = (
            <OptionButton
                key={grouping}
                is_selected={is_selected}
                onSelect={selectGrouping}
                label={<TranslatedText translation_key={PREFECTURE_GROUPING_LABEL_KEYS[grouping]} />}
            />
        );
        return grouping_button;
    });

    const picker_element: JSX.Element = (
        <OptionGroup heading_key="menu.grouping_heading">{grouping_buttons}</OptionGroup>
    );
    return picker_element;
};
