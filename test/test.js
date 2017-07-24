const BufferView = require('../lib/sequence.js');

const types = ['float32', 'int16', 'float64'];

var n = 1 * 1000 * 1000;
var testArray = [], retArray = [];
var time_start, time_diff, buffer;

/********************************************************************/
/* Test from Array to Buffer and backwards */
/********************************************************************/

console.log(BufferView)
var bv1 = BufferView(types);

for (var i = 0; i < n; i++) {
  testArray.push([]);
  for (var j = 0; j < types.length; j++) {
    testArray[i].push(Math.random());
  }
}
