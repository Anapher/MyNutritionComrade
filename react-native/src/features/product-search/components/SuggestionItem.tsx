import { FoodSuggestion } from 'Models';
import React from 'react';
import { List } from 'react-native-paper';

type Props = {
    item: FoodSuggestion;
};

export default function SuggestionItem({ item }: Props) {
    return <List.Item title={item.name} description={`${item.servingSize?.size} ${item.servingSize?.unit}`} />;
}
