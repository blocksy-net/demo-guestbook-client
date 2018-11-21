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
 * @desc Login/Signup logic based on Auth0 service
 * @author BlockSY team - blocksy@symag.com
 */

import Auth0Lock from 'auth0-lock';
import { AUTH_CONFIG, getCallbackUrl, getLogoutUrl} from './variables';
import { buildAppUrl } from '../../constants/Config'
import { browserHistory } from 'react-router';
import  { TEXTS, AUTH_ERROR, POPUP_KEY_REGISTER_VALIDATE_EMAIL } from '../../constants/MessageConstants';
import { goTo, setAuthState, setPopup, setAuth0, setErrorMessage} from '../../actions/AppActions'
import { connect, dispatch } from 'react-redux';
import { log, logError, isNull, saveJSONToStore, readJSONFromStore, deleteJSONFromStore} from '../../utils/commons'

export default class Auth {

  getDisplayType(){
    return this.display
  }

  constructor(dispatch, parent) {

    this.nextUrl = ''
    this.options = null
    this.lock = null
    this.display = null
    this.displayed = false

    this.dispatch = dispatch;
    this.parent = parent;

    this.options =  {

        oidcConformant: true,
        autoclose: true,

        languageDictionary: {
            title: "Authentification",
            error: {
              login: {
                'lock.fallback' : "Invalid email or password, please retry."
              },
            }
        },
        theme: {
            logo: 'https://s3.eu-west-3.amazonaws.com/blocksy/blocksy-logo.png',
            primaryColor: '#3c9146'
        },
        auth: {
          redirectUrl: getCallbackUrl(),
          responseType: 'token id_token',
          audience: `https://${AUTH_CONFIG.domain}/userinfo`,
          params: {
            redirect: false,
            scope: 'openid profile email'
          }
        }
      }

    // binds functions to keep this context
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.register = this.register.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)

    // check token
    var auth0 = this
    var token = readJSONFromStore("token")
    var accessToken = isNull(readJSONFromStore("token"),"accessToken") ? null : token.accessToken

    if (accessToken) {
      this.init()
      this.lock.getUserInfo(accessToken, function(error, profile) {

        log("getUserInfo profile: "+JSON.stringify(profile))

        if (!isNull(error)){
          logError("getUserInfo error: ",error)
          auth0.logout(true)
          return;
        }

        auth0.dispatch(setAuthState(true, token, profile))
        localStorage.setItem("profile", JSON.stringify(profile));

      });
    }
  }

  register(nextUrl) {

    if (this.display != "/register"){
      this.options["initialScreen"] = "signUp"
      this.options["allowSignUp"] = true
      this.options["allowLogin"] = false
      this.options["loginAfterSignup"] = false
      this.display = "/register"

      this.lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, this.options)

      this.lock.on('authenticated', (result) => {
        this.dispatch(setPopup(POPUP_KEY_REGISTER_VALIDATE_EMAIL))
        log("user signed up")
      });

      const auth0 = this

      this.lock.on('hide', (result) => {
        try{
          auth0.dispatch(setAuth0(false, false,""))
          auth0.dispatch(goTo(this.nextUrl))
        }
        catch (err){
          logError("error trying to register user", err)
        }
      });
    }

    // save URL to fallback on
    this.nextUrl = nextUrl ? nextUrl : "/#publish"

    // we save it in the localstorage as Auth0 callback cause the app to reinit
    saveJSONToStore('previousLocation', {pathname: this.nextUrl})

    // Call the show method to display the widget.
    this.lock.show()
  }

  init(){
    this.lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, this.options)
    this.handleAuthentication(); //setTimeout(() => { }, 500) // wait init to register listeners
  }

  login(nextUrl) {

    if (this.display != "/login"){
      this.options["initialScreen"] = "login"
      this.options["allowLogin"] = true
      this.options["allowSignUp"] = false
      this.display = "/login"
      this.init();
    }

    // save URL to fallback on
    this.nextUrl = nextUrl ? nextUrl : "/"

    // we save it in the localstorage as Auth0 callback cause the app to reinit
    saveJSONToStore('previousLocation', {pathname: this.nextUrl})

    // Call the show method to display the widget.
    this.lock.show()
  }

  logout(bypass, redirectUrl) {
    deleteJSONFromStore("token")
    deleteJSONFromStore("profile")

    var obj = this

    if (!bypass && obj.lock)
        obj.lock.logout({
          returnTo: redirectUrl && redirectUrl != "" ? buildAppUrl()+redirectUrl : getLogoutUrl()
        })
  }


  handleAuthentication() {

    const auth0 = this
    const lock = this.lock

    lock.on('authenticated', (result) => {
      auth0.setSession(result,false)
    });

    // Add callback for Lock's `authorization_error` event
    this.lock.on('authorization_error', (err) => {

      if (!isNull(err)){
        logError("wrong user authentication", err)
        auth0.error(err)
      }
    });

    this.lock.on('hide', (result) => {
      try{
        log("user signed up!");
        auth0.dispatch(setAuth0(false, false,""))
        auth0.dispatch(goTo(auth0.nextUrl))
      }
      catch (err){
        logError("error dispatching user authentication", err)
      }
    });
  }

  error(err){
    this.dispatch(setErrorMessage(TEXTS['AUTH_ERROR']["fr_FR"]));
    this.goTo(this.nextUrl);
    this.nextUrl = null;
  }

  setSession(authResult, goto) {
    var keys = Object.keys(authResult);
    for(var i=0; i<keys.length; i++){

      var key = keys[i];

      switch(key){
        case "accessToken":
          authResult["access_token"] = authResult["accessToken"];
          break;
        case "idToken":
          authResult["id_token"] = authResult["idToken"];
          break;
        case "expiresIn":
          authResult["expires_in"] = authResult["expiresIn"];
          break;
        case "tokenType":
          authResult["token_type"] = authResult["tokenType"];
          break;
      }
    }

    authResult["expires_in"] = parseInt(authResult["expires_in"],10);

    if (!isNull(authResult,"access_token")) {

      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
      authResult["expires_at"]= expiresAt;

      saveJSONToStore('token', authResult);

      // get user infos: name, picture, twitter_id
      const auth0 = this

      this.lock.getUserInfo(authResult.access_token, function(error, profile) {

        if (!isNull(error)){
          logError("getUserInfo error: ",error)
          return;
        }

        auth0.dispatch(setAuthState(true, authResult, profile))
        localStorage.setItem("profile", JSON.stringify(profile));
      });

      // go to next URL
      if (goto){
        this.goTo(this.nextUrl);
        this.nextUrl = null;
      }

      return this.nextUrl ? this.nextUrl : "/account";
    }
    else return null;
  }

  goTo(url){
    var previousLocation = readJSONFromStore('previousLocation')
    this.dispatch(goTo(url, isNull(previousLocation,"pathname") ? null: previousLocation.pathname));
  }

  authorize(authResult){
    var obj = this
    var location = readJSONFromStore('previousLocation')
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('token')).expires_at;
    return new Date().getTime() < expiresAt;
  }

}
