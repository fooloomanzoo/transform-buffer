'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = float32;

var _set = require('./set');

var setter = _interopRequireWildcard(_set);

var _get = require('./get');

var getter = _interopRequireWildcard(_get);

var _treat = require('./treat');

var _treat2 = _interopRequireDefault(_treat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function float32(view) {

  var min = -1 * (2 - Math.pow(2, -23)) * Math.pow(2, 127),
      max = (2 - Math.pow(2, -23)) * Math.pow(2, 127),
      byteLength = 4,
      g = getter.float32,
      s = setter.float32;

  return (0, _treat2.default)(view, s, g, min, max, byteLength);
}