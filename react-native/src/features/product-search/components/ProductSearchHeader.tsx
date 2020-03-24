import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { TextInput, ToastAndroid } from 'react-native';
import { Theme, withTheme, IconButton, Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { MealType } from 'Models';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';

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
        theme: Theme;
        mealType: MealType;
        navigation: StackNavigationProp<RootStackParamList>;
    };

function ProductSearchHeader({ searchText, setSearchText, initSearch, theme, mealType, navigation }: Props) {
    useEffect(() => {
        initSearch(mealType);
    }, [mealType]);

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
                onChangeText={s => setSearchText(s)}
                autoFocus
            />
            <IconButton
                icon="plus"
                onPress={() => navigation.navigate('AddProduct')}
                onLongPress={getToastCallback('Add new product')}
            />
        </Appbar.Header>
    );
}
export default connect(mapStateToProps, dispatchProps)(withTheme(ProductSearchHeader));
