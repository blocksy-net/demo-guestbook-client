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
 * @desc App configuration
 *
 * @author BlockSY team - blocksy@symag.com
 */

import { findAppUrlBase } from '../utils/url'

export const PRODUCTION = COMPIL_BUILD == "production";  // see webpack config
export const KNOWN_URLS = ["/guestbook", "/about", "/logs", "/results", "/hd", "/callback","/publish"]

var urlApi = COMPIL_API_URL; // see webpack config
var urlApp = ''

export function buildApiUrl(path, queryParameters) {
    var url = [urlApi, path , queryParameters ? '?' : '' , serializeParameters(queryParameters)].join('');
    return url;
};

export function buildAppUrl(path, queryParameters) {
    var url = [urlApp, path , queryParameters ? '?' : '' , serializeParameters(queryParameters)].join('');
    return url;
};

export function setUrlApi(url, takeAppBase) {
  if (takeAppBase)
    urlApi = urlApp + "/api"
  else
    urlApi = url;
}

export function setUrlApp(url) {
    urlApp = findAppUrlBase(url, KNOWN_URLS)
}

function serializeParameters(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k =  p, v = obj[p];
      str.push(typeof v == "object" ? serializeParameters(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
};
