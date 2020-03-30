import { ConsumptionTime } from 'Models';
import { RootState } from 'MyNutritionComrade';
import { createSelector } from 'reselect';
import { patchConsumedProducts } from './utils';

type TimeProps = {
    time: ConsumptionTime;
};

const currentDateSelector = (state: RootState) => state.diary.currentDate;

const consumedProductsSelector = (state: RootState, { time }: TimeProps) =>
    state.diary.consumedProducts.filter((x) => x.time === time);

const pendingConsumedProductsSelector = (state: RootState, { time }: TimeProps) =>
    state.diary.pendingConsumedProducts.filter((x) => x.time === time);

export const getConsumedProducts = createSelector(
    [currentDateSelector, consumedProductsSelector, pendingConsumedProductsSelector],
    (currentDate, consumedProducts, pendingProducts) => {
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
