import { NEW_SPECS, MAPPING_CHANGED } from '../actions/constants';

export const uiInitialState = {
    specs: [],
    mapping: {},
};

export const ui = (state = uiInitialState, action) => {
    if (action.type === NEW_SPECS) {
        return {
            ...state,
            specs: [...state.specs, ...action.payload.files],
        };
    } else if (action.type === MAPPING_CHANGED) {
        return {
            ...state,
            mapping: {
                ...state.mapping,
                [action.payload.id]: action.payload.value,
            },
        };
    }
    return state;
};
