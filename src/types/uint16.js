
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function uint16 (view) {

  const min = 0,
  	max = 65535,
  	byteLength = 2,
    g = getter.uint32,
    s = setter.uint32;

  return treat(view, s, g, min, max, byteLength);
}
