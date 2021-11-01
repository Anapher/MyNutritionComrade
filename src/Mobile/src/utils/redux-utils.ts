import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';

export type PayloadActionTemplate<T> = PayloadAction<
   T & {
      [x: string]: any;
   }
>;

export function createActionTemplate<P, T extends Partial<P>>(
   action: ActionCreatorWithPayload<P, string>,
   presetValues: T,
): PayloadActionTemplate<Omit<P, keyof T>> {
   return action(presetValues as any) as any;
}
