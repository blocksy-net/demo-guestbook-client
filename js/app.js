/**
 * The MIT License
 *
 * Copyright (c) 2017-2018 Symag. http://www.symag.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @desc This is the entry file for the application, mostly just setup and boilerplate
 * code
 *
 * @author BlockSY team - blocksy@symag.com
 */

import { log, logError } from './utils/commons'
import { PRODUCTION, setUrlApi, setUrlApp } from './constants/Config'

import 'file-loader?name=[name].[ext]!../manifest.json';

// Import all the React/ReactRouter/Redux/History libs
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router , Route , Switch, IndexRoute } from 'react-router';
import { homeReducer } from './reducers/reducers';
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

// import fonts
import FontFaceObserver from 'fontfaceobserver';

// When Open Sans is loaded, add the js-open-sans-loaded class to the body
// which swaps out the fonts
const openSansObserver = new FontFaceObserver('Open Sans');

openSansObserver.check().then(() => {
  document.body.classList.add('js-open-sans-loaded');
}, (err) => {
  document.body.classList.remove('js-open-sans-loaded');
});

// Import the components used as pages
import App from './components/App.react';

// load devtools if it is not a production build
var Devtools, composeEnhancers = null

var url = window.location.protocol + '//' + window.location.host + window.location.pathname

if (!PRODUCTION) {
  Devtools = require('redux-devtools-extension/logOnlyInProduction');
  composeEnhancers = Devtools.composeWithDevTools({
      // options like actionSanitizer, stateSanitizer
  });
  window.basepathname = '';

  setUrlApp(url)
  setUrlApi(COMPIL_API_URL);
}
else {
    setUrlApp(url)
    setUrlApi("/api", true); // pass true in order to take app base url as url to find the server api
    window.basepathname = window.location.pathname.substring(0, window.location.pathname.length - 1);
}

// Import the CSS file, which webpack transfers to the build folder
import '../css/main.css';

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const middleware = [thunk];

const store =
  PRODUCTION ?
    createStore(
      combineReducers({homeReducer}),
      applyMiddleware(thunk)
    )
    :
    createStore(
      combineReducers({homeReducer}),
      composeEnhancers(applyMiddleware(...middleware))
    );

// render page in 'app' div
render(
  <Provider store={ store }>
    <Router history={ history }>
        <App/>
    </Router>
  </Provider>,
  document.getElementById('app')
);
