import type { JSX, KeyboardEvent, ReactNode } from "react";

import styles from "./text_button.module.css";

interface TextButtonProps {
    class_name: string;
    onPress: () => void;
    children: ReactNode;
    is_pressed?: boolean;
}

const ENTER_KEY: string = "Enter";
const SPACE_KEY: string = " ";

export const TextButton = ({ class_name, onPress, children, is_pressed }: TextButtonProps): JSX.Element => {
    const button_class_name: string = `${styles.text_button} ${class_name}`;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        const is_enter_key = event.key === ENTER_KEY;
        const is_space_key = event.key === SPACE_KEY;
        if (is_enter_key === true) {
            event.preventDefault();
            onPress();
        } else if (is_space_key === true) {
            event.preventDefault();
        }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>): void => {
        const is_space_key = event.key === SPACE_KEY;
        if (is_space_key === true) {
            event.preventDefault();
            onPress();
        }
    };

    const button_element: JSX.Element = (
        <div
            role="button"
            tabIndex={0}
            className={button_class_name}
            aria-pressed={is_pressed}
            onClick={onPress}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}>
            {children}
        </div>
    );
    return button_element;
};
