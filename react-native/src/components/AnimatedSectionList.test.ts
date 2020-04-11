import { mapSection } from './AnimatedSectionList';

test('should handle empty list', () => {
    const { previousItems, removing, view } = mapSection([], [], []);

    expect(previousItems.length).toBe(0);
    expect(removing.length).toBe(0);
    expect(view.length).toBe(0);
});

test('should handle new list with one item', () => {
    const { previousItems, removing, view } = mapSection([{ item: 5, key: '5' }], [], []);

    expect(previousItems.length).toBe(1);
    expect(removing.length).toBe(0);
    expect(view.length).toBe(1);
});

test('should handle list with one item', () => {
    const { previousItems, removing, view } = mapSection([{ item: 5, key: '5' }], [{ item: 5, key: '5' }], []);

    expect(previousItems.length).toBe(1);
    expect(removing.length).toBe(0);
    expect(view.length).toBe(1);
});

test('should handle list with one removed item', () => {
    const { previousItems, removing, view } = mapSection([], [{ item: 5, key: '5' }], []);

    expect(previousItems.length).toBe(0);
    expect(removing.length).toBe(1);
    expect(view.length).toBe(1);
});

test('should handle empty list with removed items', () => {
    const { previousItems, removing, view } = mapSection([], [], [{ item: 5, key: '5', previous: [] }]);

    expect(previousItems.length).toBe(0);
    expect(removing.length).toBe(1);
    expect(view.length).toBe(1);
});

test('should preserve items order, removed item at bottom', () => {
    const { previousItems, removing, view } = mapSection(
        [{ item: 5, key: '5' }],
        [
            { item: 5, key: '5' },
            { item: 1, key: '1' },
        ],
        [],
    );

    expect(previousItems.length).toBe(1);
    expect(removing).toEqual([{ item: 1, key: '1', previous: ['5'] }]);

    expect(view).toEqual([
        { item: 5, key: '5' },
        { item: 1, key: '1', previous: ['5'] },
    ]);
});

test('should preserve items order, removed item at top', () => {
    const { previousItems, removing, view } = mapSection(
        [{ item: 5, key: '5' }],
        [
            { item: 1, key: '1' },
            { item: 5, key: '5' },
        ],
        [],
    );

    expect(previousItems.length).toBe(1);
    expect(removing).toEqual([{ item: 1, key: '1', previous: [] }]);

    expect(view).toEqual([
        { item: 1, key: '1', previous: [] },
        { item: 5, key: '5' },
    ]);
});

test('should preserve items order, removed item at bottom and added item at bottom', () => {
    const { previousItems, removing, view } = mapSection(
        [
            { item: 5, key: '5' },
            { item: 6, key: '6' },
        ],
        [
            { item: 5, key: '5' },
            { item: 1, key: '1' },
        ],
        [],
    );

    expect(previousItems.length).toBe(2);
    expect(removing).toEqual([{ item: 1, key: '1', previous: ['5'] }]);

    expect(view).toEqual([
        { item: 5, key: '5' },
        { item: 1, key: '1', previous: ['5'] },
        { item: 6, key: '6' },
    ]);
});

test('should preserve items order, removed item at bottom and added item at bottom memory', () => {
    const { previousItems, removing, view } = mapSection(
        [
            { item: 5, key: '5' },
            { item: 6, key: '6' },
        ],
        [
            { item: 5, key: '5' },
            { item: 6, key: '6' },
        ],
        [{ item: 1, key: '1', previous: ['5'] }],
    );

    expect(previousItems.length).toBe(2);
    expect(removing).toEqual([{ item: 1, key: '1', previous: ['5'] }]);

    expect(view).toEqual([
        { item: 5, key: '5' },
        { item: 1, key: '1', previous: ['5'] },
        { item: 6, key: '6' },
    ]);
});

test('should preserve items order, remove item while other item is removed in memory', () => {
    const { previousItems, removing, view } = mapSection(
        [{ item: 6, key: '6' }],
        [
            { item: 5, key: '5' },
            { item: 6, key: '6' },
        ],
        [{ item: 1, key: '1', previous: ['5'] }],
    );

    expect(previousItems.length).toBe(1);
    expect(removing).toEqual([
        { item: 1, key: '1', previous: ['5'] },
        { item: 5, key: '5', previous: [] },
    ]);

    expect(view).toEqual([
        { item: 5, key: '5', previous: [] },
        { item: 1, key: '1', previous: ['5'] },
        { item: 6, key: '6' },
    ]);
});

test('should preserve items order, add item while other item is removed in memory', () => {
    const { previousItems, removing, view } = mapSection(
        [
            { item: 5, key: '5' },
            { item: 6, key: '6' },
        ],
        [{ item: 5, key: '5' }],
        [{ item: 1, key: '1', previous: ['5'] }],
    );

    expect(previousItems.length).toBe(2);
    expect(removing).toEqual([{ item: 1, key: '1', previous: ['5'] }]);

    expect(view).toEqual([
        { item: 5, key: '5' },
        { item: 1, key: '1', previous: ['5'] },
        { item: 6, key: '6' },
    ]);
});

test('should preserve items order, replace item while other item is removed in memory', () => {
    const { previousItems, removing, view } = mapSection(
        [{ item: 6, key: '6' }],
        [{ item: 5, key: '5' }],
        [{ item: 1, key: '1', previous: ['5'] }],
    );

    expect(previousItems.length).toBe(1);
    expect(removing).toEqual([
        { item: 1, key: '1', previous: ['5'] },
        { item: 5, key: '5', previous: [] },
    ]);

    expect(view).toEqual([
        { item: 5, key: '5', previous: [] },
        { item: 1, key: '1', previous: ['5'] },
        { item: 6, key: '6' },
    ]);
});
