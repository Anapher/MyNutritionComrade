import { useMemo } from 'hoist-non-react-statics/node_modules/@types/react';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Divider, Surface, TouchableRipple } from 'react-native-paper';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionNutritions } from 'src/utils/food-portion-utils';
import { sumNutritions } from 'src/utils/nutrition-utils';
import DateControls from './DateControls';
import NutritionSummary from './NutritionSummary';

type Props = {
   selectedDate: string;
   onChangeSelectedDate: (newDate: string) => void;
   consumedFood: ConsumedPortion[];
};

export default function TabDiaryHeader({ selectedDate, onChangeSelectedDate, consumedFood }: Props) {
   const [showGoals, setShowGoals] = useState(false);
   const animation = useRef(new Animated.Value(0)).current;

   const handleToggleGoals = () => {
      setShowGoals(!showGoals);
      Animated.timing(animation, { toValue: showGoals ? 0 : 1, duration: 250, useNativeDriver: true }).start();
   };

   const nutritions = useMemo(
      () => sumNutritions(consumedFood.map((x) => getFoodPortionNutritions(x.foodPortion))),
      [consumedFood],
   );

   return (
      <Surface style={styles.surface}>
         <DateControls selectedDate={selectedDate} onChange={onChangeSelectedDate} />
         <Divider />
         <TouchableRipple style={styles.summary} onPress={handleToggleGoals}>
            <View>
               <Animated.View style={{ opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
                  <NutritionSummary nutritions={nutritions} />
               </Animated.View>
               {/* <Animated.View style={[styles.overlay, { opacity: animation }]}>
                  <NutritionGoalOverview nutritionGoal={nutritionGoal} nutritions={nutritions} />
               </Animated.View> */}
            </View>
         </TouchableRipple>
      </Surface>
   );
}

const styles = StyleSheet.create({
   surface: {
      elevation: 12,
   },
   summary: {
      paddingVertical: 8,
   },
   overlay: {
      position: 'absolute',
      height: '100%',
      width: '100%',
   },
});
