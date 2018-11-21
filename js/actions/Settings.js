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
 * @desc API calls related to settings (config or dictionary for example)
 * @author BlockSY team - blocksy@symag.com
 */

import axios from 'axios'
axios.defaults.withCredentials = true;

import 'whatwg-fetch'
import { SET_SETTINGS } from '../constants/AppConstants';
import { goTo, setAuthState, sendingRequest, setErrorMessage, forwardTo} from './AppActions'
import { PRODUCTION, buildApiUrl } from '../constants/Config'
import { log, logError, readJSONFromStore } from '../utils/commons'

export const SETTINGS_API_ROOT = '/settings'

/**
 * Retrieve settings
 */
export function retrieveSettings() {
  return (dispatch) => {

    dispatch(sendingRequest(true))

    axios.get(buildApiUrl(SETTINGS_API_ROOT),{
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
        try{
          dispatch(setSettings(resp.data))
          dispatch(sendingRequest(false))
        }
        catch (err){
          logError("error trying to retrieve settings", err)
        }
    }).catch(function(error) {
      logError("error trying to retrieve settings", error)
      dispatch(sendingRequest(false))
    });
  }
}

/**
 * Sets the form state
 * @param  {object} newState          User's interviews
 * @return {object}                   Formatted action for the reducer to handle
 */
export function setSettings(newState) {
  return { type: SET_SETTINGS, newState };
}

/*
* Utils
*/
function parseJSON(response) {
  return response.json()
}
