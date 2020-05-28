import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { RouteProp } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import TextToggleButton from 'src/components/TextToggleButton';
import NumberTextInput from 'src/components/NumberTextInput';
import { Text } from 'react-native-paper';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'SelectMealPortion'>;
};

function MealPortionDialog({
    route: {
        params: { mealName, initialPortion, onSubmit, disableGoBack, nutritionalInfo },
    },
    navigation,
}: Props) {
    const [portion, setPortion] = useState(initialPortion || 1);
    const [byVolume, setByVolume] = useState(false);
    const [isValid, setIsValid] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title={mealName} />
                    <Appbar.Action
                        icon="check"
                        disabled={portion <= 0 || !isValid}
                        onPress={() => {
                            onSubmit(portion);
                            if (!disableGoBack) navigation.goBack();
                        }}
                    />
                </Appbar.Header>
            ),
        });
    }, [isValid, portion]);

    return (
        <View style={styles.root}>
            <View style={styles.row}>
                <TextToggleButton
                    isChecked={!byVolume}
                    isLeft
                    onToggle={() => setByVolume(false)}
                    style={styles.toggleButton}
                >
                    <Text>Portions</Text>
                </TextToggleButton>
                <TextToggleButton
                    isChecked={byVolume}
                    isRight
                    onToggle={() => setByVolume(true)}
                    style={[styles.toggleButton, { marginLeft: 2 }]}
                >
                    <Text>Gram</Text>
                </TextToggleButton>
            </View>
            <View style={[styles.row, { marginTop: 32 }]}>
                <Text>Value:</Text>
            </View>
            <View style={[styles.row, { marginTop: 8, justifyContent: 'space-around', alignItems: 'flex-end' }]}>
                <View style={{ flex: 1 }} />
                <NumberTextInput
                    autoFocus
                    style={{ fontSize: 24, borderBottomColor: 'white' }}
                    value={byVolume ? nutritionalInfo.volume * portion : portion}
                    onChangeValue={(x) => setPortion(byVolume ? x / nutritionalInfo.volume : x)}
                    onChangeState={(x) => setIsValid(x)}
                />
                <View style={{ flex: 1 }}>{byVolume && <Text>g</Text>}</View>
            </View>
        </View>
    );
}

export default MealPortionDialog;

const styles = StyleSheet.create({
    root: {
        margin: 16,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    toggleButton: {
        width: 100,
        height: 40,
    },
});
