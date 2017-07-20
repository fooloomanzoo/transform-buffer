
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function (view) {

  const min = -8640000000000000,
  	max = 8640000000000000,
  	byteLength = 8,
    g = getter.float64,
    s = setter.float64;

  var t = treat(view, s, g, min, max, byteLength);

  t.clamp = function (v) {
    v = (typeof v === 'number') ? v : (typeof v === 'object') ? +v : parseInt(v);
    return v <= max ? (v >= min ? v : min) : max;
  }

  return t;
}
