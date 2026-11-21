import type { JSX, ReactNode } from "react";

import type { TranslationKey } from "../i18n/translation_key";
import styles from "./option_group.module.css";
import { TranslatedText } from "./translated_text";

interface OptionGroupProps {
    heading_key: TranslationKey;
    children: ReactNode;
}

export const OptionGroup = ({ heading_key, children }: OptionGroupProps): JSX.Element => {
    const group_element: JSX.Element = (
        <fieldset className={styles.group}>
            <legend className={styles.heading}>
                <TranslatedText translation_key={heading_key} />
            </legend>
            <div className={styles.options}>{children}</div>
        </fieldset>
    );
    return group_element;
};
