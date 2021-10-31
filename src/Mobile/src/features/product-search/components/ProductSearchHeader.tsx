import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
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
      params: { config, onCreatedAction, onCreatedPop },
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
         <View style={{ flex: 1, backgroundColor: 'black', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 8 }}>
            <TextInput
               selectionColor={theme.colors.primary}
               underlineColorAndroid="transparent"
               returnKeyType="search"
               style={{ color: theme.colors.text, fontSize: 16, backgroundColor: 'black' }}
               placeholder={t('product_search.search_hint')}
               keyboardAppearance={theme.dark ? 'dark' : 'light'}
               accessibilityRole="search"
               value={searchText}
               onChangeText={handleSetSearchText}
               autoFocus
               placeholderTextColor={theme.colors.disabled}
            />
         </View>
         <IconButton
            icon="plus"
            style={styles.plusIconButton}
            onPress={() => navigation.navigate('CreateProduct', { initialValue: {} })}
         />
         <IconButton
            icon="dots-vertical"
            style={styles.plusIconButton}
            onPress={() => navigation.navigate('CreateProduct', { initialValue: {} })}
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
