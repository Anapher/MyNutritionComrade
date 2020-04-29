import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { UserNutritionGoal } from 'Models';
import Accordion from 'react-native-collapsible/Accordion';
import { Text, TouchableRipple, useTheme, Divider, overlay } from 'react-native-paper';
import ConfigureCalories from './ConfigureCalories';
import ConfigureNutritentDistribution from './ConfigureNutritentDistribution';
import ConfigureProtein from './ConfigureProtein';

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
                <Text style={{ fontWeight: 'bold' }}>{text}</Text>
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
        defaultValue: { type: 'caloriesMifflinStJeor', palFactor: 2000, calorieBalance: 0, calorieOffset: 0 },
        render: ConfigureCalories,
    },
    {
        type: 'protein',
        label: 'Protein',
        defaultValue: { type: 'proteinByBodyweight', proteinPerKgBodyweight: 1.5 },
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
        <Accordion
            activeSections={sections
                .map((d, i) => ({ d, i }))
                .filter((x) => value[x.d.type] !== undefined)
                .map((x) => x.i)}
            sections={sections}
            renderSectionTitle={() => null}
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
        // <Accordion
        //     activeSections={[0]}
        //     sections={['Section 1', 'Section 2', 'Section 3']}
        //     renderSectionTitle={this._renderSectionTitle}
        //     renderHeader={this._renderHeader}
        //     renderContent={this._renderContent}
        //     onChange={this._updateSections}
        // />
    );
}

export default ConfigureNutritionGoals;

const styles = StyleSheet.create({
    sectionHeader: {
        padding: 16,
    },
});
