// import 'babel-polyfill';
const { expect } = require('chai');
const { record } = require('../lib/index.js');


describe('record: set parameters', function() {
  it('should accept given datatypes', function(done) {
    var types = ['bool', 'date', 'float32', 'float64', 'int8', 'uint8', 'int16', 'uint16', 'int32', 'uint32'];
    expect(function() {
      record(types);
      done();
    }).to.not.throw();
  });
  it('should accept valid given datatypes and keys', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    expect(function() {
      record(types, keys);
      done();
    }).to.not.throw();
  });
  it('should accept valid given datatypes and keys after initialisation', function(done) {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y', 'z'];
    var types2 = ['date', 'bool', 'float32'];
    var keys2 = ['a', 'b', 'c'];
    var r = record(types, keys);
    expect(function() {
      r.init(types2, keys2);
      done();
    }).to.not.throw();
  });
  it('should not accept invalid given datatypes', function() {
    var types = ['bool', 'data%', 'float32'];
    expect(function() {
      record(types);
    }).to.throw();
  });
  it('should not accept given datatypes and keys (unequal amount)', function() {
    var types = ['bool', 'date', 'float32'];
    var keys = ['x', 'y'];
    expect(function() {
      record(types, keys);
    }).to.throw();
  });
  it('should not accept given datatypes (unequal amount) and keys', function() {
    var types = ['bool'];
    var keys = ['x', 'y'];
    expect(function() {
      record(types, keys);
    }).to.throw();
  });
  it('should not accept no given datatypes', function() {
    var types = [];
    expect(function() {
      record(types);
    }).to.throw();
  });
  it('should accept a view', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      record(types, null, view);
      done();
    }).to.not.throw();
  });
  it('should accept a view after initialisation', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      var r = record(types);
      r.view(view);
      done();
    }).to.not.throw();
  });
  it('should accept another view after initialisation', function(done) {
    var types = ['bool'];
    var view = new DataView( new ArrayBuffer(8));
    var view2 = new DataView( new ArrayBuffer(10));
    expect(function() {
      var r = record(types, null, view);
      r.view(view2);
      done();
    }).to.not.throw();
  });
  it('should accept a buffer', function(done) {
    var types = ['bool'];
    var buffer = new ArrayBuffer(8);
    expect(function() {
      var r = record(types);
      r.view(buffer);
      done();
    }).to.not.throw();
  });
  it('should accept another buffer after initialisation', function(done) {
    var types = ['bool'];
    var buffer = new ArrayBuffer(8);
    var buffer2 = new ArrayBuffer(10);
    expect(function() {
      var r = record(types, null, buffer);
      r.view(buffer2);
      done();
    }).to.not.throw();
  });
  it('should accept a buffer with offset', function(done) {
    var types = ['bool'];
    var buffer = new ArrayBuffer(8);
    expect(function() {
      var r = record(types);
      r.view(buffer, 2);
      done();
    }).to.not.throw();
  });
  it('should generate a view', function() {
    var types = ['bool'];
    var r = record(types);
    var view = r.view();
    expect(view.byteLength).to.exist;
    expect(view.buffer).to.exist;
  });
  it('should accept a view with valid byteLength', function(done) {
    var types = ['float32', 'int16', 'int16'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      record(types, null, view);
      done();
    }).to.not.throw();
  });
  it('should not accept a view with invalid byteLength', function() {
    var types = ['float32', 'int16', 'int16', 'bool'];
    var view = new DataView( new ArrayBuffer(8));
    expect(function() {
      record(types, null, view);
    }).to.throw();
  });
});


