import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { TextInput } from 'react-native';
import { Theme, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { MealType } from 'Models';

const mapStateToProps = (state: RootState) => ({
    searchText: state.productSearch.searchText,
});

const dispatchProps = {
    setSearchText: actions.setSearchText,
    initSearch: actions.initSearch,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        theme: Theme;
        mealType: MealType;
    };

function ProductSearchHeader({ searchText, setSearchText, initSearch, theme, mealType }: Props) {
    useEffect(() => {
        initSearch(mealType);
    }, [mealType]);

    return (
        <TextInput
            selectionColor={theme.colors.primary}
            underlineColorAndroid="transparent"
            returnKeyType="search"
            style={{ color: theme.colors.text, fontSize: 16 }}
            keyboardAppearance={theme.dark ? 'dark' : 'light'}
            accessibilityTraits="search"
            accessibilityRole="search"
            value={searchText}
            onChangeText={s => setSearchText(s)}
            autoFocus
        />
    );
}
export default connect(mapStateToProps, dispatchProps)(withTheme(ProductSearchHeader));
