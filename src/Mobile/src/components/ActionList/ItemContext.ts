import React from 'react';

export type ItemContextInfo = {
   top: boolean;
   bottom: boolean;
};

export const ItemContext = React.createContext<ItemContextInfo>({ bottom: false, top: false });
