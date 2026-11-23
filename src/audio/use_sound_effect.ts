import { useSettingsState } from "../settings/settings_context";
import { playSoundEffect, type SoundEffect } from "./sound_effects";

export type PlaySoundEffect = (sound_effect: SoundEffect) => void;

export const useSoundEffect = (): PlaySoundEffect => {
    const { is_sound_enabled } = useSettingsState();
    const playEnabledSoundEffect = (sound_effect: SoundEffect): void => {
        if (is_sound_enabled === true) {
            playSoundEffect(sound_effect);
        }
    };
    return playEnabledSoundEffect;
};
