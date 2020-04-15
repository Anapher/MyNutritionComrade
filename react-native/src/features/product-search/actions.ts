import { RequestErrorResponse } from 'src/utils/error-result';
import { ConsumptionTime, SearchResult } from 'Models';
import { createAction } from 'typesafe-actions';

export const setSearchText = createAction('PRODUCTSEARCH/SET_TEXT')<string>();
export const initSearch = createAction('PRODUCTSEARCH/INIT')<ConsumptionTime>();
export const setSuggestions = createAction('PRODUCTSEARCH/SET_SUGGESTIONS')<SearchResult[]>();
export const appendSuggestions = createAction('PRODUCTSEARCH/APPEND_SUGGESTIONS')<SearchResult[]>();
export const suggestionRequestFailed = createAction('PRODUCTSEARCH/SUGGESTIONREQUEST_FAILURE')<RequestErrorResponse>();
