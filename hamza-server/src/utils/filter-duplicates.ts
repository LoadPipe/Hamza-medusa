

export function filterDuplicatesById<T extends { id: string }>(items: T[]): T[] {
    return items.filter(
        (i, index, array) =>
            index === array.findIndex((ii) => ii.id === i.id)
    );
}