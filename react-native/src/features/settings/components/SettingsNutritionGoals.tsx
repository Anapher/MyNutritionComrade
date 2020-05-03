import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { Appbar } from 'react-native-paper';
import ConfigureNutritionGoals from './nutrition-goals/ConfigureNutritionGoals';
import { SettingsStackParamList } from './Settings';
import LoadingOverlay from 'src/components/LoadingOverlay';
import { RequestErrorResponse, toString } from 'src/utils/error-result';

type Props = {
    navigation: StackNavigationProp<SettingsStackParamList>;
    route: RouteProp<SettingsStackParamList, 'ConfigureNutritionGoals'>;
};

const SettingsNutritionGoals = ({
    route: {
        params: { initialValue, onSubmit },
    },
    navigation,
}: Props) => {
    const [value, setValue] = useState(initialValue);
    const valueRef = useRef(value);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await onSubmit(valueRef.current);
            navigation.goBack();
        } catch (e) {
            ToastAndroid.show(toString(e), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Nutrition Goals" />
                    <Appbar.Action icon="check" onPress={handleSubmit as any} disabled={isLoading} />
                </Appbar.Header>
            ),
        });
    });

    if (isLoading) return <LoadingOverlay info="Saving changes..." />;

    return <ConfigureNutritionGoals value={value} onChange={(x) => setValue(x)} />;
};

export default SettingsNutritionGoals;

const styles = StyleSheet.create({});
