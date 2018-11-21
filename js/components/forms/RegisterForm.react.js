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
 * @desc registration form container and pagination logic
 * @author BlockSY team - blocksy@symag.com
 */

import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

// import actions
import { setErrorMessages} from '../../actions/AppActions'
import { createUser, reinitUser, changeUser, logout } from '../../actions/Users'
import { forwardTo, setServerError } from '../../actions/AppActions'

import PropTypes from 'prop-types'
import  { TEXTS, ERROR_FORM_PIN, ERROR_FORM_COMPANY,
          ERROR_APPLICATION, ERROR_FORM_EMAIL, ERROR_FORM_NAME,
          ERROR_FORM_LASTNAME, ERROR_FORM_NO_CHANGE, ERROR_FORM_MESSAGE
        } from '../../constants/MessageConstants'
import { DropdownButton, MenuItem, FormControl, Modal} from 'react-bootstrap'
import { MESSAGE_STATUS, MESSAGE_STATUS_PENDING, MESSAGE_STATUS_CONFIRMED,
         MESSAGE_STATUS_SUBMITTED, MESSAGE_STATUS_CONFIRMED_PARTIALLY
       } from '../../constants/AppConstants'
import { log, logError } from '../../utils/commons'

import { isNull, clone, readJSONFromStore } from '../../utils/commons'; // test if var or var.x is undefined, null or ""

import moment from 'moment'
import FontAwesome from 'react-fontawesome';

// import components
import LoadingButton from '../LoadingButton.react'
import ErrorMessage from '../ErrorMessage.react'

// import subpages
import Email from './inputs/Email.react'
import RegisterDetails from './RegisterDetails.react'

// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');

class RegisterForm extends PureComponent {

  constructor(props) {
    super(props);

    this.state = this.getDefaultState()

    this.state.ready = props.fastLoad
    this.state.ready = props.userLastUpdate
  }

  getDefaultState(){
    return {
      noMatch: false,
      subpage:"user",
      fields: {
        common: [],
        user: ["email", "name", "pin", "company", "message", "crypto_currency"]
      },
      lastUpdated : 0,
      fastLoad: true,
      ready: false,
      mode: {},
      invalidFields: null,
      validationTimeout: null,
      confirm: false,
      currentUid: '',
      title: "loading",
      acknowledged: false,
    }
  }

  componentWillMount(){
    this._stateMachine()
  }

  componentWillReceiveProps(nextProps){
    this._stateMachine(null, nextProps)
  }

  shouldComponentUpdate(nextProps, nextState){
    return true
  }

  _stateMachine(move, nextProps, nextState){

    var _state = nextState ? nextState : this.state
    var _props = nextProps ? nextProps : this.props
    var state = {}

    var buttons = null //{cancel: "cancel", back: "back", next: "next", other: ""}
    var subpage = _state.subpage

    var editMode = _props.mode == "edit"

    var decline = move == "decline"
    var accept = move == "accept"
    var close = move == "close"
    var back = move == "back"
    var next = move == "next"

    // set fast load to avoid waiting for new props to display
    if (_props.fastLoad || back || decline || accept) {
      state["fastLoad"] = true
    }

    if (_props.ready)
      state["ready"]=true

    var is = {}
    is["owner"]=true

    var mode = {}

    var title = ""

    // saving timestamp for comparison in "submitted" state
    if (_props.userLastUpdate != 0 && _state.lastUpdated != _props.userLastUpdate)
      state["lastUpdated"] = _props.userLastUpdate
    else if (_state.lastUpdated == 0){
      state["lastUpdated"] = 1 // when creating a message
    }

    // manage actions : next, back, close etc..
    switch ( subpage ){

        case "user":

          if (close){
             subpage = "closed"
          }
          else if (next) {
            subpage = "confirm"
          }

          break;

        case "confirm":

          if (back || decline){
            state["confirm"] = false
            subpage = "user"
          }
          else if (accept){
             state["confirm"] = false
             subpage = "submitted"
          }
          else if (!_state.confirm) {
            state["confirm"] = true;
          }

          break;


        case "submitted":

          if (_state.lastUpdated == 0) return // finished as lastUpdated been reinitiated

          if (_props.userLastUpdate != _state.lastUpdated ){
              state["lastUpdated"] = _props.userLastUpdate

              this.props.auth.logout(false, "/#guestbook")
              subpage = "closed"
          }

          if (_props.serverError.code != 0) {
              subpage = "error"
          }

          break

        case "error":
          if (back || decline){
            state["confirm"] = false
            subpage = "user"

            this.props.dispatch(setServerError({}))
          }
          break;

        case "closed":
          this._reinitAndClose(true)
          break

        case "declined":
          if (_props.userLastUpdate != _state.lastUpdated){
            this._reinitAndClose(true)
          }
          break
    }

    // manage content/display
    switch ( subpage ){
        case "user":

          title = _props.texts['REGISTERFORM_TITLE']
          buttons = this._setButtons(
                                        "", // close
                                        "", // back
                                        _props.texts['REGISTERFORM_BUTTON_POST'], // next
                                        "" // other
                                      )

          break;

        case "confirm":
          break;

        case "submitted":
          break

        case "error":
          break;

        case "closed":
          this._reinitAndClose(true)
          break

        case "declined":
          break
    }

    mode["view"] = !editMode
    state["ready"] = _props.ready

    if (move != null) state["invalidFields"] = null
    if (buttons != null) state["buttons"] = buttons
    if (subpage != _state.subpage) state["subpage"] = subpage
    if (title != _state.title) state["title"] = title
    if (JSON.stringify(_state.is) != JSON.stringify(is) ) state["is"] = is
    if (JSON.stringify(_state.mode) != JSON.stringify(mode) ) { state["mode"] = mode }

    // store object value when it has been initialized
    if (isNull(_state.initialState)) {
      state["initialState"] = this._buildInitialState("user", _props)
    }

    // handling error
    if (_props.serverError.code > 0 && _state.acknowledged){
      state["acknowledged"] = false

      var user = {}
      user["pin"] = ""

      var newState = this._mergeWithCurrentState(user);
      this._emitChange(newState);
    }

    if (this.state.invalidFields
      && Object.keys(_state.invalidFields).length > 0
      && _state.acknowledged){
      state["acknowledged"] = false
    }

    if ( Object.keys(state).length > 0
        && JSON.stringify(_state) != JSON.stringify(state) ){
      this.setState(state)
    }

  }

