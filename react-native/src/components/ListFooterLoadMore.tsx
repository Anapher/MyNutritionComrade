import React from 'react';
import { StyleSheet } from 'react-native';
import FlatButton from './FlatButton';

type Props = {
    onPress?: () => any;
    text: string;
    isLoading?: boolean;
};
const ListFooterLoadMore = ({ onPress, text, isLoading }: Props) => {
    if (isLoading) {
        return null;
    }

    return <FlatButton text={text} onPress={onPress} center />;
};

export default ListFooterLoadMore;

const styles = StyleSheet.create({});
