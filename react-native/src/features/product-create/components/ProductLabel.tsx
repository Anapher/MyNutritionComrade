import Color from 'color';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, Keyboard } from 'react-native';
import {
    Button,
    Caption,
    Dialog,
    FAB,
    IconButton,
    Portal,
    RadioButton,
    Subheading,
    Surface,
    TextInput,
    Theme,
    TouchableRipple,
} from 'react-native-paper';
import { SupportedLanguages, errorColor } from 'src/consts';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        paddingLeft: 8,
    },
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    list: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
};

export default function ProductLabel({ formik: { values, setFieldValue, errors }, theme }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(SupportedLanguages[0].twoLetterCode);
    const [autoFocusTextField, setAutoFocusTextField] = useState(false);

    const handleOpenDialog = () => {
        Keyboard.dismiss();
        setIsDialogOpen(true);
    };
    const handleCancelDialog = () => setIsDialogOpen(false);

    const handleCreateLabel = () => {
        setAutoFocusTextField(true);
        setFieldValue('label', [...values.label, { languageCode: selectedLanguage, label: '' }]);
        setIsDialogOpen(false);
    };

    const handleDeleteLabel = (index: number) =>
        setFieldValue(
            'label',
            values.label.filter((_, i) => i !== index),
        );

    const secondaryColor = Color(theme.colors.text)
        .alpha(0.6)
        .string();

    return (
        <View style={styles.root}>
            <FlatList
                style={styles.list}
                data={values.label}
                stickyHeaderIndices={[0]}
                ItemSeparatorComponent={() => (
                    <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.text }} />
                )}
                ListHeaderComponent={
                    <Surface style={{ elevation: 14, paddingVertical: 4, paddingLeft: 8 }}>
                        <Subheading>Product label</Subheading>
                        <Caption>The full label (including producer), translations, synonyms</Caption>
                    </Surface>
                }
                ListFooterComponent={
                    errors.label !== undefined && typeof errors.label === 'string' ? (
                        <Caption style={{ color: errorColor, margin: 8 }}>{errors.label}</Caption>
                    ) : (
                        undefined
                    )
                }
                renderItem={({ item, index }) => (
                    <Surface
                        style={{
                            padding: 8,
                            paddingTop: 16,
                            paddingBottom: 16,
                            elevation: 3,
                        }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TextInput
                                dense
                                label={`Label (${item.languageCode})`}
                                value={item.label}
                                onChangeText={s =>
                                    setFieldValue(
                                        'label',
                                        values.label.map((x, i) =>
                                            i !== index ? x : { languageCode: x.languageCode, label: s },
                                        ),
                                    )
                                }
                                style={{ flex: 1 }}
                                autoFocus={autoFocusTextField}
                            />
                            <IconButton icon="delete" onPress={() => handleDeleteLabel(index)} />
                        </View>
                        {errors.label && errors.label[index] && (
                            <Caption style={{ color: errorColor }}>
                                {errors.label && (errors.label[index] as any).label}
                            </Caption>
                        )}
                    </Surface>
                )}
            />
            <FAB
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                icon="plus"
                onPress={handleOpenDialog}
            />
            <Portal>
                <Dialog visible={isDialogOpen} onDismiss={handleCancelDialog}>
                    <Dialog.Title>Select language for label</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView>
                            <View>
                                {SupportedLanguages.map(x => (
                                    <TouchableRipple
                                        onPress={() => setSelectedLanguage(x.twoLetterCode)}
                                        key={x.twoLetterCode}
                                    >
                                        <View style={styles.row}>
                                            <View pointerEvents="none">
                                                <RadioButton
                                                    value={x.twoLetterCode}
                                                    status={
                                                        selectedLanguage === x.twoLetterCode ? 'checked' : 'unchecked'
                                                    }
                                                />
                                            </View>
                                            <Subheading style={styles.text}>{x.name}</Subheading>
                                        </View>
                                    </TouchableRipple>
                                ))}
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={handleCancelDialog} color={secondaryColor}>
                            Cancel
                        </Button>
                        <Button onPress={handleCreateLabel}>Create</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
