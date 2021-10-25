import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';
import SettingsList from 'src/components/Settings/SettingsList';
import StatusIndicator from 'src/components/StatusIndicator';
import api from 'src/services/api';
import { Product, ProductContributionDto, ProductContributionStatusDto } from 'src/types';
import ProductOverviewActions from './ProductOverviewActions';
import ProductOverviewCommon from './ProductOverviewCommon';
import ProductOverviewLabels from './ProductOverviewLabels';
import ProductOverviewNutritions from './ProductOverviewNutritions';
import ProductOverviewServings from './ProductOverviewServings';

type Props = {
   product: Product;
   contributionStatus?: ProductContributionStatusDto | null;
};

export default function ProductOverview({ product, contributionStatus }: Props) {
   const [status, setStatus] = useState(contributionStatus);

   useEffect(() => {
      if (status === undefined) {
         (async () => {
            const result = await api.product.getContributionStatus(product.id);
            setStatus(result);
         })();
      }
   }, [status]);

   return (
      <View>
         <SettingsList
            settings={[
               ProductOverviewLabels(product),
               ProductOverviewNutritions(product),
               ProductOverviewCommon(product),
               ProductOverviewServings(product),
               ProductOverviewActions(product, status),
            ]}
         />
         <StatusIndicator status={status ? 'none' : 'loading'} />
      </View>
   );
}
