import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitializationResult } from 'src/services/product-repository-factory';

export type RepositoryInitState = {
   status: 'initialized' | 'initializing' | 'not-initialized';
   initializationResult: InitializationResult | null;
   downloading: boolean;
};

const initialState: RepositoryInitState = {
   status: 'not-initialized',
   initializationResult: null,
   downloading: false,
};

const repoManagerSlice = createSlice({
   name: 'repo-manager',
   initialState,
   reducers: {
      initialize(state) {
         state.status = 'initializing';
      },
      setInitializationResult(state, { payload }: PayloadAction<InitializationResult>) {
         state.initializationResult = payload;
         state.status = 'initialized';
      },
      downloadRepositoryUpdates(state) {
         state.downloading = true;
      },
      downloadRepositoryUpdatesFinished(state) {
         state.downloading = false;
      },
   },
});

export const { initialize, setInitializationResult, downloadRepositoryUpdates, downloadRepositoryUpdatesFinished } =
   repoManagerSlice.actions;

export default repoManagerSlice.reducer;
