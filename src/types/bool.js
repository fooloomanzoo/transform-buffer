
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function bool () {

  const min = 0,
  	max = 1,
  	byteLength = 1,
    g = getter.int8,
    s = setter.int8;

  var t = treat(s, g, min, max, byteLength);

  t.clamp = function (v) {
    return v === true ? 1 : 0;
  };

  t.valueOf = function (v) {
    return v === 1 ? true : false;
  };

  t.get = function (view, byteOffset) {
    return t.valueOf(g.call(view, byteOffset));
  };

  return t;
}
