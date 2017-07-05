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
            name: spec.fileName,
            signals,
        };
    }, specs);

    const specsTable = R.map((spec) => {
        if (R.length(spec.signals) === 0) {
            return null;
        }
        const otherSpecs = R.filter(s => s.name !== spec.name && s.signals.length > 0, signalsBySpec);
        return {
            name: spec.name,
            signals: spec.signals,
            otherSpecs,
        };
    }, signalsBySpec);
    // console.log(R.reject(R.isNil, specsTable));
    return R.reject(R.isNil, specsTable);
});
