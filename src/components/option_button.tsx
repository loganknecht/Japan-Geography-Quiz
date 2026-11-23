import type { JSX, ReactNode } from "react";

import styles from "./option_button.module.css";
import { TextButton } from "./text_button";

export type OptionButtonLayout = "inline" | "card";

interface OptionButtonProps {
    is_selected: boolean;
    onSelect: () => void;
    label: ReactNode;
    description?: ReactNode;
    layout?: OptionButtonLayout;
}

export const OptionButton = ({
    is_selected,
    onSelect,
    label,
    description,
    layout = "inline"
}: OptionButtonProps): JSX.Element => {
    const has_description = description !== undefined;
    const is_card_layout = layout === "card";
    const selected_class_name: string = is_selected === true ? styles.selected : "";
    const layout_class_name: string = is_card_layout === true ? styles.card : "";
    const button_class_name: string = `${styles.option_button} ${selected_class_name} ${layout_class_name}`;
    const label_class_name: string = is_card_layout === true ? styles.card_header : styles.label;
    const description_class_name: string = is_card_layout === true ? styles.card_body : styles.description;

    const description_element: JSX.Element | null =
        has_description === true ? (
            <span className={description_class_name}>
                <span>{description}</span>
            </span>
        ) : null;

    const option_element: JSX.Element = (
        <div className={styles.option}>
            <TextButton class_name={button_class_name} is_pressed={is_selected} onPress={onSelect}>
                <span className={label_class_name}>{label}</span>
                {description_element}
            </TextButton>
        </div>
    );
    return option_element;
};
