import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { StyleSheet, TextInput, ToastAndroid, Keyboard } from 'react-native';
import { Appbar, IconButton, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';

const mapStateToProps = (state: RootState) => ({
    searchText: state.productSearch.searchText,
});

const dispatchProps = {
    setSearchText: actions.setSearchText,
    initSearch: actions.initSearch,
};

function getToastCallback(text?: string) {
    if (!text) return;
    return () => ToastAndroid.show(text, ToastAndroid.SHORT);
}

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
        route: RouteProp<RootStackParamList, 'SearchProduct'>;
    };

function ProductSearchHeader({
    searchText,
    setSearchText,
    initSearch,
    navigation,
    route: {
        params: { config },
    },
}: Props) {
    const theme = useTheme();

    useEffect(() => {
        initSearch(config);
    }, [config]);

    return (
        <Appbar.Header style={{ display: 'flex', flexDirection: 'row' }}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <TextInput
                selectionColor={theme.colors.primary}
                underlineColorAndroid="transparent"
                returnKeyType="search"
                style={{ color: theme.colors.text, fontSize: 16, flex: 1, marginLeft: 16 }}
                placeholder="Search for products"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
                accessibilityTraits="search"
                accessibilityRole="search"
                value={searchText}
                onChangeText={(s) => setSearchText(s)}
                autoFocus
            />
            {!config.disableMealCreation && (
                <IconButton
                    icon="silverware-fork-knife"
                    size={16}
                    style={styles.mealIconButton}
                    onPress={() => {
                        Keyboard.dismiss();
                        navigation.navigate('Meals');
                    }}
                    onLongPress={getToastCallback('Meals')}
                />
            )}
            <IconButton
                icon="plus"
                style={styles.plusIconButton}
                onPress={() => navigation.navigate('CreateProduct')}
                onLongPress={getToastCallback('Add new product')}
            />
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    mealIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        margin: 0,
    },
    plusIconButton: {
        margin: 0,
        marginRight: 8,
    },
});

export default connect(mapStateToProps, dispatchProps)(ProductSearchHeader);
