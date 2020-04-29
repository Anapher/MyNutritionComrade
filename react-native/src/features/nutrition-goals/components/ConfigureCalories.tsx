import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Text,
    RadioButton,
    useTheme,
    TextInput,
    Divider,
    Caption,
    Button,
    Portal,
    Dialog,
    Paragraph,
    TouchableRipple,
    Subheading,
} from 'react-native-paper';
import { UserNutritionGoal, CaloriesFixedNutritionGoal, CaloriesMifflinStJeorNutritionGoal } from 'Models';
import { GoalConfigProps } from './ConfigureNutritionGoals';
import Color from 'color';
import DialogButton from 'src/components/DialogButton';

const FixedCaloriesView = ({
    data,
    onChange,
}: {
    data: CaloriesFixedNutritionGoal;
    onChange: (x: CaloriesFixedNutritionGoal) => void;
}) => (
    <View style={styles.formContainer}>
        <TextInput
            value={data.caloriesPerDay === 0 ? '' : data.caloriesPerDay.toString()}
            keyboardType="numeric"
            label="Daily calories"
            onChangeText={(x) => (x === '' || Number(x)) && onChange({ ...data, caloriesPerDay: Number(x) || 0 })}
        />
    </View>
);

const referencePalFactors = [
    {
        title: 'Sedentary',
        description: 'little to no exercise',
        value: 1.2,
    },
    {
        title: 'Lightly active',
        description: 'light exercise 1-3 days per week',
        value: 1.375,
    },
    {
        title: 'Moderately active',
        description: 'moderate exercise 3-5 days per week',
        value: 1.55,
    },
    {
        title: 'Very active',
        description: 'hard exercise 6-7 days per week',
        value: 1.725,
    },
    {
        title: 'Extra active',
        description: 'very hard exercise/training or physical job',
        value: 1.9,
    },
];

const CaloriesMifflinStJeorView = ({
    data,
    onChange,
}: {
    data: CaloriesMifflinStJeorNutritionGoal;
    onChange: (x: CaloriesMifflinStJeorNutritionGoal) => void;
}) => {
    const [currentValue, setCurrentValue] = useState(data.palFactor.toString());
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();

    return (
        <View>
            <Caption style={{ textAlign: 'center' }}>Calculated by the Mifflin-St. Jeor Equation</Caption>
            <Paragraph style={{ marginHorizontal: 8 }}>
                Please enter your average daily activity level. This factor will be multiplied with the amount of energy
                your body needs to maintain basic functions like breathing. If you are not sure, just select one of the
                reference values.
            </Paragraph>
            <View style={[styles.formContainer, styles.linearView, { alignItems: 'flex-end' }]}>
                <TextInput
                    style={styles.flex}
                    value={currentValue}
                    keyboardType="numeric"
                    label="Activity level"
                    onChangeText={(x) => {
                        const val = x.replace(',', '.');
                        setCurrentValue(val);
                        if (Number(val)) {
                            onChange({ ...data, palFactor: Number(val) });
                        }
                    }}
                />
                <Button mode="outlined" style={{ marginLeft: 16 }} onPress={() => setDialogOpen(true)}>
                    References
                </Button>
            </View>
            <Portal>
                <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
                    <Dialog.Title>Select your activity level</Dialog.Title>
                    <View>
                        {referencePalFactors.map((x, i) => (
                            <View key={x.title}>
                                {i > 0 && (
                                    <Divider
                                        style={{ backgroundColor: Color(theme.colors.text).alpha(0.5).string() }}
                                    />
                                )}
                                <TouchableRipple
                                    style={styles.dialogItem}
                                    onPress={() => {
                                        setCurrentValue(x.value.toString());
                                        onChange({ ...data, palFactor: x.value });
                                        setDialogOpen(false);
                                    }}
                                >
                                    <View>
                                        <Subheading>{x.title}</Subheading>
                                        <Caption>{x.description}</Caption>
                                    </View>
                                </TouchableRipple>
                            </View>
                        ))}
                    </View>
                </Dialog>
            </Portal>
        </View>
    );
};

const defaultFixedCalories: CaloriesFixedNutritionGoal = { type: 'caloriesFixed', caloriesPerDay: 2200 };
const defaultMifflinStJeor: CaloriesMifflinStJeorNutritionGoal = {
    type: 'caloriesMifflinStJeor',
    palFactor: 1.4,
    calorieBalance: 0,
    calorieOffset: 0,
};

const ConfigureCalories = ({ data, onChange }: GoalConfigProps) => {
    const theme = useTheme();
    /** ugly fix for radio button */
    theme.colors.primary = theme.colors.text;

    const handleOnChange = (calories: any) => {
        onChange({ ...data, calories });
    };

    return (
        <View>
            <View style={styles.linearView}>
                <View style={styles.flex}>
                    <RadioButton.Item
                        theme={theme}
                        label="Fixed value"
                        status={data.calories?.type === 'caloriesFixed' ? 'checked' : 'unchecked'}
                        value="caloriesFixed"
                        onPress={() => handleOnChange(defaultFixedCalories)}
                    />
                </View>
                <View style={styles.flex}>
                    <RadioButton.Item
                        theme={theme}
                        label="Calculate"
                        status={data.calories?.type === 'caloriesMifflinStJeor' ? 'checked' : 'unchecked'}
                        value="caloriesMifflinStJeor"
                        onPress={() => handleOnChange(defaultMifflinStJeor)}
                    />
                </View>
            </View>
            <Divider style={{ backgroundColor: Color(theme.colors.text).alpha(0.5).string() }} />
            {data.calories?.type === 'caloriesFixed' ? (
                <FixedCaloriesView data={data.calories} onChange={handleOnChange} />
            ) : data.calories?.type === 'caloriesMifflinStJeor' ? (
                <CaloriesMifflinStJeorView data={data.calories} onChange={handleOnChange} />
            ) : null}
        </View>
    );
};

export default ConfigureCalories;

const styles = StyleSheet.create({
    linearView: {
        display: 'flex',
        flexDirection: 'row',
    },
    flex: {
        flex: 1,
    },
    formContainer: {
        padding: 16,
    },
    dialogItem: {
        paddingVertical: 4,
        paddingHorizontal: 24,
    },
});
