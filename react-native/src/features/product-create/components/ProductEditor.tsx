import ViewPager from '@react-native-community/viewpager';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import { Formik, FormikHelpers } from 'formik';
import { ProductInfo } from 'Models';
import React, { useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Colors, Dialog, Paragraph, Portal, Theme, useTheme } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';
import { productInfoValidationSchema } from '../data';
import ProductEditorHeader from './ProductEditorHeader';
import NutritionInfo from './tabs/NutritionInfo';
import ProductLabel from './tabs/ProductLabel';
import Properties from './tabs/properties';
import Servings from './tabs/Servings';
import LinearMobileStepper from 'src/components/LinearMobileStepper';

const stepperStyles = (theme: Theme) => {
    // const dark = Color(theme.colors.)
    const lineColor = Color(theme.colors.text).darken(0.6).string();

    const accent = '#2980b9';

    return {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: accent,
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: 'transparent',
        stepStrokeUnFinishedColor: lineColor,
        separatorFinishedColor: accent,
        separatorUnFinishedColor: lineColor,
        stepIndicatorFinishedColor: accent,
        stepIndicatorUnFinishedColor: '#2c3e50',
        stepIndicatorCurrentColor: '#2c3e50',
        stepIndicatorLabelFontSize: 0,
        currentStepIndicatorLabelFontSize: 0,
        stepIndicatorLabelCurrentColor: 'transparent',
        stepIndicatorLabelFinishedColor: 'transparent',
        stepIndicatorLabelUnFinishedColor: 'transparent',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: theme.colors.text,
    };
};

const isIOS = Platform.OS === 'ios';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    initialValue: ProductInfo;
    onSubmit: (values: ProductInfo, formikHelpers: FormikHelpers<ProductInfo>) => void | Promise<any>;
    title: string;
    titleIcon: string;
    loadingTitle: string;
};

function ProductEditor({ navigation, initialValue, onSubmit, title, titleIcon, loadingTitle }: Props) {
    const [currentPage, setCurrentPage] = useState(0);
    const viewPagerRef = useRef<ViewPager>(null);
    const theme = useTheme();

    return (
        <Formik<ProductInfo>
            initialValues={initialValue}
            validateOnMount
            onSubmit={(values, helpers) => {
                Keyboard.dismiss();
                return onSubmit(values, helpers);
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
                            <Dialog visible={props.isSubmitting} dismissable={false}>
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
