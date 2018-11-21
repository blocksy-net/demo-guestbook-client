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
 * @desc This is a set of useful tools for manipulating URLs.
 *
 * @author BlockSY team - blocksy@symag.com
 */

/*
* Parse the URL parameters into a JSON structure
*/
export function urlToJSON(url, separator) {
  try{
    var hash;
    var myJson = {};

    if (url.indexOf(separator) == -1)
      return null

    var hashes = url.slice(url.indexOf(separator) + 1).split('&');

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        var value = decodeURIComponent(hash[1]);
        value = value.replace("[\"", "");
        value = value.replace("\"]", "");
        value = value.replace(/\^.*/, "");
        myJson[hash[0]] = value;
    }

    return myJson;
  }
  catch(err){
    console.log("cannot parse URL, err:"+err.message)
    return {}
  }
}

export function findAppUrlBase(url, knownUrls) {

    // eliminate chars after ? prefix?chars -> prefix
    if (url.indexOf('?') > -1)
      url = url.substring(0, url.indexOf('?'))

    // eliminate chars after # prefix#chars -> prefix
    if (url.indexOf('#') > -1)
      url = url.substring(0, url.indexOf('#'))

    // find url base from known urls
    for (var i=0 ; i < knownUrls.length; i++){
      if (url.endsWith(knownUrls[i]))
        return url.replace(knownUrls[i],'')
      }

    return url.endsWith("/") ? url.substring(0, url.length-1) : url
}
