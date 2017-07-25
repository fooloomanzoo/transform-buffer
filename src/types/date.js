
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function date () {

  const min = -8640000000000000,
  	max = 8640000000000000,
  	byteLength = 8,
    g = getter.float64,
    s = setter.float64;

  var t = treat(s, g, min, max, byteLength);

  t.clamp = function (v) {
    // Date are stored as numbers in utc-convention
    v = (typeof v === 'number') ? v : (typeof v === 'object') ? +v : parseInt(v);
    return v <= max ? (v >= min ? v : min) : max;
  };

  t.get = function (view, byteOffset) {
    return new Date(g.call(view, byteOffset));
  };

  return t;
}
