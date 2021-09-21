import React from 'react';
import { Text } from 'react-native-paper';

type Props = {
   label: string;
};
export default function SettingsHeader({ label }: Props) {
   return <Text style={{ marginLeft: 24, marginBottom: 8 }}>{label}</Text>;
}
