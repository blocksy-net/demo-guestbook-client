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
 * @desc API calls related to donations
 * @author BlockSY team - blocksy@symag.com
 */

import axios from 'axios'
axios.defaults.withCredentials = true;

import 'whatwg-fetch'
import { SET_DONATIONS_BALANCE, SET_DONATION_BALANCE} from '../constants/AppConstants';
import { goTo, setAuthState, sendingRequest, setErrorMessage, forwardTo} from './AppActions'
import { PRODUCTION, buildApiUrl } from '../constants/Config'
import { log, logError, readJSONFromStore, isNull} from '../utils/commons'

export const DONATIONS_API_ROOT = '/donations'

/**
 * Retrieve donations balance for all organisations
 */
export function retrieveDonationsBalance() {
  return (dispatch) => {

    dispatch(sendingRequest(true));

    var url = buildApiUrl(DONATIONS_API_ROOT)+"/balance";

    axios.get( url, {
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
      try{
          var donationsBalance = []
          if (!isNull(resp.data, "donationsBalance"))
              donationsBalance = resp.data.donationsBalance;

          dispatch(setDonationsBalance(donationsBalance));
      }
      catch (err){
        logError("error trying to retrieve donations balance", err);
      }

    }).catch(function(error) {
      logError("error trying to retrieve donations balance", error);
    });

    dispatch(sendingRequest(false));

  }
}

/**
 * Retrieve all donations
 */
export function retrieveDonations() {
  return (dispatch) => {

    dispatch(sendingRequest(true))

    axios.get(buildApiUrl(DONATIONS_API_ROOT),{
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
        try{

          var entities = []

          if (!isNull(resp.data, "entities"))
            entities = resp.data.entities

          dispatch(setDonations(entities))
        }
        catch (err){
          logError("error trying to retrieve donations", err)
        }

        dispatch(sendingRequest(false))

    }).catch(function(error) {
      logError("error trying to retrieve donations", error)
      dispatch(sendingRequest(false))
    });
  }
}

/**
 * Get donation by multichain id
 */
export function getDonationBalance(uid) {
  return (dispatch) => {
    
    dispatch(sendingRequest(true))

    var url = buildApiUrl(DONATIONS_API_ROOT)+"/"+uid+"/balance"

    axios.get( url, {
      crossOrigin: true,
      withCredentials: true
    }).then(function(resp) {
      try{
        dispatch(changeDonation(resp.data))
        dispatch(sendingRequest(false))
      }
      catch (err){
        logError("error trying to retrieve donation", err)
      }

    }).catch(function(error) {
      logError("error trying to retrieve donation", error)
      dispatch(sendingRequest(false))
    });
  }
}

/**
 * Sets the form state
 * @param  {object} newState          User's donations
 * @return {object}                   Formatted action for the reducer to handle
 */
export function setDonationsBalance(donationsBalance) {
  return { type: SET_DONATIONS_BALANCE, donationsBalance };
}

/**
 * Sets the form state
 * @param  {object} newState          User's donations
 * @return {object}                   Formatted action for the reducer to handle
 */
export function setDonationBalance(newState) {
  return { type: SET_DONATION_BALANCE, newState };
}

/**
 * Sets the form state
 * @param  {object} newState          User's donations
 * @return {object}                   Formatted action for the reducer to handle
 */
export function setDonations(donations) {
  return { type: SET_DONATIONS, donations };
}

/**
 * Sets the donation candidate state
 * @param  {object} newState          The new state of the form
 * @param  {string} newState.candidate The new text of the username input field of the form
 * @return {object}                   Formatted action for the reducer to handle
 */
export function changeDonation(newState) {
  return { type: CHANGE_DONATION, newState};
}

/*
* Utils
*/
function parseJSON(response) {
  return response.json()
}
