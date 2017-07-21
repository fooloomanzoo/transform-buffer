'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (datatypes, keys) {
  var _sequence;

  var sequence = function sequence() {
    return arguments.length === 0 ? _sequence = _sequence3.default.apply(undefined, arguments) : _sequence;
  };

  /**
   * [description]
   * @method
   * @return {[type]} [description]
   */
  var join = function join() {
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
   * @return {[type]} [description]
   */
  var split = function split() {
    if (!arguments.length) return;
    var ret = [];
    for (var i = 0; i < arguments.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        ret.push(arguments[i][keys[j]]);
      }
    }
    return ret;
  };

  var transpose = function transpose() {
    if (!arguments.length) return;

    var buffer = new ArrayBuffer(arguments.length * this.sequenceByteLength);
    var view = new DataView(buffer);
    sequence.dataview(view);
    for (var i = 0, offset = 0; i < arguments.length; i++, offset += this.sequenceByteLength) {
      sequence.set(offset, array[i]);
    }
    return buffer;
  };

  var retrieve = function retrieve(buffer) {
    return buffer;
  };

  sequence.apply(undefined, arguments);

  return {
    sequence: sequence,
    split: split,
    join: join,
    transpose: transpose,
    retrieve: retrieve
  };
};

var _sequence2 = require('./sequence');

var _sequence3 = _interopRequireDefault(_sequence2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }