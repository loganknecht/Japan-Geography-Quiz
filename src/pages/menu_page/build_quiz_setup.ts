import type { QuizSetup } from "../../quiz/quiz_setup_types";
import type { MenuSelectionState } from "./menu_selection_types";

export const buildQuizSetup = (menu_selection: MenuSelectionState): QuizSetup => {
    const is_single_mode = menu_selection.play_mode === "single";
    const quiz_setup: QuizSetup =
        is_single_mode === true
            ? {
                  play_mode: "single",
                  quiz_type: menu_selection.single_quiz_type,
                  prefecture_scope: menu_selection.prefecture_scope
              }
            : {
                  play_mode: "progressive",
                  stages: menu_selection.progressive_stages,
                  progression_style: menu_selection.progression_style,
                  prefecture_grouping: menu_selection.prefecture_grouping
              };
    return quiz_setup;
};
