import type { Dispatch, JSX } from "react";

import { OptionButton } from "../../components/option_button";
import { PlaceNameText } from "../../components/place_name_text";
import { TranslatedText } from "../../components/translated_text";
import type { TranslationKey } from "../../i18n/translation_key";
import { ISLANDS_SOUTH_TO_NORTH } from "../../places/islands";
import type { Island, Region } from "../../places/place_types";
import { REGIONS_SOUTH_TO_NORTH } from "../../places/regions";
import type { PrefectureScope, PrefectureScopeKind } from "../../quiz/quiz_setup_types";
import styles from "./menu_page.module.css";
import { useMenuSelectionDispatch, useMenuSelectionState } from "./menu_selection_context";
import type { MenuSelectionAction } from "./menu_selection_types";

const SCOPE_KINDS: readonly PrefectureScopeKind[] = ["all_japan", "island", "region"];

const SCOPE_KIND_LABEL_KEYS: Record<PrefectureScopeKind, TranslationKey> = {
    all_japan: "prefecture_scope.all",
    island: "prefecture_scope.island",
    region: "prefecture_scope.region"
};

const createScopeKey = (prefecture_scope: PrefectureScope): string => {
    let scope_key: string = prefecture_scope.kind;
    switch (prefecture_scope.kind) {
        case "island": {
            scope_key = `island:${prefecture_scope.island_id}`;
            break;
        }
        case "region": {
            scope_key = `region:${prefecture_scope.region_id}`;
            break;
        }
        case "all_japan": {
            break;
        }
    }
    return scope_key;
};

export const PrefectureScopePicker = (): JSX.Element => {
    const { prefecture_scope } = useMenuSelectionState();
    const dispatchMenuSelection: Dispatch<MenuSelectionAction> = useMenuSelectionDispatch();
    const selected_scope_key: string = createScopeKey(prefecture_scope);

    const kind_buttons: JSX.Element[] = SCOPE_KINDS.map((scope_kind: PrefectureScopeKind): JSX.Element => {
        const is_selected = scope_kind === prefecture_scope.kind;
        const selectScopeKind = (): void => {
            dispatchMenuSelection({ type: "setPrefectureScopeKind", scope_kind: scope_kind });
        };
        const kind_button: JSX.Element = (
            <OptionButton
                key={scope_kind}
                is_selected={is_selected}
                onSelect={selectScopeKind}
                label={<TranslatedText translation_key={SCOPE_KIND_LABEL_KEYS[scope_kind]} />}
            />
        );
        return kind_button;
    });

    const createScopeButton = (button_scope: PrefectureScope, button_label: JSX.Element): JSX.Element => {
        const button_scope_key: string = createScopeKey(button_scope);
        const is_selected = button_scope_key === selected_scope_key;
        const selectScope = (): void => {
            dispatchMenuSelection({ type: "setPrefectureScope", prefecture_scope: button_scope });
        };
        const scope_button: JSX.Element = (
            <OptionButton
                key={button_scope_key}
                is_selected={is_selected}
                onSelect={selectScope}
                label={button_label}
            />
        );
        return scope_button;
    };

    const island_buttons: JSX.Element[] = ISLANDS_SOUTH_TO_NORTH.map((island: Island): JSX.Element => {
        const island_scope: PrefectureScope = { kind: "island", island_id: island.id };
        const island_button: JSX.Element = createScopeButton(island_scope, <PlaceNameText place_name={island.name} />);
        return island_button;
    });
    const region_buttons: JSX.Element[] = REGIONS_SOUTH_TO_NORTH.map((region: Region): JSX.Element => {
        const region_scope: PrefectureScope = { kind: "region", region_id: region.id };
        const region_button: JSX.Element = createScopeButton(region_scope, <PlaceNameText place_name={region.name} />);
        return region_button;
    });

    let scope_choices_element: JSX.Element = (
        <p className={styles.scope_note}>
            <TranslatedText translation_key="prefecture_scope.all_note" />
        </p>
    );
    switch (prefecture_scope.kind) {
        case "island": {
            scope_choices_element = <div className={styles.scope_list}>{island_buttons}</div>;
            break;
        }
        case "region": {
            scope_choices_element = <div className={styles.scope_list}>{region_buttons}</div>;
            break;
        }
        case "all_japan": {
            break;
        }
    }

    const picker_element: JSX.Element = (
        <fieldset className={styles.scope_drawer}>
            <legend className={styles.scope_heading}>
                <TranslatedText translation_key="menu.grouping_heading" />
            </legend>
            <div className={styles.segment_row}>{kind_buttons}</div>
            {scope_choices_element}
        </fieldset>
    );
    return picker_element;
};