describe('record: set and get data', function() {
  it('should set with given datatypes', function(done) {
    var r = record( ['bool', 'date', 'float32'] );
    expect(function() {
      r.set([[true, new Date(), 3], [true, new Date(), 3], [true, new Date(), 3]]);
      done();
    }).to.not.throw();
  });
  it('should set with given datatypes and valid keys', function(done) {
    var r = record( ['bool', 'date', 'float32'], ['x', 'y', 'z'] );
    expect(function() {
      r.set([{x: true, y: new Date(), z: 3},{x: true, y: new Date(), z: 3}]);
      done();
    }).to.not.throw();
  });
  it('should get with given datatypes', function(done) {
    var r = record( ['bool', 'date', 'float32']);
    r.set([[true, new Date(), 3], [true, new Date(), 3], [true, new Date(), 3]]);
    expect(function() {
      r.get(0);
      done();
    }).to.not.throw();
  });
  it('should set and get with given datatypes and be equal', function(done) {
    var r = record( ['bool', 'date', 'float32']);
    var values = [[true, new Date(), 3]];
    r.set( values );
    var ret = r.get(0);
    expect(ret).to.deep.equal(values);
    done();
  });
  it('should set and get with given datatypes and keys and be equal', function(done) {
    var r = record( ['bool', 'date', 'float32'], ['x', 'y', 'z']);
    var values = [{x: true, y: new Date(), z: 3}, {x: true, y: new Date(), z: 3}];
    r.set( values );
    var ret = r.get(0);
    expect(ret).to.deep.equal(values);
    done();
  });
});

describe('record: performance', function() {
  const types = ['bool', 'date', 'float32'];
  const r = record( types ), values = [];

  it(`setting and getting array-like values (${types.length} variables)`, function(done) {
    this.timeout(0);
    let i = values.length, n, time_start, time_diff;
    n = 1000;
    while (i < n) {
      let rdn = Math.random();
      values.push([rdn < 0.5 ? false : true, new Date(), rdn * n]);
      i++;
    }
    r.view(null, 0, r.byteLength * n);
    time_start = process.hrtime();
    r.set(values);
    time_diff = process.hrtime(time_start);
    console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
    time_start = process.hrtime();
    const ret = r.get(0);
    time_diff = process.hrtime(time_start);
    console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
    done();
  });

  it(`setting and getting array-like values (${types.length} variables)`, function(done) {
    this.timeout(0);
    let i = values.length, n, time_start, time_diff;
    n = 1000*1000;
    while (i < n) {
      let rdn = Math.random();
      values.push([rdn < 0.5 ? false : true, new Date(), rdn * n]);
      i++;
    }
    r.view(null, 0, r.byteLength * n);
    time_start = process.hrtime();
    r.set(values);
    time_diff = process.hrtime(time_start);
    console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
    time_start = process.hrtime();
    const ret = r.get(0);
    time_diff = process.hrtime(time_start);
    console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
    done();
  });

  values.length = 0;
  const keys = ['x', 'y', 'z'];
  const r2 = record( types, keys ), values2 = [];
  it(`setting and getting object-like values (${types.length} variables)`, function(done) {
    this.timeout(0);
    let i = values2.length, n, time_start, time_diff;
    n = 1000;
    while (i < n) {
      let rdn = Math.random();
      values2.push({x: rdn < 0.5 ? false : true, y: new Date(), z: rdn * n});
      i++;
    }
    r2.view(null, 0, r.byteLength * n);
    time_start = process.hrtime();
    r2.set(values2);
    time_diff = process.hrtime(time_start);
    console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
    time_start = process.hrtime();
    const ret = r2.get(0);
    time_diff = process.hrtime(time_start);
    console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
    done();
  });

  it(`setting and getting object-like values (${types.length} variables)`, function(done) {
    this.timeout(0);
    let i = values2.length, n, time_start, time_diff;
    n = 1000*1000;
    while (i < n) {
      let rdn = Math.random();
      values2.push({x: rdn < 0.5 ? false : true, y: new Date(), z: rdn * n});
      i++;
    }
    r2.view(null, 0, r.byteLength * n);
    time_start = process.hrtime();
    r2.set(values2);
    time_diff = process.hrtime(time_start);
    console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
    time_start = process.hrtime();
    const ret = r2.get(0);
    time_diff = process.hrtime(time_start);
    console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
    done();
  });

});
