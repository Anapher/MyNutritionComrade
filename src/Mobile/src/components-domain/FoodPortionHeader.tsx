import Color from 'color';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Subheading, Surface, Text, useTheme } from 'react-native-paper';
import { FoodPortion } from 'src/types';
import { sumNutritions } from 'src/utils/nutrition-utils';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
   header?: string;
   foodPortions: FoodPortion[];
   style?: StyleProp<ViewStyle>;
};

function FoodPortionHeader({ header, foodPortions, style }: Props) {
   const theme = useTheme();
   const { t } = useTranslation();

   const summaryColor = Color(theme.colors.onSurface).alpha(0.5).rgb().string();
   const summaryTextStyle: StyleProp<TextStyle> = { fontSize: 11, color: summaryColor };

   const { energy, fat, carbohydrates, sugars, protein } = sumNutritions(foodPortions.map((x) => x.nutritionalInfo));

   return (
      <Surface style={[styles.container, style]}>
         <View style={styles.header}>
            <Subheading accessibilityRole="header" style={styles.headerText}>
               {header}
            </Subheading>
            <Subheading style={styles.headerText}>
               {roundNumber(energy)}
               <Text style={{ fontSize: 12 }}> kcal</Text>
            </Subheading>
         </View>
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={summaryTextStyle}>{`${t('nutritional_info.fat')}: ${roundNumber(fat)}g`}</Text>
            <Text style={summaryTextStyle}>{`${t('nutritional_info.carbohydrates')}: ${roundNumber(
               carbohydrates,
            )}g`}</Text>
            <Text style={summaryTextStyle}>{`${t('nutritional_info.sugars')}: ${roundNumber(sugars)}g`}</Text>
            <Text style={summaryTextStyle}>{`${t('nutritional_info.protein')}: ${roundNumber(protein)}g`}</Text>
         </View>
      </Surface>
   );
}

const styles = StyleSheet.create({
   container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      elevation: 8,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   headerText: {
      fontSize: 16,
   },
});

export default FoodPortionHeader;
