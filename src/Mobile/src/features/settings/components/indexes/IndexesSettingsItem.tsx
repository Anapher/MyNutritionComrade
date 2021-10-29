import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButtonLink } from 'src/components/ActionList';
import config from 'src/config';
import { RootNavigatorParamList } from 'src/RootNavigator';

export default function IndexesSettingsItem() {
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   return (
      <ActionButtonLink
         title={t('settings.indexes.title')}
         secondary={`${config.productRepositories.length} found`}
         onPress={() => navigation.push('IndexesOverview')}
         icon="arrow"
      />
   );
}
