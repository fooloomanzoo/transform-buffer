'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bool = require('./bool');

var _bool2 = _interopRequireDefault(_bool);

var _int = require('./int8');

var _int2 = _interopRequireDefault(_int);

var _int3 = require('./int16');

var _int4 = _interopRequireDefault(_int3);

var _int5 = require('./int32');

var _int6 = _interopRequireDefault(_int5);

var _uint = require('./uint8');

var _uint2 = _interopRequireDefault(_uint);

var _uint3 = require('./uint16');

var _uint4 = _interopRequireDefault(_uint3);

var _uint5 = require('./uint32');

var _uint6 = _interopRequireDefault(_uint5);

var _float = require('./float32');

var _float2 = _interopRequireDefault(_float);

var _float3 = require('./float64');

var _float4 = _interopRequireDefault(_float3);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  bool: _bool2.default,
  int8: _int2.default,
  int16: _int4.default,
  int32: _int6.default,
  uint8: _uint2.default,
  uint16: _uint4.default,
  uint32: _uint6.default,
  float32: _float2.default,
  float64: _float4.default,
  date: _date2.default
};