import color from 'color';
import { TFunction } from 'i18next';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FoodPortion } from 'src/types';
import { getFoodPortionNutritions, suggestionIdToString } from 'src/utils/food-portion-utils';
import { roundNumber } from 'src/utils/string-utils';
import { SearchResult } from '../types';

type Props = {
   item: SearchResult;
   onPress: () => void;
};

function SearchResultItem({ item, onPress }: Props) {
   const theme = useTheme();
   const iconColor = color(theme.colors.text).alpha(0.87).rgb().string();
   const descriptionColor = color(theme.colors.text).alpha(0.54).rgb().string();

   const { t } = useTranslation();

   const title = getTitle(item, t);
   const description = getDescription(item, t);
   const icon = getIcon(item);

   return (
      <TouchableRipple onPress={onPress} style={styles.item}>
         <View style={styles.itemContent}>
            <View style={styles.iconContent}>{icon && <Icon name={icon} color={iconColor} size={24} />}</View>
            <View>
               <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
               {description !== undefined && (
                  <Text style={[styles.description, { color: descriptionColor }]}>{description}</Text>
               )}
            </View>
         </View>
      </TouchableRipple>
   );
}

function getIcon(s: SearchResult): string | null {
   switch (s.type) {
      case 'product':
         return null;
      case 'serving':
         return 'plus';
      case 'meal':
         return 'silverware-fork-knife';
      case 'custom':
         return null;
      case 'generatedMeal':
         return 'plus';
   }
}

function getTitle(s: SearchResult, t: TFunction): string {
   switch (s.type) {
      case 'product':
         return t('product_label', { product: s.product });
      case 'serving':
         return t('product_label', { product: s.product });
      case 'meal':
         return s.meal.name;
      case 'custom':
         return s.label || t('custom_meal');
      case 'generatedMeal':
         return suggestionIdToString(s.id, t);
   }
}

function getDescription(s: SearchResult, t: TFunction): string | null {
   switch (s.type) {
      case 'product':
         return t('product_search.tap_to_choose_volume');
      case 'serving':
         if (s.convertedFrom !== undefined) return `${s.amount * (1 / s.convertedFrom.factor)} ${s.convertedFrom.name}`;
         return `${s.amount} ${s.servingType}`;
      case 'meal':
         return `${roundNumber(
            getFoodPortionNutritions({
               type: 'meal',
               portion: 1,
               items: s.meal.items,
               mealId: s.meal.id,
               mealName: s.meal.name,
            }).energy,
         )} kcal`;
      case 'custom':
         return 'todo';
      case 'generatedMeal':
         return _.sortBy(s.items, (x) => getFoodPortionNutritions(x).energy)
            .map((x) => getName(x, t))
            .join(', ');
   }
}

function getName(dto: FoodPortion, t: TFunction): string {
   switch (dto.type) {
      case 'custom':
         return dto.label || t('custom_meal');
      case 'product':
         return t('product_label', { product: dto.product });
      case 'meal':
         return dto.mealName;
      case 'suggestion':
         return suggestionIdToString(dto.suggestionId, t);
   }
}

const styles = StyleSheet.create({
   item: {
      height: 60,
      paddingVertical: 12,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
   itemContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
   iconContent: {
      width: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   title: {
      fontSize: 14,
   },
   description: {
      fontSize: 12,
   },
});

export default SearchResultItem;
