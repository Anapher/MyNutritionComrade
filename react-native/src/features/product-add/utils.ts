import { CurveScale } from './reducer';
import { NutritionalInfo } from 'Models';
import { changeVolume } from 'src/utils/product-utils';

const maxSelectableCalories = 2000;

const scales = [
    { max: 750, step: 10, labelStep: 50 },
    { max: 500, step: 10, labelStep: 50 },
    { max: 250, step: 5, labelStep: 50 },
    { max: 100, step: 5, labelStep: 10 },
    { max: 50, step: 2, labelStep: 10 },
    { max: 10, step: 1, labelStep: 1 },
    { max: 5, step: 1, labelStep: 1 },
];

export function selectScale(servingVolume: number, nutritionInfo: NutritionalInfo): CurveScale {
    const oneServingNutritions = changeVolume(nutritionInfo, servingVolume);
    for (const scale of scales) {
        if (scale.max * oneServingNutritions.energy <= maxSelectableCalories) {
            return scale;
        }
    }

    return scales[scales.length - 1];
}
