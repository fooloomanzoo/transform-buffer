import types from './types/index.js';

/**
 * [set and get sequences of data on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {Object} [description]
 */

export default function(datatypes, keys, dataview) {
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
  const setSequenceTypes = function (datatypes, sequenceKeys, v) {
    if (!(Array.isArray(datatypes) && (datatypes.length > 0))) {
      throw new TypeError(`Types for Data must be an Array: ${datatypes}`);
    }
    if (sequenceKeys && !(Array.isArray(sequenceKeys) && (sequenceKeys.length === datatypes.length))) {
      throw new TypeError(`Keys for Data must be an Array and equal by lngth to Datatypes: ${sequenceKeys}`);
    }
    if (v && !(ArrayBuffer.isView(v) && v.buffer)) {
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
    if (v && v.byteLength !== undefined) {
      dataview = v;
    } else {
      view();
    }
    byteOffset();
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
      setter[i](dataview, offset + byteOrder[i], value[keys[i]]);
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
      ret.push(getter[i](dataview, offset += byteOrder[i]));
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
}
