
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function int32 (view) {

  const min = -2147483648,
  	max = 2147483647,
  	byteLength = 4,
    g = getter.int32,
    s = setter.int32;

  return treat(view, s, g, min, max, byteLength);
}
