import React, { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Dialog, Divider } from 'react-native-paper';
import DialogButton from 'src/components/DialogButton';
import { FoodPortion } from 'src/types';

export type ShowOptionsInfo = {
   foodPortion: FoodPortion;
   handleRemove: () => void;
};

type Props = {
   value?: ShowOptionsInfo;
   onDismiss: () => void;
};

function getName(value: FoodPortion, t: TFunction) {
   switch (value.type) {
      case 'product':
         return t('product_label', { product: value.product.label });
      case 'custom':
         return value.label || t('custom_meal');
      case 'meal':
         return value.mealName;
      case 'suggestion':
         throw new Error('not supported');
   }
}

function FoodPortionDialog({ value, onDismiss }: Props) {
   const [foodPortion, setFoodPortion] = useState(value?.foodPortion);
   // const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
   const { t } = useTranslation();

   /** to prevent the buggy visual effect when the dialog is fading away */
   useEffect(() => {
      if (value) setFoodPortion(value.foodPortion);
   }, [value]);

   const handleRemove = () => {
      value?.handleRemove();
      onDismiss();
   };

   return (
      <Dialog visible={!!value} onDismiss={onDismiss}>
         <Dialog.Title numberOfLines={1} lineBreakMode="tail">
            {foodPortion && getName(foodPortion, t)}
         </Dialog.Title>
         <View>
            {foodPortion?.type === 'product' && (
               <>
                  {/* <DialogButton
                     onPress={async () => {
                        navigation.navigate('ProductOverview', { product: foodPortion.product });
                        onDismiss();
                     }}
                  >
                     Show Product
                  </DialogButton> */}
                  {/* <Divider />
                  <DialogButton
                     onPress={() => {
                        navigation.navigate('ChangeProduct', { product: foodPortion.product });
                        onDismiss();
                     }}
                  >
                     Suggest Changes
                  </DialogButton>
                  <Divider />
                  <DialogButton
                     onPress={() => {
                        navigation.navigate('VoteProductChanges', { product: foodPortion.product });
                        onDismiss();
                     }}
                  >
                     Show Changes
                  </DialogButton> */}
                  <Divider />
               </>
            )}
            <DialogButton color="#e74c3c" onPress={handleRemove}>
               {t('remove')}
            </DialogButton>
         </View>
      </Dialog>
   );
}

export default FoodPortionDialog;
