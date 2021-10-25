import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { ProductContributionDto } from 'src/types';

type Props = {
   data: ProductContributionDto;
};

export default function ProductContributionView({ data }: Props) {
   return <View>{data.createdByYou && <Text>Created by you</Text>}</View>;
}
