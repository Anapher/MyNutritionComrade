import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { changeMeal } from '../actions';
import { selectForm } from '../selectors';
import MealEditor from './MealEditor';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'EditMeal'>;
};

export default function EditMeal({
   navigation,
   route: {
      params: { meal },
   },
}: Props) {
   const { t } = useTranslation();
   const values = useSelector(selectForm);
   const dispatch = useDispatch();

   const valid = values.name.length > 0 && values.items.length > 0;

   const handleSubmit = () => {
      dispatch(changeMeal({ ...meal, ...values }));
      navigation.pop(1);
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => <Button title={t('common:change')} disabled={!valid} onPress={handleSubmit} />,
         headerTitle: t('create_meal.edit_meal'),
      });
   }, [values.items, values.name]);

   return <MealEditor initialValue={meal} />;
}
