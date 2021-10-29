import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ActionButtonLink } from 'src/components/ActionList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { selectPersonalInfo } from '../../selectors';
import { calculateAge } from './utils';

export default function SettingsItem() {
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const personalInfo = useSelector(selectPersonalInfo);

   const givenInfos = new Array<string>();
   if (personalInfo.gender) {
      givenInfos.push(t(`settings.personal_info.${personalInfo.gender}`));
   }
   if (personalInfo.birthday) {
      const age = calculateAge(personalInfo.birthday);
      givenInfos.push(t(`settings.personal_info.summary.years_old`, { age }));
   }
   if (personalInfo.height) {
      givenInfos.push(`${personalInfo.height * 100} cm`);
   }

   return (
      <ActionButtonLink
         title={t('settings.personal_info.title')}
         secondary={givenInfos.length > 0 ? givenInfos.join(' | ') : undefined}
         onPress={() => navigation.push('SettingsPersonalInfo')}
         icon="arrow"
         showSecondaryBelow
      />
   );
}
