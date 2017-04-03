const DATA_TYPES = {
    'bool': {
        set: function(byteOffset, value) { DataView.prototype.setInt8.call(this, byteOffset, value ? 1 : 0); },
        get: function(byteOffset) { return DataView.prototype.getInt8.call(this, byteOffset) ? true : false },
        min: 0,
        max: 1,
        bytes: 1
    },
    'char': { // experimental (for Unicode)
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        min: 0,
        max: 127,
        bytes: 1,
    },
    'int8': {
        set: DataView.prototype.setInt8,
        get: DataView.prototype.getInt8,
        min: -128,
        max: 127,
        bytes: 1
    },
    'uint8': {
        set: DataView.prototype.setUint8,
        get: DataView.prototype.getUint8,
        min: 0,
        max: 255,
        bytes: 1
    },
    'int16': {
        set: DataView.prototype.setInt16,
        get: DataView.prototype.getInt16,
        min: -32768,
        max: 32767,
        bytes: 2
    },
    'uint16': {
        set: DataView.prototype.setUint16,
        get: DataView.prototype.getUint16,
        min: 0,
        max: 65535,
        bytes: 2
    },
    'int32': {
        set: DataView.prototype.setInt32,
        get: DataView.prototype.getInt32,
        min: -2147483648,
        max: 2147483647,
        bytes: 4
    },
    'uint32': {
        set: DataView.prototype.setUint32,
        get: DataView.prototype.getUint32,
        min: 0,
        max: 4294967295,
        bytes: 4,
    },
    'float32': {
        set: DataView.prototype.setFloat32,
        get: DataView.prototype.getFloat32,
        min: -1*(2-Math.pow(2,-23))*Math.pow(2,127),
        max: (2-Math.pow(2,-23))*Math.pow(2,127),
        bytes: 4
    },
    'float64': {
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE,
        bytes: 8
    },
    'number': {
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        min: -Number.MAX_VALUE,
        max: Number.MAX_VALUE,
        bytes: 8
    },
    'date': { // http://www.ecma-international.org/ecma-262/6.0/#sec-time-values-and-time-range
        set: DataView.prototype.setFloat64,
        get: DataView.prototype.getFloat64,
        min: -8640000000000000,
        max: 8640000000000000,
        bytes: 8
    }
};

class BufferView {

  constructor(types, seqStructFn, seqDestructFn) {
    this.sequenceByteLength = 0;
    this.sequenceByteOrder = [0];
    this.getter = [];
    this.setter = [];
    this.addSequenceTypes(types);
    this.seqStructFn = seqStructFn;
    this.seqDestructFn = seqDestructFn;
  }

  addSequenceTypes(types) {
    for (var i = 0; i < types.length; i++) {
      if (types[i] in DATA_TYPES) {
        this.sequenceByteLength += DATA_TYPES[types[i]].bytes;
        this.sequenceByteOrder.push(this.sequenceByteLength);
        this.getter.push(DATA_TYPES[types[i]].get);
        this.setter.push(DATA_TYPES[types[i]].set);
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }
  }

  getJoinFn(view) { // create a new scope
    return function(offset, item) {
      for (var i = 0; i < this.setter.length; i++) {
        this.setter[i].call(view, offset + this.sequenceByteOrder[i], item[i]);
      }
    }.bind(this);
  }

  getSplitFn(view) { // create a new scope
    return function(offset) {
      let ret = [];
      for (var i = 0; i < this.getter.length; i++) {
        ret.push( this.getter[i].call(view, offset + this.sequenceByteOrder[i]) );
      }
      return ret;
    }.bind(this);
  }

  toArray(...args) {
    if (args[0].length && typeof args[0] === 'string') {
      return this.stringToArray(...args);
    } else if (Array.isArray(args[0])) {
      return this.arrayToArray(...args);
    }
    if (args[0].byteLength) {
      return this.bufferToArray(...args);
    }
  }

  toBuffer(...args) {
    if (args[0].length && typeof args[0] === 'string') {
      return this.stringToBuffer(...args);
    } else if (Array.isArray(args[0])) {
      return this.arrayToBuffer(...args);
    }
    if (args[0].byteLength) {
      return this.bufferToBuffer(...args);
    }
  }

  toString(...args) {
    if (args[0].length && typeof args[0] === 'string') {
      return this.stringToString(...args);
    } else if (Array.isArray(args[0])) {
      return this.arrayToString(...args);
    }
    if (args[0].byteLength) {
      return this.bufferToString(...args);
    }
  }

  bufferToArray(buffer, byteOffset, byteLength) {
    var ret = [];
    const length = byteLength || buffer.byteLength;
    const view = new DataView(buffer, byteOffset, byteLength);
    // get a constant split functions
    const splitFn = this.getSplitFn(view);
    for (var offset = 0; offset < length; offset += this.sequenceByteLength) {
      ret.push( splitFn(offset) );
    }
    if (this.seqStructFn) {
      return ret.map(this.seqStructFn);
    } else {
      return ret;
    }
  }

  stringToArray(str, encoding) {
    console.log('process string');
  }

  arrayToArray(array) { // copy of the array and optional mapping of its items
    if (this.seqDestructFn) {
      return this.seqDestructFn.apply(null, array);
    } else {
      return [...array];
    }
  }

  arrayToBuffer(array) {
    let buffer = new ArrayBuffer( array.length * this.sequenceByteLength );
    const view = new DataView(buffer);
    const joinFn = this.getJoinFn(view);
    for (var i = 0, offset = 0; i < array.length; i++, offset += this.sequenceByteLength) {
      joinFn(offset, array[i]);
    }
    return buffer;
  }

  stringToBuffer(str, encoding) {

  }

  bufferToBuffer(buffer, start = 0, end) {
    return buffer.slice(start, end);
  }

  arrayToString(array, encoding) {

  }

  bufferToString(buffer, offset, byteLength, encoding) {

  }

  stringToString(str, encoding) {

  }

}


module.exports = BufferView;
