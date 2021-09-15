import { RootState } from 'src/store';

export const selectIsFirstStart = (state: RootState) => state.settings.firstStart;

export const selectSettingsLoaded = (state: RootState) => state.settings._persist.rehydrated as boolean | undefined;
