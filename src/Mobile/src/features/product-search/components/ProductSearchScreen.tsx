import { RouteProp, useTheme as useNativeTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from 'src/components/SearchBar';
import SimpleIconButton from 'src/components/SimpleIconButton';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortion, FoodPortionProduct } from 'src/types';
import { createActionTemplate } from 'src/utils/redux-utils';
import { selectedMealPortion, selectedProductAmount } from '../actions';
import { initializeSearch, setSearchText } from '../reducer';
import { selectSearchResults, selectSearchText } from '../selectors';
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
      params: { onCreatedAction, onCreatedPop, config },
   },
}: Props) {
   const theme = useTheme();
   const results = useSelector(selectSearchResults);
   const dispatch = useDispatch();
   const { t } = useTranslation();

   const handleOnCreated = (foodPortion: FoodPortion) => {
      dispatch({ ...onCreatedAction, payload: { ...onCreatedAction.payload, foodPortion } });
   };

   const showActionSheet = useActionSheetWrapper();

   const handleShowOptions = () => {
      showActionSheet([
         ...(config.disableMealCreation
            ? []
            : [
                 {
                    label: t('meals'),
                    onPress: () => navigation.navigate('MealsOverview'),
                 },
              ]),
         {
            label: t('product_search.create_product'),
            onPress: () => navigation.navigate('CreateProduct', { initialValue: {} }),
         },
         CancelButton(),
      ]);
   };

   const handleAddCustom = () => {
      Keyboard.dismiss();
      navigation.navigate('AddCustomProduct', {
         onSubmit: (value) => {
            navigation.pop(onCreatedPop + 2);
            handleOnCreated(value);
         },
      });
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: t('product_search.title'),
         headerRight: () => (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
               <SimpleIconButton icon="food" onPress={handleAddCustom} />
               <SimpleIconButton icon="dots-vertical" onPress={handleShowOptions} />
            </View>
         ),
      });
   }, []);

   const searchText = useSelector(selectSearchText);
   const handleSetSearchText = (s: string) => dispatch(setSearchText(s));

   useEffect(() => {
      dispatch(initializeSearch(config));
   }, [config, dispatch]);

   const onPressItem = (item: SearchResult) => {
      switch (item.type) {
         case 'product':
            navigation.navigate('AddProduct', {
               submitTitle: t('common:add'),
               onSubmitAction: createActionTemplate(selectedProductAmount, {
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

            handleOnCreated(foodPortion);

            navigation.pop(onCreatedPop);
            break;
         case 'meal':
            navigation.navigate('AddMeal', {
               meal: item.meal,
               submitTitle: t('common:add'),
               onSubmitPop: onCreatedPop + 1,
               onSubmitAction: createActionTemplate(selectedMealPortion, {
                  meal: item.meal,
                  completedAction: onCreatedAction,
               }),
            });
            break;
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

   const navTheme = useNativeTheme();

   return (
      <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior="padding">
         <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <View
               style={{ backgroundColor: navTheme.colors.card, paddingTop: 4, paddingBottom: 8, paddingHorizontal: 8 }}
            >
               <SearchBar
                  autoFocus
                  onChangeText={handleSetSearchText}
                  placeholder={t('product_search.search_hint')}
                  value={searchText}
               />
            </View>
            <FlatList
               data={results}
               keyboardShouldPersistTaps="handled"
               style={{ backgroundColor: theme.colors.background, flex: 1 }}
               ItemSeparatorComponent={() => <Divider inset />}
               keyExtractor={getSearchResultKey}
               renderItem={({ item }) => <SearchResultItem item={item} onPress={() => onPressItem(item)} />}
            />
         </View>
      </KeyboardAvoidingView>
   );
}
