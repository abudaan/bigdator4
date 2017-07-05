import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

const vega = global.vega; // coding like it's 1999

const viewMap = {};

const addView = (container, spec) => {
    const elem: HTMLElement = document.createElement('div');
    const name: string = spec.fileName.replace(/\./g, '_');
    // console.log(container, spec);
    elem.id = name;
    elem.className = 'view';
    container.appendChild(elem);
    // const ds = R.clone(dataset);
    viewMap[name] = new vega.View(vega.parse(spec))
        .renderer('svg')
        // .logLevel(vega.Debug)
        .initialize(`#${name}`)
        // .insert(dataset.name, dataset.values)
        // .insert(ds.name, ds.values)
        .run();
};

class Views extends Component {
    constructor() {
        super();
        this.index = 0;
    }

    componentDidMount() {
        this.element = document.getElementById('left-pane');
        // console.log(this.element);
    }

    render() {
        if (R.isNil(this.element) === false) {
            R.forEach(spec => addView(this.element, spec), this.props.specs);
            // addView(this.element, this.props.specs[0]);
        }
        return false;
    }
}

Views.propTypes = {
    specs: PropTypes.arrayOf(PropTypes.shape({ [PropTypes.string]: PropTypes.object })).isRequired,
    mapping: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
};

export default Views;
