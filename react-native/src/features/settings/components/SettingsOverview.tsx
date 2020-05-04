import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import NutritionGoalWidget from './nutrition-goals/Widget';
import PersonalInfoWidget from './personal-info/Widget';
import { SettingsStackParamList } from './Settings';
import { FlatList } from 'react-native';
import { RequestErrorResponse, toString } from 'src/utils/error-result';
import { Text, useTheme, Banner } from 'react-native-paper';

function ErrorMessage({ error }: { error: RequestErrorResponse }) {
    const theme = useTheme();

    return <Text style={{ color: theme.colors.error, marginHorizontal: 16 }}>{toString(error)}</Text>;
}

const dispatchProps = {
    loadCurrentNutritionGoal: actions.loadCurrentNutritionGoal.request,
    loadPersonalInfo: actions.loadPersonalInfo.request,
};

const mapStateToProps = (state: RootState) => ({
    isLoadingNutritionGoal: state.settings.isLoadingNutritionGoal,
    dataNutritionGoal: state.settings.nutritionGoal,
    errorNutritionGoal: state.settings.errorNutritionGoal,

    isLoadingPersonalInfo: state.settings.isLoadingPersonalInfo,
    dataPersonalInfo: state.settings.personalInfo,
    errorPersonalInfo: state.settings.errorPersonalInfo,
});

type Props = typeof dispatchProps &
    ReturnType<typeof mapStateToProps> & {
        navigation: StackNavigationProp<SettingsStackParamList>;
    };

const SettingsOverview = ({
    navigation,
    loadCurrentNutritionGoal,
    loadPersonalInfo,
    dataNutritionGoal,
    dataPersonalInfo,
    errorNutritionGoal,
    errorPersonalInfo,
    isLoadingNutritionGoal,
    isLoadingPersonalInfo,
}: Props) => {
    useEffect(() => {
        if (!dataNutritionGoal && !isLoadingNutritionGoal) {
            loadCurrentNutritionGoal();
        }
        if (!dataPersonalInfo && !isLoadingPersonalInfo) {
            loadPersonalInfo();
        }
    }, []);

    const items = [];

    if (dataNutritionGoal?.calories?.type === 'caloriesMifflinStJeor' && dataPersonalInfo) {
        if (!dataPersonalInfo.birthday || !dataPersonalInfo.gender || !dataPersonalInfo.height) {
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

    if (dataNutritionGoal) {
        items.push({
            key: 'nutritionGoal',
            render: () => <NutritionGoalWidget data={dataNutritionGoal} navigation={navigation} />,
        });
    } else if (errorNutritionGoal) {
        items.push({
            key: 'nutritionGoal',
            render: () => <ErrorMessage error={errorNutritionGoal} />,
        });
    }

    if (dataPersonalInfo) {
        items.push({
            key: 'personalInfo',
            render: () => <PersonalInfoWidget data={dataPersonalInfo} navigation={navigation} />,
        });
    } else if (errorPersonalInfo) {
        items.push({
            key: 'personalInfo',
            render: () => <ErrorMessage error={errorPersonalInfo} />,
        });
    }

    return (
        <FlatList
            style={styles.container}
            data={items}
            renderItem={(x) => x.item.render()}
            keyExtractor={(x) => x.key}
            refreshing={isLoadingNutritionGoal || isLoadingPersonalInfo}
            onRefresh={() => {
                loadPersonalInfo();
                loadCurrentNutritionGoal();
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
};

export default connect(mapStateToProps, dispatchProps)(SettingsOverview);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        padding: 16,
    },
    separator: {
        marginVertical: 8,
    },
});
