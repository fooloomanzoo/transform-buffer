
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function (view) {

  const min = -32768,
  	max = 32767,
  	byteLength = 2,
    g = getter.int16,
    s = setter.int16;

  return treat(view, s, g, min, max, byteLength);
}
