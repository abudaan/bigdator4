import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

const createMapping = specs =>
    R.map((spec) => {
        const signalNames = R.reduce((acc, s) =>
            `${acc} ${s.name}`, `${spec.description}: `, spec.signals || [{ name: 'none' }]);
        return (<div key={spec.description}>{signalNames}</div>);
    }, specs);

const Mapping = (props) => {
    console.log('render Mapping', props.specs);
    return (<div>
        {createMapping(props.specs)}
    </div>);
};

Mapping.propTypes = {
    specs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Mapping;
