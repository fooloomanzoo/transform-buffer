
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function uint32 () {

  const min = 0,
  	max = 4294967295,
  	byteLength = 4,
    g = getter.uint32,
    s = setter.uint32;

  return treat(s, g, min, max, byteLength);
}
