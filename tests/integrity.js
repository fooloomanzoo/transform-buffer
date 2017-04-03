const BufferView = require('../index.js');

const types = ['float32', 'int16', 'float64'];
var n = 1 * 1000 * 1000;

var bv = new BufferView(types, undefined, function(item) { return [item.x, item.y, item.z]; });

// Test-Array
var testArray = [];
for (var i = 0; i < n; i++) {
  testArray.push([]);
  for (var j = 0; j < types.length; j++) {
    testArray[i].push(Math.random());
  }
}

var time_start, time_diff;

time_start = process.hrtime();
let buffer = bv.arrayToBuffer(testArray);
time_diff = process.hrtime(time_start);
console.log('arrayToBuffer:', n, 'elements, time elapsed:', time_diff);

time_start = process.hrtime();
let retArray = bv.toArray(buffer);
time_diff = process.hrtime(time_start);
console.log('bufferToArray:', n, 'elements, time elapsed:', time_diff);

console.log(bv.arrayToArray([{x:1,y:2,z:3}, {x:14,y:25,z:36}]));
