// import 'babel-polyfill';
const { expect, assert, use } = require('chai');
const { sequence, array, type} = require('../../lib/index.js');

describe('set datatypes', function(){
  it('should accept given datatypes for sequence', function(done) {
    var types = ['bool', 'date', 'float32', 'float64', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32'];
    expect(function() {
      sequence(types);
      done();
    }).to.not.throw( TypeError );
  });
  it('should accept given datatypes and keys for sequence', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    expect(function() {
      sequence(types, keys);
      done();
    }).to.not.throw( TypeError );
  });
  it('should not accept given datatypes and keys (unequal amount) for sequence', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y'];
    expect(function() {
      sequence(types, keys);
      done();
    }).to.throw( TypeError );
  });
  it('should not accept given datatypes (unequal amount) and keysfor sequence', function(done) {
    var types = ['bool'];
    var keys = ['x', 'y'];
    expect(function() {
      sequence(types, keys);
      done();
    }).to.throw( TypeError );
  });
  it('should not accept no given datatypes', function(done) {
    var types = [];
    expect(function() {
      sequence(types);
      done();
    }).to.throw( TypeError );
  });
});


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
