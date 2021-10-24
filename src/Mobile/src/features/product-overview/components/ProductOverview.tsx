import React, { useEffect, useState } from 'react';
import SettingsList from 'src/components/Settings/SettingsList';
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
   contributions?: ProductContributionDto[];
};

export default function ProductOverview({ product, contributions, contributionStatus }: Props) {
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
      <SettingsList
         settings={[
            ProductOverviewLabels(product),
            ProductOverviewNutritions(product),
            ProductOverviewCommon(product),
            ProductOverviewServings(product),
            ProductOverviewActions(product, status),
         ]}
      />
   );
}
