import { NEW_SPECS, MAPPING_CHANGED } from '../actions/constants';

export const uiInitialState = {
    specs: {},
    datasets: {},
    mappings: {},
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
        };
    } else if (action.type === MAPPING_CHANGED) {
        return {
            ...state,
            mappings: {
                ...state.mappings,
                [action.payload.id]: action.payload.value,
            },
        };
    }
    return state;
};
