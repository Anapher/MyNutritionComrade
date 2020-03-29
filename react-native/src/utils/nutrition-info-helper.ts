import { NutritionInformation } from 'Models';

export function changeVolume(info: NutritionInformation, newVolume: number): NutritionInformation {
    if (info.volume === 0) throw 'Cannot calculate a new volume if the information are based on a zero volume';

    const factor = newVolume / info.volume;

    return {
        volume: newVolume,
        energy: info.energy * factor,
        fat: info.fat * factor,
        saturatedFat: info.saturatedFat * factor,
        carbohydrates: info.carbohydrates * factor,
        sugars: info.sugars * factor,
        protein: info.protein * factor,
        dietaryFiber: info.dietaryFiber * factor,
        sodium: info.sodium * factor,
    };
}
