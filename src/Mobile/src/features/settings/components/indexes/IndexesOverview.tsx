import { useActionSheet } from '@expo/react-native-action-sheet';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FullScreenError from 'src/components/FullScreenError';
import FullScreenLoading from 'src/components/FullScreenLoading';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsList from 'src/components/Settings/SettingsList';
import StatusIndicator from 'src/components/StatusIndicator';
import config from 'src/config';
import { updateRepository } from 'src/features/repo-manager/reducer';
import { selectInitializationResult, selectIsDownloadingIndexes } from 'src/features/repo-manager/selectors';
import { RepositoryStatistics } from 'src/services/product-index-factory';
import wrapActionSheet, { CancelButton } from 'src/utils/action-sheet-wrapper';

export default function IndexesOverview() {
   const dispatch = useDispatch();
   const initializationResult = useSelector(selectInitializationResult);
   const isUpdating = useSelector(selectIsDownloadingIndexes);
   const { t } = useTranslation();

   const { showActionSheetWithOptions } = useActionSheet();

   if (isUpdating && !initializationResult) {
      return <FullScreenLoading />;
   }

   if (!initializationResult) {
      return <FullScreenError errorMessage={t('settings.indexes.repositories_not_initialized')} />;
   }

   const handleRefresh = (key: string) => {
      wrapActionSheet(
         showActionSheetWithOptions,
         [
            {
               label: t('settings.indexes.refresh_repository'),
               onPress: () => {
                  dispatch(updateRepository(key));
               },
            },
            CancelButton(),
         ],
         { title: config.productRepositories.find((x) => x.key === key)!.url },
      );
   };

   return (
      <SettingsList
         settings={[
            {
               settings: config.productRepositories.map(({ key, url }) => ({
                  key,
                  render: () => (
                     <SettingsButtonLink
                        title={url}
                        titleSingleLine
                        showSecondaryBelow
                        secondary={getRepositoryDescription(t, initializationResult.repoStatistics[key])}
                        onPress={() => handleRefresh(key)}
                     />
                  ),
               })),
            },
            {
               settings: [
                  {
                     key: 'loading',
                     render: () => <View>{isUpdating && <StatusIndicator status="loading" />}</View>,
                  },
               ],
            },
         ]}
      />
   );
}

function getRepositoryDescription(t: TFunction, statistics?: RepositoryStatistics): string {
   if (!statistics) return t('settings.indexes.repository_not_initialized');

   const { catalogsCount, productsCount, lastUpdated } = statistics;

   return `${catalogsCount} ${t('catalog', { count: catalogsCount })}, ${productsCount} ${t('product', {
      count: productsCount,
   })} (${DateTime.fromISO(lastUpdated).toLocaleString(DateTime.DATETIME_SHORT)})`;
}
