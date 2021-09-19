import { RootState } from 'src/store';

export const selectIsFirstStart = (state: RootState) => state.settings.firstStart;

export const selectSettingsLoaded = (state: RootState) =>
   (state.settings as any)._persist.rehydrated as boolean | undefined;

export const selectPersonalInfo = (state: RootState) => state.settings.personalInfo;
