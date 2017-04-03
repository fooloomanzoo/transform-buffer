const TransBuffer = require('../transform-buffers.js');

function perfTest(...args) {
  var n, fn, time_start, time_diff, results = [];

  var testObj = args[0];
  if (!Number.isNaN(args[args.length - 1])) {
    n = args[args.length - 1];
    fn = args.slice(1, -1);
  } else {
    fn = args.slice(1);
  }

  // testing functions
  for (var i = 0; i < fn.length; i++) {
    if (compFn1 && typeof(compFn1) === 'function') {
      time_start = process.hrtime();
      tmp = fn[i](testObj);
      time_diff = process.hrtime(time_start);
      results.push({name: fn.name, time: time_diff[0] * 1000000000 + time_diff[1], n: n});
      delete tmp;
    }
  }

  // result output
  results.sort( (v1, v2) => { v1.time < v2.time });
  for (var i = 0; i < results.length; i++) {
    console.log(results[i].name, '\n------ total:', results[i].time + (results[i].n ? ' ------ per element: ' + results[i].time/results[i].n : ''));
  }
}
// create a buffer
