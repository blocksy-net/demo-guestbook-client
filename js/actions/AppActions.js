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
 * @desc Main app actions
 * @author BlockSY team - blocksy@symag.com
 */

import bcrypt from 'bcryptjs';
import {  CHANGE_LOCATION,
          SENDING_REQUEST, SET_ERROR_MESSAGE,
          SET_POPUP, SET_AUTH0, SET_AUTH, SET_SERVER_ERROR
        } from '../constants/AppConstants';
import { retrieveSettings } from './Settings'
import * as errorMessages  from '../constants/MessageConstants';
import { log, isNull, readJSONFromStore } from '../utils/commons'

/**
 * Send the user to the location
 */
export function goTo(location, previousLocationObject) {
  forwardTo(location, previousLocationObject)
}

/**
 * Forwards the user to the specified page
 * @param {string} location The route the user should be forwarded to
 */
export function forwardTo(location, previousLocationObject, loggedIn) {
  return (dispatch) => {

    var previousLocation = null

    if (previousLocationObject){
      previousLocation = {}
      previousLocation["pathname"] = previousLocationObject.pathname
      previousLocation["search"] = previousLocationObject.search

      log("AppActions goto previousLocation: "+JSON.stringify(previousLocation))
    }

    log("AppActions goto location="+location+" previousLocation="+JSON.stringify(previousLocation))

    dispatch(changeLocation(location, previousLocation ? previousLocation : false));
  }
}

/**
 * Sets the location state
 * @param  {object} newState          The new location
 * @return {object}                   Formatted action for the reducer to handle
 */
export function changeLocation(newState, previousLocation) {
  log("forward to "+newState+" with previousLocation "+JSON.stringify(previousLocation));
  if (newState == null) return

  var storedLocation = readJSONFromStore('previousLocation')

  // clean previous location after processing it
  if (!isNull(storedLocation, "pathname") && newState == storedLocation.pathname){
      localStorage.removeItem('previousLocation')
  }

  window.blocksy_History.push(window.basepathname+newState); // injected by App.react.js
  return { type: CHANGE_LOCATION, newState, previousLocation };
}

export function setAuth(newState, authResult) {
  return (dispatch) => {
    dispatch(setAuthState(newState, authResult))
  }
}

/**
 * Sets the authentication state of the application
 * @param {boolean} newState True means a user is logged in, false means no user is logged in
 */
export function setAuthState(newState, authResult, profile) {
  return { type: SET_AUTH, newState, authResult, profile };
}

export function setAuth0(auth0Called, auth0Displayed, auth0Popup) {
  return (dispatch) => {
    dispatch(setAuth0State(auth0Called, auth0Displayed, auth0Popup))
  }
}

/**
 * Indicates Auth0 state
 * @param {boolean} newState True means a user is logged in, false means no user is logged in
 */
export function setAuth0State(auth0Called, auth0Displayed, auth0Popup) {
  return { type: SET_AUTH0, auth0Called, auth0Displayed, auth0Popup };
}

/**
 * Sets the popup state of the application
 * @param {boolean} newState True means a user is logged in, false means no user is logged in
 */
export function setPopup(popupId) {
  return { type: SET_POPUP, popupId };
}

/**
 * Sets the popup state of the application
 * @param {boolean} error Error message
 */
export function setServerError(error) {
  return { type: SET_SERVER_ERROR, error };
}


/**
 * Sets the requestSending state, which displays a loading indicator during requests
 * @param  {boolean} sending The new state the app should have
 * @return {object}          Formatted action for the reducer to handle
 */
export function sendingRequest(sending) {
  return { type: SENDING_REQUEST, sending };
}

/**
 * Sets the errorMessages state, which displays the ErrorMessage component when it is not empty
 * @param message
 */
export function setErrorMessage(message) {
  return setErrorMessages({error: message});
}

/**
 * Sets the errorMessages state
 * @param message
 */
export function setErrorMessages(messages) {
  return (dispatch) => {
    dispatch({ type: SET_ERROR_MESSAGE, messages });

    const form = document.querySelector('.form-page__form-wrapper');
    if (form) {
      form.classList.add('js-form__err-animation');
      // Remove the animation class after the animation is finished, so it
      // can play again on the next error
      setTimeout(() => {
        form.classList.remove('js-form__err-animation');
      }, 150);

      // Remove the error message after 5s seconds
      setTimeout(() => {
        dispatch({ type: SET_ERROR_MESSAGE, messages: [] });
      }, 5000);
    }
  }
}

/**
 * Checks if any elements of a JSON object are empty
 * @param  {object} elements The object that should be checked
 * @return {boolean}         True if there are empty elements, false if there aren't
 */
function anyElementsEmpty(elements) {
  for (let element in elements) {
    if (!elements[element]) {
      return true;
    }
  }
  return false;
}
