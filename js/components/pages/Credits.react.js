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
 * @desc Credits page
 * @author BlockSY team - blocksy@symag.com
 */

import React, { Component } from 'react';

class Credits extends Component {
  render() {
    return(
      <article className="credits">
        <section className="team">
          <h2>{this.props.texts['CREDITS_TEAM']}</h2>

          <div className="row">
            <div className="col-md-12 people-list">
                <div className="people">
                  <a href="https://linkedin.com/in/jbonnel" target="_blank">
                    <img className="profile-avatar" src="https://pbs.twimg.com/profile_images/731968923868991488/AZEtuXV-_400x400.jpg" alt="Julien Bonnel"/>
                  </a>
                  <div className="team-info">
                    <h4><a href="https://linkedin.com/in/jbonnel" target="_blank">Julien Bonnel</a></h4>
                    <h5><a href="http://www.symag.com" target="_blank">Symag by BNP Paribas</a></h5>
                    <h5>CIO</h5>
                  </div>
                </div>

                <div className="people">
                  <a href="https://linkedin.com/in/bruno-coste-2b0a487" target="_blank">
                    <img className="profile-avatar" src="https://pbs.twimg.com/profile_images/573593204685168641/hfS1dqgy_400x400.jpeg" alt="Bruno Coste"/>
                  </a>
                  <div className="team-info">
                    <h4><a href="https://linkedin.com/in/bruno-coste-2b0a487" target="_blank">Bruno Coste</a></h4>
                    <h5><a href="http://www.symag.com" target="_blank">Symag by BNP Paribas</a></h5>
                    <h5>{this.props.texts['CREDITS_ENGINEER']}</h5>
                  </div>
                </div>

                <div className="people">
                  <a href="https://linkedin.com/in/bgoetzmann" target="_blank">
                    <img className="profile-avatar" src="https://pbs.twimg.com/profile_images/205904611/Bertrand_400x400.jpg" alt="Bertrand Goetzmann"/>
                  </a>
                  <div className="team-info">
                    <h4><a href="https://linkedin.com/in/bgoetzmann" target="_blank">Bertrand Goetzmann</a></h4>
                    <h5><a href="http://www.symag.com" target="_blank">Symag by BNP Paribas</a></h5>
                    <h5>{this.props.texts['CREDITS_ENGINEER']}</h5>
                  </div>
                </div>
            </div>
          </div>
        </section>

        <section className="stack">
          <h2>{this.props.texts['CREDITS_STACK']}</h2>
          <div className="row">
            <div className="col-md-12 featured-sites">
                <a href="http://blocksy-wiki.symag.com" title="BlockSY" target="_blank"><img src="img/logos/blocksy.png" alt="BlockSY"/></a>
                <a href="https://www.ethereum.org" title="Ethereum" target="_blank"><img src="img/logos/ethereum.png" alt="Ethereum"/></a>
                <a href="https://bitcoinj.github.io" title="BitcoinJ" target="_blank"><img src="img/logos/bitcoinj.png" alt="BitcoinJ"/></a>
                <a href="https://grails.org" title="Grails" target="_blank"><img src="img/logos/grails.png" alt="Grails"/></a>
                <a href="http://groovy-lang.org" title="Groovy" target="_blank"><img src="img/logos/groovy.png" alt="Groovy"/></a>
                <a href="https://mongodb.com" title="MongoDB" target="_blank"><img src="img/logos/mongodb.png" alt="MongoDB"/></a>
                <a href="https://kafka.apache.org" title="Apache Kafka" target="_blank"><img src="img/logos/kafka.png" alt="Apache Kafka"/></a>
                <a href="https://bitcoincash.org" title="BitcoinCash" target="_blank"><img src="img/logos/bitcoincash.png" alt="BitcoinCash"/></a>
                <a href="https://reactjs.org/" title="ReactJS" target="_blank"><img src="img/logos/react.png" alt="ReactJS"/></a>
                <a href="https://redux.js.org/" title="ReduxJS" target="_blank"><img src="img/logos/redux.png" alt="ReduxJS"/></a>
                <a href="https://projects.spring.io/spring-boot/" title="SpringBoot" target="_blank"><img src="img/logos/springboot.png" alt="SpringBoot"/></a>

            </div>
          </div>
        </section>

        <section className="app-infos">
          <h2>{this.props.texts['CREDITS_APP_INFOS']}</h2>
          <ul>
          <li>version: {this.props.settings.app_version}</li>
          </ul>
          <br/><br/><br/><br/>
        </section>

        <br/><br/>

      </article>
    );
  }
}

export default Credits;
