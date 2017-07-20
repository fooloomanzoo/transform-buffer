import types from './types'

export default function(datatypes, keys) {
  var byteOrder,
    byteLength,
    getter,
    setter,
    keys = keys,
    handleAsArray;

  const setSequenceTypes = function (datatypes, sequenceKeys) {
    byteLength = 0;
    byteOrder = [0];
    getter = [];
    setter = [];
    keys = [];
    handleAsArray = Boolean(sequenceKeys);
    for (var i = 0; i < datatypes.length; i++) {
      if (datatypes[i] in types) {
        byteLength += types[datatypes[i]].bytes;
        byteOrder.push(this.sequenceByteLength);

        getter.push(types[datatypes[i]].get);
        setter.push(types[datatypes[i]].set);

        if (sequenceKeys && sequenceKeys[i]) {
          keys.push(sequenceKeys[i]);
        } else {
          keys.push(i);
        }
      } else {
        console.warn(`Invalid Number-Type: ${datatypes[i]}`)
      }
    }
  }

  const join = function(view, offset, arr) {
    for (var i = 0; i < setter.length; i++) {
      setter[i].call(view, offset + byteOrder[i], arr[keys[i]]);
    }
  }

  const split = function(view, offset) {
    var ret = [];
    for (var i = 0; i < getter.length; i++) {
      ret.push(getter[i].call(view, offset + byteOrder[i]));
    }
    return ret;
  }

  setSequenceTypes(datatypes, keys);

  return {
    byteOrder: byteOrder,
    byteLength: byteLength,
    getter: getter,
    setter: setter,
    keys: keys,
    handleAsArray: handleAsArray,
    split: split,
    join: join
  }
}
