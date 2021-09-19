import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PersonalInfoSettingsItem from './personal-info/SettingsItem';

type PersonalInfoSettingsItem = {
   key: string;
   render: () => React.ReactElement;
};

export default function SettingsRoot() {
   const settings: PersonalInfoSettingsItem[] = [{ key: 'personal-info', render: () => <PersonalInfoSettingsItem /> }];

   return (
      <FlatList
         style={styles.root}
         data={settings}
         contentInset={{ bottom: 16 }}
         renderItem={(x) => x.item.render()}
         keyExtractor={(x) => x.key}
      />
   );
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFillObject,
      paddingVertical: 16,
   },
});
