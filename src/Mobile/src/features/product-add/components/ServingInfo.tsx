import React from 'react';
import { StyleSheet, View } from 'react-native';
import NutritionTile from 'src/components-domain/NutritionTile';
import Tile from 'src/components-domain/Tile';
import { ProductProperties } from 'src/types';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
   product: ProductProperties;
   volume: number;
};

function ServingInfo({ product: { nutritionalInfo }, volume }: Props) {
   return (
      <View style={styles.root}>
         <Tile
            style={styles.tile}
            caption=" "
            value={roundNumber((nutritionalInfo.energy / nutritionalInfo.volume) * volume) as any}
            text="kcal"
            fat
         />
         <NutritionTile style={styles.tile} volume={volume} info={nutritionalInfo} name="carbohydrates" />
         <NutritionTile style={styles.tile} volume={volume} info={nutritionalInfo} name="fat" />
         <NutritionTile style={styles.tile} volume={volume} info={nutritionalInfo} name="protein" />
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
   },
   tile: {
      flex: 1,
   },
});

export default ServingInfo;
