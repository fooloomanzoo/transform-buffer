'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var int8 = DataView.prototype.setInt8;
var uint8 = DataView.prototype.setUInt8;
var int16 = DataView.prototype.setInt16;

var int32 = DataView.prototype.setInt32;
var uint32 = DataView.prototype.setUint32;
var float32 = DataView.prototype.setFloat32;
var float64 = DataView.prototype.setFloat64;

var int8$1 = DataView.prototype.getInt8;
var uint8$1 = DataView.prototype.getUInt8;
var int16$1 = DataView.prototype.getInt16;

var int32$1 = DataView.prototype.getInt32;
var uint32$1 = DataView.prototype.getUint32;
var float32$1 = DataView.prototype.getFloat32;
var float64$1 = DataView.prototype.getFloat64;

function treat (view, s, g, min, max, byteLength) {

  function clamp (v) {
    return v <= max ? (v >= min ? v : min) : max;
  }

  function valueOf (v) {
    return +v;
  }

  function set (view, offset, value) {
    s.call(view, offset, clamp(value));
  }

  function get (view, offset) {
    return g.call(view, offset);
  }

  return {
    set: set,
    get: get,
    valueOf: valueOf,
    clamp: clamp,
    min: min,
    max: max,
    byteLength: byteLength
  };
}

function bool (view) {

  const min = 0,
  	max = 1,
  	byteLength = 1,
    g = int8$1,
    s = int8;

  var t = treat(view, s, g, min, max, byteLength);

  t.clamp = function (v) {
    return v === true ? 1 : 0;
  };

  t.valueOf = function (v) {
    return v === 1 ? true : false;
  };

  t.get = function (view, byteOffset) {
    return t.valueOf(g.call(view, byteOffset));
  };

  return t;
}

function int8$2 (view) {

  const min = -128,
  	max = 127,
  	byteLength = 1,
    g = int8$1,
    s = int8;

  return treat(view, s, g, min, max, byteLength);
}

function int16$2 (view) {

  const min = -32768,
  	max = 32767,
  	byteLength = 2,
    g = int16$1,
    s = int16;

  return treat(view, s, g, min, max, byteLength);
}

function int32$2 (view) {

  const min = -2147483648,
  	max = 2147483647,
  	byteLength = 4,
    g = int32$1,
    s = int32;

  return treat(view, s, g, min, max, byteLength);
}

function uint8$2 (view) {

  const min = 0,
  	max = 255,
  	byteLength = 1,
    g = uint8$1,
    s = uint8;

  return treat(view, s, g, min, max, byteLength);
}

function uint16$2 (view) {

  const min = 0,
  	max = 65535,
  	byteLength = 2,
    g = uint32$1,
    s = uint32;

  return treat(view, s, g, min, max, byteLength);
}

function uint32$2 (view) {

  const min = 0,
  	max = 4294967295,
  	byteLength = 4,
    g = uint32$1,
    s = uint32;

  return treat(view, s, g, min, max, byteLength);
}

function float32$2 (view) {

  const min = -1*(2-Math.pow(2,-23))*Math.pow(2,127),
  	max = (2-Math.pow(2,-23))*Math.pow(2,127),
  	byteLength = 4,
    g = float32$1,
    s = float32;

  return treat(view, s, g, min, max, byteLength);
}

function float64$2 (view) {

  const min = -Number.MAX_VALUE,
  	max = Number.MAX_VALUE,
  	byteLength = 8,
    g = float64$1,
    s = float64;

  return treat(view, s, g, min, max, byteLength);
}

function date (view) {

  const min = -8640000000000000,
  	max = 8640000000000000,
  	byteLength = 8,
    g = float64$1,
    s = float64;

  var t = treat(view, s, g, min, max, byteLength);

  t.clamp = function (v) {
    v = (typeof v === 'number') ? v : (typeof v === 'object') ? +v : parseInt(v);
    return v <= max ? (v >= min ? v : min) : max;
  };

  return t;
}

var types = {
  bool: bool,
  int8: int8$2,
  int16: int16$2,
  int32: int32$2,
  uint8: uint8$2,
  uint16: uint16$2,
  uint32: uint32$2,
  float32: float32$2,
  float64: float64$2,
  date: date
};

/**
 * [set and get sequences of data on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {Object} [description]
 */

