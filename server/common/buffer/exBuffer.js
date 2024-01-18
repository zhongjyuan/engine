/**
 * 构造函数
 * @param {*} bufferLength 缓存区长度(默认512 byte)
 */
var ExBuffer = function (bufferLength) {
	var self = this;
	/** */
	var _dlen = 0;
	/**包头长度 */
	var _headLen = 2;
	/**字节序 */
	var _endian = "B";
	/**写入偏移量 */
	var _putOffset = 0;
	/**读取偏移量 */
	var _readOffset = 0;
	/**读取方法名 */
	var _readMethod = "readUInt16BE";
	var slice = Array.prototype.slice;
	/**内容字节(Buffer大于8kb 会使用slowBuffer，效率低) */
	var _buffer = Buffer.alloc(bufferLength || 512);

	/**
	 * 指定包长是uint32型(默认是ushort型)
	 * @returns
	 */
	this.uint32Head = function () {
		_headLen = 4;
		_readMethod = "readUInt" + 8 * _headLen + "" + _endian + "E";
		return this;
	};

	/**
	 * 指定包长是ushort型(默认是ushort型)
	 * @returns
	 */
	this.ushortHead = function () {
		_headLen = 2;
		_readMethod = "readUInt" + 8 * _headLen + "" + _endian + "E";
		return this;
	};

	/**
	 * 指定字节序 为Little Endian (默认：Big Endian)
	 * @returns
	 */
	this.littleEndian = function () {
		_endian = "L";
		_readMethod = "readUInt" + 8 * _headLen + "" + _endian + "E";
		return this;
	};

	/**
	 * 指定字节序 为Big Endian (默认：Big Endian)
	 * @returns
	 */
	this.bigEndian = function () {
		_endian = "B";
		_readMethod = "readUInt" + 8 * _headLen + "" + _endian + "E";
		return this;
	};

	/**订阅事件(执行一次) */
	this.once = function (e, cb) {
		if (!this.listeners_once) this.listeners_once = {};
		this.listeners_once[e] = this.listeners_once[e] || [];
		if (this.listeners_once[e].indexOf(cb) == -1)
			this.listeners_once[e].push(cb);
	};

	/**订阅事件 */
	this.on = function (e, cb) {
		if (!this.listeners) this.listeners = {};
		this.listeners[e] = this.listeners[e] || [];
		if (this.listeners[e].indexOf(cb) == -1) this.listeners[e].push(cb);
	};

	/**取消订阅 */
	this.off = function (e, cb) {
		var index = -1;
		if (
			this.listeners &&
			this.listeners[e] &&
			(index = this.listeners[e].indexOf(cb)) != -1
		)
			this.listeners[e].splice(index);
	};

	/**触发事件 */
	this.emit = function (e) {
		var other_parameters = slice.call(arguments, 1);
		if (this.listeners) {
			var list = this.listeners[e];
			if (list) {
				for (var i = 0; i < list.length; ++i) {
					try {
						list[i].apply(this, other_parameters);
					} catch (e) {
						console.log(e.stack);
					}
				}
			}
		}

		if (this.listeners_once) {
			var list = this.listeners_once[e];
			delete this.listeners_once[e];
			if (list) {
				for (var i = 0; i < list.length; ++i) {
					try {
						list[i].apply(this, other_parameters);
					} catch (e) {
						console.log(e.stack);
					}
				}
			}
		}
	};

	/**
	 * 写入一段Buffer
	 * @param {*} buffer Buffer
	 * @param {*} offset 偏移量(默认0)
	 * @param {*} len 长度(默认Buffer.Length - offset)
	 */
	this.put = function (buffer, offset, len) {
		if (offset == undefined) offset = 0;
		if (len == undefined) len = buffer.length - offset;

		//当前缓冲区已经不能满足次数数据了
		if (len + getLen() > _buffer.length) {
			var ex = Math.ceil((len + getLen()) / 1024); //每次扩展1kb
			console.log(
				">> [1]len: " +
					len +
					"; len+getLen(): " +
					(len + getLen()) +
					"; bufferLen: " +
					_buffer.length +
					"; ex: " +
					ex
			);

			var tmp = Buffer.alloc(ex * 1024);
			var exlen = tmp.length - _buffer.length;
			_buffer.copy(tmp);

			if (_putOffset < _readOffset) {
				if (_putOffset <= exlen) {
					tmp.copy(tmp, _buffer.length, 0, _putOffset);
					_putOffset += _buffer.length;
				} else {
					tmp.copy(tmp, _buffer.length, 0, exlen);
					tmp.copy(tmp, 0, exlen, _putOffset);
					_putOffset -= exlen;
				}
			}
			_buffer = tmp;
		}
		console.log(
			">> [2]len: " +
				len +
				"; readOffset: " +
				_readOffset +
				"; putOffset: " +
				_putOffset
		);

		if (getLen() == 0) {
			_putOffset = _readOffset = 0;
		}

		//判断是否会冲破_buffer尾部
		if (_putOffset + len > _buffer.length) {
			//分两次存 一部分存在数据后面 一部分存在数据前面
			var len1 = _buffer.length - _putOffset;
			if (len1 > 0) {
				buffer.copy(_buffer, _putOffset, offset, offset + len1);
				offset += len1;
			}

			var len2 = len - len1;
			buffer.copy(_buffer, 0, offset, offset + len2);
			_putOffset = len2;
		} else {
			console.log(">> [3]len: " + len + "; putOffset_copy1: " + _putOffset);
			buffer.copy(_buffer, _putOffset, offset, offset + len);

			_putOffset += len;
			console.log(">> [4]len: " + len + "; putOffset_copy2: " + _putOffset);
		}

		var count = 0;
		while (true) {
			count++;
			if (count > 1000) break; //1000次还没读完??
			if (_dlen == 0) {
				if (getLen() < _headLen) {
					break; //连包头都读不了
				}
				console.log(
					"[1]buffer.length: " +
						_buffer.length +
						"; readOffset: " +
						_readOffset +
						"; headLen: " +
						_headLen +
						"; readMethod: " +
						_readMethod
				);

				if (_buffer.length - _readOffset >= _headLen) {
					_dlen = _buffer[_readMethod](_readOffset);
				} else {
					var hbuf = Buffer.alloc(_headLen);

					var rlen = 0;
					for (var i = 0; i < _buffer.length - _readOffset; i++) {
						hbuf[i] = _buffer[_readOffset++];
						rlen++;
					}

					_readOffset = 0;
					for (var i = 0; i < _headLen - rlen; i++) {
						hbuf[rlen + i] = _buffer[_readOffset++];
					}
					_dlen = hbuf[_readMethod](0);
				}
			}
			console.log(">> dlen: " + _dlen + "; unreadLen: " + getLen());
			console.log(
				">> putOffset: " + _putOffset + "; readOffset: " + _readOffset
			);

			if (getLen() >= _dlen) {
				console.log("[2]buffer.length:" + _buffer.length);

				var dbuff = Buffer.alloc(_dlen);
				if (_readOffset + _dlen > _buffer.length) {
					var len1 = _buffer.length - _readOffset;
					if (len1 > 0) {
						_buffer.copy(dbuff, 0, _readOffset, _readOffset + len1);
					}

					_readOffset = 0;
					var len2 = _dlen - len1;
					_buffer.copy(dbuff, len1, _readOffset, (_readOffset += len2));
				} else {
					console.log("[2]dlen:" + _dlen);
					console.log("[2]readOffset:" + _readOffset);
					_buffer.copy(dbuff, 0, _readOffset, (_readOffset += _dlen));
				}
				console.log("[2]readOffset2:" + _readOffset);
				try {
					_dlen = 0;
					self.emit("data", dbuff);
					if (_readOffset === _putOffset) {
						console.log("_readOffset === _putOffset=" + _readOffset);
						break;
					}
				} catch (e) {
					self.emit("error", e);
				}
			} else {
				break;
			}
		}
	};

	/**
	 * 获取现有数据长度(未处理数据)
	 * @returns
	 */
	function getLen() {
		if (_putOffset >= _readOffset) {
			return _putOffset - _readOffset;
		}
		return _buffer.length - _readOffset + _putOffset;
	}
};

module.exports = exports = ExBuffer;

/****************************************************************
 //构造一个ExBuffer，采用4个字节（uint32无符号整型）表示包长，而且是little endian 字节序
 var exBuffer = new ExBuffer().uint32Head().littleEndian();
 //或者构造一个ExBuffer，采用2个字节（ushort型）表示包长，而且是big endian 字节序 (默认)
 var exBuffer = new ExBuffer().ushortHead().bigEndian();
 //只要收到满足的包就会触发事件
 exBuffer.on('data',function(buffer){
    console.log('>> receive data,length:'+buffer.length);
    console.log(buffer);
});
 //传入一个9字节长的数据，分多次put （对应于TCP中的分包的情况）
 exBuffer.put(new Buffer([0,9]));
 exBuffer.put(new Buffer([1,2,3,4,5,6,7]));
 exBuffer.put(new Buffer([8,9]));
 //传入一个3个字节的数据和一个6个字节的数据，一次put（对应于TCP中的粘包的情况）
 exBuffer.put(new Buffer([0,3,1,2,3,0,6,1,2,3,4,5,6]));
 ****************************************************************/
