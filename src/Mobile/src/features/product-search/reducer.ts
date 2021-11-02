import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConsumptionTime } from 'src/types';
import { SearchResult } from './types';

export type SearchScreenConfig = {
   limit?: number;
   scoreBy?: { time: ConsumptionTime; date: string };
   disableMealCreation?: boolean;
};

export type ProductSearchState = {
   searchText: string;
   searchConfig: SearchScreenConfig | null;
   searchResult: SearchResult[];
};

const initialState: ProductSearchState = {
   searchText: '',
   searchConfig: null,
   searchResult: [],
};

const productSearchSlice = createSlice({
   name: 'product-search',
   initialState,
   reducers: {
      initializeSearch(state, { payload }: PayloadAction<SearchScreenConfig>) {
         state.searchText = '';
         state.searchConfig = payload;
         state.searchResult = [];
      },
      setSearchText(state, { payload }: PayloadAction<string>) {
         state.searchText = payload;
      },
      setSearchResults(state, { payload }: PayloadAction<SearchResult[]>) {
         state.searchResult = payload;
      },
   },
});

export const { initializeSearch, setSearchText, setSearchResults } = productSearchSlice.actions;

export default productSearchSlice.reducer;
