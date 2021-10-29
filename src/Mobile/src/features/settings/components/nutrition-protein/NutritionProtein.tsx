import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
   ActionButtonLink,
   ActionList,
   ActionListItem,
   ActionListSection,
   ActionNumberInput,
} from 'src/components/ActionList';
import { setNutritionGoal } from '../../reducer';
import { selectNutritionGoal } from '../../selectors';
import { UserNutritionGoal } from '../../types';

const presetProteinPerKg = [
   { key: 'build_maintain_muscle', amount: 1.8 },
   { key: 'loose_weight_without_muscles', amount: 2.6 },
];

export default function NutritionProtein() {
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const nutritionGoal = useSelector(selectNutritionGoal);
   const protein = nutritionGoal.protein;

   const handleChange = (values: Partial<UserNutritionGoal>) => {
      dispatch(setNutritionGoal({ ...nutritionGoal, ...values }));
   };

   const proteinFixedSelected = protein?.type === 'proteinFixed';
   const proteinByBodyweightSelected =
      protein?.type === 'proteinByBodyweight' &&
      !presetProteinPerKg.find((x) => x.amount === protein.proteinPerKgBodyweight);

   return (
      <ActionList>
         <ActionListSection name="selection">
            <ActionListItem
               name="protein-fixed"
               render={() => (
                  <ActionButtonLink
                     title={t('settings.protein.manual_protein_per_day')}
                     selectable
                     selected={proteinFixedSelected}
                     onPress={() => handleChange({ protein: { type: 'proteinFixed', proteinPerDay: 120 } })}
                  />
               )}
            />
            <ActionListItem
               name="protein-by-bodyweight"
               render={() => (
                  <ActionButtonLink
                     title={t('settings.protein.manual_protein_per_kg')}
                     selectable
                     selected={proteinByBodyweightSelected}
                     onPress={() =>
                        handleChange({ protein: { type: 'proteinByBodyweight', proteinPerKgBodyweight: 2 } })
                     }
                  />
               )}
            />
            {presetProteinPerKg.map(({ key, amount }) => (
               <ActionListItem
                  key={key}
                  name={key}
                  render={() => (
                     <ActionButtonLink
                        title={t(`settings.protein.${key}`)}
                        secondary={t(`settings.protein.${key}_description`)}
                        showSecondaryBelow
                        selectable
                        selected={protein?.type === 'proteinByBodyweight' && protein.proteinPerKgBodyweight === amount}
                        onPress={() =>
                           handleChange({ protein: { type: 'proteinByBodyweight', proteinPerKgBodyweight: amount } })
                        }
                     />
                  )}
               />
            ))}
            <ActionListItem
               name="none"
               render={() => (
                  <ActionButtonLink
                     title={t('settings.protein.none')}
                     selectable
                     selected={!protein}
                     onPress={() => handleChange({ protein: undefined })}
                  />
               )}
            />
         </ActionListSection>

         {proteinFixedSelected && (
            <ActionListSection name="protein-fixed-selection">
               <ActionListItem
                  name="selection"
                  render={() => (
                     <ActionNumberInput
                        title={t('settings.protein.protein_per_day') + ':'}
                        value={protein.proteinPerDay || undefined}
                        onChangeValue={(x) =>
                           handleChange({ protein: { type: 'proteinFixed', proteinPerDay: x ?? 0 } })
                        }
                     />
                  )}
               />
            </ActionListSection>
         )}
         {proteinByBodyweightSelected && (
            <ActionListSection name="protein-by-bodyweight-selection">
               <ActionListItem
                  name="selection"
                  render={() => (
                     <ActionNumberInput
                        title={t('settings.protein.protein_per_day_kg') + ':'}
                        value={protein.proteinPerKgBodyweight || undefined}
                        onChangeValue={(x) =>
                           handleChange({ protein: { type: 'proteinByBodyweight', proteinPerKgBodyweight: x ?? 0 } })
                        }
                     />
                  )}
               />
            </ActionListSection>
         )}
      </ActionList>
   );
}
