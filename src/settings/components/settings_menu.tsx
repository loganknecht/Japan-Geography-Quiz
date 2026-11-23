import { type JSX, type RefObject, useRef } from "react";

import { type PlaySoundEffect, useSoundEffect } from "../../audio/use_sound_effect";
import { GearIcon } from "../../components/gear_icon";
import { TextButton } from "../../components/text_button";
import { TranslatedText } from "../../components/translated_text";
import { usePlainTranslation } from "../../i18n/use_plain_translation";
import { SettingsForm } from "./settings_form";
import styles from "./settings_menu.module.css";

export const SettingsMenu = (): JSX.Element => {
    const dialog_ref: RefObject<HTMLDialogElement | null> = useRef<HTMLDialogElement>(null);
    const open_settings_label: string = usePlainTranslation("site.open_settings");
    const playSound: PlaySoundEffect = useSoundEffect();

    const openSettings = (): void => {
        const dialog_element: HTMLDialogElement | null = dialog_ref.current;
        const has_dialog_element = dialog_element !== null;
        if (has_dialog_element === true) {
            dialog_element.showModal();
            playSound("open_menu");
        }
    };

    const closeSettings = (): void => {
        const dialog_element: HTMLDialogElement | null = dialog_ref.current;
        const has_dialog_element = dialog_element !== null;
        if (has_dialog_element === true) {
            playSound("close_menu");
            dialog_element.close();
        }
    };

    const handleEscapeClose = (): void => {
        playSound("close_menu");
    };

    const settings_menu_element: JSX.Element = (
        <>
            <button
                type="button"
                className={styles.open_button}
                aria-label={open_settings_label}
                title={open_settings_label}
                onClick={openSettings}>
                <GearIcon />
            </button>
            <dialog ref={dialog_ref} className={styles.dialog} onCancel={handleEscapeClose}>
                <form method="dialog" className={styles.dialog_content}>
                    <h2 className={styles.heading}>
                        <TranslatedText translation_key="settings.heading" />
                    </h2>
                    <SettingsForm />
                    <TextButton class_name={styles.close_button} onPress={closeSettings}>
                        <TranslatedText translation_key="settings.close" />
                    </TextButton>
                </form>
            </dialog>
        </>
    );
    return settings_menu_element;
};
