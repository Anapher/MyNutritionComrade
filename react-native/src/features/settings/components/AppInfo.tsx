import React from 'react';
import { StyleSheet, View } from 'react-native';
import { commit, date, refs } from 'src/git-info.json';
import { Text } from 'react-native-paper';

const AppInfo = () => {
    return (
        <View style={styles.root}>
            <Text style={styles.infoText}>
                {commit} ({refs} at {date})
            </Text>
            <Text style={styles.sourceText}>https://github.com/Anapher/MyNutritionComrade</Text>
        </View>
    );
};

export default AppInfo;

const styles = StyleSheet.create({
    root: {
        marginTop: 16,
    },
    infoText: {
        fontSize: 11,
        textAlign: 'center',
        opacity: 0.7,
    },
    sourceText: {
        fontSize: 11,
        textAlign: 'center',
        opacity: 0.9,
    },
});
