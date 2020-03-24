import { StackNavigationProp } from '@react-navigation/stack';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from 'src/RootNavigator';
import BarCodeField from './BarCodeField';
import DefaultUnit from './DefaultUnit';
import { Theme } from 'react-native-paper';

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
    navigation: StackNavigationProp<RootStackParamList>;
};

export default function Properties({ formik, navigation, theme }: Props) {
    return (
        <ScrollView style={{ margin: 8 }}>
            <View>
                <BarCodeField formik={formik} navigation={navigation} />
                <View style={{ marginTop: 24, marginLeft: 8 }}>
                    <DefaultUnit formik={formik} />
                </View>
            </View>
        </ScrollView>
    );
}
