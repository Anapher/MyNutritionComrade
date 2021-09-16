import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   surface: {
      elevation: 1,
   },
   root: {
      display: 'flex',
      justifyContent: 'center',
   },
   container: {
      padding: 8,
      paddingVertical: 10,
      marginHorizontal: 8,
   },
   row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   title: {
      fontSize: 14,
   },
   description: {
      fontSize: 12,
   },
   energyText: {
      marginLeft: 16,
   },
   flexFill: {
      flex: 1,
   },
   verticalCenterAlignedRow: {
      flexDirection: 'row',
      alignItems: 'center',
   },
});
