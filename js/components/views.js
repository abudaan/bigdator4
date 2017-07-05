import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

class Views extends Component {
    constructor() {
        super();
        this.index = 0;
    }

    componentDidMount() {
        this.element = document.getElementById('left-pane');
        console.log(this.element);
    }

    render() {
        if (R.isNil(this.element) === false) {
            this.element.innerHTML = `bypass React ${this.index++}`;
        }
        return false;
    }
}

Views.propTypes = {
    specs: PropTypes.arrayOf(PropTypes.shape({ [PropTypes.string]: PropTypes.object })).isRequired,
    mapping: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
};

export default Views;
