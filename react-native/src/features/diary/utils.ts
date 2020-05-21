import _ from 'lodash';
import { DateTime } from 'luxon';
import { ConsumedDto } from 'Models';
import { addFoodPortions, getFoodPortionId } from 'src/utils/different-foods';
import { ConsumptionAction, DeleteConsumptionRequest } from './reducer';

export function patchConsumedProducts(
    list: ConsumedDto[],
    patch: ConsumptionAction,
    response?: ConsumedDto,
): ConsumedDto[] {
    if (isDeleteRequest(patch)) {
        return list.filter((x) => getFoodPortionId(x.foodPortion) !== patch.foodPortionId);
    }

    let newValue: ConsumedDto | undefined;
    let existing: ConsumedDto | undefined;

    if (response) {
        newValue = response;

        const id = getFoodPortionId(newValue.foodPortion);
        existing = list.find((x) => getFoodPortionId(x.foodPortion) === id);
    } else {
        if (!patch.foodPortion) return list;

        const id = getFoodPortionId(patch.foodPortion);
        existing = list.find((x) => getFoodPortionId(x.foodPortion) === id);

        if (!existing || !patch.append) {
            newValue = { date: patch.date, time: patch.time, foodPortion: patch.foodPortion };
        } else {
            newValue = {
                date: patch.date,
                time: patch.time,
                foodPortion: addFoodPortions(patch.foodPortion, existing.foodPortion),
            };
        }
    }

    const newConsumedDto = newValue;
    return existing ? list.map((x) => (x === existing ? newConsumedDto : x)) : [...list, newConsumedDto];
}

export function isDeleteRequest(patch: ConsumptionAction): patch is DeleteConsumptionRequest {
    return (patch as DeleteConsumptionRequest).delete;
}

/**
 * get the dates that should be currently loaded
 * @param today the date time of today
 * @param selectedDate the currently selected date
 * @param daysMargin the margin of the selected date (how many days around the selected day should be loaded in future and past)
 * @param historyDays the days before today that should be loaded
 */
export function getRequiredDates(
    today: DateTime,
    selectedDate: DateTime,
    daysMargin: number = 3,
    historyDays: number = 7,
): DateTime[] {
    const result: DateTime[] = [today, selectedDate];

    for (let i = 1; i < historyDays + 1; i++) {
        result.push(today.minus({ days: i }));
    }

    for (let i = 1; i < daysMargin + 1; i++) {
        result.push(selectedDate.plus({ days: i }));
        result.push(selectedDate.minus({ days: i }));
    }

    return _(result)
        .uniqBy((x) => x.toISODate())
        .filter((x) => x <= today)
        .sortBy((x) => x)
        .value();
}

export function groupDatesInChunks(dates: DateTime[], maxChunkLength: number): DateTime[][] {
    if (dates.length === 0) return [];

    const sortedDates = _.sortBy(dates, (x) => x); // ascending sort

    const chunks: DateTime[][] = [];

    let currentChunk: DateTime[] = [];
    for (const day of sortedDates) {
        if (currentChunk.length === 0) {
            currentChunk.push(day);
            continue;
        }

        const currentChunkStart = currentChunk[0];
        const diff = day.diff(currentChunkStart, 'days');

        if (diff.days < maxChunkLength) {
            currentChunk.push(day);
        } else {
            chunks.push(currentChunk);
            currentChunk = [day];
        }
    }

    chunks.push(currentChunk);
    return chunks;
}
