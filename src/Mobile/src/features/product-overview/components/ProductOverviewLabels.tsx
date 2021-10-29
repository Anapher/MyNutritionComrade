import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import { ActionListItem, ActionListSection } from 'src/components/ActionList';
import ActionItem from 'src/components/ActionList/Items/ActionItem';
import { Product, ProductLabel } from 'src/types';

export default function ProductOverviewLabels(product: Product) {
   return (
      <ActionListSection name="labels">
         {Object.entries(product.label).map(([lang, data]) => (
            <ActionListItem name={lang} key={lang} render={() => <LabelSettingItem label={data} lang={lang} />} />
         ))}
      </ActionListSection>
   );
}

type LabelSettingItemProps = {
   lang: string;
   label: ProductLabel;
};

function LabelSettingItem({ lang, label }: LabelSettingItemProps) {
   return (
      <ActionItem padding>
         <View style={styles.labelItemContainer}>
            <Text style={styles.labelLangText}>{lang.toUpperCase()}</Text>
            <View style={styles.labelDataContainer}>
               <Text style={{ fontSize: 16 }}>{label.value}</Text>
               {label.tags && <Caption>{label.tags?.join(', ')}</Caption>}
            </View>
         </View>
      </ActionItem>
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
