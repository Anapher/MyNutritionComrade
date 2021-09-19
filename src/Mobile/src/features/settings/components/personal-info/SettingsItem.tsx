import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectPersonalInfo } from '../../selectors';
import SettingsButton from '../SettingsButton';
import { SettingsNavigatorParamList } from '../SettingsScreen';
import { calculateAge } from './utils';

export default function SettingsItem() {
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<SettingsNavigatorParamList>>();
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
      <SettingsButton
         title={t('settings.personal_info.title')}
         caption={givenInfos.length > 0 ? givenInfos.join(' | ') : undefined}
         onPress={() => navigation.push('PersonalInfo')}
      />
   );
}
