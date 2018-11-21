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
 * @desc This component renders the footer
 *
 * @author BlockSY team - blocksy@symag.com
 */

import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Grid, Row, Col } from 'react-bootstrap'

class Footer extends Component {

  render() {

    if (Object.keys(this.props.settings) == 0) return null

    var d = new Date();
    const date = d.getFullYear()+"";

    return(

      <footer className="navbar-default navbar-fixed-bottom">

        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <td style={{width:'25%'}} className="footer-links"><a href={this.props.settings.blocksy_website_url[this.props.user.user_lang.key]} target="_blank"><small>Secured by<br/></small><img className="logo" style={{height:"20px"}} src={this.props.settings.logo_url}/></a></td>
              <td style={{width:'50%'}} className="footer-copyright"><small><a href="http://www.symag.com" target="_blank">©{ date } Symag by BNP Paribas Personal Finance </a></small></td>
              <td style={{width:'25%'}} className="footer-icons">
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a href={"https://twitter.com/"+this.props.settings.twitter.blocksy_screen_name} target="_blank"><FontAwesome className="fa-padding" name="twitter" size='2x'/></a>
              </td>
            </tr>
          </tbody>
        </table>

      </footer>
    );
  }
}

export default Footer;
