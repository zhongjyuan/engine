/**
 * 创建一个堆栈对象
 * @param {object} tab - 用于初始化堆栈的标签对象
 */
function Stack(tab) {
	/** 堆栈的最大深度，默认为10 */
	this._depth = 10;

	if (tab) {
		this._stack = tab.stack;
	} else {
		this._stack = [];
	}
}

/**
 * 将标签对象推入堆栈
 * @param {object} tab - 要推入堆栈的标签对象
 */
Stack.prototype.push = function (tab) {
	// 不存储私有标签或空标签
	if (tab.private || tab.url === "") {
		return;
	}

	// 如果堆栈已达到最大深度，则移除堆栈底部的元素
	if (this._stack.length >= this._depth) {
		this._stack.shift();
	}

	this._stack.push(tab); // 将新的标签对象推入堆栈顶部
};

/**
 * 弹出并返回堆栈顶部的标签对象
 * @returns {object} - 弹出的标签对象
 */
Stack.prototype.pop = function () {
	return this._stack.pop();
};

// /**
//  * 堆栈对象(存储历史标签页)
//  * @author zhongjyuan
//  * @email zhognjyuan@outlook.com
//  * @website http://zhongjyuan.club
//  * @date 2023年12月19日19:50:45
//  */
// class Stack {
// 	/**
// 	 * 构造函数
// 	 * @param {*} tab 标签页对象
// 	 */
// 	constructor(tab) {
// 		/**堆栈的最大深度，默认为10 */
// 		this._depth = 10;

// 		if (tab) {
// 			this._stack = tab.stack;
// 		} else {
// 			this._stack = [];
// 		}
// 	}

// 	/**
// 	 * 获取堆栈的最大深度
// 	 */
// 	get depth() {
// 		return this._depth;
// 	}

// 	/**
// 	 * 设置堆栈的最大深度
// 	 * @param {number} value 最大深度值
// 	 */
// 	set depth(value) {
// 		this._depth = value;
// 	}

// 	/**
// 	 * 获取堆栈内容
// 	 */
// 	get stack() {
// 		return this._stack;
// 	}

// 	/**
// 	 * 设置堆栈内容
// 	 * @param {array} value 堆栈内容数组
// 	 */
// 	set stack(value) {
// 		this._stack = value;
// 	}

// 	/**
// 	 * 将标签页对象推入堆栈
// 	 * @param {*} tab 标签页对象
// 	 */
// 	push(tab) {
// 		// 不存储私密标签页或空白标签页
// 		if (tab.private || tab.url === "") {
// 			return;
// 		}

// 		// 移除最早添加的标签页
// 		if (this._stack.length >= this._depth) {
// 			this._stack.shift();
// 		}

// 		// 将标签页添加到堆栈末尾
// 		this._stack.push(tab);
// 	}

// 	/**
// 	 * 从堆栈中弹出一个标签页对象
// 	 * @returns {*} 弹出的标签页对象
// 	 */
// 	pop() {
// 		// 弹出堆栈末尾的标签页
// 		return this._stack.pop();
// 	}
// }

/**导出Stack对象 */
module.exports = Stack;
