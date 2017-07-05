import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

let index = Date.now();
const getKey = () => {
    index += 1;
    return `key_${index}`;
};

const createCheckboxes = (signalName, signals, mapping, updateMapping) => R.map((signal) => {
    const id = `${signalName}:${signal}`;
    return (<td
      key={getKey()}
      className="checkbox"
    >
        <input
          id={id}
          key={id}
          type="checkbox"
          checked={R.isNil(mapping[id]) === false}
          onChange={updateMapping}
        />
    </td>);
}, signals);

const createMapping = (specsTable, mapping, updateMapping) => {
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
            const r = R.map(signalName => <tr key={getKey()}>
                <td
                  key={getKey()}
                >
                    {`\u00A0\u00A0-\u00A0${signalName}`}
                </td>
                {createCheckboxes(signalName, spec.signals, mapping, updateMapping)}
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
    {createMapping(props.specsTable, props.mapping, props.updateMapping)}
</div>);

Mapping.propTypes = {
    mapping: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    specsTable: PropTypes.arrayOf(PropTypes.object).isRequired,
    updateMapping: PropTypes.func.isRequired,
};

export default Mapping;
