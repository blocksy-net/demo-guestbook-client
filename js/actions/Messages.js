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
 * @desc API calls related to guestbook posts
 * @author BlockSY team - blocksy@symag.com
 */

import axios from 'axios'
axios.defaults.withCredentials = true;

import 'whatwg-fetch'
import { SET_MESSAGES } from '../constants/AppConstants';
import { goTo, setAuthState, sendingRequest, setErrorMessage, forwardTo} from './AppActions'
import { PRODUCTION, buildApiUrl } from '../constants/Config'
import { log, logError, readJSONFromStore, isNull } from '../utils/commons'

export const MESSAGES_API_ROOT = '/messages'

var alreadyCalling = false

/**
 * Retrieve Guestbook messages (as a candidate, a recruiter and a referrer)
 */
export function retrieveMessages(pageNumber) {
  return (dispatch) => {

    if (alreadyCalling) return

    log("DEBUG Messages retrieveMessages");

    dispatch(sendingRequest(true))

    // disable simultaneous calls
    alreadyCalling = true

    axios.get(buildApiUrl(MESSAGES_API_ROOT,{pages:pageNumber}),{
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
        try{
          var messages = []

          if (!isNull(resp.data, "messages"))
            messages = resp.data.messages

          dispatch(setMessages(messages, pageNumber))

        }
        catch (err){
            logError("error trying to retrieve messages", err)
        }

        alreadyCalling = false
        dispatch(sendingRequest(false))
    }).catch(function(error) {
      logError("error trying to retrieve messages", error)
      alreadyCalling = false
      dispatch(sendingRequest(false))
    });
  }
}

/**
 * Sets the form state
 * @param  {object} newState          User's messages
 * @return {object}                   Formatted action for the reducer to handle
 */
export function setMessages(messages, pageNumber) {
  return { type: SET_MESSAGES, messages, pageNumber};
}

/*
* Utils
*/
function parseJSON(response) {
  return response.json()
}
