import 'babel-polyfill';
import { expect, assert, use } from 'chai';
import sequence from '../../index.js';

describe('set datatypes', function(){
  it('should accept given datatypes in sequence', function(done) {
    var types = ['bool', 'date', 'float32', 'float64', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32'];

    expect(function() {
      var s = sequence(types);
    }).to.not.throw( TypeError );
// expect([{a:'a'}, {a:'b'}]).to.deep.have.same.members([{a:'a'}, {a:'b'}]);
//     var actual = ... results of the query, an array of anonymous objects ...
//
//     // expected results
//     var expected = [{"lunchTime": "12:00:00", "name": "John"},
//                    {"lunchTime": "12:00:00", "name": "Dave"},
//                    {"lunchTime": "13:00:00", "name": "Sally"},
//                    {"lunchTime": "12:00:00", "name": "Ben"},
//                    {"lunchTime": "12:00:00", "name": "Dana"},
//                    {"lunchTime": "13:00:00", "name": "Mike"}];
//
//     var intersection = actual.filter(function(n) {
//         return expected.indexOf(n) != -1
//     });
//
//     expect(intersection).to.have.length(expected.length);
//     expect(actual).to.have.length(expected.length);
  });
});