  _setButtons(cancel, back, next, other){
    var buttons = {cancel: cancel, back: back, next: next, other: other}

    if (JSON.stringify(buttons) != JSON.stringify(this.state.buttons))
      return buttons
    else
      return null
  }

  _twitter(){

    if (this.props.loggedIn)
      this.props.auth.logout()
    else
      this.props.auth.login("/")
  }

  _check(){

  	this.setState({
  		acknowledged: !this.state.acknowledged
  	})

  }

  render() {

    const buttons = (

        this.props.currentlySending ?
          <LoadingButton />
         :
          <div className="row">

            { !this.state.buttons || this.state.buttons.cancel == "" ?
              <span/>
              :
              <button type="button" className="form__cancel-btn" onClick={ e => this._onCancel() } >
                  { this.state.buttons ? this.state.buttons.cancel : ""}
              </button>
            }

            { !this.state.buttons || this.state.buttons.back == ""?
              (
                <span/>
              )
              : (
                <button type="button" className="form__back-btn" onClick={ e => this._onBack() } >
                  {this.state.buttons ? this.state.buttons.back : ""}
                </button>

              )
            }

            { !this.state.buttons || this.state.buttons.next == ""?
              (
                <span/>
              )
              : (
                <button type="button" className="form__submit-btn"  onClick={ e => this._onSubmit() }>
                  {this.state.buttons ? this.state.buttons.next : ""}
                </button>
              )
            }

          </div>

    )

    return (

      <form className="form" onSubmit={this._onSubmit.bind(this)}>

        { this.state && this.state.subpage == "confirm" ?
          <div className="form-page__wrapper-overlay">

            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>
                  { this.props.texts['REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE'] }
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                { this.props.texts['REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE_BODY'] }

                <br/><br/>
              </Modal.Body>

              <Modal.Footer>
                <button type="button" className="form__cancel-btn" onClick={ e => this._onDecline() } >
                  { this.props.texts['REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE_BUTTONS_DECLINE'] }
                </button>
                <button type="button" className="form__submit-btn" onClick={ e => this._onConfirm() }>
                  { this.props.texts['REGISTERFORM_POPUP_REGISTERACCOUNT_TITLE_BUTTONS_CONFIRM'] }
                </button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
          : <span/>
        }

        { this.state && this.state.subpage == "error" ?
          <div className="form-page__wrapper-overlay">

            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>
                { this.props.texts['REGISTERFORM_POPUP_ERROR_TITLE'] }
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {  this.props.texts[this.props.serverError.message] == null ?
                      this.props.serverError.message
                      :  this.props.texts[this.props.serverError.message]
                } ({ this.props.serverError.code })
                <br/><br/>
              </Modal.Body>

              <Modal.Footer>
                <button type="button" className="form__cancel-btn" onClick={ e => this._onDecline() } >
                  { this.props.texts['REGISTERFORM_POPUP_ERROR_BUTTONS_CANCEL'] }
                </button>
              </Modal.Footer>

            </Modal.Dialog>
          </div>
          : <span/>
        }

        <h2 className="row-centered"> { this.state.title } </h2>

        { this.props.donationPossible ?
          <div className="subtitle">
            {this.props.settings.donation.desc[this.props.user.user_lang.key]}
          </div>
          : <span/>
        }

        {    this.state && this.state.subpage == "user" ?

              <RegisterDetails
                  onSubmit = { this._onSubmit.bind(this) }
                  onBack = { this._onBack.bind(this) }
                  onDecline = { this._onDecline.bind(this) }
                  reinitAndClose = { this._reinitAndClose.bind(this) }
                  onConfirm = { this._onConfirm.bind(this) }
                  changeState = { this._changeUserState.bind(this) }
                  validateField = { this._validateField.bind(this) }
                  user = { this.props.user}
                  profile = { this.props.profile }
                  mode = { this.state.mode }
                  invalidFields = { this.state.invalidFields }
                  loggedIn = { this.props.loggedIn }
                  is = { this.state.is }
                  subpage = { this.state.subpage }
                  edit = { !this.state.mode.view }
                  fastLoad = { this.state.fastLoad }
                  settings = { this.props.settings }
                  twitter = { this._twitter.bind(this) }
                  texts = { this.props.texts }
                />
             : <span/>
        }

        {
          Object.keys(this.props.errorMessages).length > 0 ?
            <div className={ "form__field-wrapper"}>
              <ErrorMessage />
            </div>
            : <span/>
        }

        <div className="form__submit-btn-wrapper">

          { this.props.currentlySending ?
              <span/>
              :
              <div className="gdpr">
                <input type="checkbox" checked={this.state.acknowledged} value={this.state.acknowledged} onClick={e => this._check()}/>
                  &nbsp;&nbsp;
                  {this.props.texts['REGISTERFORM_GDPR_AUTHORIZE']} {this.props.settings.owner.name} {this.props.texts['REGISTERFORM_GDPR_PUBLISH']} {this.props.loggedIn ? this.props.texts['REGISTERFORM_GDPR_TWITTER']:""}.
              </div>
          }


          { this.state.acknowledged ?
              <div> {buttons} </div>
            : <div style={{width:"50px"}}> &nbsp; </div>
          }

        </div>
      </form>
    );

  }

