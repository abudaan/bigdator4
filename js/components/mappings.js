import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

let index = Date.now();
const getKey = () => {
    index += 1;
    return `key_${index}`;
};

const toName = id => id.replace(/__DOT__/g, '.');

const createCheckboxes = (specId, otherSpecId, signalName, signals, mapping, updateMapping) => R.map((signal) => {
    const id = `${specId}:${signal}::${otherSpecId}:${signalName}`;
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
    if (R.keys(specsTable).length < 2) {
        return <div />;
    }
    const tables = R.map((spec) => {
        const headers = (<tr key={getKey()}>{
            R.prepend(<th key={getKey()}>{toName(spec.id)}</th>, R.map(s => <th key={getKey()}>{s}</th>, spec.signals))
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
                    {toName(otherSpec.id)}
                </td>
            </tr>);
            const r = R.map(signalName => <tr key={getKey()}>
                <td
                  key={getKey()}
                >
                    {`\u00A0\u00A0-\u00A0${signalName}`}
                </td>
                {createCheckboxes(spec.id, otherSpec.id, signalName, spec.signals, mapping, updateMapping)}
            </tr>, otherSpec.signals);
            return [n, ...r];
        }, spec.otherSpecs);

        // <span>{spec.id}</span>
        return (<div className="mapping" key={spec.id}>
            <table>
                <tbody>
                    {headers}
                    {rows}
                </tbody>
            </table>
        </div>);
    }, R.values(specsTable));
    return tables;
};

const Mappings = props => (<div>
    {createMapping(props.specsTable, props.mappings, props.updateMapping)}
</div>);

Mappings.propTypes = {
    mappings: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    specsTable: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    updateMapping: PropTypes.func.isRequired,
};

export default Mappings;
