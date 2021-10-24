import { useActionSheet } from '@expo/react-native-action-sheet';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Caption } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsList from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/Items/SettingsNumberInput';
import { setPersonalInfo } from '../../reducer';
import { selectPersonalInfo } from '../../selectors';
import { UserPersonalInfo } from '../../types';
import { calculateAge } from './utils';

export default function PersonalInfo() {
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const { showActionSheetWithOptions } = useActionSheet();

   const values = useSelector(selectPersonalInfo);

   const handleChange = (changed: Partial<UserPersonalInfo>) => {
      dispatch(setPersonalInfo({ ...values, ...changed }));
   };

   const age = values.birthday ? calculateAge(values.birthday) : undefined;

   const handlePressGender = () => {
      showActionSheetWithOptions(
         {
            options: [t(`settings.personal_info.female`), t(`settings.personal_info.male`), t('cancel')],
            cancelButtonIndex: 2,
            userInterfaceStyle: 'dark',
         },
         (i) => {
            if (i > 1) return;
            handleChange({ gender: i === 0 ? 'female' : 'male' });
         },
      );
   };

   return (
      <SettingsList
         settings={[
            {
               settings: [
                  {
                     key: 'gender',
                     render: () => (
                        <SettingsButtonLink
                           onPress={handlePressGender}
                           title={t('settings.personal_info.gender')}
                           secondary={
                              values.gender ? t(`settings.personal_info.${values.gender}`) : t('settings.not_set')
                           }
                           formLayout
                        />
                     ),
                  },
                  {
                     key: 'height',
                     render: () => (
                        <SettingsNumberInput
                           title={t('settings.personal_info.height')}
                           value={values.height !== undefined ? values.height * 100 : undefined}
                           onChangeValue={(x) => handleChange({ height: x ? x / 100 : undefined })}
                           placeholder={t('settings.personal_info.enter_height')}
                        />
                     ),
                  },
                  {
                     key: 'age',
                     render: () => (
                        <SettingsNumberInput
                           title={t('settings.personal_info.age')}
                           value={age}
                           onChangeValue={(years) =>
                              handleChange({
                                 birthday: years ? DateTime.utc().minus({ years }).toISODate() : undefined,
                              })
                           }
                           placeholder={t('settings.personal_info.enter_age')}
                        />
                     ),
                  },
               ],
            },
         ]}
         ListFooterComponent={() => (
            <Caption style={styles.privacyNotice}>{t('settings.personal_info.privacy_notice')}</Caption>
         )}
      />
   );
}

const styles = StyleSheet.create({
   privacyNotice: {
      margin: 24,
      marginTop: 0,
   },
   toggleContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
   },
   toggleButton: {
      width: 96,
   },
   toggleButtonRight: {
      marginLeft: 2,
   },
   viewItem: {
      marginTop: 16,
   },
});
