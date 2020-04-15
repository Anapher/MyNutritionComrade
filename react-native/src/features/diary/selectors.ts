import { ConsumedProduct } from 'Models';
import { RootState } from 'MyNutritionComrade';
import { SectionListData } from 'react-native';
import { createSelector } from 'reselect';
import { ConsumptionTimes } from 'src/consts';
import { patchConsumedProducts } from './utils';

const selectedDateSelector = (state: RootState) => state.diary.selectedDate;

const consumedProductsSelector = (state: RootState) => state.diary.loadedDays[state.diary.selectedDate];

const pendingConsumedProductsSelector = (state: RootState) => state.diary.pendingConsumedProducts;

export const getConsumedProducts = createSelector(
    [selectedDateSelector, consumedProductsSelector, pendingConsumedProductsSelector],
    (currentDate, consumedProducts, pendingProducts) => {
        if (!consumedProducts) return [];

        let result = [...consumedProducts.filter((x) => x.date === currentDate)];
        let pending = [...pendingProducts.filter((x) => x.date === currentDate)];

        while (pending.length > 0) {
            const item = pending[pending.length - 1];

            // remove all with same product id, only the most recent (last) item should have an effect
            pending = pending.filter((x) => x.product.id !== item.product.id);
            result = patchConsumedProducts(result, item);
        }

        return result;
    },
);

export const getConsumedProductsSections = createSelector([getConsumedProducts], (products) => {
    const result: SectionListData<ConsumedProduct>[] = ConsumptionTimes.map((time) => ({
        time,
        data: products.filter((x) => x.time === time),
        key: time,
    }));

    return result;
});
