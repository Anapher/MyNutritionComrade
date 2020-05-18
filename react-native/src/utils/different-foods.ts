import {
    ConsumedDto,
    FoodPortionCreationDto,
    FoodPortionDto,
    SearchResult,
    ProductFoodPortionCreationDto,
    ProductInfo,
    CustomFoodPortionCreationDto,
} from 'Models';
import { getGeneratedMealName, getMatchingServing } from 'src/features/product-search/helpers';
import { ProductSearchQuery } from './input-parser';
import selectLabel, { computeNutritionHash, sumNutritions, changeVolume } from './product-utils';

export function getConsumedDtoId(dto: ConsumedDto): string {
    const foodPortionId = getFoodPortionId(dto.foodPortion);
    return `${dto.date}/${dto.time}/${foodPortionId}`;
}

export function getFoodPortionId(dto: FoodPortionDto): string {
    let key: string;

    switch (dto.type) {
        case 'meal':
            key = dto.mealId;
            break;
        case 'product':
            key = dto.product.id;
            break;
        case 'suggestion':
            key = dto.suggestionId;
            break;
        case 'custom':
            key = computeNutritionHash(dto.nutritionalInfo);
            break;
    }

    return `${dto.type}@${key}`;
}

export function getCreationDtoId(dto: FoodPortionCreationDto): string {
    let key: string;

    switch (dto.type) {
        case 'meal':
            key = dto.mealId;
            break;
        case 'product':
            key = dto.productId;
            break;
        case 'suggestion':
            key = dto.suggestionId;
            break;
        case 'custom':
            key = computeNutritionHash(dto.nutritionalInfo);
            break;
    }

    return `${dto.type}@${key}`;
}

export function createProductPortionFromCreation(
    creationDto: ProductFoodPortionCreationDto,
    product: ProductInfo,
): FoodPortionDto {
    return {
        type: 'product',
        product: product!,
        amount: creationDto.amount,
        servingType: creationDto.servingType,
        nutritionalInfo: changeVolume(
            product!.nutritionalInfo,
            creationDto.amount * product!.servings[creationDto.servingType],
        ),
    };
}

export function addCreationDtoToFoodPortion(dto: FoodPortionCreationDto, base: FoodPortionDto): FoodPortionCreationDto {
    switch (dto.type) {
        case 'product':
            if (base.type !== 'product') throw 'The types do not match';

            return {
                ...dto,
                amount: dto.amount + base.nutritionalInfo.volume / base.product.servings[dto.servingType],
            };
        case 'meal':
            if (base.type !== 'meal') throw 'The types do not match';

            return { ...dto, portion: dto.portion + base.portion };
        case 'custom':
            if (base.type !== 'custom') throw 'The types do not match';

            return {
                ...dto,
                label: dto.label || base.label,
                nutritionalInfo: sumNutritions([dto.nutritionalInfo, base.nutritionalInfo]),
            };
        case 'suggestion':
            return dto; // that doesn't work
    }
}

export function addFoodPortions(dto: FoodPortionDto, base: FoodPortionDto): FoodPortionDto {
    switch (dto.type) {
        case 'product':
            if (base.type !== 'product') throw 'The types do not match';

            return {
                ...dto,
                amount: dto.amount + base.nutritionalInfo.volume / base.product.servings[dto.servingType],
            };
        case 'meal':
            if (base.type !== 'meal') throw 'The types do not match';

            return { ...dto, portion: dto.portion + base.portion };
        case 'custom':
            if (base.type !== 'custom') throw 'The types do not match';

            return {
                ...dto,
                label: dto.label || base.label,
                nutritionalInfo: sumNutritions([dto.nutritionalInfo, base.nutritionalInfo]),
            };
        case 'suggestion':
            return dto; // that doesn't work
    }
}

export function mapFoodPortionDtoCreationDto(foodPortion: FoodPortionDto): FoodPortionCreationDto {
    switch (foodPortion.type) {
        case 'product':
            return {
                type: 'product',
                amount: foodPortion.amount,
                servingType: foodPortion.servingType,
                productId: foodPortion.product.id,
            };
        case 'meal':
            return {
                type: 'meal',
                mealId: foodPortion.mealId,
                portion: foodPortion.portion,
            };
        case 'custom':
            return {
                type: 'custom',
                label: foodPortion.label,
                nutritionalInfo: foodPortion.nutritionalInfo,
            };
        case 'suggestion':
            return {
                type: 'suggestion',
                suggestionId: foodPortion.suggestionId,
                items: foodPortion.items.map(mapFoodPortionDtoCreationDto),
            };
        default:
            throw 'Unknown type';
    }
}

export function getSearchResultKey(result: SearchResult): string {
    let key: string;

    switch (result.type) {
        case 'meal':
            key = result.mealId;
            break;
        case 'product':
            key = result.product.id;
            break;
        case 'serving':
            key = `${result.product.id}/${result.servingType}/${result.amount}/${result.convertedFrom?.name}`;
            break;
        case 'generatedMeal':
            key = result.id;
            break;
        case 'custom':
            key = computeNutritionHash(result.nutritionalInfo);
            break;
    }

    return result.type + '/' + key;
}

export function mapFoodPortionDtoToSearchResult(dto: FoodPortionDto): SearchResult {
    if (dto.type === 'product') {
        return { type: 'product', product: dto.product, frequentlyUsedPortion: dto };
    }
    if (dto.type === 'meal') {
        return { type: 'meal', name: dto.mealName, mealId: dto.mealId, frequentlyUsedPortion: dto };
    }
    if (dto.type === 'suggestion') {
        return { type: 'generatedMeal', id: dto.suggestionId, items: dto.items };
    }
    if (dto.type === 'custom') {
        return { type: 'custom', nutritionalInfo: dto.nutritionalInfo, label: dto.label };
    }
    throw 'TODO';
}

export function matchSearchResult(result: SearchResult, query: ProductSearchQuery): boolean {
    switch (result.type) {
        case 'meal':
            return !query.productSearch || result.name.toUpperCase().includes(query.productSearch.toUpperCase());
        case 'product':
            if (query.productSearch !== undefined) {
                const labelText = selectLabel(result.product.label);
                if (!labelText.toUpperCase().includes(query.productSearch.toUpperCase())) return false;
            }

            if (query.serving !== undefined) {
                if (getMatchingServing(query.serving, result.product.servings) === undefined) return false;
            }

            return true;
        case 'serving':
            if (query.productSearch !== undefined) {
                const labelText = selectLabel(result.product.label);
                if (!labelText.toUpperCase().includes(query.productSearch.toUpperCase())) return false;
            }

            if (query.serving !== undefined) {
                if (!query.serving.find((x) => x.servingType === result.servingType)) return false;
            }

            return true;
        case 'generatedMeal':
            return (
                !query.productSearch ||
                getGeneratedMealName(result).toUpperCase().includes(query.productSearch.toUpperCase())
            );
        case 'custom':
            return (
                !query.productSearch || result.label?.toUpperCase().includes(query.productSearch.toUpperCase()) === true
            );
    }
}
