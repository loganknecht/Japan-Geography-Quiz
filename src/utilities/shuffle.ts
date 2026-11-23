export const shuffle = <TItem>(items: readonly TItem[]): TItem[] => {
    const shuffled_items: TItem[] = [...items];
    for (let index: number = shuffled_items.length - 1; index > 0; index -= 1) {
        const swap_index: number = Math.floor(Math.random() * (index + 1));
        const current_item: TItem = shuffled_items[index];
        const swap_item: TItem = shuffled_items[swap_index];
        shuffled_items[index] = swap_item;
        shuffled_items[swap_index] = current_item;
    }
    return shuffled_items;
};
