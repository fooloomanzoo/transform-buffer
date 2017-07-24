export default function treat (view, s, g, min, max, byteLength) {

  function clamp (v) {
    return v <= max ? (v >= min ? v : min) : max;
  }

  function valueOf (v) {
    return +v;
  }

  function set (view, offset, value) {
    s.call(view, offset, clamp(value));
  }

  function get (view, offset) {
    return g.call(view, offset);
  }

  return {
    set: set,
    get: get,
    valueOf: valueOf,
    clamp: clamp,
    min: min,
    max: max,
    byteLength: byteLength
  };
}
