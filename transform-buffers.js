const DATA_TYPES = {
    'bool': {
        set: function(byteOffset, value) { DataView.prototype.setInt8.call(this, byteOffset, value ? 1 : 0); },
        get: function(byteOffset) { return DataView.prototype.getInt8.call(this, byteOffset) ? true : false; },
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

// TODO: rewrite in proper module form (also in browser form, --> rollup, d3), proper tests and test-cases

const MAX_ARGUMENTS_LENGTH = 0x4000;

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
    var j;
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
    this.setTransposeFunctions();
  }

  setTransposeFunctions() {
    var sequenceKeys = this.sequenceKeys;
    if (!Array.isArray(sequenceKeys)) {
      this.transposeSequence = null;
      this.retrieveSequence = null;
      return;
    }
    this.transposeSequence = function(arr) {
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
    this.retrieveSequence = function(arr) {
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
      return this.transposeSequence(ret);
    return ret;
  }

  arrayToArray(array, toMapped) { // copy of the array and optional mapping of its sequences
    if (toMapped !== undefined) {
      if (toMapped === true && this.transposeSequence && typeof this.transposeSequence === 'function') {
        return this.transposeSequence.apply(null, array);
      } else if (toMapped === false && this.retrieveSequence && typeof this.retrieveSequence === 'function') {
        return this.retrieveSequence.apply(null, array);
      }
    }
    return array;
  }

  stringToArray(str, toMapped) {
    return this.arrayToArray(this.bufferToArray(this.stringToBuffer(str)), toMapped);
  }

  arrayToBuffer(array) {
    var buffer = new ArrayBuffer( array.length * this.sequenceByteLength );
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

  stringToBuffer(str) { // http://phoboslab.org/log/2015/11/the-absolute-worst-way-to-read-typed-array-data-with-javascriptcore
    var view = new DataView( new ArrayBuffer(str.length * 2) );
    for (var i = 0; i < str.length; i++) {
      view.setUint16( i*2, str.charCodeAt(i), true );
    }
    return view.buffer;
  }

  arrayToString(array, toMapped) {
    return this.bufferToString(this.arrayToBuffer(this.arrayToArray(array, toMapped)));
  }

  bufferToString(buffer, byteOffset, byteLength) { // http://phoboslab.org/log/2015/11/the-absolute-worst-way-to-read-typed-array-data-with-javascriptcore
    var u16Count = byteLength ? byteLength >> 1 : buffer.byteLength >> 1;
    byteOffset = byteOffset || 0;

    // Create a Uint16 View from the TypedArray or ArrayBuffer
    var u16 = new Uint16Array(buffer, byteOffset, u16Count);

    // If this array has an odd byte length, we have to append the last
    // byte separately, instead of reading it from the Uint16Array.
    var lastByte = '';
    if (buffer.byteLength % 2 !== 0) {
        var u8 = new Uint8Array(u16.buffer, u16.byteOffset);
        lastByte = String.fromCharCode(u8[u16Count * 2]);
    }

    if (u16Count < MAX_ARGUMENTS_LENGTH) {
        // Fast case - data is smaller than chunk size and the conversion
        // can be done in one step.
        return String.fromCharCode.apply(null, u16) + lastByte;
    }
    else {
        // Slow case - we need to split the data into smaller chunks,
        // collect them in an array and finally join them together.
        var chunks = [], i = 0;
        while (i < u16Count) {
            chunks.push(String.fromCharCode.apply(null, u16.subarray(i, i + MAX_ARGUMENTS_LENGTH) ));
            i += MAX_ARGUMENTS_LENGTH;
        }
        chunks.push(lastByte);
        return chunks.join('');
    }
  }

  stringToString(str) {
    return str;
  }

}

module.exports = BufferView;
