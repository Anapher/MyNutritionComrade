import { flattenProductsPrioritize } from './epics';
import { FrequentlyUsedProducts } from 'Models';

test('should flatten correctly', () => {
    const test: FrequentlyUsedProducts = {
        ['Breakfast']: [],
        ['Lunch']: [],
        ['Dinner']: [],
        ['Snack']: [],
    };

    const result = Array.from(flattenProductsPrioritize(test, 'Lunch'));
    expect(result).toEqual([]);
});
