import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ActionList, ActionListItem, ActionListSection, ActionNumberInput } from 'src/components/ActionList';
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
      <ActionList>
         <ActionListSection name="default">
            <ActionListItem
               name="weight"
               render={() => (
                  <ActionNumberInput
                     title={t('settings.weight.current_weight')}
                     value={weightInfo.currentWeight}
                     placeholder={t('settings.weight.enter_here')}
                     onChangeValue={handleChange}
                  />
               )}
            />
         </ActionListSection>
      </ActionList>
   );
}
