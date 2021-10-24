import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RootNavigatorParamList } from 'src/RootNavigator';
import ProductOverview from './ProductOverview';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'ProductOverview'>;
};

export default function ProductOverviewScreen({
   route: {
      params: { product, contributionStatus },
   },
   navigation,
}: Props) {
   const { t } = useTranslation();

   useLayoutEffect(() => {
      navigation.setOptions({
         title: t('product_label', { product }),
      });
   });

   return <ProductOverview product={product} contributionStatus={contributionStatus} />;
}
