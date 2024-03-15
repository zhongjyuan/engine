/*
Js 数组的删除操作
 */

//经常用的是通过遍历,重构数组.
Array.prototype.remove = function (dx) {
	if (isNaN(dx) || dx > this.length) {
		return false;
	}
	for (var i = 0, n = 0; i < this.length; i++) {
		if (this[i] != this[dx]) {
			this[n++] = this[i];
		}
	}
	this.length -= 1;
};

//在数组中获取指定值的元素索引
Array.prototype.getIndexByValue = function (value) {
	var index = -1;
	for (var i = 0; i < this.length; i++) {
		if (this[i] == value) {
			index = i;
			break;
		}
	}
	return index;
};

Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};
