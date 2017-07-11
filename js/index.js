import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import R from 'ramda';
import { getStore } from './reducers/store';
import i18n from './util/i18n';
import App from './containers/app';

const store = getStore();
let leftPane;
let rightPane;
let container;

const onresize = () => {
    const wl = leftPane.getBoundingClientRect().width;
    const wr = rightPane.getBoundingClientRect().width;
    const w = wl + wr;
    console.log(wl, wr, w);
    container.style.width = `${w}px`;
};

window.onresize = () => {
    if (R.isNil(container)) {
        container = document.getElementById('container');
        leftPane = document.getElementById('left-pane');
        rightPane = document.getElementById('right-pane');
    }
    window.onresize = onresize;
    onresize();
};

// language = 'nl-NL';
// language = 'de-DE';
const language = 'en-EN';
i18n.changeLanguage(language, () => {
    ReactDOM.render(<I18nextProvider i18n={i18n}>
        <Provider store={store} >
            <App />
        </Provider>
    </I18nextProvider>, document.getElementById('app'));
});
