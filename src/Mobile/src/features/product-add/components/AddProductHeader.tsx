import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { RootNavigatorParamList } from 'src/RootNavigator';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   canSubmit: boolean;
   title: string;
   onSubmit: () => void;
};

export default function AddProductHeader({ navigation, onSubmit, canSubmit, title }: Props) {
   return (
      <Appbar.Header>
         <Appbar.BackAction onPress={navigation.goBack} />
         <Appbar.Content title={title} />
         <Appbar.Action icon="check" disabled={!canSubmit} onPress={onSubmit} />
      </Appbar.Header>
   );
}
