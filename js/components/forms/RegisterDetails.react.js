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
 * @desc The form used to post a new message:
 * - name
 * - email
 * - twitter connection in order to retrieve user's twitter_id, photo url, name
 * - message
 * - pin code
 *
 * @author BlockSY team - blocksy@symag.com
 */

import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Avatar from 'react-avatar'
import PinInput from 'react-pin-input';
import PropTypes from 'prop-types'
import { log, logInfo, isNull } from '../../utils/commons'

import FontAwesome from 'react-fontawesome';

// load custom inputs
import Email from './inputs/Email.react'
import TextField from './inputs/TextField.react'

// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');
let pin;

class RegisterDetails extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      ready: props.fastLoad,
      datasource: []
    }
  }

  ready(state){
    if (!state.ready)
      this.setState({
        ready: true
      })
  }

  componentWillMount(){
    if (this.props.fastLoad) this.ready(this.state)
  }

  componentWillUpdate(){
    this.ready(this.state)
  }

  shouldComponentUpdate(nextProps, nextState){
    this.ready(nextState)

    return true
  }

  _processEntry(index, user){
    log("_processEntry userUid="+user.Uid)
    return {
      name: user.firstName+" "+user.lastName,
      uid: user.uid,
      index: index
    }
  }

  render() {

    if (!this.state.ready) return null

    if (!this.props.user){
      return null
    }

    var photo_url = this.props.user.photo_url.replace('_normal','') // switch to high res image URL

    var avatar = null

    if (photo_url == '')
      avatar = <Avatar round={true} size={75} name={this.props.user.name} />
    else
      avatar = <Avatar round={true} size={75} src={photo_url} />

    return (

        <div id="forms-messageform">
            <div>
              <TextField
                id = "user-name"
                edit = {!this.props.mode.view }
                divClassname = "form__field-wrapper"
                labelClassname = "form__field-label"
                inputClassname = { this.props.mode.view
                                    ? "form__field-input"
                                    : this.props.invalidFields && this.props.invalidFields["user-name"]
                                      ? "form__field-input form__input-error"
                                      : "form__field-input" }
                label = {this.props.mode.view ? this.props.texts['REGISTERDETAILS_NAME'] : (this.props.texts['REGISTERDETAILS_NAME']+" *")}
                placeholder = { this.props.texts['REGISTERDETAILS_NAME_PLACEHOLDER'] }
                value = {this.props.user.name}
                onChange = {evt => this.props.changeState(evt)}
                autofocus = "true"
              />

              <a onClick={ e => this.props.twitter() } className="btn btn--login">
                <FontAwesome className="fa-padding" name={this.props.loggedIn ? "sign-out" : "twitter"}/>
              </a>

            </div>

            {
              this.props.settings.message.enabled ?
                <div className="form__field-wrapper">
                  <textarea rows="5" cols="70"
                            className={ this.props.invalidFields && this.props.invalidFields["user-message"]
                                    ? "form__field-input form__input-error"
                                    : "form__field-input"}
                            id="user-message" value={this.props.user.message}
                            placeholder={this.props.texts['REGISTERDETAILS_MESSAGE_PLACEHOLDER']}
                    onChange={this.props.changeState} autoCorrect="off"
                    autoCapitalize="off" spellCheck="false" readOnly={this.props.mode.view} />
                  <label className="form__field-label" htmlFor="user-message">{this.props.texts['REGISTERDETAILS_MESSAGE_LABEL']} {typeof(this.props.settings.owner.event)=="string"  ? this.props.settings.owner.event : "X"} *</label>
                </div>
              :
                <span />
            }

            <div className="form__field-wrapper">
                  <label className="form__field-label">{this.props.texts['BLOCKCHAIN_SELECTOR_LABEL']}</label><br/>
                  <span><label className="form__field-labelradio"><input type="radio" className="form__field-input-small" name="crypto_currency" value="RINKEBY" onClick={ e => this.props.changeState(null, "user-crypto_currency", 'RINKEBY') } checked={ this.props.user.crypto_currency === 'RINKEBY'} /> Ethereum</label></span>
                  <span><label className="form__field-labelradio"><input type="radio" className="form__field-input-small" name="crypto_currency" value="tBCC" onClick={ e => this.props.changeState(null, "user-crypto_currency", 'tBCC') } checked={ this.props.user.crypto_currency === 'tBCC'} /> Bitcoin Cash</label></span>
                  <br/><br/>
            </div>

            <Email
                classes="form__field-wrapper"
                id="user-email"
                inputClassname = "form__field-input"
                labelClassname = "form__field-label"
                label={"Email"+(this.props.mode.view? "":" *")}
                value={this.props.user.email}
                placeholder={ this.props.texts['REGISTERDETAILS_EMAIL_PLACEHOLDER'] }
                autoCorrect="on"
                autoCapitalize="off"
                spellCheck="false"
                autoComplete = "email"
                onChange={this.props.changeState}
                validate={this.props.validateField}
                readOnly={this.props.mode.view}
                texts={this.props.texts}
            />

            <TextField
              id = "user-company"
              edit = {!this.props.mode.view }
              divClassname = "form__field-wrapper"
              labelClassname = "form__field-label"
              inputClassname = { this.props.mode.view
                                  ? "form__field-input"
                                  : this.props.invalidFields && this.props.invalidFields["user-company"]
                                    ? "form__field-input form__input-error"
                                    : "form__field-input" }
              label = {this.props.mode.view ? this.props.texts['REGISTERDETAILS_COMPANY'] : (this.props.texts['REGISTERDETAILS_COMPANY']+" *")}
              placeholder = { this.props.texts['REGISTERDETAILS_COMPANY_PLACEHOLDER'] }
              value = {this.props.user.company}
              onChange = {evt => this.props.changeState(evt)}
              autoComplete = "organization"
            />

            <div className="form__field-wrapper">
                <PinInput
                  length={4}
                  secret
                  ref={p => (pin = p)}
                  type="numeric"
                  onChange={v => this.props.changeState(null, "user-pin", v)}
                />

                <label className="form__field-label" htmlFor="pcode">{this.props.texts['REGISTERDETAILS_PINCODE']} *</label>
            </div>


        </div>

    );
  }
}

RegisterDetails.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  reinitAndClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  changeState: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  is: PropTypes.object.isRequired,
  subpage: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  twitter: PropTypes.func.isRequired
}

export default RegisterDetails;
