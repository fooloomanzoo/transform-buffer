const BufferView = require('../index.js');

const types = ['float32', 'int16', 'float64'];

var n = 1 * 1000 * 1000;
var testArray = [], retArray = [];
var time_start, time_diff, buffer;

/********************************************************************/
/* Test from Array to Buffer and backwards */
/********************************************************************/

var bv1 = new BufferView(types);

for (var i = 0; i < n; i++) {
  testArray.push([]);
  for (var j = 0; j < types.length; j++) {
    testArray[i].push(Math.random());
  }
}

time_start = process.hrtime();
buffer = bv1.arrayToBuffer(testArray);
time_diff = process.hrtime(time_start);
console.log('arrayToBuffer:', n, 'elements, time elapsed:', time_diff);

time_start = process.hrtime();
retArray = bv1.toArray(buffer);
time_diff = process.hrtime(time_start);
console.log('bufferToArray:', n, 'elements, time elapsed:', time_diff);

testArray.length = 0;
retArray.length = 0;


/********************************************************************/
/* Test mapping Array and backwards */
/********************************************************************/

var bv2 = new BufferView(types, ['x', 'y', 'z']);

for (var i = 0; i < n; i++) {
  testArray.push(Math.random());
}

time_start = process.hrtime();
retArray = bv2.mapSequence(testArray);
time_diff = process.hrtime(time_start);
console.log('map an Array:', n, 'elements, time elapsed:', time_diff);

time_start = process.hrtime();
var testArray2 = bv2.unmapSequence(retArray);
time_diff = process.hrtime(time_start);
console.log('unmap an Array:', n, 'elements, time elapsed:', time_diff);

testArray.length = 0;
testArray2.length = 0;
retArray.length = 0;

// console.log([{x:1,y:2,z:3}, {x:14,y:25,z:36}]);
