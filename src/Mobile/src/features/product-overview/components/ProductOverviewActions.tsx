import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { Product, ProductContributionStatusDto } from 'src/types';

export default function ProductOverviewActions(
   product: Product,
   status: ProductContributionStatusDto | undefined | null,
): SettingsSection {
   const theme = useTheme();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const handleChange = () => {
      navigation.push('ChangeProduct', { product });
   };

   const handleOpenContributions = () => {
      navigation.push('ProductContributions', { product });
   };

   return {
      settings: [
         status && {
            key: 'product-history',
            render: () => (
               <SettingsButtonLink
                  title="Show contributions"
                  textStyles={{ color: theme.colors.primary }}
                  icon="arrow"
                  onPress={handleOpenContributions}
               />
            ),
         },
         !status?.readOnly && {
            key: 'product-edit',
            render: () => (
               <SettingsButtonLink
                  title="Propose changes"
                  onPress={handleChange}
                  textStyles={{ color: theme.colors.primary }}
                  icon="arrow"
               />
            ),
         },
      ].filter((x): x is SettingsItem => !!x),
   };
}
