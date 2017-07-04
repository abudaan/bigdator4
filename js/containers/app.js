import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Mapping from '../components/mapping';
import { addSpecs } from '../actions/actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.onDrop = this.dropHandler.bind(this);
    }

    dropHandler(acceptedFiles, rejectedFiles) {
        addSpecs(acceptedFiles, rejectedFiles);
    }

    render() {
        return (<div className="dropzone">
            <Dropzone
              accept=".json"
              onDrop={this.onDrop}
            >
                <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
            <Mapping specs={this.props.specs} />
        </div>);
    }
}

const mapStateToProps = (state) => {
    const ui = state.ui;
    return {
        specs: ui.specs,
    };
};

App.propTypes = {
    specs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(App);
