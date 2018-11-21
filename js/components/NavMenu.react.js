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
 * @desc This component renders the navigation bar
 *
 * @author BlockSY team - blocksy@symag.com
 */

import React, { PureComponent } from 'react';
import { Link , browserHistory} from 'react-router';
import { forwardTo, setAuth0, setErrorMessages } from '../actions/AppActions';
import { changeUser } from '../actions/Users';
import { LANGS } from '../constants/Internationalization'
import LoadingButton from './LoadingButton.react';
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { isNull, log, clone, saveJSONToStore } from '../utils/commons'; // test if var or var.x is undefined, null or ""
import { urlToJSON } from '../utils/url';

import Select from './forms/inputs/Select.react';

class NavMenu extends PureComponent {

  constructor() {
    super();

    document.documentElement.scrollTop = 0
    window.emly_navBackgroundHidden = false
  }

  /**
   * Add event listener
   */
  componentDidMount() {

    var obj = this
    if (document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', this._exitFullscreen.bind(this), false);
        document.addEventListener('mozfullscreenchange', this._exitFullscreen.bind(this), false);
        document.addEventListener('fullscreenchange', this._exitFullscreen.bind(this), false);
        document.addEventListener('MSFullscreenChange', this._exitFullscreen.bind(this), false);
    }
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {}

  /**
   * Remove event listener
   */
  componentWillUpdate() {}

  _goInFullscreen() {
    // Javascript
    var element = document.querySelector("#app")

  	if(element.requestFullscreen)
  		element.requestFullscreen();
  	else if(element.mozRequestFullScreen)
  		element.mozRequestFullScreen();
  	else if(element.webkitRequestFullscreen)
  		element.webkitRequestFullscreen();
  	else if(element.msRequestFullscreen)
  		element.msRequestFullscreen();
  }

  _exitFullscreen() {
    this.props.dispatch(forwardTo("/#hd", this.props.location));
  }

  _changeLang(evt, id, value) {
    var user = clone(this.props.user)
    user.user_lang = LANGS[value]
    this.props.dispatch(changeUser(user))
    saveJSONToStore('user_lang',user.user_lang)
  }

  render() {
    if (Object.keys(this.props.settings) == 0) return null

    // Render either the Log In and register buttons, or the logout button
    // based on the current authentication state.
    var loggedIn = this.props.loggedIn;
    var currentlySending = this.props.currentlySending;

    const logout = loggedIn ?
      (
        <NavItem eventKey={5} onClick={e => this._logout(e)} className="btn btn--login btn--nav" >Logout</NavItem>)
      : (
        <NavItem eventKey={7} className="btn btn--login btn--nav">Login</NavItem>
      );

    const register = loggedIn ?
        (
          <NavItem/>)
        : (
          <NavItem eventKey={6} href="/register" className="btn btn--login btn--nav">Register</NavItem>
        );

    var menuItems = []

    if (this.props.location.hash.startsWith("#hd") && !this.props.fullScreen)
      menuItems.push({
        label:"fullscreen",
        url:"/fullscreen"
      })

    var isCredits = this.props.location.hash.indexOf("credits") > -1

    if ( isCredits )
      menuItems.push({
        label: this.props.texts['HEADER_HOME'],
        url:"/"
      })

    if (!isCredits)
      menuItems.push({
        label: this.props.texts['HEADER_CREDITS'],
        url: "/#credits"
      })

    menuItems.push({
      label: this.props.texts['HEADER_TERMS'],
      url: isNull(this.props.settings,"terms_url")?
                      "ext:"+"http://blocksy-wiki.symag.com"
                      : "ext:"+this.props.settings.terms_url[this.props.user.user_lang.key]
    })

    var pictureUrl = ""

    var hideBg = this.props.currentPage == "/"
                  && !this.props.loggedIn
                  && window.emly_navBackgroundHidden ? "hideBackground" : ""

    // check if browser is in fullscreen mode
    var isInFullscreenMode = this.props.fullScreen//(window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)
    var hdClassName = isInFullscreenMode ? "hidden" : ""

    var json = urlToJSON(this.props.location.hash,'#')

    return(
      <Navbar inverse collapseOnSelect className={ hideBg }>
          <Navbar.Header className={ this.props.loggedIn ? "loggedIn" : ""}>

              <span className="logo-wrapper">
                <a onClick={e => this._goTo("/")}>
                  <img className="nav__logo logo" src={this.props.settings.banner_url}/>
                </a>
              </span>

              <Select
                    id = "user-user_lang"
                    entries = { LANGS }
                    placeholder = { this.props.user.user_lang.label }
                    divClassname = "user-lang"
                    inputClassname = "form__field-input"
                    value = {this.props.user.user_lang.value}
                    onChange = {this._changeLang.bind(this)}
                    edit = { true }
              />

            { menuItems.length > 0 ?
              <Navbar.Toggle />
              : <span/>
            }
          </Navbar.Header>

          { menuItems.length > 0 ?
            <Navbar.Collapse>
              <Nav pullRight className={hdClassName}>
                    {menuItems.map((item) => this._createTab(item.label, item.label, item.url ))}
              </Nav>
            </Navbar.Collapse>
            : <span/>
          }

        </Navbar>

    );
  }

  _profileCss(){
    return {
      borderRadius: '50%',
      width: '50px',
      marginTop: '3px',
      height: 'auto',
      marginLeft: '25px',
    }
  }

  _createTab(key, name, url){

    const classes = "btn btn--dash btn--nav" + (this.props.location.pathname == url && url != "/" ||
                                                this.props.location.hash.indexOf(url) > -1 ? " nav-btn-clicked" : "");

    return (
        <NavItem id={key} key={key}
          onClick={e => this._goTo(url)}
          eventKey={ key } className={ classes }>
          { name }
        </NavItem>
    )
  }

  _account() {
    this._goTo("/account");
  }

  _login() {
    this.props.dispatch(setAuth0(true, null, "/login"))
    this._goTo("/login");
  }

  _logout() {
    // no need for logging out here
  }

  _goTo(url) {

    if (url == "/fullscreen") {
      this._goInFullscreen()
      url = "#hd?mode=fullscreen"
    }

    if (url.startsWith("ext:")){
      window.open(url.replace('ext:',''),'_blank');
    }
    else {
      // change page
      this.props.dispatch(setErrorMessages(null));
      this.props.dispatch(forwardTo(url, this.props.location));
    }
  }
}

// Wrap the component to inject dispatch and state into it
export default NavMenu;
