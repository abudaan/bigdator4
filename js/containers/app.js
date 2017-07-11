import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Mappings from '../components/mappings';
import Views from '../components/views';
import { addSpecs, updateMapping } from '../actions/actions';
import getMapping from '../selectors/get_mapping';

class App extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.dropHandler.bind(this);
    }

    componentDidMount() {
        this.container = document.getElementById('container');
        this.leftPane = document.getElementById('left-pane');
        this.rightPane = document.getElementById('right-pane');
    }

    dropHandler(acceptedFiles, rejectedFiles) {
        addSpecs(acceptedFiles, rejectedFiles);
    }

    render() {
        // whoo, this is ugly!
        setTimeout(() => {
            const wl = this.leftPane.getBoundingClientRect().width;
            const wr = this.rightPane.getBoundingClientRect().width;
            const w = wl + wr;
            console.log(wl, wr, w);
            this.container.style.width = `${w}px`;
        }, 100);

        return (<div id="container">
            <div id="left-pane">
                <Views
                  specs={this.props.specs}
                  datasets={this.props.datasets}
                  mappings={this.props.mappings}
                  updated={this.props.updated}
                />
            </div>
            <div id="right-pane">
                <Dropzone
                  className="dropzone"
                  accept=".json"
                  onDrop={this.onDrop}
                >
                    <p>Try dropping some files here, or click to select files to upload.</p>
                </Dropzone>
                <Mappings
                  specsTable={this.props.specsTable}
                  mappings={this.props.mappings}
                  updateMapping={updateMapping}
                />
            </div>
        </div>);
    }
}

const mapStateToProps = (state) => {
    const specsTable = getMapping(state);
    const ui = state.ui;
    return {
        specsTable,
        specs: ui.specs,
        datasets: ui.datasets,
        mappings: ui.mappings,
        updated: ui.updated,
    };
};

App.propTypes = {
    specs: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    datasets: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    mappings: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    updated: PropTypes.shape([PropTypes.string]: PropTypes.bool).isRequired,
    specsTable: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
};

export default connect(mapStateToProps)(App);
