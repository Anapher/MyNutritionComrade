import Color from 'color';
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
import DialogButton from 'src/components/DialogButton';
import WorkingKeyboardAvoidingView from 'src/components/WorkingKeyboardAvoidingView';
import { SupportedLanguages } from 'src/consts';
import TagInput from 'src/components/TagInput';

type Props = {
    formik: FormikProps<ProductProperties>;
};

function ProductLabel({ formik: { values, setFieldValue, errors } }: Props) {
    const theme = useTheme();
    const secondaryColor = Color(theme.colors.text).alpha(0.6).string();
    const dividerColor = Color(theme.colors.text).alpha(0.2).string();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [autoFocusTextField, setAutoFocusTextField] = useState(false);

    const handleOpenDialog = () => {
        Keyboard.dismiss();
        setIsDialogOpen(true);
    };
    const handleCancelDialog = () => setIsDialogOpen(false);

    const handleCreateLabel = (languageCode: string) => {
        setAutoFocusTextField(true);
        setFieldValue('label', { ...values.label, [languageCode]: { value: '', tags: [] } });
        setIsDialogOpen(false);
    };

    const handleDeleteLabel = (lang: string) =>
        setFieldValue('label', Object.fromEntries(Object.entries(values.label).filter(([s]) => s !== lang)));

    console.log(errors);

    return (
        <View style={styles.root}>
            <WorkingKeyboardAvoidingView>
                <FlatList
                    style={styles.list}
                    data={Object.entries(values.label)}
                    stickyHeaderIndices={[0]}
                    ItemSeparatorComponent={() => (
                        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: dividerColor }} />
                    )}
                    ListHeaderComponent={
                        <Surface style={{ elevation: 1, paddingVertical: 4, paddingLeft: 8 }}>
                            <Subheading>Product label</Subheading>
                            <Caption>
                                Please copy the label from the product and include the producer if possible
                            </Caption>
                        </Surface>
                    }
                    ListFooterComponent={
                        errors.label !== undefined && typeof errors.label === 'string' ? (
                            <Caption style={{ color: theme.colors.error, margin: 8 }}>{errors.label}</Caption>
                        ) : undefined
                    }
                    keyExtractor={(x) => x[0]}
                    renderItem={({ item: [lang, label] }) => (
                        <View style={styles.itemContainer}>
                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        dense
                                        error={errors.label && !!errors.label[lang]?.value}
                                        label={`Label (${lang})`}
                                        value={label.value}
                                        onChangeText={(s) =>
                                            setFieldValue('label', { ...values.label, [lang]: { ...label, value: s } })
                                        }
                                        autoFocus={autoFocusTextField}
                                    />
                                    {errors.label && errors.label[lang] && errors.label[lang]!.value && (
                                        <Caption style={{ color: theme.colors.error }}>
                                            {errors.label[lang]!.value}
                                        </Caption>
                                    )}
                                    <TagInput
                                        dense
                                        error={errors.label && !!errors.label[lang]?.tags}
                                        label={`Tags (${lang})`}
                                        value={label.tags}
                                        onChangeValue={(tags) =>
                                            setFieldValue('label', { ...values.label, [lang]: { ...label, tags } })
                                        }
                                        style={{ flex: 1 }}
                                        autoFocus={autoFocusTextField}
                                    />
                                    {errors.label && errors.label[lang] && errors.label[lang]!.tags && (
                                        <Caption style={{ color: theme.colors.error }}>
                                            {errors.label[lang]!.tags}
                                        </Caption>
                                    )}
                                </View>
                                <IconButton icon="delete" onPress={() => handleDeleteLabel(lang)} />
                            </View>
                        </View>
                    )}
                />
            </WorkingKeyboardAvoidingView>
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
                                {SupportedLanguages.filter((x) => !values.label[x.twoLetterCode]).map((x) => (
                                    <DialogButton
                                        key={x.twoLetterCode}
                                        onPress={() => handleCreateLabel(x.twoLetterCode)}
                                    >
                                        {x.name}
                                    </DialogButton>
                                ))}
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={handleCancelDialog} color={secondaryColor}>
                            Cancel
                        </Button>
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