  _onDropdown(val) {}

  // this method manages the error display
  _validateField(fieldId, errorMessage, now){

    // field which requires validation will report his own state
    // it is valid when it's not reporting an errorMessage
    var invalidFields = this.state && this.state.invalidFields ? this.state.invalidFields : {};

    if (errorMessage){

      var obj = this;

      // direct validation at submit
      if (now) {
        invalidFields[fieldId] = errorMessage;
        obj.setState({invalidFields: invalidFields});
      }
      // delayed validation while user inputs something
      else {
        this._clearValidationError(invalidFields, fieldId);

        var validationTimeout = setTimeout(function(){
          invalidFields[fieldId] = errorMessage;
          obj.setState({invalidFields: invalidFields});
        }, 1000);

        this.setState({validationTimeout: validationTimeout});
      }
    }
    else
        // no error anymore
        this._clearValidationError(invalidFields, fieldId);

    return (errorMessage == null)
  }

  _clearValidationError(invalidFields, fieldId){

    // after each change of state we give 3s the user to finalize his input
    // before triggering a visual vaTlidation error
    if (this.state && this.state.validationTimeout) {
      clearTimeout(this.state.validationTimeout);
      this.setState({validationTimeout: null});
    }

    // remove error
    if (invalidFields){
      delete invalidFields[fieldId];

      if (Object.keys(invalidFields).length === 0 && invalidFields.constructor === Object)
        invalidFields = null;
    }

    this.setState({invalidFields: invalidFields});
  }

  _validateForm(key, value, valid){

    var invalidFields = this.state && this.state.invalidFields ? this.state.invalidFields : {};
    var errors = {}

    switch (this.state.subpage){
      case "user":
        this._validateGenericAll("user", invalidFields, key, value, valid);

        // check if data were changed
        if (Object.keys(invalidFields).length == 0
            && !this._initialStateChanged("user")){
              invalidFields["message--nochange-detected"] =
              this.props.texts[ERROR_FORM_NO_CHANGE];
        }

        break;
      case "confirm":
        break;
    }

    this._setInvalidFields(invalidFields);

    return Object.keys(invalidFields).length == 0;
  }

  _setInvalidFields(invalidFields){
    this.setState({invalidFields: invalidFields});
    this.props.dispatch(setErrorMessages(invalidFields));
  }

  _validateGenericAll(scope, errors, key, value, valid){

    // validate common attributes
    for (var i=0; i < this.state.fields.common.length; i++){
      this._validateGenericOne(scope, errors, this.state.fields.common[i], null, valid)
    }

    // validate page specific attributes
    for (var i=0; i < this.state.fields[scope].length; i++){
      this._validateGenericOne(scope, errors, this.state.fields[scope][i], null, valid)
    }

  }

