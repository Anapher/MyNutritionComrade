import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import { NutritionalInfo } from 'src/types';
import { roundNumber } from 'src/utils/string-utils';
import Tile from './Tile';

type Props = {
   info: NutritionalInfo;
   volume: number;
   name: keyof NutritionalInfo;
   style?: StyleProp<ViewStyle>;
};

export default function NutritionTile({ info, name, volume, style }: Props) {
   const { t } = useTranslation();

   return (
      <Tile
         style={style}
         caption={((info[name] / (info.volume || 1)) * 100).toFixed(1) + '%'}
         value={roundNumber((info[name] / (info.volume || 1)) * volume) + 'g'}
         text={t(`nutritional_info.${name}`)}
      />
   );
}
