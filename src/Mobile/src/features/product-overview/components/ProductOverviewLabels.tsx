import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import SettingItem from 'src/components/Settings/SettingItem';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import { Product, ProductLabel } from 'src/types';

export default function ProductOverviewLabels(product: Product): SettingsSection {
   return {
      settings: Object.entries(product.label).map(([lang, data]) => ({
         key: lang,
         render: () => <LabelSettingItem label={data} lang={lang} />,
      })),
   };
}

type LabelSettingItemProps = {
   lang: string;
   label: ProductLabel;
};

function LabelSettingItem({ lang, label }: LabelSettingItemProps) {
   return (
      <SettingItem padding>
         <View style={styles.labelItemContainer}>
            <Text style={styles.labelLangText}>{lang.toUpperCase()}</Text>
            <View style={styles.labelDataContainer}>
               <Text style={{ fontSize: 16 }}>{label.value}</Text>
               {label.tags && <Caption>{label.tags?.join(', ')}</Caption>}
            </View>
         </View>
      </SettingItem>
   );
}

const styles = StyleSheet.create({
   labelItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: 8,
      alignItems: 'center',
   },
   labelLangText: {
      fontSize: 14,
   },
   labelDataContainer: {
      marginLeft: 16,
   },
});
