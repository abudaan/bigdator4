import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Mapping from '../components/mapping';
import Views from '../components/views';
import { addSpecs, updateMapping } from '../actions/actions';
import getMapping from '../selectors/get_mapping';

class App extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.dropHandler.bind(this);
    }

    dropHandler(acceptedFiles, rejectedFiles) {
        addSpecs(acceptedFiles, rejectedFiles);
    }

    render() {
        return (<div id="container">
            <div id="left-pane">
                <Views
                  specs={this.props.specs}
                  mapping={this.props.mapping}
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
                <Mapping
                  specsTable={this.props.specsTable}
                  mapping={this.props.mapping}
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
        mapping: ui.mapping,
    };
};

App.propTypes = {
    mapping: PropTypes.shape({ [PropTypes.string]: PropTypes.object }).isRequired,
    specs: PropTypes.arrayOf(PropTypes.object).isRequired,
    specsTable: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(App);
