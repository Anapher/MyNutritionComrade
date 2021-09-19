import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, Subheading, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import TextToggleButton from 'src/components/TextToggleButton';
import { setPersonalInfo } from '../../reducer';
import { selectPersonalInfo } from '../../selectors';
import { UserPersonalInfo } from '../../types';
import NumberTextInput from '../NumberTextInput';
import { calculateAge } from './utils';

export default function PersonalInfo() {
   const dispatch = useDispatch();
   const { t } = useTranslation();

   const values = useSelector(selectPersonalInfo);

   const handleChange = (changed: Partial<UserPersonalInfo>) => {
      dispatch(setPersonalInfo({ ...values, ...changed }));
   };

   const age = values.birthday ? calculateAge(values.birthday) : undefined;

   return (
      <View style={styles.root}>
         <Caption style={styles.privacyNotice}>{t('settings.personal_info.privacy_notice')}</Caption>
         <Subheading>{t('settings.personal_info.gender')}</Subheading>
         <View style={styles.toggleContainer}>
            <TextToggleButton
               isChecked={values.gender === 'female'}
               isLeft
               onToggle={() => handleChange({ gender: 'female' })}
               style={styles.toggleButton}
            >
               <Text>{t('settings.personal_info.female')}</Text>
            </TextToggleButton>
            <TextToggleButton
               isChecked={values.gender === 'male'}
               isRight
               onToggle={() => handleChange({ gender: 'male' })}
               style={[styles.toggleButton, styles.toggleButtonRight]}
            >
               <Text>{t('settings.personal_info.male')}</Text>
            </TextToggleButton>
         </View>
         <NumberTextInput
            style={styles.viewItem}
            label="Height (cm)"
            value={values.height !== undefined ? values.height * 100 : undefined}
            onChangeValue={(x) => handleChange({ height: x ? x / 100 : undefined })}
         />
         <NumberTextInput
            style={styles.viewItem}
            label="Age"
            value={age}
            onChangeValue={(years) =>
               handleChange({ birthday: years ? DateTime.utc().minus({ years }).toISODate() : undefined })
            }
         />
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      padding: 16,
   },
   privacyNotice: {
      marginBottom: 16,
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
