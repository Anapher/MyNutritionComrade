import { ConsumedDto } from 'Models';
import { RootState } from 'MyNutritionComrade';
import { SectionListData } from 'react-native';
import { createSelector } from 'reselect';
import { ConsumptionTimes } from 'src/consts';
import { getCreationDtoId } from 'src/utils/different-foods';
import { isDeleteRequest, patchConsumedProducts } from './utils';

const selectedDateSelector = (state: RootState) => state.diary.selectedDate;
const consumedProductsSelector = (state: RootState) => state.diary.loadedDays[state.diary.selectedDate];
const pendingConsumedProductsSelector = (state: RootState) => state.diary.pendingActions;

export const getConsumedProducts = createSelector(
    [selectedDateSelector, consumedProductsSelector, pendingConsumedProductsSelector],
    (currentDate, consumedProducts, pendingProducts) => {
        if (!consumedProducts) return [];

        let result = consumedProducts.filter((x) => x.date === currentDate);
        let pending = pendingProducts.filter((x) => x.date === currentDate);

        while (pending.length > 0) {
            const item = pending[pending.length - 1];

            // remove all with same product id, only the most recent (last) item should have an effect
            pending = pending.filter((x) => {
                if (x.date !== item.date || x.time !== item.time) return false;

                if (isDeleteRequest(x) && isDeleteRequest(item)) return x.foodPortionId === item.foodPortionId;

                if (!isDeleteRequest(x) && !isDeleteRequest(item))
                    return getCreationDtoId(x.creationDto) === getCreationDtoId(item.creationDto);

                return false;
            });
            result = patchConsumedProducts(result, item);
        }

        return result;
    },
);

export const getConsumedProductsSections = createSelector([getConsumedProducts], (consumed) => {
    const result: SectionListData<ConsumedDto>[] = ConsumptionTimes.map((time) => ({
        time,
        data: consumed.filter((x) => x.time === time),
        key: time,
    }));

    return result;
});
