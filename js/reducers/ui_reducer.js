import { NEW_SPECS } from '../actions/constants';

export const uiInitialState = {
    specs: [],
};

export const ui = (state = uiInitialState, action) => {
    if (action.type === NEW_SPECS) {
        return {
            ...state,
            specs: [...state.specs, ...action.payload.files],
        };
    }
    return state;
};
