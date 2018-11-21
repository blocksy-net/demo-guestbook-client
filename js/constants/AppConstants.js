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
 * @desc AppConstants
 * These are the variables that determine what our central data store (reducer.js)
 * changes in our state. When you add a new action, you have to add a new constant here
 *
 * @author BlockSY team - blocksy@symag.com
 */

import React from 'react'; // displayStatus requirement
import moment from 'moment'
import 'moment-timezone';
import { isNull } from '../utils/commons'

/* Redux actions */
export const CHANGE_FORM = 'CHANGE_FORM';
export const SET_AUTH = 'SET_AUTH';

export const SENDING_REQUEST = 'SENDING_REQUEST';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const CHANGE_LOCATION = 'CHANGE_LOCATION';

export const SET_POPUP = 'SET_POPUP';
export const SET_AUTH0 = 'SET_AUTH0';

export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_DONATIONS = 'SET_DONATIONS';
export const SET_DONATIONS_BALANCE = 'SET_DONATIONS_BALANCE';
export const SET_DONATION_BALANCE = 'SET_DONATION_BALANCE';

export const CHANGE_USER = 'CHANGE_USER';
export const REINIT_USER =  'REINIT_USER';

export const SET_SETTINGS =  'SET_SETTINGS';
export const SET_SERVER_ERROR =  'SET_SERVER_ERROR';

/***
 * Tabs
 */
export const TAB_DONATIONS= 3;
export const TAB_MESSAGES= 2;
export const TAB_PUBLISH= 1;

/***
 * Users
 */

export const MESSAGE_STATUS_SUBMITTED= 1;
export const MESSAGE_STATUS_PENDING = 2;
export const MESSAGE_STATUS_CONFIRMED_PARTIALLY = 3;
export const MESSAGE_STATUS_CONFIRMED = 4;

export const MESSAGE_STATUS = {
  MESSAGE_STATUS_SUBMITTED: "submitted",
  MESSAGE_STATUS_PENDING: "pending confirmation",
  MESSAGE_STATUS_CONFIRMED_PARTIALLY : "partially confirmed",
  MESSAGE_STATUS_CONFIRMED : "confirmed"
}

export function getStringMessageStatus(status){
  switch (status){
    case MESSAGE_STATUS_SUBMITTED: return "submitted"
    case MESSAGE_STATUS_PENDING: return "pending confirmation"
    case MESSAGE_STATUS_CONFIRMED_PARTIALLY: return "partially DEAL_CONFIRMED"
    case MESSAGE_STATUS_CONFIRMED: return "confirmed"
  }
  return ""
}

export function displayMessageStatus(status){

  var stringStatus = getStringMessageStatus(status)
  return <div className="status">
           { status == MESSAGE_STATUS_CONFIRMED_PARTIALLY ?
             <i className="fa fa-check orange" aria-hidden="true"></i>
             :
             status == MESSAGE_STATUS_CONFIRMED ?
             <i className="fa fa-check" aria-hidden="true"></i>
             :
             status == MESSAGE_STATUS_PENDING ?
             <i className="fa fa-times" aria-hidden="true"></i>
             :
             status == MESSAGE_STATUS_SUBMITTED?
             <i className="fa fa-envelope-o" aria-hidden="true"></i>
             :
             <i className="fa fa-arrow-right" aria-hidden="true"></i>
           } &nbsp;
           {stringStatus}
        </div>
}

/***
 * other tools
 */

export function displayDollars(n){
  return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

export function getTimeZones(){
  var timezones = moment.tz.names()
  var formatted = new Array()

  // transform it to a label, key format
  for (var i=0; i< timezones.length; i++){
    var entry = {}
    entry["label"] = timezones[i]
    entry["value"] = i

    formatted.push(entry)
  }

  return formatted
}

export function findLabel(entries, value, defaultValue){
  var key = defaultValue

  for (var i=0; i< entries.length; i++){
    var entry = entries[i]
    if (entry.value == value)
      return entry.label
  }

  return key
}

export function findKey(entries, label){
  var key = -1

  for (var i=0; i< entries.length; i++){
    var entry = entries[i]
    if (entry.label == label)
      return entry.value
  }

  return key
}
