
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function uint16 () {

  const min = 0,
  	max = 65535,
  	byteLength = 2,
    g = getter.uint16,
    s = setter.uint16;

  return treat(s, g, min, max, byteLength);
}
