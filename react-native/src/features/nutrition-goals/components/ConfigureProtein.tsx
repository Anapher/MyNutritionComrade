import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { ProteinByBodyweightNutritionGoal, ProteinFixedNutritionGoal } from 'Models';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Divider, Portal, RadioButton } from 'react-native-paper';
import { GoalConfigProps } from './ConfigureNutritionGoals';
import DialogActionButton from './DialogActionButton';
import NumberTextInput from './NumberTextInput';

const referenceProteinPerKgBodyweight = [
    {
        title: 'Build/maintain muscles',
        description: '1.4 - 2.0 g/kg/d',
        value: 1.8,
    },
    {
        title: 'Loose weight without muscles',
        description:
            '2.3 - 3.1 g/kg/d may be needed to maximize the retention of lean body mass in resistance-trained subjects during hypocaloric periods.',
        value: 2.6,
    },
];

const defaultFixedProtein: ProteinFixedNutritionGoal = { type: 'proteinFixed', proteinPerDay: 120 };
const defaultProteinByBodyweight: ProteinByBodyweightNutritionGoal = {
    type: 'proteinByBodyweight',
    proteinPerKgBodyweight: referenceProteinPerKgBodyweight[0].value,
};

const FixedProteinView = ({
    data,
    onChange,
}: {
    data: ProteinFixedNutritionGoal;
    onChange: (x: ProteinFixedNutritionGoal) => void;
}) => (
    <View style={styles.formContainer}>
        <NumberTextInput
            value={data.proteinPerDay}
            label="Protein g/d"
            onChangeValue={(x) => onChange({ ...data, proteinPerDay: x })}
        />
    </View>
);

const ProteinByBodyweightView = ({
    data,
    onChange,
}: {
    data: ProteinByBodyweightNutritionGoal;
    onChange: (x: ProteinByBodyweightNutritionGoal) => void;
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <View style={styles.formContainer}>
            <View style={[styles.linearView, { alignItems: 'flex-end' }]}>
                <NumberTextInput
                    style={styles.flex}
                    label="Protein g/kg/d"
                    value={data.proteinPerKgBodyweight}
                    onChangeValue={(x) => onChange({ ...data, proteinPerKgBodyweight: x })}
                />
                <Button mode="outlined" style={{ marginLeft: 16 }} onPress={() => setDialogOpen(true)}>
                    References
                </Button>
            </View>
            <Portal>
                <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
                    <Dialog.Title>Select your goal</Dialog.Title>
                    <View>
                        {referenceProteinPerKgBodyweight.map((x, i) => (
                            <DialogActionButton
                                key={x.title}
                                title={x.title}
                                description={x.description}
                                divider={i > 0}
                                onPress={() => {
                                    onChange({ ...data, proteinPerKgBodyweight: x.value });
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

const ConfigureProtein = ({ data, onChange }: GoalConfigProps) => {
    const theme = useTheme();
    /** ugly fix for radio button */
    theme.colors.primary = theme.colors.text;

    const handleOnChange = (protein: any) => {
        onChange({ ...data, protein });
    };

    return (
        <View>
            <View style={styles.linearView}>
                <View style={styles.flex}>
                    <RadioButton.Item
                        theme={theme}
                        label="Fixed value"
                        status={data.protein?.type === 'proteinFixed' ? 'checked' : 'unchecked'}
                        value="proteinFixed"
                        onPress={() => handleOnChange(defaultFixedProtein)}
                    />
                </View>
                <View style={styles.flex}>
                    <RadioButton.Item
                        theme={theme}
                        label="Calculate"
                        status={data.protein?.type === 'proteinByBodyweight' ? 'checked' : 'unchecked'}
                        value="proteinByBodyweight"
                        onPress={() => handleOnChange(defaultProteinByBodyweight)}
                    />
                </View>
            </View>
            <Divider style={{ backgroundColor: Color(theme.colors.text).alpha(0.5).string() }} />
            {data.protein?.type === 'proteinFixed' ? (
                <FixedProteinView data={data.protein} onChange={handleOnChange} />
            ) : data.protein?.type === 'proteinByBodyweight' ? (
                <ProteinByBodyweightView data={data.protein} onChange={handleOnChange} />
            ) : null}
        </View>
    );
};

export default ConfigureProtein;

export const defaultValue = defaultProteinByBodyweight;

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
});
