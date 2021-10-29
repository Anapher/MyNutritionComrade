import React from 'react';
import { ActionList, ActionListItem, ActionListSection } from 'src/components/ActionList';
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
      <ActionList>
         {ProductOverviewLabels(product)}
         {ProductOverviewNutritions(product)}
         {ProductOverviewCommon(product)}
         {ProductOverviewServings(product)}
         {ProductOverviewActions(product, contributionStatus)}
         <ActionListSection name="status">
            {loading && <ActionListItem name="status" render={() => <StatusIndicator status="loading" />} />}
         </ActionListSection>
      </ActionList>
   );
}
