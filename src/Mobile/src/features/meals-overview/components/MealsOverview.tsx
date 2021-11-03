import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButtonLink, ActionList, ActionListItem, ActionListSection } from 'src/components/ActionList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortionItem, Meal } from 'src/types';
import { getFoodPortionNutritions } from 'src/utils/food-portion-utils';
import { loadMeals } from '../actions';
import { selectMeals } from '../selectors';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
};

export default function MealsOverview({ navigation }: Props) {
   const { bottom, left } = useSafeAreaInsets();
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const meals = useSelector(selectMeals);

   const handleCreateMeal = () => {
      navigation.navigate('CreateMeal');
   };

   useEffect(() => {
      dispatch(loadMeals());
   }, []);

   const getItemLabel = (item: FoodPortionItem) => {
      switch (item.type) {
         case 'custom':
            return item.label ?? t('custom_meal');
         case 'product':
            return t('product_label', { product: item.product });
      }
   };

   const handleChangeMeal = (meal: Meal) => {
      navigation.push('EditMeal', { meal });
   };

   return (
      <View style={StyleSheet.absoluteFill}>
         <ActionList>
            <ActionListSection name="main">
               {meals?.map((x) => (
                  <ActionListItem
                     key={x.id}
                     name={x.id}
                     render={() => (
                        <ActionButtonLink
                           title={x.name}
                           onPress={() => handleChangeMeal(x)}
                           showSecondaryBelow
                           titleSingleLine
                           secondarySingleLine
                           secondary={sortItemsByEnergy(x.items).map(getItemLabel).join(', ')}
                           icon="arrow"
                        />
                     )}
                  />
               ))}
            </ActionListSection>
         </ActionList>
         <FAB
            icon="plus"
            onPress={handleCreateMeal}
            style={{ position: 'absolute', right: left + 16, bottom: bottom + 16 }}
         />
      </View>
   );
}

const sortItemsByEnergy = (items: FoodPortionItem[]) =>
   _.orderBy(items, (x) => getFoodPortionNutritions(x).energy, 'desc');
