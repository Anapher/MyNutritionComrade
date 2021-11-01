import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DateTime } from 'luxon';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { createMeal } from '../actions';
import { selectForm } from '../selectors';
import MealEditor from './MealEditor';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'CreateMeal'>;
};

export default function CreateMeal({ navigation, route: { params } }: Props) {
   const { t } = useTranslation();
   const values = useSelector(selectForm);
   const dispatch = useDispatch();

   const valid = values.name.length > 0 && values.items.length > 0;

   const handleCreate = () => {
      dispatch(createMeal({ ...values, createdOn: DateTime.now().toISO() }));
      navigation.pop(1);
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => <Button title={t('common:create')} disabled={!valid} onPress={handleCreate} />,
         headerTitle: t('create_meal.title'),
      });
   }, [values.items, values.name]);

   return <MealEditor initialValue={params?.initialValue} />;
}
