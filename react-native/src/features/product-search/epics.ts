import { FoodSuggestion, MealType } from 'Models';
import { RootEpic } from 'MyNutritionComrade';
import { filter, map } from 'rxjs/operators';
import { tryParseServingSize } from 'src/utils/input-parser';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const initSuggestionsEpic: RootEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.initSearch)),
        map(() => actions.setSuggestions(querySuggestions('', state$.value.productSearch.mealType))),
    );

export const querySuggestionsEpic: RootEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.setSearchText)),
        map(({ payload }) => actions.setSuggestions(querySuggestions(payload, state$.value.productSearch.mealType))),
    );

function querySuggestions(input: string, mealType: MealType): FoodSuggestion[] {
    if (input === '') {
        // return most frequent items from last days
        return [{ name: 'Haferflocken', servingSize: { size: 70, unit: 'g' }, kcal: 200 }];
    }

    const result = tryParseServingSize(input);
    const firstServing = result.serving && result.serving[0];

    return [
        {
            name: result.productSearch || 'No name given',
            kcal: 10,
            servingSize: firstServing && { unit: firstServing.unit || 'g', size: firstServing.size || 1 },
        },
    ];
}
