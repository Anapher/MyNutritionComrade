import { DateTime } from 'luxon';
import { ConsumedProduct } from 'Models';
import { ConsumeProductData } from './reducer';
import { changeVolume } from 'src/utils/product-utils';
import _ from 'lodash';

export const matchProduct = (o1: ConsumedProduct, o2: ConsumeProductData) =>
    o1.date === o2.date && o1.time === o2.time && o1.productId === o2.product.id;

export const mapToProduct = (x: ConsumeProductData, newValue?: number): ConsumedProduct => ({
    date: x.date,
    time: x.time,
    productId: x.product.id,
    label: x.product.label,
    nutritionalInfo: changeVolume(x.product.nutritionalInfo, newValue ?? x.value),
    tags: x.product.tags,
});

export function patchConsumedProducts(list: ConsumedProduct[], patch: ConsumeProductData): ConsumedProduct[] {
    if (patch.value === 0) {
        if (!patch.append) {
            // remove item
            return list.filter((x) => !matchProduct(x, patch));
        }
    } else if (list.findIndex((x) => matchProduct(x, patch)) > -1) {
        const newValue = patch.append
            ? (list.find((x) => matchProduct(x, patch))?.nutritionalInfo.volume ?? 0) + patch.value
            : patch.value;

        // update item
        return list.map((x) =>
            matchProduct(x, patch) ? { ...x, nutritionalInfo: changeVolume(x.nutritionalInfo, newValue) } : x,
        );
    } else {
        // add item
        return [...list, mapToProduct(patch)];
    }

    return list;
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
