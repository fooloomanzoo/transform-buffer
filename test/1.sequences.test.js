// import 'babel-polyfill';
const {expect} = require('chai');
const {sequence} = require('../lib/index.js');

describe('sequence: set parameters', function() {
	it('should accept given datatypes', function(done) {
		const options = {
			types: [
				'bool',
				'date',
				'float32',
				'float64',
				'int8',
				'uint8',
				'int16',
				'uint16',
				'int32',
				'uint32'
			]
		};
		expect(function() {
			sequence(options);
			done();
		}).to.not.throw();
	});
	it('should accept valid given datatypes and keys', function(done) {
		const options = {
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		};
		expect(function() {
			sequence(options);
			done();
		}).to.not.throw();
	});
	it('should accept valid given datatypes and keys after initialisation', function(done) {
		const options = {
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		};
		const options2 = {
			types: [
				'date', 'date', 'float32'
			],
			keys: ['a', 'b', 'c']
		};
		const s = sequence(options);
		expect(function() {
			s.init(options2);
			done();
		}).to.not.throw();
	});
	it('should not accept invalid given datatypes', function() {
		const options = {
			types: [
				'bool', 'd2123ate', 'float32'
			],
			keys: ['x', 'y', 'z']
		};
		expect(function() {
			sequence(options);
		}).to.throw();
	});
	it('should not accept given datatypes and keys (unequal amount)', function() {
		const options = {
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y']
		};
		expect(function() {
			sequence(options);
		}).to.throw();
	});
	it('should not accept given datatypes (unequal amount) and keys', function() {
		const options = {
			types: [
				'bool', 'date'
			],
			keys: ['x', 'y', 'z']
		};
		expect(function() {
			sequence(options);
		}).to.throw();
	});
	it('should not accept no given datatypes', function() {
		const options = {
			types: []
		};
		expect(function() {
			sequence(options);
		}).to.throw();
	});
	it('should accept a view', function(done) {
		const options = {
			types: ['bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			sequence(view, options);
			done();
		}).to.not.throw();
	});
	it('should accept a view after initialisation', function(done) {
		const options = {
			types: ['bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			const s = sequence(options);
			s.view(view);
			done();
		}).to.not.throw();
	});
	it('should accept another view after initialisation', function(done) {
		const options = {
			types: ['bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		const view2 = new DataView(new ArrayBuffer(6));
		expect(function() {
			const s = sequence(view, options);
			s.view(view2);
			done();
		}).to.not.throw();
	});
	it('should accept a buffer', function(done) {
		const options = {
			types: ['bool']
		};
		const buffer = new ArrayBuffer(8);
		expect(function() {
			const s = sequence(options);
			s.view(buffer);
			done();
		}).to.not.throw();
	});
	it('should accept another buffer after initialisation', function(done) {
		const options = {
			types: ['bool']
		};
		const buffer = new ArrayBuffer(8);
		const buffer2 = new ArrayBuffer(10);
		expect(function() {
			const s = sequence(buffer, options);
			s.view(buffer2);
			done();
		}).to.not.throw();
	});
	it('should accept a buffer with offset', function(done) {
		const options = {
			types: ['bool']
		};
		const buffer = new ArrayBuffer(8);
		expect(function() {
			const s = sequence(options);
			s.view(buffer, 2);
			done();
		}).to.not.throw();
	});
	it('should generate a view', function() {
		const options = {
			types: ['bool']
		};
		const s = sequence(options);
		expect(s.view().byteLength).to.exist;
		expect(s.view().buffer).to.exist;
	});
	it('should accept a view with valid byteLength', function(done) {
		const options = {
			types: ['float32', 'int16', 'int16']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			sequence(view, options);
			done();
		}).to.not.throw();
	});
	it('should not accept a view with invalid byteLength', function() {
		const options = {
			types: ['float32', 'int16', 'int16', 'bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			sequence(view, options);
		}).to.throw();
	});
});

describe('sequence: set and get data', function() {
	it('should set with given datatypes', function(done) {
		const s = sequence(['bool', 'date', 'float32']);
		s.view();
		expect(function() {
			s.set([true, new Date(), 3]);
			done();
		}).to.not.throw();
	});
	it('should set with given datatypes at offset', function(done) {
		const s = sequence(['bool', 'date', 'float32']);
		s.view(new ArrayBuffer(15), 2);
		expect(function() {
			s.set([true, new Date(), 3]);
			done();
		}).to.not.throw();
	});
	it('should set with given datatypes and valid keys', function(done) {
		const s = sequence({
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		});
		s.view();
		expect(function() {
			s.set({x: true, y: new Date(), z: 3});
			done();
		}).to.not.throw();
	});
	it('should get with given datatypes', function(done) {
		const s = sequence({
			types: ['bool', 'date', 'float32']
		});
		s.view();
		s.set([true, new Date(), 3]);
		expect(function() {
			s.get(0);
			done();
		}).to.not.throw();
	});
	it('should get with given datatypes at offset', function(done) {
		const s = sequence({
			types: ['bool', 'date', 'float32']
		});
		s.view(new ArrayBuffer(120), 2, 20);
		s.set([true, new Date(), 3]);
		expect(function() {
			s.get(2);
			done();
		}).to.not.throw();
	});
	it('should set and get with given datatypes and be equal', function(done) {
		const s = sequence({
			types: ['bool', 'date', 'float32']
		});
		s.view();
		const value = [true, new Date(), 3];
		s.set(value);
		const ret = s.get(0);
		expect(ret).to.deep.equal(value);
		done();
	});
	it('should set and get with given datatypes and keys and be equal', function(done) {
		const s = sequence({
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		});
		s.view();
		const value = {
			x: true,
			y: new Date(),
			z: 3
		};
		s.set(value);
		const ret = s.get(0);
		expect(ret).to.deep.equal(value);
		done();
	});
	it('should set and get after resetting view', function(done) {
		const s = sequence({
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		});
		s.view();
		let value = {
			x: false,
			y: new Date(),
			z: 5
		};
		s.set(value);
		s.view(null);
		value = {
			x: true,
			y: new Date(),
			z: 3
		};
		s.set(value);
		const ret = s.get(0);
		expect(ret).to.deep.equal(value);
		done();
	});
});
