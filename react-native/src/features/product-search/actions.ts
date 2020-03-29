import { ConsumptionTime, FoodSuggestion } from 'Models';
import { createAction } from 'typesafe-actions';

export const setSearchText = createAction('PRODUCTSEARCH/SET_TEXT')<string>();
export const initSearch = createAction('PRODUCTSEARCH/INIT')<ConsumptionTime>();
export const setSuggestions = createAction('PRODUCTSEARCH/SET_SUGGESTIONS')<FoodSuggestion[]>();
export const appendSuggestions = createAction('PRODUCTSEARCH/APPEND_SUGGESTIONS')<FoodSuggestion[]>();
