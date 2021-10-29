import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { ActionButtonLink, ActionListItem, ActionListSection } from 'src/components/ActionList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { Product, ProductContributionStatusDto } from 'src/types';

export default function ProductOverviewActions(
   product: Product,
   status: ProductContributionStatusDto | undefined | null,
) {
   const theme = useTheme();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const handleChange = () => {
      navigation.push('ChangeProduct', { product });
   };

   const handleOpenContributions = () => {
      navigation.push('ProductContributions', { product });
   };

   return (
      <ActionListSection name="actions">
         {status && (
            <ActionListItem
               name="product-history"
               render={() => (
                  <ActionButtonLink
                     title="Show contributions"
                     textStyles={{ color: theme.colors.primary }}
                     icon="arrow"
                     onPress={handleOpenContributions}
                  />
               )}
            />
         )}
         {status && !status.readOnly && (
            <ActionListItem
               name="product-edit"
               render={() => (
                  <ActionButtonLink
                     title="Propose changes"
                     onPress={handleChange}
                     textStyles={{ color: theme.colors.primary }}
                     icon="arrow"
                  />
               )}
            />
         )}
      </ActionListSection>
   );
}
