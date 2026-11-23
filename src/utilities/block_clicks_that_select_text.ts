const isSelectingTextInside = (element: Element): boolean => {
    const selection: Selection | null = window.getSelection();
    const has_no_selection = selection === null;
    if (has_no_selection === true) {
        const is_selecting: boolean = false;
        return is_selecting;
    }
    const is_collapsed: boolean = selection.isCollapsed;
    const has_selection_in_element: boolean = selection.containsNode(element, true);
    const is_selecting_inside: boolean = is_collapsed === false && has_selection_in_element === true;
    return is_selecting_inside;
};

const blockTextSelectionClick = (event: MouseEvent): void => {
    const event_target: EventTarget | null = event.target;
    const is_element_target = event_target instanceof Element;
    if (is_element_target === false) {
        return;
    }
    const clicked_button: Element | null = event_target.closest("button, [role='button']");
    const is_pointer_click = event.detail > 0;
    const has_button = clicked_button !== null;
    const is_button_pointer_click = has_button === true && is_pointer_click === true;
    if (is_button_pointer_click === false) {
        return;
    }
    const is_selecting_text: boolean = isSelectingTextInside(clicked_button);
    if (is_selecting_text === true) {
        event.preventDefault();
        event.stopPropagation();
    }
};

export const blockClicksThatSelectText = (): void => {
    window.addEventListener("click", blockTextSelectionClick, { capture: true });
};
