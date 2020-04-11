import ViewPager from '@react-native-community/viewpager';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import { ProductProperties } from 'Models';
import React, { useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Colors, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import LinearMobileStepper from 'src/components/LinearMobileStepper';
import { RootStackParamList } from 'src/RootNavigator';
import { productInfoValidationSchema } from '../data';
import ProductEditorHeader from './ProductEditorHeader';
import NutritionInfo from './tabs/NutritionInfo';
import ProductLabel from './tabs/ProductLabel';
import Properties from './tabs/properties';
import Servings from './tabs/Servings';
import cuid from 'cuid';

const isIOS = Platform.OS === 'ios';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    initialValue: ProductProperties;
    onSubmit: (values: ProductProperties, formikHelpers: FormikHelpers<ProductProperties>) => void | Promise<any>;
    title: string;
    titleIcon: string;
    loadingTitle: string;
    disableLoadingIndicator?: boolean;
};

function ProductEditor({
    navigation,
    initialValue,
    onSubmit,
    title,
    titleIcon,
    loadingTitle,
    disableLoadingIndicator,
}: Props) {
    const [currentPage, setCurrentPage] = useState(0);
    const viewPagerRef = useRef<ViewPager>(null);
    const theme = useTheme();

    return (
        <Formik<ProductProperties>
            initialValues={{ ...initialValue, label: initialValue.label.map((x) => ({ ...x, key: cuid() })) }}
            validateOnMount
            onSubmit={(values, helpers) => {
                Keyboard.dismiss();

                const patchedValues: ProductProperties = {
                    ...values,
                    nutritionalInfo: Object.fromEntries(
                        Object.keys(values.nutritionalInfo).map((x) => [x, Number((values.nutritionalInfo as any)[x])]),
                    ) as any,
                    label: values.label.map((x) => ({ languageCode: x.languageCode, value: x.value })),
                };

                return onSubmit(patchedValues, helpers);
            }}
            validationSchema={productInfoValidationSchema}
        >
            {(props) => {
                React.useLayoutEffect(() => {
                    navigation.setOptions({
                        header: () => (
                            <ProductEditorHeader
                                navigation={navigation}
                                canSubmit={props.isValid}
                                onSubmit={props.submitForm}
                                title={title}
                                icon={titleIcon}
                            />
                        ),
                    });
                });
                return (
                    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
                        <ViewPager
                            showPageIndicator
                            keyboardDismissMode="on-drag"
                            style={{ flexGrow: 1, flex: 1 }}
                            orientation="horizontal"
                            onPageSelected={(e) => {
                                setCurrentPage(e.nativeEvent.position);
                            }}
                            ref={viewPagerRef}
                        >
                            <View key="1">
                                <ProductLabel formik={props} />
                            </View>
                            <View key="2">
                                <Properties formik={props} navigation={navigation} />
                            </View>
                            <View key="3">
                                <NutritionInfo
                                    formik={props}
                                    onShowNextPage={() => {
                                        viewPagerRef.current?.setPage(currentPage + 1);
                                        Keyboard.dismiss();
                                    }}
                                />
                            </View>
                            <View key="4">
                                <Servings formik={props} />
                            </View>
                        </ViewPager>
                        <LinearMobileStepper
                            hideOnKeyboardOpening
                            steps={4}
                            activeStep={currentPage}
                            onChangeActiveStep={(s) => viewPagerRef.current?.setPage(s)}
                        />
                        <Portal>
                            <Dialog visible={props.isSubmitting && !disableLoadingIndicator} dismissable={false}>
                                <Dialog.Title>{loadingTitle}</Dialog.Title>
                                <Dialog.Content>
                                    <View style={styles.dialogContent}>
                                        <ActivityIndicator
                                            color={Colors.indigo500}
                                            size={isIOS ? 'large' : 48}
                                            style={styles.dialogActivityIndicator}
                                        />
                                        <Paragraph>Loading.....</Paragraph>
                                    </View>
                                </Dialog.Content>
                            </Dialog>
                        </Portal>
                    </View>
                );
            }}
        </Formik>
    );
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'column',
        ...StyleSheet.absoluteFillObject,
    },
    mainViews: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
    stepperContainer: {
        marginVertical: 8,
    },
    dialogContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dialogActivityIndicator: {
        marginRight: 16,
    },
});

export default ProductEditor;
