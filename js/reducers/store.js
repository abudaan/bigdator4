import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import { autoRehydrate } from 'redux-persist';
// import thunkMiddleware from 'redux-thunk'
import type { CombinedReducer } from 'redux';
import { ui, uiInitialState } from './ui_reducer';

const initialState = {
    ui: uiInitialState,
};

const combinedReducers = combineReducers({ ui });
// create dummy store to prevent a null value, use the boolean initialized instead of a null check
// to see if a store has already been created (singleton-ish)
let store = createStore(combinedReducers, initialState);
let initialized = false;

export const getNewStore = () => {
    const s = createStore(
        combinedReducers,
        initialState,
        compose(
            autoRehydrate(),
            applyMiddleware(
                // thunkMiddleware,
                createLogger({ collapsed: true }),
            ),
        ),
    );
    return s;
};

export function getStore() {
    if (initialized === false) {
        initialized = true;
        store = getNewStore();
    }
    return store;
}
