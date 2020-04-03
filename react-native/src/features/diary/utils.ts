import { ConsumedProduct } from 'Models';
import { ConsumeProductData } from './reducer';
import { changeVolume } from 'src/utils/product-utils';

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
