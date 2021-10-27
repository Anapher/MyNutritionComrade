import React from 'react';
import { View } from 'react-native';
import SettingsList from 'src/components/Settings/SettingsList';
import StatusIndicator from 'src/components/StatusIndicator';
import { Product, ProductContributionStatusDto } from 'src/types';
import ProductOverviewActions from './ProductOverviewActions';
import ProductOverviewCommon from './ProductOverviewCommon';
import ProductOverviewLabels from './ProductOverviewLabels';
import ProductOverviewNutritions from './ProductOverviewNutritions';
import ProductOverviewServings from './ProductOverviewServings';

type Props = {
   product: Product;
   contributionStatus?: ProductContributionStatusDto | null;
   loading?: boolean;
};

export default function ProductOverview({ product, contributionStatus, loading }: Props) {
   return (
      <View>
         <SettingsList
            settings={[
               ProductOverviewLabels(product),
               ProductOverviewNutritions(product),
               ProductOverviewCommon(product),
               ProductOverviewServings(product),
               ProductOverviewActions(product, contributionStatus),
            ]}
         />
         <StatusIndicator status={loading ? 'none' : 'loading'} />
      </View>
   );
}
