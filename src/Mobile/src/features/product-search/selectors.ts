import { RootState } from 'src/store';

export const selectSearchText = (state: RootState) => state.productSearch.searchText;
export const selectSearchResults = (state: RootState) => state.productSearch.searchResult;
export const selectSearchConfig = (state: RootState) => state.productSearch.searchConfig;
