import _ from 'lodash';
import { RootState } from 'MyNutritionComrade';
import { Store } from 'redux';
import { AsyncStorage } from 'react-native';

const storageKey = 'state';

let storageState: Partial<RootState> | null = null;

type ExtractStateFn = (state: RootState) => Partial<RootState>;

/**
 * Automatically save parts of the state in the browser storage
 * @param store the redux store
 * @param getStorageState get the part of the state that should be persisted
 */
export function persistState(store: Store, getStorageState: ExtractStateFn) {
    store.subscribe(() => {
        const state: RootState = store.getState();

        const newStorageState = getStorageState(state);
        if (!_.isEqual(storageState, newStorageState)) {
            storageState = newStorageState;
            AsyncStorage.setItem(storageKey, JSON.stringify(newStorageState));
        }
    });
}

/**
 * Load the persisted state from the browser storage
 * reducer does not use initialState if the state is partially there which leads to unexpected states
 */
export async function loadState(): Promise<Partial<RootState>> {
    const storageValue = await AsyncStorage.getItem(storageKey);

    if (storageValue === null) {
        return {};
    }

    return JSON.parse(storageValue) as Partial<RootState>;
}
