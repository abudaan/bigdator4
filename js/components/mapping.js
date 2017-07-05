import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

let index = Date.now();
const getKey = () => {
    index += 1;
    return `key_${index}`;
};

const createMapping = (specsTable, mapping) => {
    if (specsTable.length < 2) {
        return <div />;
    }
    const tables = R.map((spec) => {
        const headers = (<tr key={getKey()}>{
            R.prepend(<th key={getKey()}>{spec.name}</th>, R.map(s => <th key={getKey()}>{s}</th>, spec.signals))
        }</tr>);

        const rows = R.map((otherSpec) => {
            const n = (<tr
              key={getKey()}
              className="specname"
            >
                <td
                  key={getKey()}
                  colSpan={spec.signals.length + 1}
                >
                    {otherSpec.name}
                </td>
            </tr>);
            const a = R.repeat(1, spec.signals.length);
            const r = R.map(signalName => <tr key={getKey()}>
                <td
                  key={getKey()}
                >
                    {`  - ${signalName}`}
                </td>
                {R.map(() => <td key={getKey()} className="checkbox"><input type="checkbox" key={getKey()} /></td>, a)}
            </tr>, otherSpec.signals);
            return [n, ...r];
        }, spec.otherSpecs);

        // <span>{spec.name}</span>
        return (<div className="mapping" key={spec.name}>
            <table>
                <tbody>
                    {headers}
                    {rows}
                </tbody>
            </table>
        </div>);
    }, specsTable);
    return tables;
};

const Mapping = props => (<div>
    {createMapping(props.specsTable, props.mapping)}
</div>);

Mapping.propTypes = {
    mapping: PropTypes.arrayOf(PropTypes.object).isRequired,
    specsTable: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Mapping;
