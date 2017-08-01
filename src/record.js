import sequence from './sequence';

/**
 * [transpose and rejoin records on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 */
export default function record(dataview, options) {
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
