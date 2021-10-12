import { createAction } from '@reduxjs/toolkit';

export const updateRepository = createAction<string>('repo-manager/update');
