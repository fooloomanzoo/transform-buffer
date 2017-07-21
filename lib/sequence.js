'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (datatypes, keys, view) {
  var byteOrder, byteLength, offset, getter, setter, handleAsArray;

  /**
   * [change the given datastructur of the sequence]
   * @method
   * @param  {[Array]} datatypes [Definition of types of data in the given values]
   * @param  {[Array]} sequenceKeys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
   * @param  {[Object]} [the view on the buffer, where the data is set]
   * @return {[Number]} [byteLength]
   */
  var setSequenceTypes = function setSequenceTypes(datatypes, sequenceKeys, view) {
    if (!Array.isArray(datatypes)) {
      throw new TypeError('Types for Data must be an Array: ' + datatypes);
    }
    if (sequenceKeys && !Array.isArray(sequenceKeys)) {
      throw new TypeError('Keys for Data must be an Array: ' + sequenceKeys);
    }
    byteLength = 0;
    byteOrder = [0];
    getter = [];
    setter = [];
    keys = [];
    handleAsArray = Boolean(sequenceKeys);
    for (var i = 0; i < datatypes.length; i++) {
      if (datatypes[i] in _index2.default) {
        byteLength += _index2.default[datatypes[i]].bytes;
        byteOrder.push(this.sequenceByteLength);

        getter.push(_index2.default[datatypes[i]].get);
        setter.push(_index2.default[datatypes[i]].set);

        if (sequenceKeys && sequenceKeys[i]) {
          keys.push(sequenceKeys[i]);
        } else {
          keys.push(i);
        }
      } else {
        throw new TypeError('Invalid Number-Type: ' + datatypes[i]);
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
  var dataview = function dataview() {
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
  var set = function set(value) {
    for (var i = 0; i < setter.length; i++) {
      setter[i].call(view, offset += byteOrder[i], value[keys[i]]);
    }
  };

  /**
   * [retrieve data of an given view on a buffer]
   * @method
   * @return {[Object,Array]} [The get value]
   */
  var get = function get() {
    var ret = [];
    for (var i = 0; i < getter.length; i++) {
      ret.push(getter[i].call(view, offset += byteOrder[i]));
    }
    return handleAsArray ? ret : ret;
  };

  setSequenceTypes.apply(undefined, arguments);

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
};

var _index = require('./types/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }