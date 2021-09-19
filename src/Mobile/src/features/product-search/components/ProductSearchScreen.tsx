import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Keyboard } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ProductSearchCompletedAction, RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortionProduct } from 'src/types';
import { selectedProductAmount } from '../actions';
import { selectSearchResults } from '../selectors';
import { SearchResult } from '../types';
import { getSearchResultKey } from '../utils';
import SearchResultItem from './SearchResultItem';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'SearchProduct'>;
};
export default function ProductSearchScreen({
   navigation,
   route: {
      params: { onCreatedAction, onCreatedPop },
   },
}: Props) {
   const theme = useTheme();
   const results = useSelector(selectSearchResults);
   const dispatch = useDispatch();

   const onPressItem = (item: SearchResult) => {
      switch (item.type) {
         case 'product':
            navigation.navigate('AddProduct', {
               onSubmitAction: selectedProductAmount({
                  amount: 0,
                  servingType: '',
                  product: item.product,
                  completedAction: onCreatedAction,
               }),
               onSubmitPop: onCreatedPop + 1,
               product: item.product,
            });
            break;
         case 'serving':
            const foodPortion: FoodPortionProduct = {
               type: 'product',
               amount: item.amount,
               product: item.product,
               servingType: item.servingType,
            };

            const action: ProductSearchCompletedAction = {
               ...onCreatedAction,
               payload: { ...onCreatedAction.payload, foodPortion },
            };

            dispatch(action);

            navigation.pop(onCreatedPop);
            break;
         //  case 'meal':
         //      navigation.navigate('SelectMealPortion', {
         //          mealName: item.mealName,
         //          initialPortion: item.frequentlyUsedPortion?.portion,
         //          nutritionalInfo: item.nutritionalInfo,
         //          disableGoBack: true,
         //          onSubmit: (portion: number) => {
         //              onCreated({ type: 'meal', mealId: item.mealId, portion });
         //              navigation.pop(2);
         //          },
         //      });
         //      break;
         //  case 'generatedMeal':
         //      onCreated(
         //          {
         //              type: 'suggestion',
         //              suggestionId: item.id,
         //              items: item.items.map(mapFoodPortionDtoCreationDto),
         //          },
         //          {
         //              type: 'suggestion',
         //              suggestionId: item.id,
         //              items: item.items,
         //              nutritionalInfo: sumNutritions(item.items.map((x) => x.nutritionalInfo)),
         //          },
         //      );
         //      navigation.goBack();
         //      break;
         //  case 'custom':
         //      const customCreationDto: CustomFoodPortionCreationDto = {
         //          type: 'custom',
         //          nutritionalInfo: item.nutritionalInfo,
         //          label: item.label,
         //      };
         //      onCreated(customCreationDto, customCreationDto);
         //      navigation.goBack();
         //      break;
      }

      Keyboard.dismiss();
   };

   return (
      <FlatList
         data={results}
         keyboardShouldPersistTaps="handled"
         style={{ backgroundColor: theme.colors.background }}
         ItemSeparatorComponent={() => <Divider inset />}
         keyExtractor={getSearchResultKey}
         renderItem={({ item }) => <SearchResultItem item={item} onPress={() => onPressItem(item)} />}
      />
   );
}
