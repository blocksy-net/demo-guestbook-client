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
 * @desc simple email input component
 * @author BlockSY team - blocksy@symag.com
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  { ERROR_FORM_EMAIL } from '../../../constants/MessageConstants';
import { log } from '../../../utils/commons'

// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');

class Email extends Component {

  render() {
    return(
      <div className={ this.props.classes }>
        <input className={ this.state && this.state.error ? this.props.inputClassname+" form__input-error" : this.props.inputClassname }
          type="email"
          id={ this.props.id }
          value={this.props.value}
          placeholder={ this.props.placeholder }
          onChange={this._changeState.bind(this)}
          autoCorrect={ this.props.autoCorrect }
          autoCapitalize={ this.props.autoCapitalize }
          spellCheck={ this.props.spellCheck }
          readOnly={ this.props.readOnly}/>
        <label className={this.props.labelClassname} htmlFor={ this.props.id }> { this.props.label }</label>
      </div>
    );
  }

  _changeState(evt){

    var isValid = this._validate(evt);

    this.props.validate(this.props.id,
      isValid ? null : this.props.texts[ERROR_FORM_EMAIL]
    );

    this.props.onChange(evt, null, null, isValid);
  }

  // Change the username in the app state
  _validate(evt) {
    var regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

    var isValid = regexp.test(evt.target.value)
    this.setState({error: !isValid});

    return isValid;
  }
}

Email.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.string.isRequired,
  value:  PropTypes.string.isRequired,
  placeholder :  PropTypes.string.isRequired,
  autoCorrect: PropTypes.string.isRequired,
  autoCapitalize: PropTypes.string.isRequired,
  spellCheck: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
}

export default Email;
