'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = date;

var _set = require('./set');

var setter = _interopRequireWildcard(_set);

var _get = require('./get');

var getter = _interopRequireWildcard(_get);

var _treat = require('./treat');

var _treat2 = _interopRequireDefault(_treat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function date(view) {

  var min = -8640000000000000,
      max = 8640000000000000,
      byteLength = 8,
      g = getter.float64,
      s = setter.float64;

  var t = (0, _treat2.default)(view, s, g, min, max, byteLength);

  t.clamp = function (v) {
    v = typeof v === 'number' ? v : (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? +v : parseInt(v);
    return v <= max ? v >= min ? v : min : max;
  };

  return t;
}