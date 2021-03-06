import types from './types/index.js';

/**
 * [set and get sequences of data on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 * @return {Object} [description]
 */

export default function sequence(dataview, options) {
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
