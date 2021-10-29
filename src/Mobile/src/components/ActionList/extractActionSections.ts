import React from 'react';
import ActionListItem, { ActionListItemProps } from './ActionListItem';
import ActionListSection, { ActionListSectionProps } from './ActionListSection';
import { ActionListItemDescription, ActionListSectionDescription } from './types';

export default function extractActionSections(children: React.ReactNode) {
   return React.Children.toArray(children).reduce<ActionListSectionDescription[]>((result, child) => {
      if (React.isValidElement(child)) {
         if (child.type === ActionListSection) {
            const sectionProps = child.props as ActionListSectionProps;
            result.push({
               renderHeader: sectionProps.renderHeader,
               items: getActionListItems(sectionProps.children),
            });
         }
      }

      return result;
   }, []);
}

export function getActionListItems(children: React.ReactNode): ActionListItemDescription[] {
   return React.Children.toArray(children).reduce<ActionListItemDescription[]>((result, child) => {
      if (React.isValidElement(child)) {
         if (child.type === ActionListItem) {
            const itemProps = child.props as ActionListItemProps;
            result.push({ name: itemProps.name, render: itemProps.render });
         }
      }

      return result;
   }, []);
}
