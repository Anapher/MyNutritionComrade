import React from 'react';
import { View, ViewProps } from 'react-native';
import { getActionListItems } from './extractActionSections';
import { ItemContext } from './ItemContext';
import { ActionListItemDescription } from './types';

type Props = ViewProps & {
   children: React.ReactNode;
};

export default function StaticActionView({ children, ...props }: Props) {
   const items = getActionListItems(children);
   return (
      <View {...props}>
         {items.map((item, i) => (
            <React.Fragment key={item.name}>{RenderSettingsItem(item, i, items)}</React.Fragment>
         ))}
      </View>
   );
}

const RenderSettingsItem = (
   item: ActionListItemDescription,
   index: number,
   allSettings: ActionListItemDescription[],
) => {
   const top = index === 0;
   const bottom = allSettings.length - 1 === index;

   if (top || bottom) {
      return <ItemContext.Provider value={{ top, bottom }}>{item.render()}</ItemContext.Provider>;
   }

   return item.render();
};
