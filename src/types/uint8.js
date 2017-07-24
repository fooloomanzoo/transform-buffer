
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function uint8 () {

  const min = 0,
  	max = 255,
  	byteLength = 1,
    g = getter.uint8,
    s = setter.uint8;

  return treat(s, g, min, max, byteLength);
}
