import Color from 'color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { FoodPortionItem, FoodPortionMeal } from 'src/types';
import { getFoodPortionId, getFoodPortionNutritions } from 'src/utils/food-portion-utils';
import { roundNumber } from 'src/utils/string-utils';

interface Props {
   onHeaderPress?: () => void;
   onHeaderLongPress?: () => void;

   header: React.ReactChild;
   items: FoodPortionItem[];

   renderItem: (item: FoodPortionItem) => React.ReactNode;

   dense?: boolean;
}

function MealPortionTree({ onHeaderPress, onHeaderLongPress, header, items, dense, renderItem }: Props) {
   const rippleColor = 'black';

   return (
      <Surface style={styles.surface}>
         <View>
            <TouchableRipple
               onPress={onHeaderPress}
               onLongPress={onHeaderLongPress}
               rippleColor={rippleColor}
               style={styles.root}
            >
               <View style={[styles.container, dense && { marginLeft: 0 }]}>{header}</View>
            </TouchableRipple>
            <View style={{ marginLeft: dense ? 8 : 16 }}>
               {items.map((item, i) => {
                  return (
                     <View key={getFoodPortionId(item)}>
                        <Divider style={{ marginLeft: dense ? -8 : -16 }} />
                        <MealItem renderItem={renderItem} item={item} lastItem={i === items.length - 1} />
                     </View>
                  );
               })}
            </View>
         </View>
      </Surface>
   );
}

type MealItemProps = {
   item: FoodPortionItem;
   lastItem?: boolean;

   renderItem: (item: FoodPortionItem) => React.ReactNode;
};

function MealItem({ item, lastItem, renderItem }: MealItemProps) {
   return (
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
         <View style={{ display: 'flex', flexDirection: 'column' }}>
            <View style={{ backgroundColor: 'white', width: 1, height: 1, marginTop: -1 }} />
            <View style={{ backgroundColor: 'white', width: 1, flex: 1 }} />
            <View style={{ backgroundColor: 'white', width: 1, height: 1 }} />
            <View style={{ backgroundColor: lastItem ? 'transparent' : 'white', width: 1, flex: 1 }} />
         </View>
         <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'white', height: 1, width: 8 }} />
         </View>
         <View style={{ flex: 1 }}>{renderItem(item)}</View>
      </View>
   );
}

interface MealPortionViewProps {
   foodPortion: FoodPortionMeal;

   onHeaderPress?: () => void;
   onHeaderLongPress?: () => void;

   renderItem: (item: FoodPortionItem) => React.ReactNode;

   dense?: boolean;
}

function MealPortionView({ foodPortion, ...props }: MealPortionViewProps) {
   const theme = useTheme();
   const titleColor = Color(theme.colors.onSurface).alpha(0.87).rgb().string();
   const kcalColor = Color(theme.colors.onSurface).alpha(0.8).rgb().string();

   const nutritionInfo = getFoodPortionNutritions(foodPortion);

   return (
      <MealPortionTree
         {...props}
         items={foodPortion.items}
         header={
            <View style={styles.row}>
               <View style={styles.flexFill}>
                  <Text
                     ellipsizeMode="tail"
                     numberOfLines={1}
                     style={[styles.title, { color: titleColor, fontWeight: 'bold' }]}
                  >
                     {foodPortion.portion !== 1 ? `${foodPortion.portion}x ` : null}
                     {foodPortion.mealName}
                  </Text>
               </View>
               <Text style={[styles.energyText, { color: kcalColor }]}>{roundNumber(nutritionInfo.energy)} kcal</Text>
            </View>
         }
      />
   );
}

export default MealPortionView;

export const styles = StyleSheet.create({
   surface: {
      elevation: 1,
   },
   root: {
      display: 'flex',
      justifyContent: 'center',
   },
   container: {
      padding: 8,
      paddingVertical: 10,
      marginHorizontal: 8,
   },
   row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   title: {
      fontSize: 14,
   },
   description: {
      fontSize: 12,
   },
   energyText: {
      marginLeft: 16,
   },
   flexFill: {
      flex: 1,
   },
   verticalCenterAlignedRow: {
      flexDirection: 'row',
      alignItems: 'center',
   },
});
