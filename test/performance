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
retArray = bv2.transposeSequence(testArray);
time_diff = process.hrtime(time_start);
console.log('map an Array:', n, 'elements, time elapsed:', time_diff);

time_start = process.hrtime();
var testArray2 = bv2.retrieveSequence(retArray);
time_diff = process.hrtime(time_start);
console.log('unmap an Array:', n, 'elements, time elapsed:', time_diff);

testArray.length = 0;
testArray2.length = 0;
retArray.length = 0;


/********************************************************************/
/* Test String to Buffer and backwards */
/********************************************************************/

var bv3 = new BufferView(types);
var testString = '', retString = '';
n = 1 * 1000 * 1000 + 1;

// for (var i = 0; i < types.length; i++) {
//   testString += String.fromCharCode(Math.floor(Math.random()*32465));
// }
testString = 'abc'
testString = testString.repeat( n / types.length );

time_start = process.hrtime();
buffer = bv3.stringToBuffer(testString);
time_diff = process.hrtime(time_start);
console.log('String to Buffer:', n, 'elements, time elapsed:', time_diff);

time_start = process.hrtime();
retString = bv2.bufferToString(buffer);
time_diff = process.hrtime(time_start);
console.log('Buffer to String:', n, 'elements, time elapsed:', time_diff);

console.log(testString == retString, testString === retString, testString.length, retString.length, testString.charCodeAt(testString.length - 1), retString.charCodeAt(retString.length - 1));

var failed = [];
for (var i = 0; i < testString.length; i++) {
  if (testString.charCodeAt(i) !== retString.charCodeAt(i)) {
      // console.log(i, testString.charCodeAt(i), retString.charCodeAt(i));
      failed.push(i);
  }
}

console.log(failed.length);

testString.length = 0;
retString.length = 0;

// console.log([{x:1,y:2,z:3}, {x:14,y:25,z:36}]);
