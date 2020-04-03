import { PatchOperation } from 'Models';
import { StyleSheet, View } from 'react-native';
import ChangedValue from 'src/components/ChangedValue';

type Props<T> = {
    patch: PatchOperation;
    currentValue?: T;
    formatValue?: (x: T) => string;
};

function ValuePatch<T>({ patch, currentValue, formatValue }: Props<T>) {
    return (
        <View style={styles.linearView}>
            {currentValue && (
                <ChangedValue
                    value={formatValue ? formatValue(currentValue) : String(currentValue)}
                    style={{ marginRight: patch.type === 'set' ? 2 : 0 }}
                />
            )}
            {patch.type === 'set' && <ChangedValue value={formatValue ? formatValue(patch.value) : patch.value} />}
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
