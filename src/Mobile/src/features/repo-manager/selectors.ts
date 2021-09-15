import { RootState } from 'src/store';

export const selectInitializationResultStatus = (state: RootState) => state.repoManager.initializationResult?.type;

export const selectInitializationResult = (state: RootState) => state.repoManager.initializationResult;
