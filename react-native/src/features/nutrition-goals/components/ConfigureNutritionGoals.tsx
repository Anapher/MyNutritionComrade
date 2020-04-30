import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { UserNutritionGoal } from 'Models';
import Accordion from 'react-native-collapsible/Accordion';
import { Text, TouchableRipple, useTheme, Divider, overlay } from 'react-native-paper';
import ConfigureCalories, { defaultValue as defaultValueCalories } from './ConfigureCalories';
import ConfigureNutritentDistribution from './ConfigureNutrientDistribution';
import ConfigureProtein, { defaultValue as defaultValueProtein } from './ConfigureProtein';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    initialValue: UserNutritionGoal;
};

function SectionHeader({ text, onPress, active }: { text: string; onPress: () => void; active: boolean }) {
    const theme = useTheme();

    return (
        <View>
            <TouchableRipple
                style={[styles.sectionHeader, active && { backgroundColor: theme.colors.accent }]}
                onPress={onPress}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{text}</Text>
                    {active && <Icon name="check" size={20} style={{ color: theme.colors.text }} />}
                </View>
            </TouchableRipple>
            <Divider />
        </View>
    );
}

export type GoalConfigProps = {
    data: UserNutritionGoal;
    onChange: (data: UserNutritionGoal) => void;
};

const sections: {
    type: keyof UserNutritionGoal;
    label: string;
    defaultValue: any;
    render: React.ComponentType<GoalConfigProps>;
}[] = [
    {
        type: 'calories',
        label: 'Calories',
        defaultValue: defaultValueCalories,
        render: ConfigureCalories,
    },
    {
        type: 'protein',
        label: 'Protein',
        defaultValue: defaultValueProtein,
        render: ConfigureProtein,
    },
    {
        type: 'distribution',
        label: 'Nutrient Distribution',
        defaultValue: { type: 'proportionalDistribution', carbohydrates: 0.5, protein: 0.3, fat: 0.2 },
        render: ConfigureNutritentDistribution,
    },
];

function ConfigureNutritionGoals({ initialValue }: Props) {
    const [value, setValue] = useState(initialValue);

    return (
        <ScrollView>
            <Accordion
                activeSections={sections
                    .map((d, i) => ({ d, i }))
                    .filter((x) => value[x.d.type] !== undefined)
                    .map((x) => x.i)}
                sections={sections}
                renderSectionTitle={() => null as any}
                renderHeader={(item, i, active) => (
                    <SectionHeader
                        active={active}
                        text={item.label}
                        onPress={() =>
                            setValue({
                                ...value,
                                [item.type]: value[item.type] === undefined ? item.defaultValue : undefined,
                            })
                        }
                    />
                )}
                renderContent={(content) => <content.render data={value} onChange={(x) => setValue(x)} />}
                onChange={(x) => {}}
                expandMultiple
            />
        </ScrollView>
    );
}

export default ConfigureNutritionGoals;

const styles = StyleSheet.create({
    sectionHeader: {
        padding: 16,
    },
});
