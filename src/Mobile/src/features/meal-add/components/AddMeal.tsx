import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import NumberTextInput from 'src/components/NumberTextInput';
import TextToggleButton from 'src/components/TextToggleButton';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { getFoodPortionNutritions } from 'src/utils/food-portion-utils';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'AddMeal'>;
};

export default function AddMeal({
   route: {
      params: { meal, submitTitle, initialPortion, onSubmitAction, onSubmitPop },
   },
   navigation,
}: Props) {
   const { t } = useTranslation();
   const dispatch = useDispatch();
   const [portion, setPortion] = useState(initialPortion ?? 1);
   const [portionMode, setPortionMode] = useState<'by-percentage' | 'by-gram'>('by-percentage');
   const [textInputValid, setTextInputValid] = useState(false);

   const mealNutritions = useMemo(
      () =>
         getFoodPortionNutritions({
            type: 'meal',
            items: meal.items,
            portion: 1,
            mealId: meal.id,
            mealName: meal.name,
         }),
      [meal],
   );

   const onSubmit = () => {
      dispatch({ ...onSubmitAction, payload: { ...onSubmitAction.payload, portion } });
      navigation.pop(onSubmitPop);
   };
   const canSubmit = textInputValid && portion > 0;

   useLayoutEffect(() => {
      navigation.setOptions({
         title: meal.name,
         headerRight: () => <Button title={submitTitle} onPress={onSubmit} disabled={!canSubmit} />,
         headerBackTitleVisible: false,
      });
   });

   const changeSelectedValue = (value: number | undefined) => {
      value = value ?? 0;
      setPortion(portionMode === 'by-gram' ? value / mealNutritions.volume : value);
   };

   return (
      <View style={styles.root}>
         <View style={styles.row}>
            <TextToggleButton
               isChecked={portionMode === 'by-percentage'}
               isLeft
               onToggle={() => setPortionMode('by-percentage')}
               style={styles.toggleButton}
            >
               <Text>{t('add_meal.portions')}</Text>
            </TextToggleButton>
            <TextToggleButton
               isChecked={portionMode === 'by-gram'}
               isRight
               onToggle={() => setPortionMode('by-gram')}
               style={[styles.toggleButton, { marginLeft: 2 }]}
            >
               <Text>{t('add_meal.weight')}</Text>
            </TextToggleButton>
         </View>
         <View style={[styles.row, { marginTop: 32 }]}>
            <Text>{t('add_meal.weight')}:</Text>
         </View>
         <View style={[styles.row, { marginTop: 8, justifyContent: 'space-around', alignItems: 'flex-end' }]}>
            <View style={{ flex: 1 }} />
            <NumberTextInput
               autoFocus
               style={styles.textInput}
               value={portionMode === 'by-gram' ? mealNutritions.volume * portion : portion}
               onChangeValue={changeSelectedValue}
               onChangeState={(x) => setTextInputValid(x)}
            />
            <View style={{ flex: 1 }}>{portionMode === 'by-gram' && <Text>g</Text>}</View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      margin: 16,
      marginTop: 32,
   },
   row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
   },
   toggleButton: {
      width: 120,
      height: 40,
   },
   textInput: {
      fontSize: 24,
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      minWidth: 80,
      textAlign: 'center',
   },
});
