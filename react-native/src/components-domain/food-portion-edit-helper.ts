import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import {
    FoodPortionProductDto,
    ProductFoodPortionCreationDto,
    FoodPortionMealDto,
    MealFoodPortionCreationDto,
} from 'Models';
import { changeVolume } from 'src/utils/product-utils';

export const CreateEditProductDelegate = (navigation: StackNavigationProp<RootStackParamList>) => (
    item: FoodPortionProductDto,
    executeEdit: (changes: Partial<ProductFoodPortionCreationDto>) => void,
) => {
    const product = item.product;
    navigation.navigate('AddProduct', {
        product,
        amount: item.amount,
        servingType: item.servingType,
        onSubmit: (amount, servingType) => {
            const creationDto: ProductFoodPortionCreationDto = {
                type: 'product',
                amount,
                servingType,
                productId: product.id,
            };
            executeEdit(creationDto);
        },
    });
};

export const CreateEditMealDelegate = (navigation: StackNavigationProp<RootStackParamList>) => (
    foodPortion: FoodPortionMealDto,
    executeEdit: (changes: Partial<MealFoodPortionCreationDto>) => void,
) => {
    navigation.navigate('SelectMealPortion', {
        mealName: foodPortion.mealName,
        nutritionalInfo: changeVolume(
            foodPortion.nutritionalInfo,
            foodPortion.nutritionalInfo.volume / foodPortion.portion,
        ),
        initialPortion: foodPortion.portion,
        onSubmit: (portion: number) => {
            const creationDto: MealFoodPortionCreationDto = {
                type: 'meal',
                portion,
                mealId: foodPortion.mealId,
            };

            executeEdit(creationDto);
        },
    });
};
