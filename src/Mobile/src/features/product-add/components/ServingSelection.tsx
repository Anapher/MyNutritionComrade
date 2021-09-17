import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import TextToggleButton from 'src/components/TextToggleButton';
import { ProductProperties } from 'src/types';
import { createChunks } from 'src/utils/array-utils';
import { getBaseUnit } from 'src/utils/product-utils';

type Props = {
   value: string;
   onChange: (v: string) => void;
   product: ProductProperties;
};

export default function ServingSelection({ value, onChange, product }: Props) {
   const [servingTypes, setServingTypes] = useState<string[]>([]);
   const { t } = useTranslation();

   useEffect(() => {
      setServingTypes(_.sortBy(Object.keys(product.servings), (x) => product.servings[x]));
   }, [product]);

   const baseUnit = getBaseUnit(product);

   return (
      <View>
         {createChunks(servingTypes, 3).map((chunkItems, i) => (
            <View style={styles.row} key={i}>
               {chunkItems.map((x, i) => (
                  <TextToggleButton
                     key={x}
                     isChecked={value === x}
                     isLeft={i === 0}
                     isRight={i === chunkItems.length - 1}
                     onToggle={() => onChange(x)}
                     style={styles.toggleButton}
                  >
                     <Text>{t(`serving_types.${x}`)}</Text>
                     {product.servings[x] > 1 && (
                        <Caption style={styles.caption}>{`${product.servings[x]} ${baseUnit}`}</Caption>
                     )}
                  </TextToggleButton>
               ))}
            </View>
         ))}
      </View>
   );
}

const styles = StyleSheet.create({
   row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 8,
   },
   toggleButton: {
      marginLeft: 2,
      width: 100,
      height: 40,
   },
   caption: {
      marginVertical: 0,
      lineHeight: 14,
   },
});
