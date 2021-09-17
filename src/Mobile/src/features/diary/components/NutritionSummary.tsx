import React from 'react';
import { StyleSheet, View } from 'react-native';
import NutritionTile from 'src/components-domain/NutritionTile';
import Tile from 'src/components-domain/Tile';
import { NutritionalInfo } from 'src/types';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
   nutritions: NutritionalInfo;
};

function NutritionSummary({ nutritions }: Props) {
   return (
      <View style={styles.root}>
         <Tile style={styles.tile} caption=" " value={roundNumber(nutritions.energy) as any} text="kcal" fat />
         <NutritionTile style={styles.tile} volume={nutritions.volume} info={nutritions} name="carbohydrates" />
         <NutritionTile style={styles.tile} volume={nutritions.volume} info={nutritions} name="fat" />
         <NutritionTile style={styles.tile} volume={nutritions.volume} info={nutritions} name="protein" />
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   tile: {
      flex: 1,
   },
});

export default NutritionSummary;
