const TransBuffer = require('../transform-buffers.js');
// 
// function assertTest(testObj, enc, dec, compFn, n) {
//   var tmp1, tmp2, time_start, time_diff_enc, time_diff_dec, failed;
//
//   if (enc && typeof(enc) === 'function') {
//     time_start = process.hrtime();
//     tmp1 = enc(testObj);
//     time_diff_enc = process.hrtime(time_start);
//     time_diff_enc = time_diff_enc[0] * 1000000000 + time_diff_enc[1];
//     console.log('ENCODING\n------ total:', time_diff_enc + (n ? '\n------ per element: ' + time_diff_enc/n : ''));
//   }
//
//   if (tmp1 && dec && typeof(dec) === 'function') {
//     time_start = process.hrtime();
//     tmp2 = dec(tmp1);
//     time_diff_dec = process.hrtime(time_start);
//     time_diff_dec = time_diff_dec[0] * 1000000000 + time_diff_dec[1];
//     console.log('DECODING\n------ total:', time_diff_dec + (n ? '\n------ per element: ' + time_diff_dec/n : ''));
//   }
//
//   if (tmp2 && compFn && typeof(compFn) === 'function') {
//     failed = compFn(testObj, tmp2);
//     console.log(`RESULT\ntests failed ${failed}-times`;
//   }

}