var sequ = function(datatypes, keys, dataview) {
  var byteOrder,
    byteLength,
    offcutLength,
    offset,
    getter,
    setter,
    handleAsArray;

/**
 * [change the given datastructur of the sequence]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} sequenceKeys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @param  {Object} [the view on the buffer, where the data is set]
 * @return {number} [byteLength]
 */
  const setSequenceTypes = function (datatypes, sequenceKeys, view) {
    if (!(Array.isArray(datatypes) && (datatypes.length > 0))) {
      throw new TypeError(`Types for Data must be an Array: ${datatypes}`);
    }
    if (sequenceKeys && !(Array.isArray(sequenceKeys) && (sequenceKeys.length === datatypes.length))) {
      throw new TypeError(`Keys for Data must be an Array and equal by lngth to Datatypes: ${sequenceKeys}`);
    }
    if (view && !(ArrayBuffer.isView(view) && view.buffer)) {
      throw new TypeError(`View must a view on a buffer`);
    }
    byteLength = 0;
    byteOrder = [0];
    getter = [];
    setter = [];
    keys = [];
    var type;
    handleAsArray = Boolean(sequenceKeys);
    for (var i = 0; i < datatypes.length; i++) {
      if (datatypes[i] in types) {
        type = types[datatypes[i]]();
        byteLength += type.byteLength;
        byteOrder.push(byteLength);

        getter.push(type.get);
        setter.push(type.set);

        if (sequenceKeys && sequenceKeys[i]) {
          keys.push(sequenceKeys[i]);
        } else {
          keys.push(i);
        }
      } else {
        throw new TypeError(`Invalid Number-Type: ${datatypes[i]}`);
      }
    }
    if (view && view.byteLength !== undefined) {
      dataview = view;
    } else {
      dataview = new DataView( new ArrayBuffer( byteLength ), offset, byteLength);
    }
    offcutLength = dataview.byteLength - byteLength;
    if (offcutLength < 0) {
      throw new TypeError(`Buffer is smaller than the given sequence`);
    }
    return byteLength;
  };

  /**
   * [setting or getting the dataview of the sequence]
   * @method
   * @param  {Object} [the view on the buffer, where the data is set]
   * @param  {number} [the offset of the view on the buffer, where the data is set]
   * @return {Object} [the dataview]
   */
  const view = function () {
    return (arguments.length === 0) ? (dataview !== undefined ? dataview : (dataview = new DataView( new ArrayBuffer( byteLength, byteOffset(arguments[1]), byteLength )))) : (dataview = arguments[0]);
  };

  /**
   * [setting or getting the byteOffset of the view]
   * @method
   * @param  {number} [the offset of the view on the buffer, where the data is set]
   * @return {Object} [the offset]
   */
  const byteOffset = function () {
    return (arguments.length === 0) ? (offset !== undefined ? offset : (offset = 0)) : (offset = arguments[0]);
  };

/**
 * [set data to an given view on a buffer]
 * @method
 * @param  {[Object,Array]} value [The value to be set]
 * @return {Object} [the dataview]
 */
  const set = function(value) {
    for (var i = 0; i < setter.length; i++) {
      setter[i].call(dataview, offset += byteOrder[i], value[keys[i]]);
    }
    return dataview;
  };

/**
 * [retrieve data of an given view on a buffer]
 * @method
 * @return {Object|Object[]} [The get value]
 */
  const get = function() {
    var ret = [];
    for (var i = 0; i < getter.length; i++) {
      ret.push(getter[i].call(dataview, offset += byteOrder[i]));
    }
    return handleAsArray ? ret : ret;
  };

  setSequenceTypes(...arguments);

  return {
    byteOrder: byteOrder,
    byteLength: byteLength,
    byteOffset: byteOffset,
    offcutLength: offcutLength,
    getter: getter,
    setter: setter,
    keys: keys,
    handleAsArray: handleAsArray,
    set: set,
    get: get,
    dataview: view
  };
};

/**
 * [transpose and rejoin arrays on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 */
var array$1 = function(datatypes, keys) {
  var _sequence;

  const sequence = function() {
    return arguments.length === 0 ? (_sequence = sequ(...arguments)) : _sequence;
  };

  /**
   * [description]
   * @method
   * @return {Object[]} [description]
   */
  const join = function() {
    if (!arguments.length) return;
    var ret = [];
    // console.log(arguments.length);
    var len = Math.floor(arguments.length / sequenceKeys.length) * sequenceKeys.length;
    var i = 0,
        l = 0;
    while (i < len) {
      ret.push({});
      for (var j = 0; j < keys.length; j++, i++) {
        ret[l][keys[j]] = arguments[i];
      }
      l++;
    }
    return ret;
  };

  /**
   * [description]
   * @method
   * @return {Object[]} [description]
   */
  const split = function() {
    if (!arguments.length) return;
    var ret = [];
    for (var i = 0; i < arguments.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        ret.push(arguments[i][keys[j]]);
      }
    }
    return ret;
  };

  const transpose = function() {
    if (!arguments.length) return;

    var buffer = new ArrayBuffer( arguments.length * this.sequenceByteLength );
    const view = new DataView(buffer);
    sequence.dataview(view);
    for (var i = 0, offset = 0; i < arguments.length; i++, offset += this.sequenceByteLength) {
      sequence.set(offset, array[i]);
    }
    return buffer;
  };

  const retrieve = function(buffer) {
    return buffer;
  };


  sequence(...arguments);

  return {
    sequence: sequence,
    split: split,
    join: join,
    transpose: transpose,
    retrieve: retrieve
  };
};

exports.sequence = sequ;
exports.array = array$1;
exports.types = types;
