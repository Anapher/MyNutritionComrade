export type ActionListItemDescription = {
   render: () => React.ReactElement;
   name: string;
};

export type ActionListSectionDescription = {
   name?: string;
   items: ActionListItemDescription[];
   renderHeader?: () => React.ReactNode | null;
};
