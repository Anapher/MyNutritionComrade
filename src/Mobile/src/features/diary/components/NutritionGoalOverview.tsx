import React from 'react';
import { StyleSheet, View } from 'react-native';
import { roundNumber } from 'src/utils/string-utils';
import { Text } from 'react-native-paper';
import { NutritionalInfo } from 'src/types';
import Tile from 'src/components-domain/Tile';
import { useSelector } from 'react-redux';
import { selectUserCaloriesPerDay, selectUserProteinPerDay } from 'src/features/settings/selectors';
import { useTranslation } from 'react-i18next';

type GoalTileProps = {
   name: string;
   value: number;
   unit: string;
   targetValue: number;
};

function GoalTile({ name, targetValue, value, unit }: GoalTileProps) {
   const progress = value / targetValue;
   const color = progress > 95 ? '#27ae60' : progress > 50 ? '#e67e22' : '#e74c3c';
   const left = targetValue - value;

   return (
      <Tile
         caption={`${(progress * 100).toFixed(1)}%`}
         value={`${roundNumber(left)}${unit}`}
         valueColor={color}
         text={name}
         style={{ marginLeft: 32 }}
      />
   );
}

type Props = {
   nutritions: NutritionalInfo;
};

function NutritionGoalOverview({ nutritions }: Props) {
   const { t } = useTranslation();
   const targetCalories = useSelector(selectUserCaloriesPerDay);
   const targetProtein = useSelector(selectUserProteinPerDay);

   if (!targetCalories && !targetProtein) {
      return (
         <View style={styles.centered}>
            <Text style={{ textAlign: 'center', opacity: 0.5 }}>{t('nutrition_goal_overview.not_configured')}</Text>
         </View>
      );
   }

   return (
      <View style={styles.root}>
         <View style={styles.container}>
            <Tile
               value={`${t('nutrition_goal_overview.missing')}:`}
               caption={`${t('nutrition_goal_overview.reached')}:`}
               text=" "
               style={{ alignItems: 'flex-end' }}
            />
            <View style={styles.container}>
               {targetCalories && (
                  <GoalTile
                     name={t('nutritional_info.energy')}
                     targetValue={targetCalories}
                     unit=" kcal"
                     value={nutritions.energy}
                  />
               )}
               {targetProtein && (
                  <GoalTile
                     name={t('nutritional_info.protein')}
                     targetValue={targetProtein}
                     unit="g"
                     value={nutritions.protein}
                  />
               )}
            </View>
         </View>
      </View>
   );
}

export default NutritionGoalOverview;

const styles = StyleSheet.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      paddingHorizontal: 16,
   },
   container: {
      display: 'flex',
      flexDirection: 'row',
   },
   centered: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      paddingHorizontal: 16,
   },
});
