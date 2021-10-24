import React from 'react';
import SettingsList from 'src/components/Settings/SettingsList';
import { Product, ProductContributionDto, ProductContributionStatusDto } from 'src/types';
import ProductOverviewLabels from './ProductOverviewLabels';

type Props = {
   product: Product;
   contributionStatus?: ProductContributionStatusDto | null;
   contributions?: ProductContributionDto[];
};

export default function ProductOverview({ product, contributions, contributionStatus }: Props) {
   return <SettingsList settings={[ProductOverviewLabels(product)]} />;
}
