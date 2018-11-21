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
 * @desc This is a set of useful tools made to accelerate the development
 * and to make our app more robust and safer.
 *
 * @author BlockSY team - blocksy@symag.com
 */

import { PRODUCTION } from '../constants/Config'
import moment from 'moment'
import StackTrace from 'stacktrace-js'

/*
* Test if var or var.x is undefined, null or ""
* @author BlockSY team - blocksy@symag.com
*/
export function isNull(object, entry) {
  try {
    if (object === undefined || object == null || object == "") return true

    if (entry === undefined || entry == null || entry == "") return false

    if (Object.keys(object) == 0 ) return true
    return object[entry] === undefined || object[entry] == null ||  object[entry] == ""
  }
  catch (err) {
    return true
  }
}

/* clone any kind of non cyclical object */
export function clone(obj){
  return JSON.parse(JSON.stringify(obj))
}

/* retrieve the first entry of a map */
export function getFirstEntry(map){
  if ( Object.keys(map).length > 0 ){
    // taking the first one in the list
    for(var key in map) {
      if (map.hasOwnProperty(key)) {
          return key;
      }
    }
  }

  return ""
}

/* retrieve the first entry of a map */
export function getFirstValue(map){
  if ( Object.keys(map).length > 0 ){
    // taking the first one in the list
    for(var key in map) {
      if (map.hasOwnProperty(key)) {
          return map[key];
      }
    }
  }

  return ""
}

/* retrieve key from a string value in a map */
export function getKeyFromValue(map, stringValue){

  var keys = Object.keys(map)
  var values = Object.values(map)

  for(var i = 0 ; i < values.length; i++) {
      if (values[i] == stringValue) {
          return keys[i];
      }
  }

  return ""
}

/* convert values of map to array */
export function convertMapValuesToArray(map, attributeName){

  var values = Object.values(map)
  var array = []

  for(var i = 0 ; i < values.length; i++) {
      if (isNull(attributeName))
        array.push(values[i])
      else {
        array.push(values[i][attributeName])
      }
  }

  return array
}

/* retrieve the json entry that contains a specific key/value */
export function getJsonArrayEntryByKeyValue(arrayOfJson, key, value ){

  for(var i=0; i<arrayOfJson.length; i++) {
    var json = arrayOfJson[i]
    if (json[key] == value) return json
  }

  return null
}

/* logging methods */
export const LOG_DEBUG = 1;
export const LOG_INFO = 2;
export const LOG_ERROR = 3
export const LOG_FATAL = 4;

export function logFatal(message, jsonAttributes){
  log(message, LOG_FATAL, jsonAttributes)
}

export function logError(message, error){
  var errorJson = {raw: JSON.stringify(error)}
  if (!isNull(error,"name")) errorJson["name"] = error.name
  if (!isNull(error,"message")) errorJson["message"] = error.message

  log(message, LOG_ERROR, {error: errorJson})
}

export function logInfo(message, jsonAttributes){
  log(message, LOG_INFO, jsonAttributes)
}

export function logDebug(message, jsonAttributes){
  log(message, LOG_DEBUG, jsonAttributes)
}

/* logging method */
export function log(message, priority, jsonAttributes){

  //TODO: manage priority and json key values from js logger Winston

  var entry = {}
  entry["dateTime"]= moment().unix()

  switch (priority){
    case LOG_INFO:   entry["level"]= "INFO"; break;
    case LOG_ERROR:  entry["level"]= "ERROR"; break;
    case LOG_FATAL:  entry["level"]= "FATAL"; break;
    default: entry["level"]= "DEBUG"; break;
  }

  if (PRODUCTION && entry["level"] == "DEBUG") return;

  entry["message"] = message
  entry["attributes"] = jsonAttributes

  var stacktrace = StackTrace.getSync();
  stacktrace.shift();
  entry["stacktrace"] = stacktrace

  console.log(JSON.stringify(entry))

  // TODO:  report errors and fatals to server

}

/* localstorage management */
export function saveJSONToStore(key, obj){
  localStorage.setItem(key, JSON.stringify(obj))
}

export function readJSONFromStore(key){
  return JSON.parse(localStorage.getItem(key))
}

export function deleteJSONFromStore(key){
  localStorage.removeItem(key)
}
