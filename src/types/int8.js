
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function (view) {

  const min = -128,
  	max = 127,
  	byteLength = 1,
    g = getter.int8,
    s = setter.int8;

  return treat(view, s, g, min, max, byteLength);
}
