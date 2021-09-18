import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

type Props = React.ComponentProps<typeof Button>;

const DialogButton = ({ contentStyle, ...props }: Props) => {
   const theme = useTheme();
   return <Button color={theme.colors.text} {...props} contentStyle={[styles.contentStyle, contentStyle]} />;
};

export default DialogButton;

const styles = StyleSheet.create({
   contentStyle: {
      justifyContent: 'flex-start',
      height: 50,
   },
});
