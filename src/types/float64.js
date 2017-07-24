
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function float64 () {

  const min = -Number.MAX_VALUE,
  	max = Number.MAX_VALUE,
  	byteLength = 8,
    g = getter.float64,
    s = setter.float64;

  return treat(s, g, min, max, byteLength);
}
