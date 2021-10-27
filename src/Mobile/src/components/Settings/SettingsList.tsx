import React from 'react';
import {
   KeyboardAvoidingView,
   Platform,
   SectionList,
   SectionListData,
   SectionListProps,
   SectionListRenderItem,
   StyleSheet,
   View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemContext } from './ItemContext';

export type SettingsItem = {
   render: () => React.ReactElement;
   key: string;
};

export type SettingsSection = {
   settings: SettingsItem[];
   renderHeader?: () => React.ReactElement | null;
};

type Props = Omit<Omit<Omit<SectionListProps<any>, 'sections'>, 'renderItem'>, 'keyExtractor'> & {
   settings: SettingsSection[];
};

export default function SettingsList({ settings, style, ...props }: Props) {
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
            renderItem={RenderSettingsItem}
            keyExtractor={(item) => item.key}
            renderSectionFooter={() => <View style={{ marginBottom: 32 }} />}
            renderSectionHeader={({ section }) => section.renderHeader?.()}
            ListFooterComponent={<SafeAreaView />}
            {...props}
         />
      </KeyboardAvoidingView>
   );
}

const RenderSettingsItem: SectionListRenderItem<SettingsItem> = ({ index, item, section }) => {
   const top = index === 0;
   const bottom = section.data.length - 1 === index;

   if (top || bottom) {
      return <ItemContext.Provider value={{ top, bottom }}>{item.render()}</ItemContext.Provider>;
   }

   return item.render();
};

const styles = StyleSheet.create({
   root: {
      padding: 16,
   },
});
