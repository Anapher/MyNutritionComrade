import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FoodPortionHeader from 'src/components-domain/FoodPortionHeader';
import InteractiveCustomItem from 'src/components-domain/FoodPortionItem/InteractiveCustomItem';
import InteractiveProductItem from 'src/components-domain/FoodPortionItem/InteractiveProductItem';
import { ActionListItem, ActionTextInput } from 'src/components/ActionList';
import StaticActionView from 'src/components/ActionList/StaticActionView';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortionItem } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { createActionTemplate } from 'src/utils/redux-utils';
import { addItem, changeProductAmount, initialize, removeItem, setItem, setName } from '../reducer';
import { selectForm } from '../selectors';
import { MealForm } from '../validation';

type Props = {
   initialValue?: Partial<MealForm>;
};

export default function MealEditor({ initialValue }: Props) {
   const { t } = useTranslation();
   const { bottom, left } = useSafeAreaInsets();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const dispatch = useDispatch();

   useLayoutEffect(() => {
      dispatch(initialize(initialValue ?? {}));
   }, []);

   const { name, items } = useSelector(selectForm);

   const handleAddItem = () => {
      navigation.push('SearchProduct', {
         config: { disableMealCreation: true },
         onCreatedAction: createActionTemplate(addItem, {}),
         onCreatedPop: 1,
      });
   };

   const handleChangeName = (value: string) => dispatch(setName(value));

   const handleRemove = (id: string) => {
      dispatch(removeItem(id));
   };

   return (
      <View style={styles.root}>
         <StaticActionView style={styles.nameContainer}>
            <ActionListItem
               name="name"
               render={() => (
                  <ActionTextInput
                     title={t('create_meal.meal_name')}
                     value={name ?? ''}
                     onChangeValue={(val) => handleChangeName(val ?? '')}
                  />
               )}
            />
         </StaticActionView>
         <FlatList
            style={styles.itemsList}
            ListHeaderComponent={<FoodPortionHeader foodPortions={items ?? []} />}
            data={items ?? []}
            keyExtractor={(item) => getFoodPortionId(item)}
            renderItem={({ item }) => RenderFoodPortion(item, () => handleRemove(getFoodPortionId(item)))}
         />
         <FAB
            icon="plus"
            onPress={handleAddItem}
            style={{ position: 'absolute', right: left + 16, bottom: bottom + 16 }}
         />
      </View>
   );
}

function RenderFoodPortion(foodPortion: FoodPortionItem, onRemove: () => void) {
   switch (foodPortion.type) {
      case 'product':
         return (
            <InteractiveProductItem
               foodPortion={foodPortion}
               onRemove={onRemove}
               changeAmountAction={createActionTemplate(changeProductAmount, { foodPortion })}
            />
         );
      case 'custom':
         return (
            <InteractiveCustomItem
               foodPortion={foodPortion}
               onRemove={onRemove}
               changeAction={createActionTemplate(setItem, {})}
            />
         );
      default:
         break;
   }

   return null;
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFillObject,
      display: 'flex',
      flexDirection: 'column',
   },
   nameContainer: {
      padding: 16,
   },
   itemsList: {
      flex: 1,
   },
});
