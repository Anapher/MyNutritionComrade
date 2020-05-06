import { RootState } from 'MyNutritionComrade';
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Divider, Surface, TouchableRipple, useTheme, overlay } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as selectors from '../selectors';
import DateControls from './DateControls';
import NutritionSummary from './NutritionSummary';
import NutritionGoalOverview from './NutritionGoalOverview';
import { sumNutritions } from 'src/utils/product-utils';

const mapStateToProps = (state: RootState) => ({
    consumedProducts: selectors.getConsumedProducts(state),
    selectedDate: state.diary.selectedDate,
    nutritionGoal: state.diary.nutritionGoal,
});

const dispatchProps = {
    loadDate: actions.setSelectedDate.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function DiaryHeader({ consumedProducts, selectedDate, loadDate, nutritionGoal }: Props) {
    const [showGoals, setShowGoals] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const handleToggleGoals = () => {
        setShowGoals(!showGoals);
        Animated.timing(animation, { toValue: showGoals ? 0 : 1, duration: 250 }).start();
    };

    const nutritions = sumNutritions(consumedProducts.map((x) => x.nutritionalInfo));

    return (
        <Surface style={styles.surface}>
            <DateControls selectedDate={selectedDate} onChange={(d) => loadDate(d)} />
            <Divider />
            <TouchableRipple style={styles.summary} onPress={handleToggleGoals}>
                <View>
                    <Animated.View
                        style={{ opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}
                    >
                        <NutritionSummary nutritions={nutritions} />
                    </Animated.View>
                    <Animated.View style={[styles.overlay, { opacity: animation }]}>
                        <NutritionGoalOverview nutritionGoal={nutritionGoal} nutritions={nutritions} />
                    </Animated.View>
                </View>
            </TouchableRipple>
        </Surface>
    );
}

export default connect(mapStateToProps, dispatchProps)(DiaryHeader);

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
