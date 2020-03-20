import { FoodSuggestion } from 'Models';
import { MealType } from 'Models';
import { createAction } from 'typesafe-actions';

export const setSearchText = createAction('PRODUCTSEARCH/SET_TEXT')<string>();
export const initSearch = createAction('PRODUCTSEARCH/INIT')<MealType>();
export const setSuggestions = createAction('PRODUCTSEARCH/SET_SUGGESTIONS')<FoodSuggestion[]>();
