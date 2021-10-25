import { Operation } from 'fast-json-patch';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import ChangedValueText from 'src/components/ChangedValueText';

type Props<T> = {
   operation: Operation;
   currentValue?: T;
   formatValue?: (x: T) => string;

   textStyle?: StyleProp<TextStyle>;
};

function ValuePatch<T>({ operation, currentValue, formatValue, textStyle }: Props<T>) {
   formatValue = formatValue || ((s: any) => String(s));

   return (
      <View style={styles.linearView}>
         {currentValue === undefined || currentValue === null ? undefined : (
            <ChangedValueText
               value={formatValue(currentValue)}
               style={[{ marginRight: operation.op === 'add' || operation.op === 'replace' ? 8 : 0 }, textStyle]}
               removed
            />
         )}
         {operation.op === 'add' || operation.op === 'replace' ? (
            <ChangedValueText value={formatValue(operation.value)} style={textStyle} />
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
