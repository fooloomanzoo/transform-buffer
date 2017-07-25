import types from './types/index.js';

/**
 * [set and get sequences of data on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {Object} [description]
 */

export default function(datatypes, keys) {
  var byteOrder,
    byteLength,
    offset,
    getter,
    setter,
    dataview,
    handleAsArray;

/**
 * [change the given datastructure of the sequence]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} sequenceKeys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {number} [byteLength]
 */
  const init = function (datatypes, sequenceKeys) {
    if (!(Array.isArray(datatypes) && (datatypes.length > 0))) {
      throw new TypeError(`Types for Data must be an Array: ${datatypes}`);
    }
    if (sequenceKeys && !(Array.isArray(sequenceKeys) && (sequenceKeys.length === datatypes.length))) {
      throw new TypeError(`Keys for Data must be an Array and equal by lngth to Datatypes: ${sequenceKeys}`);
    }
    byteLength = 0;
    byteOrder = [0];
    offset = 0;
    getter = [];
    setter = [];
    keys = [];
    var type;
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

    handleAsArray = !Boolean(sequenceKeys);
    if (handleAsArray === true) {
      get = function() {
        offset = arguments[0] === undefined ? (offset || 0) : arguments[0];
        var ret = [];
        for (var i = 0; i < getter.length; i++) {
          ret.push(getter[i](dataview, offset + byteOrder[i]));
        }
        offset += byteLength;
        return ret;
      };
    } else {
      get = function() {
        offset = arguments[0] === undefined ? (offset || 0) : arguments[0];
        var ret = {};
        for (var i = 0; i < getter.length; i++) {
          ret[keys[i]] = getter[i](dataview, offset + byteOrder[i]);
        }
        offset += byteLength;
        return ret;
      };
    }

    return byteLength;
  };

  /**
   * [setting or getting the dataview of the sequence]
   * @method
   * @param  {Object} [the buffer or view, where the data is set]
   * @param  {number} [the offset of the view on the buffer, where the data is set]
   * @param  {number} [the byteLength of the view on the buffer, where the data is set]
   * @return {Object} [the dataview]
   */
  const view = function (v, o, b) {
    if (v && !(ArrayBuffer.isView(v) || v.byteLength)) {
      throw new TypeError(`View must a view or a buffer`);
    }
    if (o !== undefined && b !== undefined && (o + byteLength < b)) {
      throw new TypeError(`Buffer is smaller than the given sequence`);
    }
    offset = 0;
    b = b || byteLength;
    o = o || 0;
    return !v ? (dataview !== undefined ? dataview : ( dataview = new DataView( new ArrayBuffer( b ), o ) )) : (v.buffer ? (dataview = new DataView(v.buffer, o, b)) : (dataview = new DataView(v, o, b)));
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
    offset = arguments[1] === undefined ? (offset || 0) : arguments[1];
    for (var i = 0; i < setter.length; i++) {
      setter[i](dataview, offset + byteOrder[i], value[keys[i]]);
    }
    offset += byteLength;
    return dataview;
  };

/**
 * [retrieve data of an given view on a buffer]
 * @method
 * @return {Object|Object[]} [The get value]
 */
  var get = function() {};

  init(...arguments);

  return {
    byteOrder: byteOrder,
    byteLength: byteLength,
    byteOffset: byteOffset,
    getter: getter,
    setter: setter,
    handleAsArray: handleAsArray,
    init: init,
    set: set,
    get: get,
    dataview: view
  };
}
