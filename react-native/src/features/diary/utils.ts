import { ConsumedProduct } from 'Models';
import { ConsumeProductData } from './reducer';
import { changeVolume } from 'src/utils/nutrition-info-helper';

export const matchProduct = (o1: ConsumedProduct, o2: ConsumeProductData) =>
    o1.day === o2.date && o1.time === o2.time && o1.productId === o2.product.id;

export const mapToProduct = (x: ConsumeProductData, newValue?: number) => ({
    day: x.date,
    time: x.time,
    productId: x.product.id,
    label: x.product.label,
    nutritionInformation: changeVolume(x.product.nutritionInformation, newValue ?? x.value),
    tags: x.product.tags,
});
