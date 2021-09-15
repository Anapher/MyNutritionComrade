import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../reducer';
import { getSelectedDate, selectConsumedPortions } from '../selectors';
import ConsumedFoodList from './ConsumedFoodList';
import TabDiaryHeader from './TabDiaryHeader';

export default function TabDiary() {
   const dispatch = useDispatch();

   const selectedDate = useSelector(getSelectedDate);
   const consumedPortions = useSelector(selectConsumedPortions);

   useEffect(() => {
      if (!selectedDate) {
         dispatch(setSelectedDate(DateTime.now().toISODate()));
      }
   }, [selectedDate, dispatch]);

   const handleChangeSelectedDate = (newDate: string) => dispatch(setSelectedDate(newDate));

   if (!selectedDate) return null;

   return (
      <View style={styles.root}>
         <TabDiaryHeader
            selectedDate={selectedDate}
            consumedFood={consumedPortions ?? []}
            onChangeSelectedDate={handleChangeSelectedDate}
         />
         {consumedPortions && (
            <ConsumedFoodList style={styles.list} consumedFood={consumedPortions} selectedDate={selectedDate} />
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
   },
   list: {
      flex: 1,
   },
});
