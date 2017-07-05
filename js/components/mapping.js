import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

let index = Date.now();
const getKey = () => {
    index += 1;
    return `key_${index}`;
};

const createMapping = (specs, mapping) => {
    const tables = R.map((spec) => {
        const headers = (<tr key={getKey()}>{
            R.prepend(<th key={getKey()}>{spec.name}</th>, R.map(s => <th key={getKey()}>{s}</th>, spec.signals))
        }</tr>);
        const rows = R.map((os) => {
            const n = <tr key={getKey()} className="specname"><td key={getKey()} colSpan={os.signals.length + 1}>{os.name}</td></tr>;
            const a = R.repeat(1, spec.signals.length);
            const r = R.map(signalName => <tr key={getKey()}>
                <td key={getKey()}>{`  - ${signalName}`}</td>
                {R.map(() => <td key={getKey()}><input type="checkbox" key={getKey()} /></td>, a)}
            </tr>, os.signals);
            return [n, ...r];
        }, spec.otherSignals);

        return (<div className="mapping" key={spec.name}>
            <span>{spec.name}</span>
            <table>
                <tbody>
                    {headers}
                    {rows}
                </tbody>
            </table>
        </div>);
    }, specs);
    return tables;
};

const Mapping = props => (<div>
    {createMapping(props.signals, props.mapping)}
</div>);

Mapping.propTypes = {
    signals: PropTypes.arrayOf(PropTypes.object).isRequired,
    mapping: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Mapping;
