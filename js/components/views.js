import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

const vega = global.vega; // coding like it's 1999

const viewMap = {};
const mapIndexed = R.addIndex(R.map);

const addView = (container, spec, datasets) => {
    const id: string = spec.id;
    const elem: HTMLElement = document.createElement('div');
    // console.log(container, spec);
    elem.id = spec.id;
    elem.className = 'view';
    container.appendChild(elem);
    viewMap[id] = new vega.View(vega.parse(spec));

    mapIndexed((data, i) => {
        let dataset;
        if (R.isNil(data.url) === false && data.url.indexOf('http:') !== 0) {
            dataset = datasets[data.url.replace(/\./g, '__DOT__')];
            if (R.isNil(dataset) === false) {
                viewMap[id].insert(dataset.name, dataset.values);
                // delete spec.data[i].url; // no need to load from the url anymore
                // spec.data[i].values = dataset.values;
            }
        }
        return 0;
    }, spec.data);

    viewMap[id]
        .run()
        .renderer('svg')
        // .logLevel(vega.Debug)
        .initialize(`#${id}`);
};

const addMappings = (mappings) => {
    R.forEach((mapping) => {
        console.log(mapping);
    }, R.keys(mappings));
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
            R.forEach((spec) => {
                // if (R.isNil(document.getElementById(spec.id))) {
                //     addView(this.element, spec, this.props.datasets);
                // } else {
                //     console.log('no need to update views');
                // }
                addView(this.element, spec, this.props.datasets);
            }, R.values(this.props.specs));
            addMappings(this.props.mappings);
        }
        return false;
    }
}

Views.propTypes = {
    specs: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    datasets: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    mappings: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
};

export default Views;
