import sequence from './sequence';

/**
 * [transpose and rejoin records on a given view to a buffer]
 * @method
 * @param  {string[]} datatypes [Definition of types of data in the given values]
 * @param  {string[]} keys [if the value is an Object with specified keys this Array is used to get its properties. Same order like datatypes]
 */
export default function record() {
  var _sequence;


  /**
   * [description]
   * @method
   * @return {[Object]} [the sequence Object]
   */
  const init = function() {
    return arguments.length === 0 ? _sequence : (_sequence = sequence(...arguments));
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
      sequence.set(offset, record[i]);
    }
    return buffer;
  };

  const retrieve = function(buffer) {
    return buffer;
  };


  init(...arguments);

  return {
    sequence: init,
    dataview: _sequence.view,
    split: split,
    join: join,
    transpose: transpose,
    retrieve: retrieve
  };
}
