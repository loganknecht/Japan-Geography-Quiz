import { type JSX, type ReactNode, useId } from "react";

import styles from "./option_button.module.css";

export type OptionButtonLayout = "inline" | "card";

interface OptionButtonProps {
    is_selected: boolean;
    onSelect: () => void;
    label: ReactNode;
    description?: ReactNode;
    tooltip?: ReactNode;
    layout?: OptionButtonLayout;
}

export const OptionButton = ({
    is_selected,
    onSelect,
    label,
    description,
    tooltip,
    layout = "inline"
}: OptionButtonProps): JSX.Element => {
    const tooltip_id: string = useId();
    const has_description = description !== undefined;
    const has_tooltip = tooltip !== undefined;
    const is_card_layout = layout === "card";
    const selected_class_name: string = is_selected === true ? styles.selected : "";
    const layout_class_name: string = is_card_layout === true ? styles.card : "";
    const button_class_name: string = `${styles.option_button} ${selected_class_name} ${layout_class_name}`;
    const label_class_name: string = is_card_layout === true ? styles.card_header : styles.label;
    const description_class_name: string = is_card_layout === true ? styles.card_body : styles.description;
    const described_by_id: string | undefined = has_tooltip === true ? tooltip_id : undefined;

    const description_element: JSX.Element | null =
        has_description === true ? <span className={description_class_name}>{description}</span> : null;
    const tooltip_element: JSX.Element | null =
        has_tooltip === true ? (
            <span role="tooltip" id={tooltip_id} className={styles.tooltip}>
                {tooltip}
            </span>
        ) : null;

    const option_element: JSX.Element = (
        <div className={styles.option}>
            <button
                type="button"
                className={button_class_name}
                aria-pressed={is_selected}
                aria-describedby={described_by_id}
                onClick={onSelect}>
                <span className={label_class_name}>{label}</span>
                {description_element}
            </button>
            {tooltip_element}
        </div>
    );
    return option_element;
};
