// import 'babel-polyfill';
const { expect } = require('chai');
const { array } = require('../lib/index.js');


describe('array: set parameters', function() {
  it('should accept given datatypes', function(done) {
    var types = ['bool', 'date', 'float32', 'float64', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32'];
    expect(function() {
      array(types);
      done();
    }).to.not.throw();
  });
  it('should accept valid given datatypes and keys', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    expect(function() {
      array(types, keys);
      done();
    }).to.not.throw();
  });
  it('should not accept invalid given datatypes', function() {
    var types = ['bool', 'data%', 'float32'];
    expect(function() {
      array(types);
    }).to.throw();
  });
  it('should not accept given datatypes and keys (unequal amount)', function() {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y'];
    expect(function() {
      array(types, keys);
    }).to.throw();
  });
  it('should not accept given datatypes (unequal amount) and keys', function() {
    var types = ['bool'];
    var keys = ['x', 'y'];
    expect(function() {
      array(types, keys);
    }).to.throw();
  });
  it('should not accept no given datatypes', function() {
    var types = [];
    expect(function() {
      array(types);
      array();
    }).to.throw();
  });
  it('should accept a view', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      array(types, null, view);
      done();
    }).to.not.throw();
  });
  it('should accept a view with valid byteLength', function(done) {
    var types = ['float32', 'int16', 'int16'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      array(types, null, view);
      done();
    }).to.not.throw();
  });
  it('should not accept a view with invalid byteLength', function() {
    var types = ['float32', 'int16', 'int16', 'bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      array(types, null, view);
    }).to.throw();
  });
});


describe('array: set and get data', function() {
  it('should set with given datatypes', function(done) {
    var s = array( ['bool', 'date', 'float32'] );
    expect(function() {
      s.set([true, new Date(), 3]);
      done();
    }).to.not.throw();
  });
  it('should set with given datatypes and valid keys', function(done) {
    var s = array( ['bool', 'date', 'float32'], ['x', 'y', 'z'] );
    expect(function() {
      s.set({x: true, y: new Date(), z: 3});
      done();
    }).to.not.throw();
  });
  it('should get with given datatypes', function(done) {
    var s = array( ['bool', 'date', 'float32']);
    s.set([true, new Date(), 3]);
    expect(function() {
      s.get(0);
      done();
    }).to.not.throw();
  });
  it('should set and get with given datatypes and be equal', function(done) {
    var s = array( ['bool', 'date', 'float32']);
    var value = [true, new Date(), 3];
    s.set( value );
    var ret = s.get(0);
    expect(ret).to.deep.equal(value);
    done();
  });
  it('should set and get with given datatypes and keys and be equal', function(done) {
    var s = array( ['bool', 'date', 'float32'], ['x', 'y', 'z']);
    var value = {x: true, y: new Date(), z: 3};
    s.set( value );
    var ret = s.get(0);
    expect(ret).to.deep.equal(value);
    done();
  });
});
