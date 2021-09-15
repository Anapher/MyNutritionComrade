import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionListData, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import FlatButton from 'src/components/FlatButton';
import { ConsumedPortion } from 'src/types';

type Props = {
   section: SectionListData<ConsumedPortion>;
   onAddFood: () => void;
   onScanBarcode: () => void;
   style?: StyleProp<ViewStyle>;
};

function ConsumptionTimeFooter({ section: { data }, onAddFood, onScanBarcode, style }: Props) {
   const theme = useTheme();
   const { t } = useTranslation();

   return (
      <Surface style={[styles.footer, style]}>
         {data.length === 0 && (
            <View
               style={[
                  styles.divider,
                  {
                     borderBottomColor: theme.colors.disabled,
                  },
               ]}
            />
         )}
         <View style={styles.row}>
            <View style={{ flex: 2 }}>
               <FlatButton text={t('consumed_list.add_food')} icon="plus" onPress={onAddFood} />
            </View>
            <View style={{ flex: 1 }}>
               <FlatButton text={t('consumed_list.scan')} icon="barcode" onPress={onScanBarcode} />
            </View>
         </View>
      </Surface>
   );
}

export default ConsumptionTimeFooter;

const styles = StyleSheet.create({
   footer: {
      elevation: 8,
   },
   row: {
      flexDirection: 'row',
   },
   divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginRight: 80,
   },
});
