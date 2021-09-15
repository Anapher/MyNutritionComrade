import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Keyboard } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { CustomFoodPortionCreationDto, ProductFoodPortionCreationDto } from 'src/types';
import { selectSearchResults } from '../selectors';
import { SearchResult } from '../types';
import { getSearchResultKey } from '../utils';
import SearchResultItem from './SearchResultItem';

export default function ProductSearchScreen() {
   const theme = useTheme();
   const results = useSelector(selectSearchResults);
   const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();

   const onPressItem = (item: SearchResult) => {
      switch (
         item.type
         // case 'product':
         //    navigation.navigate('AddProduct', {
         //       disableGoBack: true,
         //       onSubmit: (amount, servingType) => {
         //          const creationDto: ProductFoodPortionCreationDto = {
         //             type: 'product',
         //             amount,
         //             servingType,
         //             productId: item.product.id,
         //          };

         //          onCreated(creationDto, createProductPortionFromCreation(creationDto, item.product));
         //          navigation.pop(2);
         //       },
         //       product: item.product,
         //    });
         //    break;
         //  case 'serving':
         //      const creationDto: ProductFoodPortionCreationDto = {
         //          type: 'product',
         //          amount: item.amount,
         //          productId: item.product.id,
         //          servingType: item.servingType,
         //      };

         //      onCreated(creationDto, createProductPortionFromCreation(creationDto, item.product));
         //      navigation.goBack();
         //      break;
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
      ) {
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
