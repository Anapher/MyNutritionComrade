import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsList from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/Items/SettingsNumberInput';
import { setWeight } from '../../reducer';
import { selectWeightInfo } from '../../selectors';

export default function Weight() {
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const weightInfo = useSelector(selectWeightInfo);

   const handleChange = (newValue: number | undefined) => {
      dispatch(setWeight({ ...weightInfo, currentWeight: newValue }));
   };

   return (
      <SettingsList
         settings={[
            {
               settings: [
                  {
                     key: 'weight',
                     render: () => (
                        <SettingsNumberInput
                           title={t('settings.weight.current_weight')}
                           value={weightInfo.currentWeight}
                           placeholder={t('settings.weight.enter_here')}
                           onChangeValue={handleChange}
                        />
                     ),
                  },
               ],
            },
         ]}
      ></SettingsList>
   );
}
