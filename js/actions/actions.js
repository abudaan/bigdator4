import R from 'ramda';
import { getStore } from '../reducers/store';
import { NEW_SPECS } from '../actions/constants';

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
            const f1 = R.filter(f => f.$schema === 'https://vega.github.io/schema/vega/v3.0.json', parsedFiles);
            dispatch({
                type: NEW_SPECS,
                payload: {
                    files: f1,
                },
            });
        });
    }
};

const mappingChanged = (mapping) => {

};

export {
    addSpecs,
    mappingChanged,
};
