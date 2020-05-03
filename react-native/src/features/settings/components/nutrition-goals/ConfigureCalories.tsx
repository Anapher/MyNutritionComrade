import Color from 'color';
import { CaloriesFixedNutritionGoal, CaloriesMifflinStJeorNutritionGoal } from 'Models';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Button,
    Caption,
    Dialog,
    Divider,
    Paragraph,
    Portal,
    RadioButton,
    Subheading,
    TextInput,
    useTheme,
} from 'react-native-paper';
import PaperSlider from 'src/components/PaperSlider';
import { GoalConfigProps } from './ConfigureNutritionGoals';
import DialogActionButton from './DialogActionButton';
import NumberTextInput from '../NumberTextInput';

const defaultFixedCalories: CaloriesFixedNutritionGoal = { type: 'caloriesFixed', caloriesPerDay: 2200 };
const defaultMifflinStJeor: CaloriesMifflinStJeorNutritionGoal = {
    type: 'caloriesMifflinStJeor',
    palFactor: 1.4,
    calorieBalance: 0,
    calorieOffset: 0,
};

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
            label="Daily calories (kcal)"
            onChangeText={(x) => (x === '' || Number(x)) && onChange({ ...data, caloriesPerDay: Number(x) || 0 })}
        />
    </View>
);

const CaloriesMifflinStJeorView = ({
    data,
    onChange,
}: {
    data: CaloriesMifflinStJeorNutritionGoal;
    onChange: (x: CaloriesMifflinStJeorNutritionGoal) => void;
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <View style={{ marginBottom: 16 }}>
            <Caption style={{ textAlign: 'center' }}>Calculated by the Mifflin-St. Jeor Equation</Caption>
            <Paragraph style={[styles.paragraph, { marginHorizontal: 16 }]}>
                Please enter your average daily activity level. This factor will be multiplied with the amount of energy
                your body needs to maintain basic functions like breathing. If you are not sure, just select one of the
                reference values.
            </Paragraph>
            <View style={[styles.formContainer, styles.linearView, { alignItems: 'flex-end' }]}>
                <NumberTextInput
                    style={styles.flex}
                    value={data.palFactor}
                    label="Activity level"
                    onChangeValue={(x) => onChange({ ...data, palFactor: x })}
                />
                <Button mode="outlined" style={{ marginLeft: 16 }} onPress={() => setDialogOpen(true)}>
                    References
                </Button>
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <Subheading>Balance</Subheading>
                <Paragraph style={styles.paragraph}>
                    The amount of calories that should be added to your calculated calorie intake. If you want to
                    maintain your weight, set to 0. To loose/gain, set to negative/positive number.
                </Paragraph>
            </View>
            <View style={{ marginTop: 8 }}>
                <PaperSlider
                    minimumValue={-1000}
                    maximumValue={1000}
                    step={50}
                    value={data.calorieBalance}
                    onValueChange={(x) => onChange({ ...data, calorieBalance: x })}
                    unit="kcal"
                />
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <Subheading>Error Corrrection</Subheading>
                <Paragraph style={styles.paragraph}>
                    Your calculated calories are just a rough guess. Use this slider to adjust the calories you need to
                    maintain your weight. This has the same effect like the balance slider.
                </Paragraph>
            </View>
            <View style={{ marginTop: 8 }}>
                <PaperSlider
                    minimumValue={-1000}
                    maximumValue={1000}
                    step={50}
                    value={data.calorieOffset}
                    onValueChange={(x) => onChange({ ...data, calorieOffset: x })}
                    unit="kcal"
                />
            </View>
            <Portal>
                <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
                    <Dialog.Title>Select your activity level</Dialog.Title>
                    <View>
                        {referencePalFactors.map((x, i) => (
                            <DialogActionButton
                                key={x.title}
                                title={x.title}
                                description={x.description}
                                divider={i > 0}
                                onPress={() => {
                                    onChange({ ...data, palFactor: x.value });
                                    setDialogOpen(false);
                                }}
                            />
                        ))}
                    </View>
                </Dialog>
            </Portal>
        </View>
    );
};

const ConfigureCalories = ({ data, onChange }: GoalConfigProps) => {
    const theme = useTheme();

    /** ugly fix for radio button */
    const fixedTheme = { ...theme, colors: { ...theme.colors, primary: theme.colors.text } };

    const handleOnChange = (calories: any) => {
        onChange({ ...data, calories });
    };

    return (
        <View>
            <View style={styles.linearView}>
                <View style={styles.flex}>
                    <RadioButton.Item
                        theme={fixedTheme}
                        label="Fixed value"
                        status={data.calories?.type === 'caloriesFixed' ? 'checked' : 'unchecked'}
                        value="caloriesFixed"
                        onPress={() => handleOnChange(defaultFixedCalories)}
                    />
                </View>
                <View style={styles.flex}>
                    <RadioButton.Item
                        theme={fixedTheme}
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
export const defaultValue = defaultMifflinStJeor;

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
    paragraph: {
        fontSize: 12,
        lineHeight: 16,
    },
});
