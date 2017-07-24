import types from './types/index.js';

/**
 * [set and get sequences of data on a given view to a buffer]
 * @method
 * @param  {[Array]} datatypes [Definition of types of data in the given values]
 * @param  {[Array]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {[Object]} [description]
 */

export default function(datatypes, keys, view) {
  var byteOrder,
    byteLength,
    offset,
    getter,
    setter,
    handleAsArray;

/**
 * [change the given datastructur of the sequence]
 * @method
 * @param  {[Array]} datatypes [Definition of types of data in the given values]
 * @param  {[Array]} sequenceKeys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @param  {[Object]} [the view on the buffer, where the data is set]
 * @return {[Number]} [byteLength]
 */
  const setSequenceTypes = function (datatypes, sequenceKeys, view) {
    if (!(Array.isArray(datatypes) && datatypes.length > 0)) {
      throw new TypeError(`Types for Data must be an Array: ${datatypes}`);
    }
    if (sequenceKeys && !(Array.isArray(sequenceKeys) && sequenceKeys.length === datatypes.length)) {
      throw new TypeError(`Keys for Data must be an Array: ${sequenceKeys}`);
    }
    byteLength = 0;
    byteOrder = [0];
    getter = [];
    setter = [];
    keys = [];
    handleAsArray = Boolean(sequenceKeys);
    for (var i = 0; i < datatypes.length; i++) {
      if (datatypes[i] in types) {
        byteLength += types[datatypes[i]].bytes;
        byteOrder.push(byteLength);

        getter.push(types[datatypes[i]].get);
        setter.push(types[datatypes[i]].set);

        if (sequenceKeys && sequenceKeys[i]) {
          keys.push(sequenceKeys[i]);
        } else {
          keys.push(i);
        }
      } else {
        throw new TypeError(`Invalid Number-Type: ${datatypes[i]}`);
      }
    }
    dataview(view);
    return byteLength;
  };

  /**
   * [setting or getting the dataview of the sequence]
   * @method
   * @param  {[Object]} [the view on the buffer, where the data is set]
   * @param  {[Number]} offset [offset in the view]
   * @return {[Object]} [the dataview]
   */
  const dataview = function () {
    if (arguments[0]) {
      view = arguments[0];
      if (arguments[1] !== undefined) {
        offset = arguments[1];
      }
    }
    offset = offset || 0;
    return view;
  };

/**
 * [set data to an given view on a buffer]
 * @method
 * @param  {[Object,Array]} value [The value to be set]
 */
  const set = function(value) {
    for (var i = 0; i < setter.length; i++) {
      setter[i].call(view, offset += byteOrder[i], value[keys[i]]);
    }
  };

/**
 * [retrieve data of an given view on a buffer]
 * @method
 * @return {[Object,Array]} [The get value]
 */
  const get = function() {
    var ret = [];
    for (var i = 0; i < getter.length; i++) {
      ret.push(getter[i].call(view, offset += byteOrder[i]));
    }
    return handleAsArray ? ret : ret;
  };

  setSequenceTypes(...arguments);

  return {
    byteOrder: byteOrder,
    byteLength: byteLength,
    offset: offset,
    getter: getter,
    setter: setter,
    keys: keys,
    handleAsArray: handleAsArray,
    set: set,
    get: get,
    dataview: dataview
  };
}
