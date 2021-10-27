import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { signOut } from '../../reducer';
import { selectAuthInfo } from '../../selectors';

export default function AccountSettingsItem() {
   const { t } = useTranslation();
   const authInfo = useSelector(selectAuthInfo);
   const { showActionSheetWithOptions } = useActionSheet();
   const dispatch = useDispatch();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const handleShowOptions = () => {
      showActionSheetWithOptions(
         {
            options: [t('settings.account.sign_out'), t('common:cancel')],
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
         },
         (index) => {
            if (index === 0) {
               dispatch(signOut());
            }
         },
      );
   };

   const handleSignIn = () => {
      navigation.push('Login', {});
   };

   if (!authInfo) {
      return <SettingsButtonLink title={t('settings.account.sign_in')} onPress={handleSignIn} icon="arrow" />;
   }

   return (
      <SettingsButtonLink
         title={t('settings.account.title')}
         secondary={`${authInfo?.email}`}
         onPress={handleShowOptions}
         icon="arrow"
         showSecondaryBelow
      />
   );
}