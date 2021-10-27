import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitializationResult } from 'src/services/product-index-factory';

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
      productRepositoryUpdated(state) {
         state.downloading = false;
      },
      updateRepository(state, _: PayloadAction<string>) {
         state.downloading = true;
      },
   },
});

export const {
   initialize,
   setInitializationResult,
   downloadRepositoryUpdates,
   productRepositoryUpdated,
   updateRepository,
} = repoManagerSlice.actions;

export default repoManagerSlice.reducer;
