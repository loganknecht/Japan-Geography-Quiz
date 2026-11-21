import { type JSX, type RefObject, useRef } from "react";

import { TranslatedText } from "../../components/translated_text";
import { usePlainTranslation } from "../../i18n/use_plain_translation";
import { SettingsForm } from "./settings_form";
import styles from "./settings_menu.module.css";

export const SettingsMenu = (): JSX.Element => {
    const dialog_ref: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);
    const open_settings_label: string = usePlainTranslation("site.open_settings");

    const openSettings = (): void => {
        const dialog_element: HTMLDialogElement | null = dialog_ref.current;
        const has_dialog_element = dialog_element !== null;
        if (has_dialog_element === true) {
            dialog_element.showModal();
        }
    };

    const settings_menu_element: JSX.Element = (
        <>
            <button
                type="button"
                className={styles.open_button}
                aria-label={open_settings_label}
                title={open_settings_label}
                onClick={openSettings}>
                <span aria-hidden="true">⚙</span>
            </button>
            <dialog ref={dialog_ref} className={styles.dialog}>
                <form method="dialog" className={styles.dialog_content}>
                    <h2 className={styles.heading}>
                        <TranslatedText translation_key="settings.heading" />
                    </h2>
                    <SettingsForm />
                    <button type="submit" className={styles.close_button}>
                        <TranslatedText translation_key="settings.close" />
                    </button>
                </form>
            </dialog>
        </>
    );
    return settings_menu_element;
};
