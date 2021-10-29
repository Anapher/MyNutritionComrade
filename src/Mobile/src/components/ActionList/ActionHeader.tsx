import React from 'react';
import { Text } from 'react-native-paper';
import { TEXT_PADDING_LEFT } from './config';

type Props = {
   label: string;
};
export default function ActionHeader({ label }: Props) {
   return <Text style={{ marginLeft: TEXT_PADDING_LEFT, marginBottom: 8 }}>{label}</Text>;
}
