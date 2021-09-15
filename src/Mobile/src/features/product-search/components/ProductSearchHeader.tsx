import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import { Appbar, IconButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { initializeSearch, setSearchText } from '../reducer';
import { selectSearchText } from '../selectors';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'SearchProduct'>;
};

function ProductSearchHeader({
   navigation,
   route: {
      params: { config },
   },
}: Props) {
   const theme = useTheme();
   const dispatch = useDispatch();
   const { t } = useTranslation();

   const searchText = useSelector(selectSearchText);
   const handleSetSearchText = (s: string) => dispatch(setSearchText(s));

   useEffect(() => {
      dispatch(initializeSearch(config));
   }, [config, dispatch]);

   return (
      <Appbar.Header style={styles.header}>
         <Appbar.BackAction onPress={navigation.goBack} />
         <TextInput
            selectionColor={theme.colors.primary}
            underlineColorAndroid="transparent"
            returnKeyType="search"
            style={{ color: theme.colors.text, fontSize: 16, flex: 1, marginLeft: 16 }}
            placeholder={t('product_search.search_hint')}
            keyboardAppearance={theme.dark ? 'dark' : 'light'}
            accessibilityRole="search"
            value={searchText}
            onChangeText={handleSetSearchText}
            autoFocus
            placeholderTextColor={theme.colors.disabled}
         />
         {!config.disableMealCreation && (
            <IconButton
               icon="silverware-fork-knife"
               size={16}
               style={styles.mealIconButton}
               onPress={() => {
                  Keyboard.dismiss();
                  //   navigation.navigate('Meals');
               }}
            />
         )}
         <IconButton
            icon="plus"
            style={styles.plusIconButton}
            // onPress={() => navigation.navigate('CreateProduct')}
         />
      </Appbar.Header>
   );
}

const styles = StyleSheet.create({
   header: {
      display: 'flex',
      flexDirection: 'row',
   },
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

export default ProductSearchHeader;
