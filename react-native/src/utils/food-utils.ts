import itiriri from 'itiriri';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { RecentMealSuggestion, ServingSize } from 'Models';
import { parse } from 'search-params';
import { generatedMealIds } from 'src/consts';
import { capitalizeFirstLetter } from './string-utils';

export function getMatchingServing(
    matchedServings: Partial<ServingSize>[],
    productServings: { [key: string]: number },
): Partial<ServingSize> | undefined {
    return itiriri(_.sortBy(matchedServings, (x) => x.servingType !== undefined)) // sort by unit, so the servings with unit are at the top
        .filter((x) => (x.servingType ? productServings[x.servingType] !== undefined : true))
        .first();
}

export function suggestionIdToString(id: string): string {
    const parts = id.split('?', 2);

    if (parts[0] === generatedMealIds.recentMeal) {
        const query = parse<RecentMealSuggestion>(parts[1]);
        const yesterday = query.date === DateTime.local().minus({ days: 1 }).toISODate();

        return yesterday
            ? `Yesterdays ${capitalizeFirstLetter(query.time)}`
            : `${capitalizeFirstLetter(query.time)} from ${DateTime.fromISO(query.date).toLocaleString(
                  DateTime.DATE_HUGE,
              )}`;
    }

    return 'Unknown';
}