  _validateGenericOne(scope, errors, key, value, valid){

      var error = null

      switch (key){

        case "email":
          if ( isNull(value) ? this.props.user.email.length == 0 : value.length == 0){
            error = this.props.texts[ERROR_FORM_EMAIL]
          }

          break

        case "name":

          if ( isNull(value) ? this.props.user.name.length < 2 : value.length < 2){
            error = this.props.texts[ERROR_FORM_NAME]
          }

          break

        case "company":
          if ( isNull(value) ? this.props.user.company.length < 2 : value.length < 2){
            error = this.props.texts[ERROR_FORM_COMPANY]
          }

          break

        case "pin":
          if (isNull(value) ? this.props.user.pin.length < 4 : value.length < 4){
            error = this.props.texts[ERROR_FORM_PIN]
          }

          break

        case "message":
          if ( isNull(value) ? this.props.user.message.length == 0 : value.length == 0){
            if (this.props.settings.message.enabled)
              error = this.props.texts[ERROR_FORM_MESSAGE]
          }

          break
      }


    // no error clean errors table
    if (isNull(error)){
       if (!isNull(errors, scope+"-"+key))
          this._clearValidationError(errors, scope+"-"+key);
    }
    // add error to display
    else
      errors[scope+"-"+key] = error

    return errors

  }

  // store initial state in order
  // to check if data have been modified
  _buildInitialState(namespace, props){
    var initialState = {}
    initialState[namespace] = {}

    for(var i=0; i<this.state.fields[namespace].length; i++) {
      var key = this.state.fields[namespace][i]
      if (!isNull(key)) {
        initialState[namespace][key] = JSON.stringify(props.user[key])
      }
    }

    return initialState
  }

  // check if data have been modified
  _initialStateChanged(namespace){

    for(var i=0; i<this.state.fields[namespace].length; i++) {
      var key = this.state.fields[namespace][i]

      var changed =  this.state.initialState[namespace][key] != JSON.stringify(this.props.user[key])

      if (changed) return true
    }

    return false
  }

  _changeUserState(evt, key, value, isValid){

    console.log("**** evt:"+evt )
    console.log("**** key:"+key )
    console.log("**** value:"+value )
    console.log("**** isValid:"+isValid )

    key = evt
          ? evt.target.id.replace('user-','')
          : key.replace('user-','');

    var errors = []

    var invalidFields = isNull(this.state, "invalidFields") ? {} : this.state.invalidFields

    // clean potential previous try to save unchanged data
    delete invalidFields["message--nochange-detected"]

    invalidFields = this._validateGenericOne("user", invalidFields, key, value, isValid, false)

    this.setState({invalidFields: invalidFields});
    this.props.dispatch(setErrorMessages(invalidFields));

    // prepare object to be merged
    var user = {};
    user[key] = evt ? evt.target.value : value;

    // merge and update Redux model
    var newState = this._mergeWithCurrentState(user);
    this._emitChange(newState);

  }

  // Merges the current state with a change
  _mergeWithCurrentState(change) {
    return assign(this.props.user, change);
  }

  // Emits a change of the form state to the application state
  _emitChange(newState) {
    this.props.dispatch(changeUser(newState));
  }

  // onSubmit call the passed onSubmit function
  _onSubmit(evt) {

    if (!this._validateForm()){
      return false;
    }

    this._stateMachine("next")

  }

  _onConfirm(){

    this._stateMachine("accept")

    // prepare user data to be sent to the server
    var user = clone(this.props.user)

    delete user.pub_key
    delete user.priv_key

    var user_lang = user.user_lang.key
    delete user.user_lang

    user["user_lang"]=user_lang
    user["twitter_accessToken"] = this.props.token.accessToken
    user["photo_url"] = this.props.user.photo_url.replace('_normal','') // obtain high res picture

    this.props.dispatch(createUser(user));

  }

  _onCancel() {
    this._stateMachine("close")
  }

  _onDecline() {
    this._stateMachine("decline")
  }

  _onBack() {
    // change page
    this.props.dispatch(setErrorMessages(null));

    this._stateMachine("back")
  }

  _reinitAndClose(userUpdated, previousUser){
    var state = this.getDefaultState()

    this.props.dispatch(reinitUser())

    // create a message
    if (!isNull(previousUser)){
      this.setState(state)
    }
    // go back to list
    else if (userUpdated){
      var obj = this
      this.setState(state, obj.props.onSubmit());
    }
    // reinit state
    else
      this.setState(state)
  }

}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  serverError: PropTypes.object.isRequired,
}

export default RegisterForm;
