import sequ from './sequence'

export default function(datatypes, keys) {
  const sequence = sequ(datatypes, keys);

  const join = function(arr) {
    var ret = [];
    // console.log(arguments.length);
    var len = Math.floor(arr.length / sequenceKeys.length) * sequenceKeys.length;
    var i = 0,
        l = 0;
    while (i < len) {
      ret.push({})
      for (var j = 0; j < sequenceKeys.length; j++, i++) {
        ret[l][sequenceKeys[j]] = arr[i];
      }
      l++;
    }
    return ret;
  }

  const split = function(arr) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < sequenceKeys.length; j++) {
        ret.push(arr[i][sequenceKeys[j]]);
      }
    }
    return ret;
  }

  return {
    sequence: sequence,
    split: split,
    join: join
  }
}
