import { Operation } from 'fast-json-patch';
import { FieldPath } from 'react-hook-form';
import { ProductProperties } from 'src/types';

export const isOperationChanging = (operation: Operation, property: FieldPath<ProductProperties>) =>
   operation.path === '/' + property.replace('.', '/');

export const isOperationItem = (operation: Operation, property: FieldPath<ProductProperties>) =>
   operation.path.startsWith('/' + property.replace('.', '/') + '/');

export const getPropertyOperationType = (operation: Operation, currentValue: any): OperationType => {
   switch (operation.op) {
      case 'add':
      case 'replace':
         return currentValue ? 'modify' : 'add';
      case 'remove':
         return 'remove';
      default:
         throw new Error('Unsupported operation type: ' + operation.op);
   }
};

export type OperationType = 'add' | 'modify' | 'remove' | 'initialize';

export type PatchView = {
   type: OperationType;
   title: string;
   view: React.ReactNode;
};
