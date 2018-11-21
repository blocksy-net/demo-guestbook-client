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
 * @desc simple text field component
 * @author BlockSY team - blocksy@symag.com
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  { ERROR_FORM_EMAIL } from '../../../constants/MessageConstants';
import { log, isNull } from '../../../utils/commons'

// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');

class TextField extends Component {

  render() {
    return(
      this.props.edit ?
        <div className={this.props.divClassname}>
          <input className={this.props.inputClassname}
            type="text" id={this.props.id} value={this.props.value} placeholder={this.props.placeholder}
            onChange={this.props.onChange} autoCorrect="off" autoCapitalize="off"
            autoComplete={ isNull(this.props.autocomplete)? false : this.props.autocomplete } spellCheck="false"
            autoFocus={this.props.autofocus} />

          <label className={this.props.labelClassname} htmlFor={this.props.id}>{this.props.label}</label>
        </div>
        :
        <div className={this.props.divClassname}>
         <input id={this.props.id} className={this.props.inputClassname} value={this.props.value} readOnly/>
         <label className={this.props.labelClassname} htmlFor={this.props.id}>{this.props.label}</label>
        </div>
    );
  }
}

TextField.propTypes = {
  id :  PropTypes.string.isRequired,
  placeholder :  PropTypes.string.isRequired,
  divClassname :  PropTypes.string.isRequired,
  inputClassname:  PropTypes.string.isRequired,
  labelClassname : PropTypes.string.isRequired,
  label : PropTypes.string.isRequired,
  value :  PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  edit : PropTypes.bool.isRequired,
}

export default TextField;
