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
 * @desc This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * @author BlockSY team - blocksy@symag.com
 */

// Import stuff
import React, { PureComponent } from 'react';

import { connect, dispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {  Route , Switch, IndexRoute } from 'react-router';
import { withRouter } from "react-router-dom";
import { Modal } from 'react-bootstrap'
import  { POPUPS, POPUP_KEY_VALIDATE_EMAIL, POPUP_VALIDATE_EMAIL, POPUP_KEY_NONE } from '../constants/MessageConstants'
import  { TAB_MESSAGES, TAB_DONATIONS, TAB_PUBLISH } from '../constants/AppConstants'

import { retrieveSettings} from '../actions/Settings';
import { forwardTo, setPopup, setAuth0, setAuthState} from '../actions/AppActions';
import { log , logError, logDebug} from '../utils/commons'

import { isNull, clone, saveJSONToStore, readJSONFromStore, deleteJSONFromStore } from '../utils/commons';

import Auth from '../auth/auth0/Auth.react';
import Callback from '../auth/auth0/Callback.react';
import { urlToJSON } from '../utils/url';

// import UI components
import Nav from './NavMenu.react';
import Footer from './Footer.react';

import Main from './pages/Main.react';
import NotFound from './pages/NotFound.react';
import Credits from './pages/Credits.react';
import Logs from './pages/Logs.react';

class App extends PureComponent {

  constructor(props) {
    super(props);

    // as react-router-redux doesn't work that well at this moment
    // we will store the history singleton within window object
    window.blocksy_History = this.props.history;

    // instantiate Auth0
    var auth = new Auth(this.props.dispatch, this);

    this.state = {
      auth: auth,
      urlToJSON: null,
      auth0: {
        displayed: false,
        display: ""
      }
    };
  }

  componentWillMount(){
    try{
      // retrieve demo settings from server
      this.props.dispatch(retrieveSettings())

      // calculate and process routes
      this.checkURLAndRoute()

    } catch(err){
      logError("error mouting app", err)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    this.checkURLAndRoute(nextProps, nextState)

    return true
  }

  checkURLAndRoute(nextProps, nextState){
    var _state = nextState ? nextState : this.state
    var _props = nextProps ? nextProps : this.props
    var state = {}

    var jsonURLState = _state.urlToJSON? _state.urlToJSON : ""

    var jsonURL = urlToJSON(_props.history.location.search, '?')
    if (jsonURL == null) jsonURL = ""

    // remember the previous page and parameters
    // document.referrer remember the very last previous one
    // but our logic must bypass this last previous one sometimes
    // so we implemented the following treatment
    if (_props.history.location.pathname.replace(window.basepathname,'') != "/callback"
        && JSON.stringify(jsonURL) != JSON.stringify(jsonURLState)){
          state["urlToJSON"] = jsonURL
     }

    // calculate and process routes
    this.router(nextState ? false : true, nextProps, nextState, Object.keys(state) > 0 ? state : undefined)
  }

  render() {
    if (this.state == null) return undefined

    // get the content to display from current route
    const pageToDisplay = this.router(true);

    return(
      <div id="root">
        <div className={ "container" } >

          <Nav
              currentPage={this.props.history.location.pathname}
              messages={this.props.data.messages}
              deals={this.props.data.deals}
              interviews={this.props.data.interviews}
              auth={this.state.auth}
              loggedIn={this.props.data.loggedIn}
              history={this.props.history}
              location={this.props.location}
              dispatch={this.props.dispatch}
              currentlySending={this.props.data.currentlySending}
              settings={this.props.data.settings}
              user={this.props.data.user}
              texts={this.props.data.texts}
              fullScreen={this.props.data.fullScreen}
              />

            { this.props.data.popupId > 0 ?
                <div className="form-page__wrapper-overlay">
                  <Modal.Dialog>
                    <Modal.Header>
                      <Modal.Title>{ POPUPS[this.props.data.popupId].title } </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <p dangerouslySetInnerHTML={{__html: POPUPS[this.props.data.popupId].label}}/>
                      <br/><br/>
                    </Modal.Body>

                    <Modal.Footer>
                      <button type="submit" className="form__submit-btn" onClick={ e => this._onConfirm() }>
                        { POPUPS[this.props.data.popupId].buttons.yes }
                      </button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </div>
                :
                <span/>
            }


            { pageToDisplay }

        </div>
        <Footer
          settings={this.props.data.settings}
          user={this.props.data.user}
          />
      </div>
    )
  }

  _onConfirm(){
    this.props.dispatch(setPopup(POPUP_KEY_NONE)) // close popup
  }

  // tired about the issues with react-router
  // here is our own router...
  router(display, nextProps, nextState, state){

    var _state = nextState ? nextState : this.state
    var _props = nextProps ? nextProps : this.props

    var page = null;
    var pathname = _props.history.location.pathname.replace(window.basepathname,'')
    var hash = _props.history.location.hash

    var auth0 = _props.data.auth0

    // handle social auth callback
    var token = readJSONFromStore('token')
    var profile = readJSONFromStore('profile')
    var json =  urlToJSON(hash,'#')

    // look for access_token in URL
    if (isNull(token, "access_token")
        && !isNull(json,"access_token")
        && !_props.data.loggedIn) {
        _state.auth.init()
        _state.auth.setSession(json, false)
    }

    if (!isNull(token, "access_token") && _props.location.hash.startsWith("access_token")){
       _props.dispatch(forwardTo("/"))
    }

    // set previous url in case of callback after authentication
    if (pathname == "/callback" || !isNull(json, "access_token")) {
      pathname = _props.data.previousLocation?
                    _props.data.previousLocation.pathname : "/publish"
    }

    var urlParams = isNull(state)? _state.urlToJSON : state

    if (isNull(urlParams) && !isNull(_props.location)){
      urlParams = urlToJSON(_props.location.search, "?")
    }

    var hashParams = json

    if (!isNull(json,"hd")) pathname = "/hd"
    if (!isNull(json,"publish")) pathname = "/publish"
    if (!isNull(json,"credits")) pathname = "/credits"
    if (!isNull(json,"guestbook")) pathname = "/guestbook"
    if (!isNull(json,"results")) pathname = "/results"
    if (!isNull(json,"logs")) pathname = "/logs"


    switch (pathname){
        case "/":
        case "/publish":
        case "/hd":
        case "/guestbook":
        case "/results":
          if (display){
              page =  ( <Main
                              pathname={ pathname }
                              tab={ pathname == "/guestbook" ? TAB_MESSAGES
                                  : pathname == "/results" ? TAB_DONATIONS
                                  : pathname == "/hd"  ? -1
                                  : TAB_PUBLISH } // pass tab index
                              urlParams={ urlParams }
                              auth={ this.state.auth }
                        />
                      );
          }
          break

        case "/credits":
          if (display) {
              page = ( <Credits texts={this.props.data.texts} settings={this.props.data.settings}/> )
          }
              //TODO: create about page or manage external link in NavMenu
          break;

        case "/logs":
          if (display) {
              page = ( <Logs settings={this.props.data.settings}/> )
          }
             //TODO: create logs page or manage external link in NavMenu
          break;

        // TODO: add other pages

        default:
          break;

    }

    if (state && Object.keys(state) > 0) this.setState(state)
    if (page == null)  page = ( <NotFound/> );

    return page;

  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state.homeReducer,
    location: state.location,
    history: state.history
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(withRouter(App));
