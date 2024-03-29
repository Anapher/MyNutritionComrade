import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Caption } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
   ActionButtonLink,
   ActionList,
   ActionListItem,
   ActionListSection,
   ActionNumberInput,
} from 'src/components/ActionList';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { setPersonalInfo } from '../../reducer';
import { selectPersonalInfo } from '../../selectors';
import { UserPersonalInfo } from '../../types';
import { calculateAge } from './utils';

export default function PersonalInfo() {
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const showActionSheet = useActionSheetWrapper();

   const values = useSelector(selectPersonalInfo);

   const handleChange = (changed: Partial<UserPersonalInfo>) => {
      dispatch(setPersonalInfo({ ...values, ...changed }));
   };

   const age = values.birthday ? calculateAge(values.birthday) : undefined;

   const handlePressGender = () => {
      showActionSheet([
         { label: t(`settings.personal_info.female`), onPress: () => handleChange({ gender: 'female' }) },
         { label: t(`settings.personal_info.male`), onPress: () => handleChange({ gender: 'male' }) },
         CancelButton(),
      ]);
   };

   return (
      <ActionList
         ListFooterComponent={() => (
            <Caption style={styles.privacyNotice}>{t('settings.personal_info.privacy_notice')}</Caption>
         )}
      >
         <ActionListSection name="default">
            <ActionListItem
               name="gender"
               render={() => (
                  <ActionButtonLink
                     onPress={handlePressGender}
                     title={t('settings.personal_info.gender')}
                     secondary={values.gender ? t(`settings.personal_info.${values.gender}`) : t('settings.not_set')}
                     formLayout
                  />
               )}
            />
            <ActionListItem
               name="height"
               render={() => (
                  <ActionNumberInput
                     title={t('settings.personal_info.height')}
                     value={values.height !== undefined ? values.height * 100 : undefined}
                     onChangeValue={(x) => handleChange({ height: x ? x / 100 : undefined })}
                     placeholder={t('settings.personal_info.enter_height')}
                  />
               )}
            />
            <ActionListItem
               name="age"
               render={() => (
                  <ActionNumberInput
                     title={t('settings.personal_info.age')}
                     value={age}
                     onChangeValue={(years) =>
                        handleChange({
                           birthday: years ? DateTime.utc().minus({ years }).toISODate() : undefined,
                        })
                     }
                     placeholder={t('settings.personal_info.enter_age')}
                  />
               )}
            />
         </ActionListSection>
      </ActionList>
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
