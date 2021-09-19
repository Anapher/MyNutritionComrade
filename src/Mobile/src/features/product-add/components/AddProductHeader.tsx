import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Button, Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import { RootNavigatorParamList } from 'src/RootNavigator';

function AddProductHeader({ navigation, onSubmit, canSubmit, title }: Props) {
   return (
      <Appbar.Header>
         <Appbar.BackAction onPress={navigation.goBack} />
         <Appbar.Content title={title} />
         <Appbar.Action icon="check" disabled={!canSubmit} onPress={onSubmit} />
      </Appbar.Header>
   );
}

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   canSubmit: boolean;
   title: string;
   onSubmit: () => void;
   submitTitle: string;
};

export default function useAddProductHeader(props: Props) {
   if (Platform.OS === 'ios') {
      useLayoutEffect(() => {
         props.navigation.setOptions({
            title: props.title,
            headerRight: () => (
               <Button title={props.submitTitle} onPress={props.onSubmit} disabled={!props.canSubmit} />
            ),
            headerBackTitleVisible: false,
         });
      });
   } else {
      useLayoutEffect(() => {
         props.navigation.setOptions({
            header: () => <AddProductHeader {...props} />,
         });
      });
   }
}
