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
 * @desc Reducer that manages app data
 *
 * @author BlockSY team - blocksy@symag.com
 */

import { SET_PROFILE, CHANGE_LOCATION, CHANGE_USER, REINIT_USER,
         SET_MESSAGES, REINIT_MESSAGE,
         SET_DONATIONS, SET_DONATIONS_BALANCE, SET_DONATION_BALANCE,
         SET_AUTH, SENDING_REQUEST, SET_ERROR_MESSAGE, SET_SERVER_ERROR,
         SET_POPUP, SET_AUTH0, SET_SETTINGS
       } from '../constants/AppConstants';

import { LANG_FR, LANG_EN } from '../constants/Internationalization';
import { getTexts } from '../constants/MessageConstants';

import moment from 'moment'

import { isNull, clone, readJSONFromStore } from '../utils/commons';


// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');

// data structure of a user

const emptyUser = {
  email: '',
  company: '',
  pin: '',
  name: '',
  user_lang: isNull(readJSONFromStore('user_lang'),"key")?
                ((window.navigator.userLanguage || window.navigator.language).startsWith("en") ?
                  LANG_EN
                  : LANG_FR
                )
                : readJSONFromStore('user_lang'),
  twitter_id: '',
  twitter_accessToken: '',
  twitter_screenName: '',
  photo_url: '',
  message: '',
  crypto_currency: 'RINKEBY',
  pub_key: '',
  priv_key: ''
}

// data structure of a message from the GuestBook
const emptyMessage = {
  id: '',
  dateTime: 0,
  message: '',
  user : {
    id: '',
    name: '',
    twitter_id: '',
    twitter_screenName: '',
    photo_url: ''
  }
};

// data structure of an association
const emptyAssociation = {
  id: '',
  dateTime: 0,
  name: '',
	desc: '',
  url: '',
	logo_url: '',
	multichain_id: '',
};

// The initial Redux application state
const initialState = {
  donationsBalance: [],
  donationsBalanceLastUpdate: 0,
  donationBalance: {},
  donationBalanceLastUpdate: 0,

  messages: [],
  messagesLastUpdate: 0,
  messagesPageIndex: 0,

  message: clone(emptyMessage),
  messageLastUpdate : 0,

  user: clone(emptyUser),
  userLastUpdate: 0,

  serverError: {
    message: '',
    code: 0
  },

  currentlySending: false,
  loggedIn: false,
  errorMessages: {},

  location: '/',
  previousLocation: null,

  popupId: 0,

  auth0: {
    called: false,
    displayed: false,
    display: ""
  },

  token: {},
  settings: {},
  texts: getTexts(emptyUser.user_lang),

  fullScreen : false,
  fullScreenTime : 0,
  lastAuthTime : 0
};

// Takes care of changing the application state
export function homeReducer(state = initialState, action) {

  switch (action.type) {
    case SET_AUTH0:

      var auth0 = {}
      auth0["called"] = action.auth0Called == null ? state.auth0.called : action.auth0Called
      auth0["displayed"] = action.auth0Displayed == null ? state.auth0.displayed : action.auth0Displayed
      auth0["display"] = action.auth0Popup == null ? state.auth0.display : action.auth0Popup

      return assign({}, state, {
        auth0: auth0
      });
      break

    case SET_POPUP:
      return assign({}, state, {
        popupId: action.popupId
      });
      break;

    case SET_SERVER_ERROR:

      var message = ""
      var code = 0

      /*debug: console.log("**** action error: "+Object.keys(action.error))
      for (var key in action.error){
          if (action.error.hasOwnProperty(key)) {
              console.log("**** key: "+key+" value: "+JSON.stringify(action.error[key]))
          }
      }*/

      if (!isNull(action.error, "data")) {
        if (!isNull(action.error.data,"error")){
          message = action.error.data.message
          code = action.error.data.error
        } else {
          message = action.error.data
          code = action.error.status
        }
      } else if (!isNull(action.error, "message")) {
          message = action.error.message
          code = action.error.code
      }

      return assign({}, state, {
        serverError: {
            message: message,
            code: code,
        }
      });
    break;

    case SET_MESSAGES:

      return assign({}, state, {
        messages: action.messages,
        messagesLastUpdate: moment().unix(),
        messagesPageIndex: action.pageNumber
      });
      break;

    case SET_DONATIONS:
      return assign({}, state, {
        donations: action.donations,
        donationsLastUpdate: moment().unix()
      });
      break;

    case SET_DONATIONS_BALANCE:
      return assign({}, state, {
        donationsBalance: action.donationsBalance,
        donationsBalanceLastUpdate: moment().unix()
      });

      break;

    case SET_DONATION_BALANCE:

      var donationBalance = clone(state.donationBalance)

      if (!isNull(action.newState, "entity")) {
        donationBalance = action.newState
      }

      return assign({}, state, {
        donationBalance: donationBalance,
        donationBalanceLastUpdate: moment().unix()
      });

      break;

    case CHANGE_USER:
      var user = clone(state.user)
      var texts = clone(state.texts)
      var nextState = {}

      if (!isNull(action.newState,"pub_key"))
        user.pub_key = action.newState.pub_key

      if (!isNull(action.newState,"user_lang")){
        user.user_lang = action.newState.user_lang
        nextState["texts"] = getTexts(action.newState.user_lang)
      }

      nextState["user"]=user
      nextState["userLastUpdate"]=moment().unix()

      return assign({}, state, nextState);

    case REINIT_USER:

      var user = clone(emptyUser)
      user.user_lang = state.user.user_lang

      return assign({}, state, {
        user: user,
        loggedIn: false,
        usersLastUpdate: 0,
        token: {}
      });

    case CHANGE_LOCATION:
      var newState = {
        fullScreen: false
      }

      // ignore failed listener registering attempt for fullscreen window

      if (moment.now()-state.fullScreenTime < 2000
          && action.newState.indexOf("hd") > -1)
        return assign({}, state, {})

      if (action.newState.indexOf("mode=fullscreen") > -1){
        newState["fullScreenTime"] = moment.now()
        newState["fullScreen"] = true
      }

      if (!isNull(action.location, "hash")
          && action.location.hash.startsWith("access_token")){
        action.location.hash = ""
      }

      /*if (action.newState == state.location
          && action.previousLocation
          && action.previousLocation == state.previousLocation){
            return assign({}, state, newState);
      }*/

      newState["location"] = action.newState

      if (action.previousLocation)
        newState["previousLocation"] = action.previousLocation

      return assign({}, state, newState);

      break;

    case SET_AUTH:
      var user = state.user

      if (isNull(action.profile))
        user = clone(emptyUser)
      else {
        user.email = action.profile.email
        user.name = action.profile.name
        user.twitter_id = action.profile.sub
        user.twitter_screenName = action.profile.nickname // nickname has volontarily been replaced by screen_name with an auth0 rule (see manage.auth0.com)
        user.photo_url = action.profile.picture
        user.crypto_currency = action.profile.crypto_currency
      }

      var newState = {}
      newState["user"]=user
      newState["loggedIn"]=action.newState
      newState["token"]=action.authResult
      newState["lastAuthTime"]=moment.now()

      return assign({}, state, newState);

    case SENDING_REQUEST:
      return assign({}, state, {
        currentlySending: action.sending
      });

    case SET_ERROR_MESSAGE:
      return assign({}, state, {
        errorMessages: action.messages
      });

    case SET_SETTINGS:
      return assign({}, state, {
        settings: action.newState
      });

    default:
      return state;
  }
}
