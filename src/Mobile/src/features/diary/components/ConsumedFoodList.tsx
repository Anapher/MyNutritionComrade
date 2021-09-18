import { NavigationProp, useNavigation } from '@react-navigation/core';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, SectionListData, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Divider, Portal } from 'react-native-paper';
import FoodPortionHeader from 'src/components-domain/FoodPortionHeader';
import { ConsumptionTimes } from 'src/consts';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ConsumedPortion, ConsumptionTime } from 'src/types';
import { getConsumedPortionId } from 'src/utils/product-utils';
import { addConsumption } from '../actions';
import ConsumedFoodItem from './ConsumedFoodItem';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';
import FoodPortionDialog, { ShowOptionsInfo } from './FoodPortionDialog';

type Props = {
   style?: StyleProp<ViewStyle>;
   consumedFood: ConsumedPortion[];
   selectedDate: string;
};

export default function ConsumedFoodList({ style, consumedFood, selectedDate }: Props) {
   const { t } = useTranslation();
   const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
   const [foodPortionOptions, setFoodPortionOptions] = useState<ShowOptionsInfo | undefined>();

   const sections = useMemo(
      () =>
         ConsumptionTimes.map<SectionListData<ConsumedPortion>>((time) => ({
            time,
            data: consumedFood.filter((x) => x.time === time),
            key: time,
         })),
      [consumedFood],
   );

   const handleAddFood = (time: ConsumptionTime) => {
      navigation.navigate('SearchProduct', {
         config: { consumptionTime: time, date: selectedDate },
         onCreatedPop: 1,
         onCreatedAction: addConsumption({ date: selectedDate, time, append: true, creationDto: null as any }) as any,
      });
   };

   const handleScanBarcode = (time: ConsumptionTime) => {};

   return (
      <>
         <SectionList
            style={style}
            sections={sections}
            keyExtractor={getConsumedPortionId}
            stickySectionHeadersEnabled={false}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => <ConsumedFoodItem consumed={item} showOptions={setFoodPortionOptions} />}
            renderSectionHeader={({ section: { key } }) => {
               const section = sections.find((x) => x.key === key)!;
               return (
                  <FoodPortionHeader
                     foodPortions={section.data.map((x) => x.foodPortion)}
                     header={t(`consumption_time.${section.time}`)}
                     style={styles.sectionHeader}
                  />
               );
            }}
            renderSectionFooter={({ section }) => (
               <ConsumptionTimeFooter
                  style={styles.sectionFooter}
                  section={section}
                  onAddFood={() => handleAddFood(section.time)}
                  onScanBarcode={() => handleScanBarcode(section.time)}
               />
            )}
         />
         <Portal>
            <FoodPortionDialog value={foodPortionOptions} onDismiss={() => setFoodPortionOptions(undefined)} />
         </Portal>
      </>
   );
}

const styles = StyleSheet.create({
   sectionHeader: {
      marginTop: 8,
   },
   sectionFooter: {
      marginBottom: 8,
   },
});
