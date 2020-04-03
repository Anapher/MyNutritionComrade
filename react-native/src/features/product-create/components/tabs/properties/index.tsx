import { StackNavigationProp } from '@react-navigation/stack';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from 'src/RootNavigator';
import BarCodeField from './BarCodeField';
import DefaultUnit from './DefaultUnit';

type Props = {
    formik: FormikProps<ProductInfo>;
    navigation: StackNavigationProp<RootStackParamList>;
};

function Properties({ formik, navigation }: Props) {
    return (
        <ScrollView style={styles.root}>
            <View>
                <BarCodeField formik={formik} navigation={navigation} />
                <View style={styles.unitRow}>
                    <DefaultUnit formik={formik} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        margin: 8,
    },
    unitRow: {
        marginTop: 24,
        marginLeft: 8,
    },
});

export default Properties;
