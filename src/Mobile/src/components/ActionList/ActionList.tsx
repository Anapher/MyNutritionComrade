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
import extractActionSections from './extractActionSections';
import { ItemContext } from './ItemContext';
import { ActionListItemDescription } from './types';

type Props = Omit<Omit<Omit<SectionListProps<any>, 'sections'>, 'renderItem'>, 'keyExtractor'> & {
   children: React.ReactNode;
};

export default function ActionList({ children, style, ...props }: Props) {
   const sections = extractActionSections(children)
      .filter((x) => x.items.length > 0)
      .map<SectionListData<ActionListItemDescription>>(({ items, renderHeader, name }, i) => ({
         data: items,
         key: name ?? i.toString(),
         renderHeader,
      }));

   console.log(sections);

   return (
      <KeyboardAvoidingView
         style={StyleSheet.absoluteFill}
         keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
         behavior="padding"
      >
         <SectionList
            style={[styles.root, style]}
            contentInset={{ bottom: 16 }}
            sections={sections}
            stickySectionHeadersEnabled={false}
            renderItem={RenderActionItem}
            keyExtractor={(item) => item.name}
            renderSectionFooter={() => <View style={{ marginBottom: 32 }} />}
            renderSectionHeader={({ section }) => section.renderHeader?.()}
            ListFooterComponent={<SafeAreaView />}
            {...props}
         />
      </KeyboardAvoidingView>
   );
}

const RenderActionItem: SectionListRenderItem<ActionListItemDescription> = ({ index, item, section }) => {
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
