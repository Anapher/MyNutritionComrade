import { RootState } from 'MyNutritionComrade';
import { createSelector } from 'reselect';
import { changeVolume } from 'src/utils/nutrition-info-helper';
import { ConsumptionTime } from 'Models';
import { matchProduct } from './reducer';
import { mapToProduct } from './utils';

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
        let result = [...consumedProducts.filter((x) => x.day === currentDate)];
        let pending = [...pendingProducts.filter((x) => x.date === currentDate)];

        while (pending.length > 0) {
            const item = pending[pending.length - 1];

            // remove all with same product id, only the most recent (last) item should have an effect
            pending = pending.filter((x) => x.product.id !== item.product.id);

            // TODO: create external function, unify with reducer
            if (item.value === 0) {
                // remove item
                result = result.filter((x) => !matchProduct(x, item));
            } else if (result.findIndex((x) => matchProduct(x, item)) > -1) {
                const newValue = item.append
                    ? (state.consumedProducts.find((x) => matchProduct(x, item))?.nutritionInformation.volume ?? 0) +
                      item.value
                    : item.value;

                // update item
                result = result.map((x) =>
                    matchProduct(x, item)
                        ? { ...x, nutritionInformation: changeVolume(x.nutritionInformation, newValue) }
                        : x,
                );
            } else {
                // add item
                result = [...result, mapToProduct(item)];
            }
        }

        return result;
    },
);
