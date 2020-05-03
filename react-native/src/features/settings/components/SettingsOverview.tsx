import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Widget from './nutrition-goals/Widget';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from './Settings';

type Props = {
    navigation: StackNavigationProp<SettingsStackParamList>;
};
const SettingsOverview = ({ navigation }: Props) => {
    return (
        <View style={styles.container}>
            <Widget navigation={navigation} />
        </View>
    );
};

export default SettingsOverview;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});
