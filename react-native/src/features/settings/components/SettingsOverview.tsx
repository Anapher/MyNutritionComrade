import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Banner, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { RequestErrorResponse, toString } from 'src/utils/error-result';
import * as actions from '../actions';
import NutritionGoalWidget from './nutrition-goals/Widget';
import PersonalInfoWidget from './personal-info/Widget';
import { SettingsStackParamList } from './Settings';
import { UserSettings } from 'Models';
import * as jsonPatch from 'fast-json-patch';
import useAsyncFunction from 'src/hooks/use-async-function';
import LogOffWidget from './LogOffWidget';

function ErrorMessage({ error }: { error: RequestErrorResponse }) {
    const theme = useTheme();
    return <Text style={{ color: theme.colors.error, marginHorizontal: 16 }}>{toString(error)}</Text>;
}

const dispatchProps = {
    loadUserSettings: actions.loadUserSettings.request,
};

const mapStateToProps = (state: RootState) => ({
    isLoading: state.settings.isLoading,
    userSettings: state.settings.userSettings,
    error: state.settings.error,
});

type Props = typeof dispatchProps &
    ReturnType<typeof mapStateToProps> & {
        navigation: StackNavigationProp<SettingsStackParamList>;
    };

const SettingsOverview = ({ navigation, loadUserSettings, isLoading, userSettings, error }: Props) => {
    useEffect(() => {
        if (!userSettings && !isLoading) {
            loadUserSettings();
        }
    }, []);

    const patchAction = useAsyncFunction(
        actions.patchUserSettings.request,
        actions.patchUserSettings.success,
        actions.patchUserSettings.failure,
    );

    const items = [];

    if (userSettings?.nutritionGoal?.calories?.type === 'caloriesMifflinStJeor' && userSettings.personalInfo) {
        if (
            !userSettings.personalInfo.birthday ||
            !userSettings.personalInfo.gender ||
            !userSettings.personalInfo.height
        ) {
            items.push({
                key: 'warning',
                render: () => (
                    <Banner visible actions={[]} icon="alert">
                        Warning: Your calories nutrition goal cannot be calculated as your personal infos are
                        incomplete.
                    </Banner>
                ),
            });
        }
    }

    const handlePatch = (result: UserSettings) => {
        const current = { ...userSettings! };

        /** replace nutrition goals which types has changed */
        if (result.nutritionGoal && current.nutritionGoal) {
            for (const propName of Object.keys(result)) {
                if ((result.nutritionGoal as any)[propName]?.type !== (current.nutritionGoal as any)[propName]?.type) {
                    (current.nutritionGoal as any)[propName] = null;
                }
            }
        }

        const ops = jsonPatch.compare(current, result);

        if (ops.length === 0) {
            return Promise.resolve();
        }

        return patchAction!(ops);
    };

    if (error) {
        items.push({
            key: 'nutritionGoal',
            render: () => <ErrorMessage error={error} />,
        });
    }

    if (userSettings?.nutritionGoal) {
        items.push({
            key: 'nutritionGoal',
            render: () => (
                <NutritionGoalWidget
                    data={userSettings.nutritionGoal!}
                    navigation={navigation}
                    onChange={(x) => handlePatch({ ...userSettings, nutritionGoal: x })}
                />
            ),
        });
    }

    if (userSettings?.personalInfo) {
        items.push({
            key: 'personalInfo',
            render: () => (
                <PersonalInfoWidget
                    data={userSettings.personalInfo!}
                    navigation={navigation}
                    onChange={(x) => handlePatch({ ...userSettings, personalInfo: x })}
                />
            ),
        });
    }

    items.push({ key: 'account', render: () => <LogOffWidget /> });

    return (
        <FlatList
            style={styles.container}
            data={items}
            renderItem={(x) => x.item.render()}
            contentInset={{ bottom: 16 }}
            ListFooterComponent={<View style={{ height: 16 }} />}
            ListHeaderComponent={<View style={{ height: 16 }} />}
            keyExtractor={(x) => x.key}
            refreshing={isLoading}
            onRefresh={() => {
                loadUserSettings();
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
};

export default connect(mapStateToProps, dispatchProps)(SettingsOverview);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        paddingHorizontal: 16,
    },
    separator: {
        marginVertical: 8,
    },
});
