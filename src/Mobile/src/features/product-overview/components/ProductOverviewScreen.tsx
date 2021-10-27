import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { initialize, uninitialize } from '../reducer';
import { selectCurrentProduct, selectLoading, selectProductContributionStatus } from '../selectors';
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
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(initialize({ product, contributionStatus }));

      return () => {
         // required because else on every product index update, the sagas
         // will check for changes and make web requests if required
         dispatch(uninitialize());
      };
   }, [product]);

   product = useSelector(selectCurrentProduct) ?? product;
   contributionStatus = useSelector(selectProductContributionStatus) ?? contributionStatus;
   const loading = useSelector(selectLoading);

   useLayoutEffect(() => {
      navigation.setOptions({
         title: t('product_label', { product }),
      });
   }, [product]);

   return <ProductOverview product={product} contributionStatus={contributionStatus} loading={loading} />;
}
