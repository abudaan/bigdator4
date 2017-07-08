import R from 'ramda';
import { getStore } from '../reducers/store';
import { NEW_SPECS, MAPPING_CHANGED } from '../actions/constants';

const dispatch = getStore().dispatch;

const readFiles = (index, files, parsedFiles, callback) => {
    if (index === files.length) {
        callback(parsedFiles);
        return;
    }
    const file = files[index];
    const reader = new FileReader();
    reader.onload = (event) => {
        const json = JSON.parse(event.target.result);
        if (R.isNil(json.description)) {
            json.description = 'no description';
        }
        if (R.isNil(json.signals)) {
            json.signals = [];
        }
        json.id = file.name.replace(/\./g, '__DOT__');
        json.fileName = file.name;
        readFiles(
            index + 1,
            files,
            [...parsedFiles, json],
            callback,
        );
    };
    reader.readAsText(file);
};

const addSpecs = (acceptedFiles, rejectedFiles) => {
    // TODO: check if a file with the same name has already been uploaded
    // TODO: do something with the rejectedFiles

    if (rejectedFiles.length > 0) {
        console.log('rejected', rejectedFiles);
    }

    if (acceptedFiles.length > 0) {
        readFiles(0, acceptedFiles, [], (parsedFiles) => {
            const datasets = R.reduce((acc, d) => ({
                ...acc,
                [d.id]: d,
            }), {}, R.filter(f => R.isNil(f.$schema), parsedFiles));
            const specs = R.reduce((acc, s) => ({
                ...acc,
                [s.id]: s,
            }), {}, R.filter(f => f.$schema === 'https://vega.github.io/schema/vega/v3.0.json', parsedFiles));
            dispatch({
                type: NEW_SPECS,
                payload: {
                    specs,
                    datasets,
                },
            });
        });
    }
};

const updateMapping = (event) => {
    const target = event.target;
    dispatch({
        type: MAPPING_CHANGED,
        payload: {
            id: target.id,
            value: target.checked ? target.checked : null,
        },
    });
};

export {
    addSpecs,
    updateMapping,
};
