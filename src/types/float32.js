
import * as setter from './set';
import * as getter from './get';
import treat from './treat';

export default function (view) {

  const min = -1*(2-Math.pow(2,-23))*Math.pow(2,127),
  	max = (2-Math.pow(2,-23))*Math.pow(2,127),
  	byteLength = 4,
    g = getter.float32,
    s = setter.float32;

  return treat(view, s, g, min, max, byteLength);
}
