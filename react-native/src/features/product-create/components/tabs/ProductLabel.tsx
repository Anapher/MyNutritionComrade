import Color from 'color';
import cuid from 'cuid';
import { FormikProps } from 'formik';
import { ProductProperties } from 'Models';
import React, { useState } from 'react';
import { FlatList, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Caption,
    Dialog,
    FAB,
    IconButton,
    Portal,
    Subheading,
    Surface,
    TextInput,
    useTheme,
} from 'react-native-paper';
import DialogRadioButton from 'src/components/DialogRadioButton';
import { SupportedLanguages } from 'src/consts';

type Props = {
    formik: FormikProps<ProductProperties>;
};

function ProductLabel({ formik: { values, setFieldValue, errors } }: Props) {
    const theme = useTheme();
    const secondaryColor = Color(theme.colors.text).alpha(0.6).string();
    const dividerColor = Color(theme.colors.text).alpha(0.2).string();

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
        setFieldValue('label', [...values.label, { languageCode: selectedLanguage, label: '', key: cuid() }]);
        setIsDialogOpen(false);
    };

    const handleDeleteLabel = (index: number) =>
        setFieldValue(
            'label',
            values.label.filter((_, i) => i !== index),
        );

    return (
        <View style={styles.root}>
            <FlatList
                style={styles.list}
                data={values.label}
                stickyHeaderIndices={[0]}
                ItemSeparatorComponent={() => (
                    <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: dividerColor }} />
                )}
                ListHeaderComponent={
                    <Surface style={{ elevation: 1, paddingVertical: 4, paddingLeft: 8 }}>
                        <Subheading>Product label</Subheading>
                        <Caption>The full label (including producer), translations, synonyms</Caption>
                    </Surface>
                }
                ListFooterComponent={
                    errors.label !== undefined && typeof errors.label === 'string' ? (
                        <Caption style={{ color: theme.colors.error, margin: 8 }}>{errors.label}</Caption>
                    ) : undefined
                }
                keyExtractor={(x) => (x as any).key}
                renderItem={({ item, index }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.row}>
                            <TextInput
                                dense
                                label={`Label (${item.languageCode})`}
                                value={item.value}
                                onChangeText={(s) =>
                                    setFieldValue(
                                        'label',
                                        values.label.map((x, i) => (i !== index ? x : { ...x, value: s })),
                                    )
                                }
                                style={{ flex: 1 }}
                                autoFocus={autoFocusTextField}
                            />
                            <IconButton icon="delete" onPress={() => handleDeleteLabel(index)} />
                        </View>
                        {errors.label && errors.label[index] && (
                            <Caption style={{ color: theme.colors.error }}>
                                {errors.label && (errors.label[index] as any).label}
                            </Caption>
                        )}
                    </View>
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
                                {SupportedLanguages.map((x) => (
                                    <DialogRadioButton
                                        checked={selectedLanguage === x.twoLetterCode}
                                        key={x.twoLetterCode}
                                        onPress={() => setSelectedLanguage(x.twoLetterCode)}
                                        label={x.name}
                                    />
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

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    itemContainer: {
        padding: 8,
        paddingTop: 8,
        paddingBottom: 8,
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

export default ProductLabel;
