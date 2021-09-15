import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDate } from '../reducer';
import { getSelectedDate, selectConsumedPortions } from '../selectors';

export default function TabDiary() {
   const dispatch = useDispatch();

   const selectedDate = useSelector(getSelectedDate);
   const consumedPortions = useSelector(selectConsumedPortions);

   useEffect(() => {
      if (!selectedDate) {
         dispatch(setSelectedDate(DateTime.now().toISODate()));
      }
   }, [selectedDate, dispatch]);

   return (
      <View>
         <Text>Selected date: {selectedDate}</Text>
         <Text>Consumed: {JSON.stringify(consumedPortions)}</Text>
      </View>
   );
}
