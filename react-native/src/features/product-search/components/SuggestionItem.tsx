import { FoodSuggestion } from 'Models';
import React from 'react';
import { List, TouchableRipple, Text, Caption, Theme, withTheme } from 'react-native-paper';
import selectLabel from 'src/utils/label-selector';
import { View, StyleSheet } from 'react-native';
import color from 'color';

type Props = {
    item: FoodSuggestion;
    theme: Theme;
};

const styles = StyleSheet.create({
    item: {
        paddingLeft: 68,
        paddingVertical: 12,
    },
    title: {
        fontSize: 16,
    },
    description: {
        fontSize: 12,
    },
});

function SuggestionItem({ item, theme }: Props) {
    console.log(item);

    const titleColor = color(theme.colors.text).alpha(0.87).rgb().string();

    const descriptionColor = color(theme.colors.text).alpha(0.54).rgb().string();

    return (
        <TouchableRipple onPress={() => {}} style={styles.item}>
            <View>
                <View>
                    <Text style={[styles.title, { color: titleColor }]}>{selectLabel(item.model.label)}</Text>
                    <Text style={[styles.description, { color: descriptionColor }]}>{`${item.servingSize?.size} ${
                        item.servingSize?.conversion?.name || item.servingSize?.unit
                    }`}</Text>
                </View>
            </View>
        </TouchableRipple>
    );
}

export default withTheme(SuggestionItem);
