import Color from 'color';
import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { isProductLiquid } from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';
import { styles } from './food-portion-styles';
import {
   CustomFoodPortionCreationDto,
   FoodPortion,
   FoodPortionCreationDto,
   FoodPortionCustom,
   FoodPortionProduct,
   NutritionalInfo,
   ProductFoodPortionCreationDto,
} from 'src/types';
import { mapFoodPortionDtoCreationDto } from 'src/utils/food-creation-utils';
import { useTranslation } from 'react-i18next';

interface Props<T extends FoodPortion, TCreation extends FoodPortionCreationDto> {
   /** when the item is pressed. A delegate action is submitted as parameter that can be called to trigger @see {onEdit} */
   onPress?: () => void;
   onLongPress?: () => void;

   containerStyle?: StyleProp<ViewStyle>;

   foodPortion: T;
}

export function ProductFoodPortionView({
   onPress,
   onLongPress,
   foodPortion,
   containerStyle,
}: Props<FoodPortionProduct, ProductFoodPortionCreationDto>) {
   const { t } = useTranslation();

   return (
      <FoodPortionItem
         onPress={onPress}
         onLongPress={onLongPress}
         label={t('product_label', { product: foodPortion.product })}
         nutritionalInfo={foodPortion.nutritionalInfo}
         isLiquid={isProductLiquid(foodPortion.product)}
         containerStyle={containerStyle}
      />
   );
}

export function CustomFoodPortionView({
   onPress,
   onLongPress,
   foodPortion,
   containerStyle,
}: Props<FoodPortionCustom, CustomFoodPortionCreationDto>) {
   const { t } = useTranslation();

   return (
      <FoodPortionItem
         onPress={onPress}
         onLongPress={onLongPress}
         label={foodPortion.label || t('custom_meal')}
         nutritionalInfo={foodPortion.nutritionalInfo}
         isLiquid={false}
         containerStyle={containerStyle}
      />
   );
}

type FoodPortionItemProps = {
   containerStyle?: StyleProp<ViewStyle>;

   onPress?: () => void;
   onLongPress?: () => void;

   label: string;
   nutritionalInfo: NutritionalInfo;
   isLiquid: boolean;
};

function FoodPortionItem({
   onLongPress,
   onPress,
   nutritionalInfo,
   label,
   isLiquid,
   containerStyle,
}: FoodPortionItemProps) {
   const theme = useTheme();
   const { t } = useTranslation();

   const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
   const descriptionColor = Color(theme.colors.text).alpha(0.7).rgb().string();
   const descriptionBColor = Color(theme.colors.text).alpha(0.4).rgb().string();

   const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();
   const rippleColor = 'black';

   const { fat, carbohydrates, protein, volume, energy } = nutritionalInfo;

   return (
      <Surface style={styles.surface}>
         <TouchableRipple
            onPress={onPress && (() => onPress())}
            onLongPress={onLongPress && (() => onLongPress())}
            rippleColor={rippleColor}
            style={styles.root}
         >
            <View style={[styles.row, styles.container, containerStyle]}>
               <View style={styles.flexFill}>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.title, { color: titleColor }]}>
                     {label}
                  </Text>
                  <View style={styles.verticalCenterAlignedRow}>
                     <Text style={[styles.description, { color: descriptionColor }]}>
                        {volume}
                        {isLiquid ? 'ml' : 'g'}
                     </Text>
                     <Text style={[styles.description, { color: descriptionBColor, fontSize: 11 }]}>
                        {' | '}
                        {`${t('nutritional_info.fat')}: ${roundNumber(fat)}g | ${t(
                           'nutritional_info.carbohydrates_short',
                        )}: ${roundNumber(carbohydrates)}g | ${t('nutritional_info.protein')}: ${roundNumber(
                           protein,
                        )}g`}
                     </Text>
                  </View>
               </View>
               <Text style={[styles.energyText, { color: kcalColor }]}>{roundNumber(energy)} kcal</Text>
            </View>
         </TouchableRipple>
      </Surface>
   );
}