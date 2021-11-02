import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, SectionListData, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import FoodPortionHeader from 'src/components-domain/FoodPortionHeader';
import { ConsumptionTimes } from 'src/consts';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ConsumedPortion, ConsumptionTime } from 'src/types';
import { getConsumedPortionId } from 'src/utils/food-portion-utils';
import { createActionTemplate } from 'src/utils/redux-utils';
import { addConsumption, barcodeScannedAddProduct } from '../actions';
import ConsumedFoodItem from './ConsumedFoodItem';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';

type Props = {
   style?: StyleProp<ViewStyle>;
   consumedFood: ConsumedPortion[];
   selectedDate: string;
};

export default function ConsumedFoodList({ style, consumedFood, selectedDate }: Props) {
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

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
         config: { scoreBy: { time, date: selectedDate } },
         onCreatedPop: 1,
         onCreatedAction: createActionTemplate(addConsumption, { date: selectedDate, time, append: true }),
      });
   };

   const handleScanBarcode = (time: ConsumptionTime) => {
      navigation.navigate('ScanBarcode', {
         keepOpen: true,
         showCodeScannedAnimation: true,
         onCodeScanned: (result) =>
            dispatch(barcodeScannedAddProduct({ date: selectedDate, time, result, navigation })),
      });
   };

   return (
      <SectionList
         style={style}
         sections={sections}
         keyExtractor={getConsumedPortionId}
         stickySectionHeadersEnabled={false}
         ItemSeparatorComponent={() => <Divider />}
         renderItem={({ item }) => <ConsumedFoodItem consumed={item} />}
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
