import { RootState } from 'src/store';

export const selectInitializationResultStatus = (state: RootState) => state.repoManager.initializationResult?.type;

export const selectInitializationResult = (state: RootState) => state.repoManager.initializationResult;

export const selectProducts = (state: RootState) =>
   (state.repoManager.initializationResult?.type !== 'not-initialized' &&
      state.repoManager.initializationResult?.data) ||
   undefined;

export const selectIsDownloadingIndexes = (state: RootState) => state.repoManager.downloading;

export const selectProduct = (state: RootState, productId: string) => {
   if (!state.repoManager.initializationResult) return undefined;
   if (state.repoManager.initializationResult.type === 'not-initialized') return undefined;

   return state.repoManager.initializationResult.data[productId] ?? null;
};
