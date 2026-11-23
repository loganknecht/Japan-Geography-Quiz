import close_menu_url from "../assets/sounds/close_menu.wav";
import correct_answer_url from "../assets/sounds/correct_answer.wav";
import highlight_answer_url from "../assets/sounds/highlight_answer.wav";
import open_menu_url from "../assets/sounds/open_menu.wav";
import wrong_answer_url from "../assets/sounds/wrong_answer.wav";

export type SoundEffect = "correct_answer" | "wrong_answer" | "highlight_answer" | "open_menu" | "close_menu";

const SOUND_EFFECT_URLS: Record<SoundEffect, string> = {
    correct_answer: correct_answer_url,
    wrong_answer: wrong_answer_url,
    highlight_answer: highlight_answer_url,
    open_menu: open_menu_url,
    close_menu: close_menu_url
};

const sound_effect_players: Partial<Record<SoundEffect, HTMLAudioElement>> = {};

const findSoundEffectPlayer = (sound_effect: SoundEffect): HTMLAudioElement => {
    const existing_player: HTMLAudioElement | undefined = sound_effect_players[sound_effect];
    const has_existing_player = existing_player !== undefined;
    if (has_existing_player === true) {
        return existing_player;
    }
    const new_player: HTMLAudioElement = new Audio(SOUND_EFFECT_URLS[sound_effect]);
    new_player.preload = "auto";
    sound_effect_players[sound_effect] = new_player;
    return new_player;
};

const ignorePlaybackError = (): void => {
    return;
};

export const playSoundEffect = (sound_effect: SoundEffect): void => {
    const player: HTMLAudioElement = findSoundEffectPlayer(sound_effect);
    player.currentTime = 0;
    const playback: Promise<void> = player.play();
    playback.catch(ignorePlaybackError);
};
