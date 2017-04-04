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

  constructor(types, sequenceKeys) {
    this.sequenceByteLength = 0;
    this.sequenceByteOrder = [0];
    this.getter = [];
    this.setter = [];
    this.types = types;
    this.sequenceKeys = [];
    this.addSequenceTypes(types, sequenceKeys);
  }

  addSequenceTypes(types, sequenceKeys) {
    if (!sequenceKeys) { // performance leak, when writing on object-keys, in comparison to pushing to array
      this._handleSequenceAsArray = true;
    }
    for (var i = 0; i < types.length; i++) {
      if (types[i] in DATA_TYPES) {
        this.sequenceByteLength += DATA_TYPES[types[i]].bytes;
        this.sequenceByteOrder.push(this.sequenceByteLength);
        this.getter.push(DATA_TYPES[types[i]].get);
        this.setter.push(DATA_TYPES[types[i]].set);
        if (sequenceKeys && sequenceKeys[i]) {
          this.sequenceKeys.push(sequenceKeys[i]);
        } else {
          this.sequenceKeys.push('' + i);
        }
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }
    this.setMapFunctions();
  }

  setMapFunctions() {
    var sequenceKeys = this.sequenceKeys;
    if (!Array.isArray(sequenceKeys)) {
      this.mapSequence = null;
      this.unmapSequence = null;
      return;
    }
    this.mapSequence = function(arr) {
      var ret = [];
      // console.log(arguments.length);
      var len = Math.floor(arr.length / sequenceKeys.length) * sequenceKeys.length;
      var i = 0,
          l = 0;
      while (i < len) {
        ret.push({})
        for (var j = 0; j < sequenceKeys.length; j++, i++) {
          ret[l][sequenceKeys[j]] = arr[i];
        }
        l++;
      }
      return ret;
    };
    this.unmapSequence = function(arr) {
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < sequenceKeys.length; j++) {
          ret.push(arr[i][sequenceKeys[j]]);
        }
      }
      return ret;
    };
  }

  getJoinFn(view) { // create a new scope
    return function(offset, sequence) {
      for (var i = 0; i < this.setter.length; i++) {
        this.setter[i].call(view, offset + this.sequenceByteOrder[i], sequence[this.sequenceKeys[i]]);
      }
    }.bind(this);
  }

  getSplitFn(view) { // create a new scope
    return function(offset) {
      var ret = [];
      for (var i = 0; i < this.getter.length; i++) {
        ret.push(this.getter[i].call(view, offset + this.sequenceByteOrder[i]));
      }
      return ret;
    }.bind(this);
  }

  toArray() {
    if (arguments[0].length && typeof arguments[0] === 'string') {
      return this.stringToArray.apply(this, arguments);
    } else if (Array.isArray(arguments[0])) {
      return this.arrayToArray.apply(this, arguments);
    }
    if (arguments[0].byteLength) {
      return this.bufferToArray.apply(this, arguments);
    }
  }

  toBuffer() {
    if (arguments[0].length && typeof arguments[0] === 'string') {
      return this.stringToBuffer.apply(this, arguments);
    } else if (Array.isArray(arguments[0])) {
      return this.arrayToBuffer.apply(this, arguments);
    }
    if (arguments[0].byteLength) {
      return this.bufferToBuffer.apply(this, arguments);
    }
  }

  toString() {
    if (arguments[0].length && typeof arguments[0] === 'string') {
      return this.stringToString.apply(this, arguments);
    } else if (Array.isArray(arguments[0])) {
      return this.arrayToString.apply(this, arguments);
    }
    if (arguments[0].byteLength) {
      return this.bufferToString.apply(this, arguments);
    }
  }

  bufferToArray(buffer, byteOffset, byteLength) {
    var ret = [];
    const length = 0 || byteLength || buffer.byteLength;
    const view = new DataView(buffer, byteOffset, byteLength);
    // get a constant split functions
    const splitFn = this.getSplitFn(view);
    for (var offset = 0; offset < length; offset += this.sequenceByteLength) {
      ret.push( splitFn(offset) );
    }
    if (!this._handleSequenceAsArray)
      return this.mapSequence(ret);
    return ret;
  }

  arrayToArray(array, toMapped) { // copy of the array and optional mapping of its sequences
    if (toMapped !== undefined) {
      if (toMapped === true && this.mapSequence && typeof this.mapSequence === 'function') {
        return this.mapSequence.apply(null, array);
      } else if (toMapped === false && this.unmapSequence && typeof this.unmapSequence === 'function') {
        return this.unmapSequence.apply(null, array);
      }
    }
    return array;
  }

  stringToArray(str) {
    console.log('process string');
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

  bufferToBuffer(buffer, start = 0, end) {
    return buffer.slice(start, end);
  }

  stringToBuffer(str) {

  }

  arrayToString(array) {

  }

  bufferToString(buffer, offset, byteLength) {

  }

  stringToString(str) {

  }

}

module.exports = BufferView;
