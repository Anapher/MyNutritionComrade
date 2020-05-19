import itiriri from 'itiriri';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { ConsumptionTime, GeneratedMealSuggestion, ServingSize } from 'Models';
import { capitalizeFirstLetter } from './string-utils';

export function getMatchingServing(
    matchedServings: Partial<ServingSize>[],
    productServings: { [key: string]: number },
): Partial<ServingSize> | undefined {
    return itiriri(_.sortBy(matchedServings, (x) => x.servingType !== undefined)) // sort by unit, so the servings with unit are at the top
        .filter((x) => (x.servingType ? productServings[x.servingType] !== undefined : true))
        .first();
}

export function getGeneratedMealName(generatedMeal: GeneratedMealSuggestion): string {
    const splitter = generatedMeal.id.split('/');
    const time: ConsumptionTime = splitter[1] as any;
    const day = splitter[0];
    const yesterday = day === DateTime.local().minus({ days: 1 }).toISODate();

    return yesterday
        ? `Yesterdays ${capitalizeFirstLetter(time)}`
        : `${capitalizeFirstLetter(time)} from ${DateTime.fromISO(day).toLocaleString(DateTime.DATE_HUGE)}`;
}
