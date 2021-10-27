import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import jwtDecode from 'jwt-decode';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { signOut } from '../../reducer';
import { selectAuthInfo } from '../../selectors';

export default function AccountSettingsItem() {
   const { t } = useTranslation();
   const authInfo = useSelector(selectAuthInfo);
   const showActionSheet = useActionSheetWrapper();
   const dispatch = useDispatch();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const handleShowOptions = () => {
      showActionSheet([
         { label: t('settings.account.sign_out'), destructive: true, onPress: () => dispatch(signOut()) },
         CancelButton(),
      ]);
   };

   const handleSignIn = () => {
      navigation.push('Login', {});
   };

   if (!authInfo) {
      return <SettingsButtonLink title={t('settings.account.sign_in')} onPress={handleSignIn} icon="arrow" />;
   }

   const isAdmin = isUserAdmin(authInfo.token);
   return (
      <SettingsButtonLink
         title={t('settings.account.title')}
         style={{ backgroundColor: '#e74d3c5a' }}
         secondary={`${authInfo?.email}` + (isAdmin ? ' - ADMIN' : '')}
         onPress={handleShowOptions}
         icon="arrow"
         showSecondaryBelow
      />
   );
}

function isUserAdmin(token: string) {
   const result = jwtDecode(token) as any;
   return result.rol === 'admin';
}
