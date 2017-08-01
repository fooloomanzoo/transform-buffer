'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var int8 = DataView.prototype.setInt8;
var uint8 = DataView.prototype.setUInt8;
var int16 = DataView.prototype.setInt16;
var uint16 = DataView.prototype.setUint16;
var int32 = DataView.prototype.setInt32;
var uint32 = DataView.prototype.setUint32;
var float32 = DataView.prototype.setFloat32;
var float64 = DataView.prototype.setFloat64;

var int8$1 = DataView.prototype.getInt8;
var uint8$1 = DataView.prototype.getUInt8;
var int16$1 = DataView.prototype.getInt16;
var uint16$1 = DataView.prototype.getUint16;
var int32$1 = DataView.prototype.getInt32;
var uint32$1 = DataView.prototype.getUint32;
var float32$1 = DataView.prototype.getFloat32;
var float64$1 = DataView.prototype.getFloat64;

function treat (s, g, min, max, byteLength) {

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

function bool () {

  const min = 0,
  	max = 1,
  	byteLength = 1,
    g = int8$1,
    s = int8;

  var t = treat(s, g, min, max, byteLength);

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

function int8$2 () {

  const min = -128,
  	max = 127,
  	byteLength = 1,
    g = int8$1,
    s = int8;

  return treat(s, g, min, max, byteLength);
}

function int16$2 () {

  const min = -32768,
  	max = 32767,
  	byteLength = 2,
    g = int16$1,
    s = int16;

  return treat(s, g, min, max, byteLength);
}

function int32$2 () {

  const min = -2147483648,
  	max = 2147483647,
  	byteLength = 4,
    g = int32$1,
    s = int32;

  return treat(s, g, min, max, byteLength);
}

function uint8$2 () {

  const min = 0,
  	max = 255,
  	byteLength = 1,
    g = uint8$1,
    s = uint8;

  return treat(s, g, min, max, byteLength);
}

function uint16$2 () {

  const min = 0,
  	max = 65535,
  	byteLength = 2,
    g = uint16$1,
    s = uint16;

  return treat(s, g, min, max, byteLength);
}

function uint32$2 () {

  const min = 0,
  	max = 4294967295,
  	byteLength = 4,
    g = uint32$1,
    s = uint32;

  return treat(s, g, min, max, byteLength);
}

function float32$2 () {

  const min = -1*(2-Math.pow(2,-23))*Math.pow(2,127),
  	max = (2-Math.pow(2,-23))*Math.pow(2,127),
  	byteLength = 4,
    g = float32$1,
    s = float32;

  return treat(s, g, min, max, byteLength);
}

function float64$2 () {

  const min = -Number.MAX_VALUE,
  	max = Number.MAX_VALUE,
  	byteLength = 8,
    g = float64$1,
    s = float64;

  return treat(s, g, min, max, byteLength);
}

function date () {

  const min = -8640000000000000,
  	max = 8640000000000000,
  	byteLength = 8,
    g = float64$1,
    s = float64;

  var t = treat(s, g, min, max, byteLength);

  t.clamp = function (v) {
    // Date are stored as numbers in utc-convention
    v = (typeof v === 'number') ? v : (typeof v === 'object') ? +v : parseInt(v);
    return v <= max ? (v >= min ? v : min) : max;
  };

  t.get = function (view, byteOffset) {
    return new Date(g.call(view, byteOffset));
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

function sequence(dataview, options) {
  if (options === undefined) {
    options = dataview;
    dataview = null;
  }

  let byteOrder,
    byteLength,
    byteOffset,
    getter,
    setter,
    handleAsArray,
    keys = [];
/**
 * [change the given datastructure of the sequence]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} sequenceKeys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {number} [byteLength of the sequence]
 */
  const init = function (datatypes, sequenceKeys) {
    if( (typeof arguments[0] === "object") && (arguments[0] !== null) && arguments[0].types ) {
      datatypes = arguments[0].types;
      sequenceKeys = arguments[0].keys;
    }
    if (!(Array.isArray(datatypes) && (datatypes.length > 0))) {
      throw new TypeError(`Types for Data must be an Array: ${datatypes}`);
    }
    if (sequenceKeys && !(Array.isArray(sequenceKeys) && (sequenceKeys.length === datatypes.length))) {
      throw new TypeError(`Keys for Data must be an Array and equal by length to Datatypes: ${datatypes}. Got: ${sequenceKeys}`);
    }
    byteLength = 0;
    byteOrder = [0];
    byteOffset = 0;
    getter = [];
    setter = [];
    keys = [];
    let type;
    for (let i = 0; i < datatypes.length; i++) {
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

    handleAsArray = !Boolean(sequenceKeys);
    if (handleAsArray === true) {
      get = function() {
        byteOffset = arguments[0] === undefined ? (byteOffset || 0) : arguments[0];
        if (byteOffset >= dataview.byteLength) return;
        const ret = [];
        for (let i = 0; i < getter.length; i++) {
          ret.push(getter[i](dataview, byteOffset + byteOrder[i]));
        }
        byteOffset += byteLength;
        return ret;
      };
    } else {
      get = function() {
        byteOffset = arguments[0] === undefined ? (byteOffset || 0) : arguments[0];
        if (byteOffset >= dataview.byteLength) return;
        const ret = {};
        for (let i = 0; i < getter.length; i++) {
          ret[keys[i]] = getter[i](dataview, byteOffset + byteOrder[i]);
        }
        byteOffset += byteLength;
        return ret;
      };
    }

    return byteLength;
  };

  /**
   * [setting or getting the dataview of the sequence]
   * @method
   * @param  {Object} [the buffer or view, where the data is set]
   * @param  {number} [the byteOffset of the view on the buffer, where the data is set]
   * @param  {number} [the byteLength of the view on the buffer]
   * @return {Object} [the dataview]
   */
  const view = function (v, o, b) {
    if (v && !(ArrayBuffer.isView(v) || v.byteLength !== undefined)) {
      throw new TypeError(`View must a view or a buffer. Got ${typeof v}, ${v}`);
    }
    byteOffset = 0;
    b = b || (v && v.byteLength) || byteLength;
    o = o || 0;
    if (o + byteLength > b) {
      throw new RangeError(`Buffer is smaller than the given sequence. Expected ${b}, got ${o + byteLength}`);
    }
    return (!v) ? ((v === null || !dataview) ? ( dataview = new DataView( new ArrayBuffer( b ), o ) ) : dataview) : (v.buffer ? (dataview = new DataView(v.buffer, o)) : (dataview = new DataView(v, o)));
  };

  /**
   * [setting or getting the byteOffset relative to the offset of the view]
   * @method
   * @param  {number} [the byteOffset of the view on the buffer, where the data is set]
   * @return {Object} [the byteOffset]
   */
  const offset = function () {
    return (arguments.length === 0) ? (byteOffset !== undefined ? byteOffset : (byteOffset = 0)) : (byteOffset = arguments[0]);
  };

/**
 * [set data to an given view on a buffer]
 * @method
 * @param  {[Object,Array]} value [The value to be set
 * @param  {number} [the byteOffset of the view on the buffer, where the data is set]
 * @return {Object} [the dataview]
 */
  const set = function(value) {
    byteOffset = arguments[1] === undefined ? (byteOffset || 0) : arguments[1];
    for (let i = 0; i < setter.length; i++) {
      setter[i](dataview, byteOffset + byteOrder[i], value[keys[i]]);
    }
    byteOffset += byteLength;
    return dataview;
  };

/**
 * [retrieve data of an given view on a buffer]
 * @method
 * @return {Object|Object[]} [The get value]
 */
  var get = function() {};

  init(options.types, options.keys);

  if (dataview || (options.view && (options.view.offset === undefined && options.view.byteLength === undefined))) {
    view(dataview, options.view.offset, options.view.byteLength);
  }

  return {
    byteOrder: byteOrder,
    byteLength: byteLength,
    byteOffset: offset,
    view: view,
    getter: getter,
    setter: setter,
    handleAsArray: handleAsArray,
    init: init,
    set: set,
    get: get
  };
}

/**
 * [transpose and rejoin records on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 */
function record(dataview, options) {
  if (options === undefined) {
    options = dataview;
    dataview = null;
  }

  var _sequence;


  /**
   * [description]
   * @method
   * @return {[Object]} [the sequence Object]
   */
  const init = function() {
    return arguments.length === 0 ? _sequence : (_sequence = sequence(...arguments));
  };

  const view = function() {
    return _sequence === undefined ? (init(...arguments), _sequence.view(...arguments)) : (_sequence.view(...arguments));
  };

  const byteLength = function() {
    return _sequence === undefined ? (init(...arguments), _sequence.byteLength(...arguments)) : (_sequence.byteLength(...arguments));
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

  // TODO: handle a stream?
  const set = function(array, v, offset) {
    if (!(array && array.length !== 0)) return;
    if (v) {
      view(v, offset);
    } else {
      view(new ArrayBuffer( array.length * _sequence.byteLength ), offset);
    }
    for (var i = 0; i < array.length; i++) {
      _sequence.set( array[i] );
    }
    // return view().buffer;
  };

  // TODO: return a stream?
  const get = function(offset, v) {
    if (v !== undefined) {
      view(v, offset);
    } else if (offset !== undefined) {
      _sequence.byteOffset( offset );
    }
    const array = [];
    var value;
    while ((value = _sequence.get()) !== undefined) {
      array.push(value);
    }
    return array;
  };


  init(...arguments);

  return {
    init: init,
    view: view,
    byteLength: byteLength,
    set: set,
    get: get,
    split: split,
    join: join
  };
}

exports.sequence = sequence;
exports.record = record;
exports.types = types;
