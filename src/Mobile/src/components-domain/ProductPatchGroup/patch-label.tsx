import { Operation } from 'fast-json-patch';
import { TFunction } from 'i18next';
import React from 'react';
import { View } from 'react-native';
import { Caption, Text } from 'react-native-paper';
import ChangedValueText from 'src/components/ChangedValueText';
import { ProductLabel, ProductProperties } from 'src/types';
import ValuePatch from '../ValuePatch';
import { PatchView } from './utils';

function formatTags(label?: ProductLabel) {
   if (!label?.tags) return '';
   return label.tags.join(', ');
}

export default function patchLabel(operation: Operation, currentProduct: ProductProperties, t: TFunction): PatchView {
   const language = /^\/label\/([a-z]+)/.exec(operation.path)![1];

   if (/^\/label\/[a-z]+$/.test(operation.path)) {
      if (operation.op === 'add') {
         const newLabel = operation.value as ProductLabel;

         return {
            type: 'add',
            title: 'Create new label for language ' + language,
            view: (
               <View>
                  <Text>{newLabel.value}</Text>
                  {newLabel.tags && <Caption>{formatTags(newLabel)}</Caption>}
               </View>
            ),
         };
      }

      if (operation.op === 'remove') {
         return {
            type: 'remove',
            title: 'Remove label of language ' + language,
            view: (
               <View>
                  <ChangedValueText removed value={currentProduct.label[language]?.value} />
                  <ChangedValueText removed value={formatTags(currentProduct.label[language])} />
               </View>
            ),
         };
      }

      throw new Error('Wtf is this?');
   }

   if (operation.path.endsWith('/value')) {
      return {
         type: 'modify',
         title: 'Change label of language ' + language,
         view: <ValuePatch operation={operation} currentValue={currentProduct.label[language]?.value} />,
      };
   }

   return {
      type: 'modify',
      title: 'Unsupported json patch',
      view: <Text>{JSON.stringify(operation)}</Text>,
   };
}
