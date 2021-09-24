import React from 'react';
import {
   FlatList,
   FlatListProps,
   KeyboardAvoidingView,
   Platform,
   SectionList,
   SectionListData,
   StyleSheet,
   View,
} from 'react-native';
import { SettingsButtonContainerProps } from './SettingsButtonContainer';

export type SettingsItem = {
   render: (props: SettingsButtonContainerProps) => React.ReactElement;
   key: string;
};

export type SettingsSection = {
   settings: SettingsItem[];
   renderHeader?: () => React.ReactElement;
};

type Props = Omit<Omit<Omit<FlatListProps<any>, 'data'>, 'renderItem'>, 'keyExtractor'> & {
   settings: SettingsSection[] | SettingsItem[];
};

export default function SettingsList({ settings, style, ...props }: Props) {
   if (isSettingsSection(settings)) {
      const sections = settings
         .filter((x) => x.settings.length > 0)
         .map<SectionListData<SettingsItem>>(({ settings, renderHeader }, i) => ({
            data: settings,
            key: i.toString(),
            renderHeader,
         }));

      return (
         <KeyboardAvoidingView
            style={{ height: '100%' }}
            keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
            behavior={'padding'}
         >
            <SectionList
               style={[styles.root, style]}
               contentInset={{ bottom: 16 }}
               sections={sections}
               stickySectionHeadersEnabled={false}
               renderItem={({ item, index, section }) =>
                  item.render({ top: index === 0, bottom: section.data.length - 1 === index })
               }
               keyExtractor={(item) => item.key}
               renderSectionFooter={() => <View style={{ marginBottom: 32 }}></View>}
               renderSectionHeader={({ section }) => section.renderHeader?.()}
               {...props}
            />
         </KeyboardAvoidingView>
      );
   } else {
      const items = settings.map(({ render, key }, i) => ({
         component: render({ top: i === 0, bottom: i === settings.length - 1 }),
         key,
      }));

      return (
         <FlatList
            style={[styles.root, style]}
            contentInset={{ bottom: 16 }}
            data={items}
            renderItem={(x) => x.item.component}
            keyExtractor={(x) => x.key}
            {...props}
         />
      );
   }
}

function isSettingsSection(s: SettingsSection[] | SettingsItem[]): s is SettingsSection[] {
   return s.length === 0 ? false : (s as SettingsSection[])[0].settings !== undefined;
}

const styles = StyleSheet.create({
   root: {
      padding: 16,
   },
});
