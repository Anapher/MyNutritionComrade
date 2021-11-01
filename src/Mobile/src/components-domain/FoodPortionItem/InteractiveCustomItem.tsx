import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CustomFoodPortionView } from 'src/components-domain/FoodPortionItem/FoodPortionView';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortion, FoodPortionCustom } from 'src/types';
import { PayloadActionTemplate } from 'src/utils/redux-utils';

type Props = {
   foodPortion: FoodPortionCustom;
   onRemove: () => void;
   changeAction: PayloadActionTemplate<{ foodPortion: FoodPortion }>;
};

export default function InteractiveCustomItem({ foodPortion, onRemove, changeAction }: Props) {
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const showActionSheet = useActionSheetWrapper();

   const handleChange = () => {
      navigation.navigate('AddCustomProduct', {
         initialValues: foodPortion,

         onSubmit: (values) => {
            onRemove();
            dispatch({ ...changeAction, payload: { ...changeAction.payload, foodPortion: values } });
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
