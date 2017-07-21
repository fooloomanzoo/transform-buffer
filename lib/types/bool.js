'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bool;

var _set = require('./set');

var setter = _interopRequireWildcard(_set);

var _get = require('./get');

var getter = _interopRequireWildcard(_get);

var _treat = require('./treat');

var _treat2 = _interopRequireDefault(_treat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function bool(view) {

  var min = 0,
      max = 1,
      byteLength = 1,
      g = getter.int8,
      s = setter.int8;

  var t = (0, _treat2.default)(view, s, g, min, max, byteLength);

  t.clamp = function (v) {
    return v === true ? 1 : 0;
  };

  t.convert = function (v) {
    return v === 1 ? true : false;
  };

  t.get = function (view, byteOffset) {
    return t.convert(g.call(view, byteOffset));
  };

  return t;
}