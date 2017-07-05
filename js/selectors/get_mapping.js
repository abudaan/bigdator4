import R from 'ramda';
import { createSelector } from 'reselect';

const getUI = state => state.ui;

export default createSelector([getUI], (ui) => {
    const {
        specs,
        // mapping,
    } = ui;

    const signalsBySpec = R.map((spec) => {
        const signals = R.map(s => s.name, spec.signals || []);
        return {
            name: spec.fileName,
            signals,
        };
    }, specs);

    const signals = R.map((spec) => {
        const otherSignals = R.filter(s => s.name !== spec.name, signalsBySpec);
        return {
            name: spec.name,
            signals: spec.signals,
            otherSignals,
        };
    }, signalsBySpec);

    return signals;
});
