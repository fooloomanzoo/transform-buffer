// import 'babel-polyfill';
const {expect} = require('chai');
const {record} = require('../lib/index.js');

describe('record: set parameters', function() {
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
			record(options);
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
			record(options);
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
		const r = record(options);
		expect(function() {
			r.init(options2);
			done();
		}).to.not.throw();
	});
	it('should not accept invalid given datatypes', function() {
		const options = {
			types: ['bool', 'data%', 'float32']
		};
		expect(function() {
			record(options);
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
			record(options);
		}).to.throw();
	});
	it('should not accept given datatypes (unequal amount) and keys', function() {
		const options = {
			types: ['bool'],
			keys: ['x', 'y']
		};
		expect(function() {
			record(options);
		}).to.throw();
	});
	it('should not accept no given datatypes', function() {
		const options = {
			types: []
		};
		expect(function() {
			record(options);
		}).to.throw();
	});
	it('should accept a view', function(done) {
		const options = {
			types: ['bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			record(view, options);
			done();
		}).to.not.throw();
	});
	it('should accept a view after initialisation', function(done) {
		const options = {
			types: ['bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			const r = record(options);
			r.view(view);
			done();
		}).to.not.throw();
	});
	it('should accept another view after initialisation', function(done) {
		const options = {
			types: ['bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		const view2 = new DataView(new ArrayBuffer(10));
		expect(function() {
			const r = record(view, options);
			r.view(view2);
			done();
		}).to.not.throw();
	});
	it('should accept a buffer', function(done) {
		const options = {
			types: ['bool']
		};
		const buffer = new ArrayBuffer(8);
		expect(function() {
			const r = record(options);
			r.view(buffer);
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
			const r = record(buffer, options);
			r.view(buffer2);
			done();
		}).to.not.throw();
	});
	it('should accept a buffer with offset', function(done) {
		const options = {
			types: ['bool']
		};
		const buffer = new ArrayBuffer(8);
		expect(function() {
			const r = record(options);
			r.view(buffer, 2);
			done();
		}).to.not.throw();
	});
	it('should generate a view', function() {
		const options = {
			types: ['bool']
		};
		const r = record(options);
		const view = r.view();
		expect(view.byteLength).to.exist;
		expect(view.buffer).to.exist;
	});
	it('should accept a view with valid byteLength', function(done) {
		const options = {
			types: ['float32', 'int16', 'int16']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			record(view, options);
			done();
		}).to.not.throw();
	});
	it('should not accept a view with invalid byteLength', function() {
		const options = {
			types: ['float32', 'int16', 'int16', 'bool']
		};
		const view = new DataView(new ArrayBuffer(8));
		expect(function() {
			record(view, options);
		}).to.throw();
	});
});

describe('record: set and get data', function() {
	it('should set with given datatypes', function(done) {
		const r = record({
			types: ['bool', 'date', 'float32']
		});
		expect(function() {
			r.set([
				[
					true, new Date(), 3
				],
				[
					true, new Date(), 3
				],
				[true, new Date(), 3]
			]);
			done();
		}).to.not.throw();
	});
	it('should set with given datatypes and valid keys', function(done) {
		const r = record({
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		});
		expect(function() {
			r.set([
				{
					x: true,
					y: new Date(),
					z: 3
				}, {
					x: true,
					y: new Date(),
					z: 3
				}
			]);
			done();
		}).to.not.throw();
	});
	it('should get with given datatypes', function(done) {
		const r = record({
			types: ['bool', 'date', 'float32']
		});
		r.set([
			[
				true, new Date(), 3
			],
			[
				true, new Date(), 3
			],
			[true, new Date(), 3]
		]);
		expect(function() {
			r.get(0);
			done();
		}).to.not.throw();
	});
	it('should set and get with given datatypes and be equal', function(done) {
		const r = record({
			types: ['bool', 'date', 'float32']
		});
		const values = [
			[true, new Date(), 3]
		];
		r.set(values);
		const ret = r.get(0);
		expect(ret).to.deep.equal(values);
		done();
	});
	it('should set and get with given datatypes and keys and be equal', function(done) {
		const r = record({
			types: [
				'bool', 'date', 'float32'
			],
			keys: ['x', 'y', 'z']
		});
		const values = [
			{
				x: true,
				y: new Date(),
				z: 3
			}, {
				x: true,
				y: new Date(),
				z: 3
			}
		];
		r.set(values);
		const ret = r.get(0);
		expect(ret).to.deep.equal(values);
		done();
	});
});

describe('record: performance', function() {
	const options = {
		types: ['bool', 'date', 'float32']
	};
	const r = record(options),
		values = [];

	it(`setting and getting array-like values (${options.types.length} constiables)`, function(done) {
		this.timeout(0);
		let i = values.length,
			n,
			time_start,
			time_diff;
		n = 1000;
		while (i < n) {
			let rdn = Math.random();
			values.push([
				rdn < 0.5
					? false
					: true,
				new Date(),
				rdn * n
			]);
			i++;
		}
		r.view(null, 0, r.byteLength * n);
		time_start = process.hrtime();
		r.set(values);
		time_diff = process.hrtime(time_start);
		console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
		time_start = process.hrtime();
		r.get(0);
		time_diff = process.hrtime(time_start);
		console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
		done();
	});

	it(`setting and getting array-like values (${options.types.length} constiables)`, function(done) {
		this.timeout(0);
		let i = values.length,
			n,
			time_start,
			time_diff;
		n = 1000 * 1000;
		while (i < n) {
			let rdn = Math.random();
			values.push([
				rdn < 0.5
					? false
					: true,
				new Date(),
				rdn * n
			]);
			i++;
		}
		r.view(null, 0, r.byteLength * n);
		time_start = process.hrtime();
		r.set(values);
		time_diff = process.hrtime(time_start);
		console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
		time_start = process.hrtime();
		r.get(0);
		time_diff = process.hrtime(time_start);
		console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
		done();
	});

	values.length = 0;
	options.keys = ['x', 'y', 'z'];
	const r2 = record(options),
		values2 = [];
	it(`setting and getting object-like values (${options.types.length} constiables)`, function(done) {
		this.timeout(0);
		let i = values2.length,
			n,
			time_start,
			time_diff;
		n = 1000;
		while (i < n) {
			let rdn = Math.random();
			values2.push({
				x: rdn < 0.5
					? false
					: true,
				y: new Date(),
				z: rdn * n
			});
			i++;
		}
		r2.view(null, 0, r.byteLength * n);
		time_start = process.hrtime();
		r2.set(values2);
		time_diff = process.hrtime(time_start);
		console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
		time_start = process.hrtime();
		r2.get(0);
		time_diff = process.hrtime(time_start);
		console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
		done();
	});

	it(`setting and getting object-like values (${options.types.length} constiables)`, function(done) {
		this.timeout(0);
		let i = values2.length,
			n,
			time_start,
			time_diff;
		n = 1000 * 1000;
		while (i < n) {
			let rdn = Math.random();
			values2.push({
				x: rdn < 0.5
					? false
					: true,
				y: new Date(),
				z: rdn * n
			});
			i++;
		}
		r2.view(null, 0, r.byteLength * n);
		time_start = process.hrtime();
		r2.set(values2);
		time_diff = process.hrtime(time_start);
		console.log(`setting ${n}-values time elapsed: ${time_diff}s`);
		time_start = process.hrtime();
		r2.get(0);
		time_diff = process.hrtime(time_start);
		console.log(`getting ${n}-values time elapsed: ${time_diff}s`);
		done();
	});

});
