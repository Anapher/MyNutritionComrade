import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = TextInputProps;

export default function SearchBar(props: Props) {
   return (
      <View style={styles.container}>
         <Icon name="magnify" size={20} color="#a4a4aa" />
         <TextInput style={styles.text} placeholderTextColor="#8e8e92" accessibilityRole="search" {...props} />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      display: 'flex',
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 6,
      backgroundColor: '#3a3a3c',
      borderRadius: 10,
   },
   text: {
      flex: 1,
      fontSize: 16,
      marginLeft: 4,
      color: 'white',
   },
});
