import React, { useState, useRef } from 'react';
import { View, Keyboard } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { withTheme, Theme, Text } from 'react-native-paper';
import Color from 'color';
import ViewPager from '@react-native-community/viewpager';
import { Formik } from 'formik';
import { ProductInfo } from 'Models';
import NutritionInfo from './NutritionInfo';

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

type Props = {
    theme: Theme;
};

function AddProduct({ theme }: Props) {
    const [currentPage, setCurrentPage] = useState(0);
    const viewPagerRef = useRef<ViewPager>(null);

    return (
        <Formik<ProductInfo>
            initialValues={{
                defaultServing: 'g',
                nutritionInformation: {
                    mass: 0,
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
                label: [],
                servings: {},
            }}
            onSubmit={() => {}}
        >
            {props => (
                <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <ViewPager
                        style={{ flexGrow: 1 }}
                        orientation="horizontal"
                        onPageSelected={e => {
                            setCurrentPage(e.nativeEvent.position);
                            Keyboard.dismiss();
                        }}
                        ref={viewPagerRef}
                    >
                        <View key="0">
                            <Text>First page</Text>
                        </View>
                        <View key="1">
                            <NutritionInfo
                                formik={props}
                                onShowNextPage={() => {
                                    viewPagerRef.current?.setPage(currentPage + 1);
                                    Keyboard.dismiss();
                                }}
                            />
                        </View>
                        <View key="2">
                            <Text>Third page</Text>
                        </View>
                        <View key="3">
                            <Text>Fourth page</Text>
                        </View>
                    </ViewPager>
                    <View style={{ marginBottom: 6 }}>
                        <StepIndicator
                            stepCount={4}
                            customStyles={stepperStyles(theme)}
                            currentPosition={currentPage}
                            onPress={pos => {
                                viewPagerRef.current?.setPage(pos);
                            }}
                            labels={['Label', 'Nutritions', 'Servings', 'Misc']}
                        />
                    </View>
                </View>
            )}
        </Formik>
    );
}
export default withTheme(AddProduct);
