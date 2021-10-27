import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { overlay, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CurvedSlider from 'src/components/CurvedSlider/CurvedSlider';
import NumberTextInput from 'src/components/NumberTextInput';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { formatNutritionalValue, getBaseUnit } from 'src/utils/product-utils';
import { initialize, setAmount, setServingType } from '../reducer';
import { selectSlider } from '../selectors';
import AddProductFooter from './AddProductFooter';
import useAddProductHeader from './AddProductHeader';
import ServingInfo from './ServingInfo';
import ServingSelection from './ServingSelection';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'AddProduct'>;
};

export default function AddProduct({
   navigation,
   route: {
      params: {
         product,
         amount: initialAmount,
         servingType: initialServingType,
         onSubmitAction,
         onSubmitPop,
         submitTitle,
      },
   },
}: Props) {
   const dispatch = useDispatch();
   const slider = useSelector(selectSlider);
   const theme = useTheme();
   const { t } = useTranslation();

   const [isInputValid, setIsInputValid] = useState(true);

   useLayoutEffect(() => {
      dispatch(initialize({ product, amount: initialAmount, servingType: initialServingType }));
   }, [product, initialAmount, initialServingType]);

   product = slider?.product || product; // the product of the slider may be updated

   useAddProductHeader({
      title: t('product_label', { product }),
      submitTitle,
      navigation,
      canSubmit: isInputValid && slider !== null && slider.amount > 0,
      onSubmit: () => {
         dispatch({
            ...onSubmitAction,
            payload: {
               ...onSubmitAction.payload,
               amount: slider!.amount,
               servingType: slider!.servingType,
            },
         });
         navigation.pop(onSubmitPop);
      },
   });

   if (!slider) return null;
   if (slider.product.id !== product.id) return null;

   const { amount, servingType, curve: curveScale } = slider;
   const curveBackground = overlay(8, theme.colors.surface);

   const handleChangeServingType = (newServingType: string) => dispatch(setServingType(newServingType));
   const handleChangeAmount = (newAmount?: number) => dispatch(setAmount(newAmount || 0));

   const baseUnit = getBaseUnit(product);
   const isBaseUnitSelected = servingType === baseUnit;

   return (
      <View style={styles.root}>
         <View>
            <View style={styles.servingInfoContainer}>
               <ServingInfo product={product} volume={amount * product.servings[servingType]} />
            </View>
            <View style={styles.servingSelectionContainer}>
               <ServingSelection product={product} value={servingType} onChange={handleChangeServingType} />
            </View>
            <View style={styles.volumeContainer}>
               <NumberTextInput
                  style={styles.volumeText}
                  value={amount}
                  onChangeValue={handleChangeAmount}
                  onChangeState={(x) => setIsInputValid(x)}
                  showBottomLine
               />
               <View style={[styles.row, { opacity: 0.6 }]}>
                  <Text>
                     {isBaseUnitSelected
                        ? ''
                        : formatNutritionalValue(amount * product.servings[servingType], baseUnit)}
                  </Text>
               </View>
            </View>
            <View style={styles.sliderContainer}>
               <CurvedSlider
                  onChange={handleChangeAmount}
                  step={curveScale.step}
                  minValue={0}
                  maxValue={curveScale.max}
                  width={Dimensions.get('window').width - 32}
                  scaleSteps={curveScale.labelStep}
                  curveBackground={curveBackground}
                  curveGradientStart={theme.colors.accent}
                  curveGradientEnd={theme.colors.accent}
                  value={amount}
               />
            </View>
         </View>
         <SafeAreaView>
            <AddProductFooter product={product} />
         </SafeAreaView>
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
   },
   servingInfoContainer: {
      marginHorizontal: 16,
   },
   servingSelectionContainer: {
      marginTop: 32,
   },
   sliderContainer: {
      display: 'flex',
      alignItems: 'center',
   },
   row: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
   },
   volumeContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 48,
      marginBottom: 48,
   },
   volumeText: {
      fontSize: 36,
      borderBottomColor: 'white',
   },
});
