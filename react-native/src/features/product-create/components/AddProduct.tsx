import ViewPager from '@react-native-community/viewpager';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import { Formik, FormikHelpers } from 'formik';
import { ProductInfo } from 'Models';
import React, { useRef, useState, useCallback } from 'react';
import { Keyboard, KeyboardAvoidingView, View, Platform, ToastAndroid } from 'react-native';
import { Theme, withTheme, Portal, Dialog, ActivityIndicator, Colors, Paragraph } from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import { CurrentLanguage, SupportedLanguages } from 'src/consts';
import { RootStackParamList } from 'src/RootNavigator';
import * as yup from 'yup';
import AddProductHeader from './AddProductHeader';
import NutritionInfo from './NutritionInfo';
import ProductLabel from './ProductLabel';
import Properties from './properties';
import Servings from './Servings';
import useAsyncFunction from 'src/hooks/use-async-function';
import * as actions from '../actions';
import { AxiosError } from 'axios';
import { RestError } from 'src/utils/error-result';

const stepperStyles = (theme: Theme) => {
    // const dark = Color(theme.colors.)
    const lineColor = Color(theme.colors.text)
        .darken(0.6)
        .string();

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
    theme: Theme;
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'AddProduct'>;
};

const nutritionalValue = yup
    .number()
    .min(0)
    .required();

const validationSchema = yup.object().shape({
    label: yup
        .array()
        .of(
            yup.object().shape({
                languageCode: yup
                    .string()
                    .required()
                    .oneOf(SupportedLanguages.map(x => x.twoLetterCode)),
                label: yup.string().required('The label is required.'),
            }),
        )
        .min(1, 'Please provide at least one label.'),
    defaultServing: yup
        .string()
        .required()
        .test('defaultServingHasValue', 'The default serving must have a value', function(value) {
            const { servings } = this.parent;
            return !!servings[value];
        }),
    nutritionInformation: yup.object().shape({
        mass: yup
            .number()
            .oneOf([100])
            .required()
            .test('max', 'Total nutritions must not exceed 100g', function(value) {
                const { mass, fat, carbohydrates, protein, sodium } = this.parent;
                return fat + carbohydrates + protein + sodium <= mass;
            }),
        energy: nutritionalValue,
        fat: nutritionalValue,
        saturatedFat: nutritionalValue.test('max', 'Saturated Fat must not exceed total fat', function(value) {
            const { fat } = this.parent;
            return fat >= value;
        }),
        carbohydrates: nutritionalValue,
        sugars: nutritionalValue.test('max', 'Sugars must not exceed total carbohydrates', function(value) {
            const { carbohydrates } = this.parent;
            return carbohydrates >= value;
        }),
        protein: nutritionalValue,
        dietaryFiber: nutritionalValue,
        sodium: nutritionalValue,
    }),
    tags: yup.array().of(yup.string()),
    code: yup.string(),
    servings: yup.lazy((value: any) =>
        yup.object().shape(Object.fromEntries(Object.keys(value).map(x => [x, yup.number().positive()]))),
    ),
});

const defaultValues = {
    defaultServing: 'g',
    nutritionInformation: {
        mass: 100,
        energy: 0,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 0,
        sugars: 0,
        protein: 0,
        dietaryFiber: 0,
        sodium: 0,
    },
    tags: [],
    label: [{ languageCode: CurrentLanguage, label: '' }],
    servings: {
        g: 1,
    },
    code: '',
};

function AddProduct({ theme, navigation, route }: Props) {
    const [currentPage, setCurrentPage] = useState(0);
    const viewPagerRef = useRef<ViewPager>(null);

    const createAction = useAsyncFunction(
        actions.createAsync.request,
        actions.createAsync.success,
        actions.createAsync.failure,
    );

    const createProductCallback = useCallback(
        async (values: ProductInfo, formikActions: FormikHelpers<ProductInfo>) => {
            const { setSubmitting, setErrors } = formikActions;

            try {
                await createAction!(values);
                navigation.goBack();
                ToastAndroid.show('The product was created successfully.', 3000);
            } catch (error) {
                const axiosError: AxiosError = error;
                if (axiosError?.response === undefined) {
                    ToastAndroid.show('Connection failed.', 3000);
                    return;
                }

                if (typeof axiosError.response === 'string') {
                    ToastAndroid.show(`Request failed: ${axiosError.response}`, 3000);
                    return;
                }

                const restErrors = axiosError.response.data as RestError[];
                for (const error of restErrors) {
                    ToastAndroid.show(error.message, 3000);
                    if (error.fields) {
                        setErrors(error.fields);
                    }
                }
            } finally {
                setSubmitting(false);
            }
        },
        [createAction, navigation],
    );

    return (
        <Formik<ProductInfo>
            initialValues={{ ...defaultValues, ...(route.params?.product || {}) }}
            validateOnMount
            onSubmit={(values, helpers) => {
                Keyboard.dismiss();
                createProductCallback(values, helpers);
            }}
            validationSchema={validationSchema}
        >
            {props => {
                React.useLayoutEffect(() => {
                    navigation.setOptions({
                        header: () => (
                            <AddProductHeader
                                navigation={navigation}
                                canSubmit={props.isValid}
                                onSubmit={props.submitForm}
                            />
                        ),
                    });
                });
                return (
                    <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <KeyboardAvoidingView
                            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
                            behavior="padding"
                            enabled
                            keyboardVerticalOffset={80}
                        >
                            <ViewPager
                                keyboardDismissMode="on-drag"
                                style={{ flexGrow: 1 }}
                                orientation="horizontal"
                                onPageSelected={e => {
                                    setCurrentPage(e.nativeEvent.position);
                                }}
                                ref={viewPagerRef}
                            >
                                <View key="0">
                                    <ProductLabel formik={props} theme={theme} />
                                </View>
                                <View key="1">
                                    <Properties formik={props} theme={theme} navigation={navigation} />
                                </View>
                                <View key="2">
                                    <NutritionInfo
                                        formik={props}
                                        onShowNextPage={() => {
                                            viewPagerRef.current?.setPage(currentPage + 1);
                                            Keyboard.dismiss();
                                        }}
                                    />
                                </View>
                                <View key="3">
                                    <Servings formik={props} theme={theme} />
                                </View>
                            </ViewPager>
                        </KeyboardAvoidingView>

                        <View style={{ marginVertical: 8 }}>
                            <StepIndicator
                                stepCount={4}
                                customStyles={stepperStyles(theme)}
                                currentPosition={currentPage}
                                onPress={pos => {
                                    viewPagerRef.current?.setPage(pos);
                                }}
                                labels={['Label', 'Properties', 'Nutritions', 'Servings']}
                            />
                        </View>
                        <Portal>
                            <Dialog visible={props.isSubmitting} dismissable={false}>
                                <Dialog.Title>
                                    {route.params?.isUpdating ? 'Submitting update...' : 'Creating product...'}
                                </Dialog.Title>
                                <Dialog.Content>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ActivityIndicator
                                            color={Colors.indigo500}
                                            size={isIOS ? 'large' : 48}
                                            style={{ marginRight: 16 }}
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
export default withTheme(AddProduct);
