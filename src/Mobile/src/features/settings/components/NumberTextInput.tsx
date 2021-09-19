import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';

type Props = Omit<React.ComponentProps<typeof TextInput>, 'value'> & {
   value: number | undefined;
   onChangeValue: (v: number | undefined) => void;
};

const NumberTextInput = ({ value, onChangeValue, error, ...props }: Props) => {
   const [currentValue, setCurrentValue] = useState(value?.toString());

   useEffect(() => {
      const s = value?.toString();
      if (currentValue?.replace('.', '') !== s) {
         if (currentValue === '' && value === 0) return;
         if (currentValue === '0.' && value === 0) return;
         setCurrentValue(s);
      }
   }, [value]);

   return (
      <TextInput
         error={currentValue !== value?.toString() || error}
         value={currentValue ?? ''}
         keyboardType="numeric"
         onChangeText={(x) => {
            if (!x) {
               setCurrentValue(undefined);
               onChangeValue(undefined);
               return;
            }

            const val = x.replace(',', '.');
            setCurrentValue(val);

            const n = Number(val);
            if (!Number.isNaN(n)) {
               onChangeValue(n);
            }
         }}
         {...props}
      />
   );
};

export default NumberTextInput;
