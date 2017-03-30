const DATA_TYPES = {
    'bool': {
        set: function(byteOffset, value) { DataView.prototype.setInt8.call(this, byteOffset, value ? 1 : 0); },
        get: function(byteOffset) { return DataView.prototype.getInt8.call(this, byteOffset) ? true : false },
        min: 0,
        max: 1,
        bytes: 1
    },
    'char': { // experimental (for Unicode)
        set: function(byteOffset, value) { DataView.prototype.setInt8.call(this, byteOffset, Math.abs(Math.floor(value % 128))); },
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

class ExtendedDataView {
  constructor(types) {
    this.init();
    if (types && Array.isArray(types)) {
      this.addSequenceTypes(types);
    }
  }

  init() {
    this.sequenceByteLength = 0;
    this.sequenceByteOrder = [];
    this.getter = [];
    this.setter = [];
  }

  addSequenceTypes(types) {
    for (var i = 0; i < types.length; i++) {
      if (types[i] in DATA_TYPES) {
        this.sequenceByteOrder.push(this.sequenceByteLength);
        this.sequenceByteLength += DATA_TYPES[types[i]].bytes;
        this.getter.push(DATA_TYPES[types[i]].get);
        this.setter.push(DATA_TYPES[types[i]].set);
      } else {
        console.warn(`Invalid Number-Type: \"${types[i]}\"`)
      }
    }
    this.splitBufferInSequence = this.getSplitSequenceFn(tmp_view, this.getter, this.sequenceByteOrder);
  }

  getSplitSequenceFn(view, getter, byteOrder) {
    return function(offset) {
      var ret = [];
      for (var i = 0; i < getter.length; i++) {
        // console.log(col, this.byteLength, offset, offset + this.sequenceByteOrder[col]);
        ret.push( getter[col].call(view, offset + byteOrder[i]) );
      }
      return ret;
    }
  }

  bufferToArray(buffer, byteOffset, byteLength, plain) { // using static split functions
    let ret = [];
    let length = byteLength || buffer.byteLength;
    let tmp_view = new DataView(buffer, byteOffset, byteLength);
    if (!plain) { // array seperated sequences
      for (var offset = 0; offset < length; offset += this.sequenceByteLength) {
        ret.push( this.splitBufferInSequence(offset) );
      }
    } else { // all sequences in one array
      for (var offset = 0; offset < length; offset += this.sequenceByteLength) {
        ret.push.apply( ret, this.splitBufferInSequence(offset) );
      }
    }
    return ret;
  }


}

module.exports = ExtendedDataView;
