import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CustomFoodPortionView } from 'src/components-domain/FoodPortionView';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortionCustom } from 'src/types';
import { setConsumption } from '../../actions';
import { ConsumedFoodItemProps } from './types';

export default function ConsumedCustomItem({
   consumed: { foodPortion, date, time },
   onRemove,
}: ConsumedFoodItemProps<FoodPortionCustom>) {
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const showActionSheet = useActionSheetWrapper();

   const handleChange = () => {
      navigation.navigate('AddCustomProduct', {
         initialValues: foodPortion,

         onSubmit: (values) => {
            onRemove();
            dispatch(setConsumption({ date, time, foodPortion: values }));
            navigation.pop(1);
         },
      });
   };

   const handleShowOptions = () => {
      showActionSheet(
         [
            {
               label: t('common:remove'),
               onPress: onRemove,
               destructive: true,
            },
            CancelButton(),
         ],
         {
            title: foodPortion.label || t('custom_meal'),
         },
      );
   };

   return <CustomFoodPortionView foodPortion={foodPortion} onPress={handleChange} onLongPress={handleShowOptions} />;
}
