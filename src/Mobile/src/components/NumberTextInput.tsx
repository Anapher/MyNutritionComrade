import React, { useEffect, useLayoutEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = Omit<React.ComponentProps<typeof TextInput>, 'value'> & {
   value?: number;
   onChangeValue: (newVal?: number) => void;
   onChangeState?: (isValid: boolean) => void;
   showBottomLine?: boolean;
};

function NumberTextInput({ value, onChangeValue, onChangeState, showBottomLine, style, ...props }: Props) {
   const [displayText, setDisplayText] = useState(value?.toString());
   const theme = useTheme();

   useLayoutEffect(() => {
      const s = value?.toString();
      if (displayText !== s) {
         if (Number(displayText) === value) return;
         if (!displayText && value === 0) return;
         if (displayText === '0.' && value === 0) return;
         setDisplayText(s);
      }
   }, [value]);

   const isApplied = Number(displayText) === value;

   useEffect(() => {
      if (onChangeState) onChangeState(isApplied);
   }, [isApplied]);

   return (
      <TextInput
         keyboardType="numeric"
         value={displayText ?? ''}
         onChangeText={(s) => {
            if (!s) {
               setDisplayText(undefined);
               onChangeValue(undefined);
               return;
            }

            s = s.replace(',', '.');
            setDisplayText(s);

            const n = Number(s);
            if (!Number.isNaN(n)) {
               onChangeValue(n);
            }
         }}
         placeholderTextColor={theme.colors.onSurfaceDisabled}
         style={[
            {
               color: theme.colors.onSurface,
            },
            showBottomLine && { borderBottomWidth: displayText ? 0 : 1, borderBottomColor: theme.colors.onSurface },
            !isApplied && { color: theme.colors.error },
            style,
         ]}
         {...props}
      />
   );
}

export default NumberTextInput;
