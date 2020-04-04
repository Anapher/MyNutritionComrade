import { PatchOperation } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChangedValue from 'src/components/ChangedValue';

type Props<T> = {
    patch: PatchOperation;
    currentValue?: T;
    formatValue?: (x: T) => string;
};

function ValuePatch<T>({ patch, currentValue, formatValue }: Props<T>) {
    console.log(patch);
    console.log(currentValue);

    return (
        <View style={styles.linearView}>
            {currentValue === undefined || currentValue === null ? undefined : (
                <ChangedValue
                    value={formatValue ? formatValue(currentValue) : String(currentValue)}
                    style={{ marginRight: patch.type === 'set' ? 8 : 0 }}
                    removed
                />
            )}
            {patch.type === 'set' ? (
                <ChangedValue value={formatValue ? formatValue(patch.value) : patch.value} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    linearView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ValuePatch;
