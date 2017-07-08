import R from 'ramda';
import { createSelector } from 'reselect';

const getUI = state => state.ui;

export default createSelector([getUI], (ui) => {
    const {
        specs,
        // mapping,
    } = ui;

    const signalsBySpec = R.map((spec) => {
        const signals = R.map(s => s.name, spec.signals);
        return {
            id: spec.id,
            signals,
        };
    }, R.values(specs));

    const specsTable = R.reduce((acc, spec) => {
        if (R.length(spec.signals) > 0) {
            const otherSpecs = R.filter(s => s.id !== spec.id && s.signals.length > 0, signalsBySpec);
            return {
                ...acc,
                [spec.id]: {
                    id: spec.id,
                    signals: spec.signals,
                    otherSpecs,
                },
            };
        }
        return acc;
    }, {}, signalsBySpec);
    return specsTable;
});
