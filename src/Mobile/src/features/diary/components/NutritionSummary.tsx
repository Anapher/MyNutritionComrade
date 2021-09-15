import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { NutritionalInfo } from 'src/types';
import { roundNumber } from 'src/utils/string-utils';
import Tile from './Tile';

type NutritionTile = {
   info: NutritionalInfo;
   volume: number;
   name: keyof NutritionalInfo;
   label: string;
};

function NutritionTile({ info, name, volume, label }: NutritionTile) {
   return (
      <Tile
         style={{ flex: 1 }}
         caption={((info[name] / (info.volume || 1)) * 100).toFixed(1) + '%'}
         value={roundNumber((info[name] / (info.volume || 1)) * volume) + 'g'}
         text={label}
      />
   );
}

type Props = {
   nutritions: NutritionalInfo;
};

function NutritionSummary({ nutritions }: Props) {
   const { t } = useTranslation();

   return (
      <View style={styles.root}>
         <Tile style={{ flex: 1 }} caption=" " value={roundNumber(nutritions.energy) as any} text="kcal" fat />
         <NutritionTile
            volume={nutritions.volume}
            info={nutritions}
            name="carbohydrates"
            label={t('nutritional_info.carbohydrates')}
         />
         <NutritionTile volume={nutritions.volume} info={nutritions} name="fat" label={t('nutritional_info.fat')} />
         <NutritionTile
            volume={nutritions.volume}
            info={nutritions}
            name="protein"
            label={t('nutritional_info.protein')}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
});

export default NutritionSummary;
