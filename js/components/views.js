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

    mapIndexed((data, i) => {
        let dataset;
        if (R.isNil(data.url) === false && data.url.indexOf('http:') !== 0) {
            dataset = datasets[data.url.replace(/\./g, '__DOT__')];
            if (R.isNil(dataset) === false) {
                delete spec.data[i].url; // no need to load from the url anymore
                spec.data[i].values = dataset.values;
            }
        }
        return 0;
    }, spec.data);

    const view = new vega.View(vega.parse(spec))
        .renderer('svg')
        // .logLevel(vega.Debug)
        .initialize(`#${id}`)
        .run();

    viewMap[id] = {
        listeners: [],
        view,
    };
};

const addMappings = (mappings) => {
    R.forEach((o) => {
        R.forEach((l) => {
            o.view.removeSignalListener(l[0], l[1]);
        }, o.listeners);
        o.bindings = [];
    }, R.values(viewMap));

    R.forEach((mapping) => {
        const s = mapping.split('::');
        const s0 = s[0].split(':');
        const s1 = s[1].split(':');

        const emitterId = s0[0];
        const emitterSignal = s0[1];
        const receiverId = s1[0];
        const receiverSignal = s1[1];
        // console.log(mapping);
        // console.log(emitterId, emitterSignal, receiverId, receiverSignal);

        const emitter = viewMap[emitterId].view;
        const receiver = viewMap[receiverId].view;
        const handler = (name: string, data: *) => {
            try {
                receiver.signal(receiverSignal, data).run();
            } catch (e) {
                console.error(`incompatible data between signals: ${emitterSignal} -> ${receiverSignal}`, data);
            }
        };

        emitter.addSignalListener(emitterSignal, handler);
        viewMap[emitterId].bindings.push([emitterSignal, handler]);
    }, R.keys(mappings));
};

class Views extends Component {
    constructor() {
        super();
        this.index = 0;
    }

    componentDidMount() {
        this.leftPane = document.getElementById('left-pane');
    }

    render() {
        if (R.isNil(this.leftPane) === false) {
            if (this.props.updated.specs === true || this.props.updated.datasets === true) {
                // console.log('render');
                R.forEach((spec) => {
                    // if (R.isNil(document.getElementById(spec.id))) {
                    //     addView(this.leftPane, spec, this.props.datasets);
                    // } else {
                    //     console.log('no need to update views');
                    // }
                    addView(this.leftPane, spec, this.props.datasets);
                }, R.values(this.props.specs));
            }
            addMappings(this.props.mappings);
        }
        return false;
    }
}

Views.propTypes = {
    specs: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    datasets: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    mappings: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    updated: PropTypes.shape([PropTypes.string]: PropTypes.bool).isRequired,
};

export default Views;
