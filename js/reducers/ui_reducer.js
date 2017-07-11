import R from 'ramda';
import { NEW_SPECS, MAPPING_CHANGED } from '../actions/constants';

export const uiInitialState = {
    specs: {},
    datasets: {},
    mappings: {},
    updated: {
        specs: false,
        datasets: false,
        mappings: false,
    },
};

export const ui = (state = uiInitialState, action) => {
    if (action.type === NEW_SPECS) {
        return {
            ...state,
            specs: {
                ...state.specs,
                ...action.payload.specs,
            },
            datasets: {
                ...state.datasets,
                ...action.payload.datasets,
            },
            updated: {
                specs: R.keys(action.payload.specs).length > 0,
                datasets: R.keys(action.payload.datasets).length > 0,
                mappings: false,
            },
        };
    } else if (action.type === MAPPING_CHANGED) {
        const updated = {
            specs: false,
            datasets: false,
            mappings: true,
        };

        if (action.payload.value !== true) {
            const m = { ...state.mappings };
            delete m[action.payload.id];
            return {
                ...state,
                updated,
                mappings: m,
            };
        }

        return {
            ...state,
            updated,
            mappings: {
                ...state.mappings,
                [action.payload.id]: action.payload.value,
            },
        };
    }
    return state;
};
