// import 'babel-polyfill';
const { expect, assert, use } = require('chai');
const { sequence } = require('../lib/index.js');


describe('set parameters of a sequence', function() {
  it('should accept given datatypes for sequence', function(done) {
    var types = ['bool', 'date', 'float32', 'float64', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32'];
    expect(function() {
      sequence(types);
      done();
    }).to.not.throw();
  });
  it('should accept valid given datatypes and keys for sequence', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    expect(function() {
      sequence(types, keys);
      done();
    }).to.not.throw();
  });
  it('should not accept invalid given datatypes', function() {
    var types = ['bool', 'data%', 'float32'];
    expect(function() {
      sequence(types);
    }).to.throw();
  });
  it('should not accept given datatypes and keys (unequal amount) for sequence', function() {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y'];
    expect(function() {
      sequence(types, keys);
    }).to.throw();
  });
  it('should not accept given datatypes (unequal amount) and keys for sequence', function() {
    var types = ['bool'];
    var keys = ['x', 'y'];
    expect(function() {
      sequence(types, keys);
    }).to.throw();
  });
  it('should not accept no given datatypes', function() {
    var types = [];
    expect(function() {
      sequence(types);
      sequence();
    }).to.throw();
  });
  it('should accept a view', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      sequence(types, null, view);
      done();
    }).to.not.throw();
  });
  it('should accept a view with valid byteLength', function(done) {
    var types = ['float32', 'int16', 'int16'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      sequence(types, null, view);
      done();
    }).to.not.throw();
  });
  it('should not accept a view with invalid byteLength', function() {
    var types = ['float32', 'int16', 'int16', 'bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      sequence(types, null, view);
    }).to.throw();
  });
});


describe('set data of a sequence', function() {
  it('should accept given datatypes for sequence', function(done) {
    var s = sequence( ['bool', 'date', 'float32'] );
    expect(function() {
      s.set([true, new Date(), 3]);
      done();
    }).to.not.throw();
  });
});
