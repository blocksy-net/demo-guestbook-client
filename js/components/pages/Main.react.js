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
 * @desc This is the main page of Guestbook app.
 * It displays a tabbed pane containing:
 * - a registration page
 * - a guestbook page
 * - a results page displaying donations or votes
 *
 * Route: /
 * @author BlockSY team - blocksy@symag.com
 */

import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { setErrorMessage, forwardTo, setAuth0 } from '../../actions/AppActions';

import { reinitUser } from '../../actions/Users'
import { getMessage, retrieveMessages } from '../../actions/Messages'
import { retrieveDonationsBalance } from '../../actions/Donations'
import { displayMessageStatus, TAB_PUBLISH, TAB_MESSAGES, TAB_DONATIONS} from '../../constants/AppConstants';

import map from 'lodash/map'
import get from 'lodash/get'
import moment from 'moment'
import { urlToJSON } from '../../utils/url';
import { Tabs, Tab } from 'react-bootstrap'
import { log, clone, isNull, getFirstEntry, since } from '../../utils/commons'

import InfiniteScroll from 'react-infinite-scroll-component';
import Avatar from 'react-avatar'
import ProgressBar from 'react-progressbar.js'

// import forms
import RegisterForm from '../forms/RegisterForm.react';

export default class Main extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      display:  "list",
      messageUid: '',
      activeTab : -1, // default mode HD (no tabs)
      propsTab : -2, // to keep the old propsTab value
      currentMessagesPage : 1,
      currentDonationsPage : 1,
      messagesLastUpdate: 0,
      messages: [],
      donationsBalanceLastUpdate: 0,
      donationsBalance: [],
      fetchingMessage: false,
      messagesTimeout: [],
      resultsTimeout: []
    };
  }

  componentWillMount(){
    this.stateMachine()

    switch (this.props.tab){
      case -1: // default mode HD (no tabs)
        this._handleSelect(TAB_MESSAGES, true) // start guestbook timers
        this._handleSelect(TAB_DONATIONS, true) // start donations timers
        break
      case TAB_MESSAGES:
        this._handleSelect(TAB_MESSAGES, false) // start guestbook timers
        break
      case TAB_PUBLISH: // in order to get the number of donations
        this.props.dispatch(retrieveDonationsBalance())
        break
      case TAB_DONATIONS:
        this._handleSelect(TAB_DONATIONS, false) // start donations timers
        break
    }
  }

  componentWillReceiveProps(nextProps){
    this.stateMachine(nextProps)

  }

  shouldComponentUpdate(nextProps, nextState){
    this.stateMachine(nextProps, nextState)
    return true
  }

  stateMachine(nextProps, nextState){

    var state = {}

    var _state = nextState ? nextState : this.state
    var _props = nextProps ? nextProps : this.props

    //////
    // update messages list(s)
    //
    if (!isNull(_props.data.messages)
        && _props.data.messages.length >0
        && _state.messagesLastUpdate < _props.data.messagesLastUpdate){

      state["messages"]=_props.data.messages
      state["messagesLastUpdate"]=_props.data.messagesLastUpdate
    }

    if (!isNull(_props.data.donationsBalance)
        && _props.data.donationsBalance.length >0
        && _state.donationsBalanceLastUpdate < _props.data.donationsBalanceLastUpdate){
      var  donationsBalance = _props.data.donationsBalance;
      state["donationsBalance"] = donationsBalance;
      state["donationsBalanceLastUpdate"] = _props.data.donationsBalanceLastUpdate;
    }

    if (_props.tab != this.state.propsTab ) {
      state["activeTab"]=_props.tab
      state["propsTab"]=_props.tab
      this._handleSelect(_props.tab, true)
    }

    //////
    // display message if required
    //

    var currentMessage = _state.messageUid
    var urlParams = _props.urlParams

    var messageToLoad = urlParams && urlParams.uid ? urlParams.uid : null
    var mode = _state.display

    // come back to list from message view case
    if (currentMessage != '' && mode == "list" && !messageToLoad){
      state["messageUid"] = ''
      state["urlToJSON"] = ''
    }

    // no message displayed
    if (currentMessage == ''){

      // but message uid is passed through url
      if (messageToLoad && !_state.fetchingMessage){

        if (_props.data.loggedIn){
            // fetch message
            state["fetchingMessage"]=true
            _props.dispatch(getMessage(messageToLoad))
        }
        else {
            // fetch message bypassing auth
            _props.dispatch(getMessage(messageToLoad, urlParams.id, true))
            state["fetchingMessage"]=true
        }
      }
    }

    // but a message has been fetched in store
    if (_props.data.message.uid != ''){

      // message was just loaded
      if (_state.fetchingMessage) {
        state["fetchingMessage"]=false
        state["messageUid"] = _props.data.message.uid
        log("Main stateMachine fetchingMessage")
      }
      else if (currentMessage == _props.data.message.uid) {

        // load message for owner or viewer
        var _mode = mode

        // if mode has changed
        if (mode != _mode)
          state["display"] = _mode
      }

    }

    if (Object.keys(state).length > 0) this.setState(state)

    return state
  }

  _scrollerRefresh(){}

  _scrollerFetchData(){

    if (this.state.activeTab != TAB_MESSAGES && this.props.pathname != "/hd") return

    var nextPage = this.state.currentMessagesPage+1

    /* debug purpose
    var messages = this.state.messages

    for(var i=0; i<10; i++){

      var nb = this.state.messages.length+i

      var message = {
        id: nb,
        dateTime: moment().unix(),
        value: 'message number '+nb,
        author : {
          id: nb,
          name: 'user '+nb,
          twitter_id: 'user_twitter_'+nb,
          photo_url: ''
        }
      };

      messages.push(message)
    }*/

    this.setState({
      //for debug purpose: messages: messages,
      currentMessagesPage: nextPage
    })
  }

  _logout(){
    this.props.auth.logout({
      returnTo: buildAppUrl("/")
    })
  }

  render() {

    if (Object.keys(this.props.data.settings) == 0) return null

    const { history, user, currentlySending, location, errorMessages } = this.props.data;

    const dispatch = this.props.dispatch;
    var _this = this

    // this method renders the bootstrap tables by columns
    const renderCustom = (cell, row, extra) => {

       // row contains all message data
       // extra contains path and title
       var value = get(row, extra.path);
       var status = ""
       var yours = ""

       switch(extra.path){

         case "name":
            return <div className="logo">
                    <a href={row.entity.url} target="_blank">
                      <img src={row.entity.logo_url}/>
                    </a>

                   </div>

         case "balance":

            return <div>
                    <div className="balance">{value},00 <span className="dark">{_this.props.data.settings.investment.currency}</span></div>
                    <div className="subtitle">
                      {_this.props.data.texts['MAIN_DONATIONS_FOR']} <a href={row.entity.url} target="_blank"><span className="organization">{row.entity.name[_this.props.data.user.user_lang.key]}</span></a>
                    </div>
                   </div>
         default:
            return <span/>
       }
    };

    var columns = null;

    // define colums depending on active tab
    if (this.state.activeTab == TAB_DONATIONS || this.props.tab == -1){ // sent view
      columns = [
        //{ path: "logo", title: "logo", dataSort: false, class: "date"}, //TODO: translations required
        { path: "name", title:"nom",  dataSort: true},
        { path: "balance", title: "total",  dataSort: true},
      ];

      columns[0].title=this.props.data.texts['MAIN_DONATIONS_NAME']
    }


    var obj = this

    // load column css style
    const columnClassNameFormat = (fieldValue, row, rowIdx, colIdx) => {
      // fieldValue is column value
      // row is whole row object
      // rowIdx is index of row
      // colIdx is index of column
      return obj.state.activeTab == TAB_DONATIONS? (colIdx == 1 ? 'date' : colIdx == 3 ? 'by' : '' ) : colIdx == 2 ? 'date' : '';
    }

    // create colums
    const tableColumn = map(columns, column => (
    	<TableHeaderColumn
        columnClassName={ columnClassNameFormat.bind(this)}
        className={column.class}
    		dataField={column.path}
    		dataFormat={renderCustom.bind(this)}
    		formatExtraData={column}
    		isKey={column.isKey}
    		key={column.path}
        dataSort={column.dataSort}
        hidden={column.hidden}
    	>{column.title}</TableHeaderColumn>
    ));

    // configure row options
    var selectRow = {
      mode: 'radio',
      onSelect: this._onSelectRow.bind(this),
      hideSelectColumn: true,
      clickToSelect: true,
    };

    var messages = []

    const style = {
      alignItems: 'center',
    };

    var width = document.getElementById('app').clientWidth
    var avatarSize = width < 800 ? 60 : 75

    moment.locale('fr'); // TODO manage user lang

    for(var i=0; i<this.state.messages.length;i++){
      var message = this.state.messages[i]

      // calcule time elapsed since message has been created
      var now = moment().unix()
      var seconds = now - message.dateTime
      var days = Math.floor(seconds / (3600*24))
      seconds  -= days*3600*24
      var hours   = Math.floor(seconds / 3600)
      seconds  -= hours*3600;
      var minutes = Math.floor(seconds / 60)
      seconds  -= minutes*60;

      var since = {}
      since["days"]=days
      since["hours"]=hours
      since["minutes"]=minutes
      since["seconds"]=seconds

      // add JSX to display message
      messages.push(
        <div key={'div' + i} className="form__field-wrapper guestbook entry">

          <div className="photo">
              {
                message.author.photo_url == '' || message.author.photo_url == 'null'  ?
                  <Avatar round={true} size={avatarSize} name={message.author.name} />
                :
                  <Avatar round={true} size={avatarSize} src={message.author.photo_url} />
              }
          </div>
          <div className="content">
            <div className="header">
              {message.author.name}&nbsp;
              { isNull(message.author,"twitter_screenName") || message.author.twitter_screenName == "null"  ?
                <span/>
                :
                <a className="twitter" href={"https://twitter.com/@"+message.author.twitter_screenName} target="_blank">{ message.author.twitter_screenName.length > 50 ? "" : "@"+message.author.twitter_screenName}&nbsp;</a>
              }
              <span className="dateTime">&bull; {since.days>0? since.days+"d ": ""}{since.hours>0? since.hours+"h ": ""}{since.minutes}mins</span>
            </div>
            <div className="message">{message.value}</div>
            <div className="footer">
              { this.props.data.texts['MAIN_MESSAGES_CERTIFICATE'] } <a href={this.props.data.settings.blocksy_website_url[this.props.data.user.user_lang.key]}>Blocksy</a>&nbsp;
              { message.confirmations > 0 ?
                <span>{ this.props.data.texts['MAIN_MESSAGES_WITH'] } <a href={message.url_blockexplorer} target="_blank">{message.confirmations} { this.props.data.texts['MAIN_MESSAGES_CONFIRMATIONS'] }</a></span>
                :
                <span>, { this.props.data.texts['MAIN_MESSAGES_AWAITINGCONFIRMATION'] }</span>
              }:

              <br/>

              <a href={message.url_blockexplorer} target="_blank">{message.id} </a>
            </div>
          </div>
        </div>
      )

    }

    // calculate the amount raised
    var totalRaised = 0

    for (var i=0; i<this.state.donationsBalance.length; i++)
      totalRaised += this.state.donationsBalance[i].balance

    // calculate the percentage of goal
    var max = isNull(this.props.data.settings, "investment")? 0 : this.props.data.settings.investment.amount_total
    var percentage = max > 0 ? totalRaised / max : 0

    // guestbook display
    const guestbookComponent = (
      <InfiniteScroll
          pullDownToRefresh
          pullDownToRefreshContent={
            <span/>
          }
          releaseToRefreshContent={
            <span/>
          }
          refreshFunction={e => this._scrollerRefresh(e)}
          next={e => this._scrollerFetchData(e)}
          hasMore={true}
          loader={<div className="messages-loading"><br/><br/>
                    <i className="messages-loading-icon fa fa-commenting fa-2x"></i><br/>
                    <span>{this.props.data.texts['MAIN_MESSAGES_LOADING']}</span><br/>
                    <span className="loading">{this.props.data.texts['MAIN_MESSAGES_NODATA']}</span>
                  </div>}
          endMessage={"-"}
        >

        { messages }

      </InfiniteScroll>
    )

    // check if browser is in fullscreen mode
    var titleHdClassName = "eventTitle" + (this.props.data.fullScreen ? " eventTitleHD" : "")
    var ochdClassName = (this.props.data.settings.donation.enabled ?  "" : "hd-one-column")
    var hdClassName = "containerHD" + (this.props.data.fullScreen ? " fullscreen-mode "+ochdClassName : " "+ochdClassName)
    var dhdClassName = "donationsHD" + (this.props.data.fullScreen ? " donationsHD-fullscreen" : "")
    var ghdClassName = (this.props.data.settings.donation.enabled ?  "" : "hd-one-column")

    return (

        <article>
            <h1 className={titleHdClassName}>{this.props.data.settings.title[this.props.data.user.user_lang.key]}</h1>

            <section className="row">

              { this.props.tab == -1 ?

                <table className={hdClassName}>
                  <tbody>
                    <tr>
                      <td width="50%">
                        <div className ="guestbookHD">
                          {guestbookComponent}
                        </div>
                      </td>

                      { !isNull(this.props.data.settings.donation, "enabled")
                        &&  this.props.data.settings.donation.enabled ?
                        <td width="50%" >
                          <div className={dhdClassName}>
                            <div className="form__field-wrapper">
                              { max > 0 ?
                                <div className="objective">

                                  <div className="title">
                                    <span className="green">{totalRaised},00</span> {this.props.data.settings.investment.currency} {this.props.data.texts['MAIN_DONATIONS_PROGRESS_RAISED']} <span className="green">{this.props.data.settings.investment.amount_total},00</span> {this.props.data.settings.investment.currency}
                                  </div>

                                  <div>
                                    <ProgressBar.Line
                                        progress={percentage}
                                        text={''}
                                        options={{strokeWidth: 4, color: "#3c9146", trailColor: "#e9e9e9" }}
                                        initialAnimate={true}
                                        containerStyle={{ height: '25px'}}
                                        containerClassName={'progressbar'} />
                                  </div>

                                  <div className="subtitle">
                                   {this.props.data.settings.donation.donator[this.props.data.user.user_lang.key]}<br/>
                                   {this.props.data.settings.donation.rules[this.props.data.user.user_lang.key]}
                                  </div>

                                </div>
                                : <span/>
                              }

                              <BootstrapTable
                                  tableBodyClass='donations'
                                  data={ isNull(this.state,"donationsBalance") ? new Array() : this.state.donationsBalance }
                                  bordered={ false } selectRow={ selectRow }
                                  options={{
                                     defaultSortName: 'balance',
                                     defaultSortOrder: 'desc',
                                     noDataText: 'No data retrieved.'
                                  }} >
                                <TableHeaderColumn dataField='multichain_id' isKey={ true } hidden>multichain_id</TableHeaderColumn>
                                {tableColumn}
                              </BootstrapTable>
                            </div>
                          </div>
                        </td>
                        : <td/>
                      }
                    </tr>
                  </tbody>
                </table>

              :
              <div className="container">

                <Tabs id="messages-tabs" activeKey={this.state.activeTab} onSelect={e => _this._handleSelect(e)}>

                    <Tab eventKey={TAB_PUBLISH} title={this.props.data.texts['MAIN_TABS_PUBLISH']}>
                       <RegisterForm ref="newMessage"
                             loggedIn={this.props.data.loggedIn}
                             mode={ "edit" }
                             lastUpdated={this.props.data.message.lastUpdated}
                             user={user}
                             userLastUpdate = {this.props.data.userLastUpdate}
                             token={this.props.data.token}
                             errorMessages={errorMessages ? errorMessages : {}}
                             dispatch={dispatch}
                             location={location}
                             history={history}
                             onSubmit={e => this._onMessageSubmit(e)}
                             onCancel={e => this._onMessageSubmit(e)}
                             onError={e => this._triggerError(e)}
                             currentlySending={currentlySending}
                             auth = {this.props.auth}
                             settings = { this.props.data.settings }
                             serverError = { this.props.data.serverError }
                             fastLoad = { true }
                             ready = { this.state.activeTab == TAB_PUBLISH }
                             texts = { this.props.data.texts }
                             logout = { e => this._logout()}
                             donationPossible = {
                               !isNull(this.props.data.settings, "donation")
                                   && this.props.data.settings.donation.enabled
                                   &&  totalRaised < max
                             }
                       />
                     </Tab>

                     <Tab eventKey={TAB_MESSAGES} title={this.props.data.texts['MAIN_TABS_MESSAGES']}>

                       {guestbookComponent}

                     </Tab>

                     { this.props.data.settings.donation.enabled ?
                     <Tab eventKey={TAB_DONATIONS} title={this.props.data.texts['MAIN_TABS_DONATIONS']}>

                       { this.state.activeTab == TAB_DONATIONS ?

                         <div className="form__field-wrapper">
                           { max > 0 ?
                             <div className="objective">

                               <div className="title">
                                 <span className="green">{totalRaised},00</span> {this.props.data.settings.investment.currency} {this.props.data.texts['MAIN_DONATIONS_PROGRESS_RAISED']} <span className="green">{this.props.data.settings.investment.amount_total},00</span> {this.props.data.settings.investment.currency}
                               </div>


                               <div>
                                 <ProgressBar.Line
                                     progress={percentage}
                                     text={''}
                                     options={{strokeWidth: 4, color: "#3c9146", trailColor: "#e9e9e9" }}
                                     initialAnimate={true}
                                     containerStyle={{ height: '25px'}}
                                     containerClassName={'progressbar'} />
                               </div>

                               <div className="subtitle">
                                {this.props.data.settings.donation.donator[this.props.data.user.user_lang.key]}<br/>
                                {this.props.data.settings.donation.rules[this.props.data.user.user_lang.key]}
                               </div>

                             </div>
                             : <span/>
                           }

                           <BootstrapTable
                               tableBodyClass='donations'
                               data={ isNull(this.state,"donationsBalance") ? new Array() : this.state.donationsBalance }
                               bordered={ false } selectRow={ selectRow }
                               options={{
                                  defaultSortName: 'balance',
                                  defaultSortOrder: 'desc',
                                  noDataText: 'No data retrieved.'
                               }} >
                             <TableHeaderColumn dataField='multichain_id' isKey={ true } hidden>multichain_id</TableHeaderColumn>
                             {tableColumn}
                           </BootstrapTable>

                           <div className="rules">

                           </div>
                         </div>

                         : <span/>
                       }

                     </Tab>
                     :
                     <span/>
                    }
                  </Tabs>
                </div>
              }
            </section>

        </article>

    );
  }

  _cleanIntervals() {

    if (!isNull(this.state,"messagesTimeout") && this.state.messagesTimeout.length > 1) {

      for(var i=1; i<this.state.messagesTimeout.length;i++)
        window.clearInterval(this.state.messagesTimeout[i])

      this.setState({
          messagesTimeout: [this.state.messagesTimeout[0]]
      })
    }

    if (!isNull(this.state,"resultsTimeout") && this.state.resultsTimeout.length > 1) {
      for(var i=1; i<this.state.resultsTimeout.length;i++)
        window.clearInterval(this.state.resultsTimeout[i])

      this.setState({
          resultsTimeout: [this.state.resultsTimeout[0]]
      })
    }
  }

  /*
    when selecting a tab we will set intervals to refresh data from server
  */
  _handleSelect(key, keepTabIndex) {

    var state = {}
    var obj = this


    switch (key) {
      // messages tab
      case TAB_MESSAGES || -1:

        // retrieve messages
        obj.props.dispatch(retrieveMessages(this.state.currentMessagesPage))

        // set a timer to retrieve messages
        var messagesTimeout = window.setInterval(
          function(){
            if (obj.state.activeTab == TAB_MESSAGES || obj.state.activeTab == -1){
              obj._cleanIntervals()
              obj.props.dispatch(retrieveMessages(obj.state.currentMessagesPage))
            }
          }
          , 5000);

        state["messagesTimeout"] = this.state.messagesTimeout
        state["messagesTimeout"].push(messagesTimeout)

        break

      // results tab
      case TAB_DONATIONS || -1:

        // retrieve donations balance
        obj.props.dispatch(retrieveDonationsBalance())

        // set a timer to retrieve donations
        var resultsTimeout = window.setInterval(
          function(){
            if (obj.state.activeTab == TAB_DONATIONS || obj.state.activeTab == -1){
              obj._cleanIntervals()
              obj.props.dispatch(retrieveDonationsBalance())
            }
          }
          , 5000);


        state["resultsTimeout"] = this.state.resultsTimeout
        state["resultsTimeout"].push(resultsTimeout)

        break

      default:

        break
    }

    if (!keepTabIndex){
       state["activeTab"] = key
    }

    if (Object.keys(state).length > 0) {
       this.setState(state);
       this.forceUpdate()
     }

  }

  _onSelectRow(message){
    this.props.dispatch(getMessage(message.uid));
    this.setState({messageUid: message.uid, display:"edit" })
  }

  _displayCreateMessage(){
    this.setState({display:"create", messageUid:""});
  }

  _onMessageSubmit(messageUpdated){
      var previousLocation = {}
      previousLocation["pathname"] = "/guestbook"
      previousLocation["search"] = ""

      this.props.dispatch(reinitUser());

      this._handleSelect(TAB_MESSAGES, false) // start guestbook timers

  }

  _triggerError(message){
      this.props.dispatch(setErrorMessage(message));
  }
}

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state.homeReducer,
    location: state.location
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(Main);
