// import 'babel-polyfill';
const { expect } = require('chai');
const { sequence } = require('../lib/index.js');


describe('sequence: set parameters', function() {
  it('should accept given datatypes', function(done) {
    var types = ['bool', 'date', 'float32', 'float64', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32'];
    expect(function() {
      sequence(types);
      done();
    }).to.not.throw();
  });
  it('should accept valid given datatypes and keys', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    expect(function() {
      sequence(types, keys);
      done();
    }).to.not.throw();
  });
  it('should accept valid given datatypes and keys after initialisation', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    var types2 = ['date', 'bool', 'float32'];
    var keys2 = ['a', 'b', 'c'];
    var s = sequence(types, keys);
    expect(function() {
      s.init(types2, keys2);
      done();
    }).to.not.throw();
  });
  it('should not accept invalid given datatypes', function() {
    var types = ['bool', 'data%', 'float32'];
    expect(function() {
      sequence(types);
    }).to.throw();
  });
  it('should not accept given datatypes and keys (unequal amount)', function() {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y'];
    expect(function() {
      sequence(types, keys);
    }).to.throw();
  });
  it('should not accept given datatypes (unequal amount) and keys', function() {
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
  it('should accept a view after initialisation', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      var s = sequence(types);
      s.view(view);
      done();
    }).to.not.throw();
  });
  it('should accept another view after initialisation', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    var view2 = new DataView( new ArrayBuffer(10));
    expect(function() {
      var s = sequence(types, null, view);
      s.view(view2);
      done();
    }).to.not.throw();
  });
  it('should accept a buffer', function(done) {
    var types = ['bool'];
    var buffer = new ArrayBuffer(8);
    expect(function() {
      var s = sequence(types);
      s.view(buffer);
      done();
    }).to.not.throw();
  });
  it('should accept another buffer after initialisation', function(done) {
    var types = ['bool'];
    var buffer = new ArrayBuffer(8);
    var buffer2 = new ArrayBuffer(10);
    expect(function() {
      var s = sequence(types, null, buffer);
      s.view(buffer2);
      done();
    }).to.not.throw();
  });
  it('should accept a buffer with offset', function(done) {
    var types = ['bool'];
    var buffer = new ArrayBuffer(8);
    expect(function() {
      var s = sequence(types);
      s.view(buffer, 2);
      done();
    }).to.not.throw();
  });
  it('should generate a view', function() {
    var types = ['bool'];
    var s = sequence(types);
    expect(s.view().byteLength).to.exist;
    expect(s.view().buffer).to.exist;
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


describe('sequence: set and get data', function() {
  it('should set with given datatypes', function(done) {
    var s = sequence( ['bool', 'date', 'float32'] );
    s.view();
    expect(function() {
      s.set([true, new Date(), 3]);
      done();
    }).to.not.throw();
  });
  it('should set with given datatypes at offset', function(done) {
    var s = sequence( ['bool', 'date', 'float32'] );
    s.view(new ArrayBuffer(15), 2);
    expect(function() {
      s.set([true, new Date(), 3]);
      done();
    }).to.not.throw();
  });
  it('should set with given datatypes and valid keys', function(done) {
    var s = sequence( ['bool', 'date', 'float32'], ['x', 'y', 'z'] );
    s.view();
    expect(function() {
      s.set({x: true, y: new Date(), z: 3});
      done();
    }).to.not.throw();
  });
  it('should get with given datatypes', function(done) {
    var s = sequence( ['bool', 'date', 'float32']);
    s.view();
    s.set([true, new Date(), 3]);
    expect(function() {
      s.get(0);
      done();
    }).to.not.throw();
  });
  it('should get with given datatypes at offset', function(done) {
    var s = sequence( ['bool', 'date', 'float32'] );
    s.view(new ArrayBuffer(120), 2, 20);
    s.set([true, new Date(), 3]);
    expect(function() {
      s.get(2);
      done();
    }).to.not.throw();
  });
  it('should set and get with given datatypes and be equal', function(done) {
    var s = sequence( ['bool', 'date', 'float32']);
    s.view();
    var value = [true, new Date(), 3];
    s.set( value );
    var ret = s.get(0);
    expect(ret).to.deep.equal(value);
    done();
  });
  it('should set and get with given datatypes and keys and be equal', function(done) {
    var s = sequence( ['bool', 'date', 'float32'], ['x', 'y', 'z']);
    s.view();
    var value = {x: true, y: new Date(), z: 3};
    s.set( value );
    var ret = s.get(0);
    expect(ret).to.deep.equal(value);
    done();
  });
  it('should set and get after resetting view', function(done) {
    var s = sequence( ['bool', 'date', 'float32'], ['x', 'y', 'z']);
    s.view();
    var value = {x: false, y: new Date(), z: 5};
    s.set( value );
    s.view(null);
    value = {x: true, y: new Date(), z: 3};
    s.set( value );
    var ret = s.get(0);
    expect(ret).to.deep.equal(value);
    done();
  });
});
