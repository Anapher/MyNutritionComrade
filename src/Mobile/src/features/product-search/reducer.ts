import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductSearchConfig } from 'src/services/search-engine/types';
import { SearchResult } from './types';

export type ProductSearchState = {
   searchText: string;
   searchConfig: ProductSearchConfig | null;
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
      initializeSearch(state, { payload }: PayloadAction<ProductSearchConfig>) {
         state.searchText = '';
         state.searchConfig = payload;
         state.searchResult = [];
      },
      setSearchText(state, { payload }: PayloadAction<string>) {
         state.searchText = payload;
      },
      setSuggestions(state, { payload }: PayloadAction<SearchResult[]>) {
         state.searchResult = payload;
      },
   },
});

export const { initializeSearch, setSearchText } = productSearchSlice.actions;

export default productSearchSlice.reducer;
