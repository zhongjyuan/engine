/**
 * 去重
 * @author zhongjyuan
 * @date   2023年5月12日10:09:18
 * @email  zhongjyuan@outlook.com
 * @param {*} array 目标数组
 * @returns
 */
Array.unique = function(array) {
	if (!Array.isArray(array)) {
		throw new TypeError("The parameter must be an array");
	}
	var res = [];
	for (var i = 0, len = array.length; i < len; i++) {
		var current = array[i];
		if (res.indexOf(current) === -1) {
			res.push(current);
		}
	}

	return res;
};

/**
 * 是否存在
 * @author zhongjyuan
 * @date   2023年5月12日10:11:24
 * @email  zhongjyuan@outlook.com
 * @param {*} array 目标数组
 * @param {*} object 目标对象
 * @returns
 */
Array.exist = function(array, object) {
	if (!Array.isArray(array)) {
		throw new TypeError("The second parameter must be an array");
	}
	for (var i = 0; i < array.length; i++) {
		var thisEntry = array[i];
		if (thisEntry == object) {
			// 使用双等号实现宽松比较，可以自动转换字符串数字类型
			return true;
		}
	}
	return false;
};

/**
 * 随机排列
 * @author zhongjyuan
 * @date   2023年5月13日17:47:54
 * @email  zhongjyuan@outlook.com
 * @param {*} array 目标数组
 * @returns
 */
Array.shuffle = function(array) {
	if (!Array.isArray(array)) {
		throw new TypeError("The second parameter must be an array");
	}

	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};
