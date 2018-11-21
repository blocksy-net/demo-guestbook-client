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
 * @desc API calls related to Guestbook users
 * @author BlockSY team - blocksy@symag.com
 */

import axios from 'axios'
axios.defaults.withCredentials = true;

import 'whatwg-fetch'
import { CHANGE_USER, REINIT_USER } from '../constants/AppConstants';
import { goTo, setAuthState, sendingRequest, forwardTo, setServerError} from './AppActions'
import { PRODUCTION, buildApiUrl } from '../constants/Config'
import { log, logError, readJSONFromStore, deleteJSONFromStore } from '../utils/commons'

export const USERS_API_ROOT = '/users'

/**
 * Create a new User within the Guestbook
 */
export function createUser(user) {
  return (dispatch) => {
    log("DEBUG Users createUser");

    dispatch(sendingRequest(true))

    axios.post(buildApiUrl(USERS_API_ROOT),JSON.stringify(user),{
      headers: {
           'Content-Type': 'application/json;charset=UTF-8'
      },
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
      try {
        log(resp.data)
        log(resp.status)
        log(resp.statusText)
        log(resp.headers)
        log(resp.config)

        dispatch(changeUser(resp.data))
      }
      catch (err){
        logError("******* ERROR User.js createUser: "+err)
      }

      dispatch(sendingRequest(false))
    }).catch(function(error) {
      dispatch(setServerError(error.response))
      dispatch(sendingRequest(false))
      logError("**** users error: "+JSON.stringify(error))
    });
  }
}

/**
 * Get Guestbook user by uid
 */
export function getUser(uid, userId, bypassAuth) {
  return (dispatch) => {

    dispatch(sendingRequest(true))
    dispatch(reinitUser())

    var url = buildApiUrl(USERS_API_ROOT)+"/"+uid
    if (userId) url += "?userId="+userId

    axios.get( url, {
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
      try{
        dispatch(changeUser(resp.data))
        dispatch(sendingRequest(false))
      }
      catch (err){
        logError("error trying to retrieve user", err)
      }

    }).catch(function(error) {

      logError("error trying to retrieve user", error)
      dispatch(sendingRequest(false))
    });
  }
}

/**
* Log user out
*/
export function logout() {
  return (dispatch) => {
      deleteJSONFromStore("token")
      deleteJSONFromStore("profile")
      dispatch(setAuthState(false, "", null))
  }
}

/**
 * Sets the user user state
 * @param  {object} newState          The user to add
 * @return {object}                   Formatted action for the reducer to handle
 */
export function addUser(newState) {
  return (dispatch) => {
    dispatch(changeUser(newState));
  }
}

/**
 * Sets the user state
 * @param  {object} newState          The new state of the form
 * @param  {string} newState.candidate The new text of the username input field of the form
 * @return {object}                   Formatted action for the reducer to handle
 */
export function changeUser(newState) {
  return { type: CHANGE_USER, newState};
}

/**
 * Reinits user state
 * @return {object}                   Formatted action for the reducer to handle
 */
export function reinitUser(previousUser) {
  //TODO: deleteJSONFromStore("token")
  //TODO: deleteJSONFromStore("profile")
  return { type: REINIT_USER, previousUser };
}

/*
* Utils
*/
function parseJSON(response) {
  return response.json()
}
