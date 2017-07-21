function clamp (v) {
  return v <= max ? (v >= min ? v : min) : max;
}

function convert (v) {
  return v;
}

export default function treat (view, s, g, min, max, byteLength) {

  function set (view, offset, value) {
    s.call(view, offset, clamp(value));
  }

  function get (view, offset) {
    return g.call(view, offset);
  }

  return {
    set: set,
    get: get,
    convert: convert,
    reconvert: reconvert,
    min: min,
    max: max,
    byteLength: byteLength
  };
}
