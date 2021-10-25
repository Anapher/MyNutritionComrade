import React from 'react';
import { View, ViewProps } from 'react-native';
import { ItemContext } from './ItemContext';
import { SettingsItem } from './SettingsList';

type Props = ViewProps & {
   settings: SettingsItem[];
};

export default function SettingsView({ settings, ...props }: Props) {
   return <View {...props}>{settings.map((item, i) => RenderSettingsItem(item, i, settings))}</View>;
}

const RenderSettingsItem = (item: SettingsItem, index: number, allSettings: SettingsItem[]) => {
   const top = index === 0;
   const bottom = allSettings.length - 1 === index;

   if (top || bottom) {
      return <ItemContext.Provider value={{ top, bottom }}>{item.render()}</ItemContext.Provider>;
   }

   return item.render();
};
