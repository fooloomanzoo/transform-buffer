"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = treat;
function clamp(v) {
  return v <= max ? v >= min ? v : min : max;
}

function convert(v) {
  return v;
}

function set(view, byteOffset, value) {
  s.call(view, byteOffset, clamp(value));
}

function get(view, byteOffset) {
  return g.call(view, byteOffset);
}

function treat(view, s, g, min, max, byteLength) {
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