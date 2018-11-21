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
 * @desc simple select component
 * @author BlockSY team - blocksy@symag.com
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import  { findLabel, findKey } from '../../../constants/AppConstants';
import { log } from '../../../utils/commons'


import { FormControl } from 'react-bootstrap'

// Object.assign is not yet fully supported in all browsers, so we fallback to
// a polyfill
const assign = Object.assign || require('object.assign');

class Select extends PureComponent {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps,nextState){
    if (this.props.entries == null) return false
    if (this.props.entries.length == 0) return false
    if (this.props.entries[0].label == null) return false

    return true
  }

  render() {
    if (this.props.entries == null) return null
    if (this.props.entries.length == 0) return null

    var entries = [];
    var label

    if (this.props.value){
      label = findLabel(this.props.entries, this.props.value)
      entries.push(<option value={this.props.value} key={this.props.value}>
                    { findLabel(this.props.entries, this.props.value)}
                   </option>);
    }
    else{
      label = this.props.entries[this.props.value > 0 ? this.props.value-1 : 0].label
      entries.push(<option value='-1' key='-1'>{this.props.placeholder}</option>);
    }

    for(var i in this.props.entries){
      var entry = this.props.entries[i];

      if (entry.value != this.props.value){

        entries.push(
                  <option value={entry.value} key={entry.value}
                          defaultValue={this.props.value}
                  >
                          {entry.label}
                  </option>);
      }
    }

    return(
      this.props.edit ?
        <div className={this.props.divClassname}>
          <FormControl key={this.props.id}
                       componentClass="select" placeholder="select"
                       onChange={evt => this._onSelect(evt)}>
            { entries }
          </FormControl>
          <label className={this.props.labelClassname}  htmlFor={this.props.id}>{this.props.label}</label>
        </div>
        :
        <div className={this.props.divClassname}>
          <input className={this.props.inputClassname} value={label} readOnly/>
          <label className={this.props.labelClassname} htmlFor={this.props.id}>{this.props.label}</label>
        </div>
    );
  }

  _onSelect(evt){
    return this.props.onChange(null, this.props.id, parseInt(evt.target.value), true, true)
  }
}

Select.propTypes = {
  id :  PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired,
  divClassname :  PropTypes.string.isRequired,
  inputClassname : PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired
}

export default Select;
