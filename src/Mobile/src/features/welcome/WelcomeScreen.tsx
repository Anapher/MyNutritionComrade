import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Button, Headline, Subheading, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { firstStartCompleted } from '../settings/reducer';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
};

export default function WelcomeScreen({ navigation }: Props) {
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const handleStart = () => {
      dispatch(firstStartCompleted());
      navigation.replace('Home');
   };

   return (
      <SafeAreaView style={styles.root}>
         <Headline>{t('welcome.welcome_message')}</Headline>
         <Subheading style={styles.descriptionTitle}>We will now download and build the food database</Subheading>
         <Text style={styles.bulletPoint}>
            - This may take some time, but has several advantages including fast search and offline usage
         </Text>
         <Text style={styles.bulletPoint}>
            - Also, using this decentralized approach, we are not able to track you. Maximum privacy for you!
         </Text>
         <Text style={styles.bulletPoint}>- The database is synchronized once per week automatically</Text>
         <Button mode="contained" style={styles.button} onPress={handleStart}>
            Let's Start
         </Button>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFillObject,
      display: 'flex',
      flexDirection: 'column',
      margin: 16,
   },
   descriptionTitle: { marginTop: 16 },
   bulletPoint: { marginTop: 8 },
   button: {
      marginTop: 16,
   },
});
