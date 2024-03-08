import logger from "@base/logger";
import { sort as sortConsts } from "@common/consts/default";
import { isArray, isBoolean, isObject } from "./default";

export default {
	up: logger.decorator(arrayUp, "tool-array-up"),
	down: logger.decorator(arrayDown, "tool-array-down"),
	swap: logger.decorator(arraySwap, "tool-array-swap"),
	sort: logger.decorator(arraySort, "tool-array-sort"),
	merge: logger.decorator(arrayMerge, "tool-array-merge"),
	weight: logger.decorator(arrayWeight, "tool-array-weight"),
	unique: logger.decorator(arrayUnique, "tool-array-unique"),
	shuffle: logger.decorator(arrayShuffle, "tool-array-shuffle"),
	transpose: logger.decorator(arrayTranspose, "tool-array-transpose"),
};

/**
 * 交换数组或对象中指定索引的两个元素的值。
 * @param {Array|Object} array 要操作的数组或对象。
 * @param {number|string} index1 要交换的第一个元素的索引。
 * @param {number|string} index2 要交换的第二个元素的索引。
 *
 * @example
 * var arr = [1, 2, 3, 4, 5];
 * arrayTranspose(arr, 1, 3);
 * console.log(arr); // [1, 4, 3, 2, 5]
 *
 * var obj = { a: 10, b: 20, c: 30 };
 * arrayTranspose(obj, 'b', 'c');
 * console.log(obj); // { a: 10, b: 30, c: 20 }
 */
export function arrayTranspose(array, index1, index2) {
	if (!isArray(array) && !isObject(array)) {
		logger.error("[arrayTranspose] 参数异常：array<${0}>必须是数组类型或对象类型.", JSON.stringify(array));
		return;
	}

	if (isArray(array) && (!array[index1] || !array[index2])) {
		logger.error("[arrayTranspose] 参数异常：array<${0}>不存在索引${1}或索引${2}.", JSON.stringify(array), index1, index2);
		return;
	}

	if (isObject(array) && (!array.hasOwnProperty(index1) || !array.hasOwnProperty(index2))) {
		logger.error("[arrayTranspose] 参数异常：array<${0}>不存在属性${1}或属性${2}.", JSON.stringify(array), index1, index2);
		return;
	}

	var temp = array[index1];
	array[index1] = array[index2];
	array[index2] = temp;
}

/**
 * 交换数组中两个元素的位置
 * @param {Array} array 要进行交换操作的数组
 * @param {number} sourceIndex 源元素的索引
 * @param {number} targetIndex 目标元素的索引
 * @returns {Array} 交换后的数组
 *
 * @example
 * var arr = [1, 2, 3, 4, 5];
 * arraySwap(arr, 1, 3); // 返回 [1, 4, 3, 2, 5]
 *
 * @example
 * var arr = ['a', 'b', 'c'];
 * arraySwap(arr, 0, 2); // 返回 ['c', 'b', 'a']
 */
export function arraySwap(array, sourceIndex, targetIndex) {
	if (!isArray(array)) {
		logger.error("[arraySwap] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
		return;
	}

	if (isArray(array) && (!array[sourceIndex] || !array[targetIndex])) {
		logger.error("[arraySwap] 参数异常：array<${0}>不存在索引${1}或索引${2}.", JSON.stringify(array), sourceIndex, targetIndex);
		return;
	}

	array[sourceIndex] = array.splice(targetIndex, 1, array[sourceIndex])[0];

	return array;
}

/**
 * 将数组中指定索引的元素向上移动一位
 * @param {Array} array 要进行移动操作的数组
 * @param {number} sourceIndex 要移动的元素的索引
 * @throws {Error} 当输入参数无效时抛出异常
 *
 * @example
 * var arr = [1, 2, 3, 4, 5];
 * arrayUp(arr, 3); // 数组变为 [1, 2, 4, 3, 5]
 *
 * @example
 * var arr = ['a', 'b', 'c'];
 * arrayUp(arr, 1); // 数组变为 ['b', 'a', 'c']
 */
export function arrayUp(array, sourceIndex) {
	if (!isArray(array)) {
		logger.error("[arrayUp] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
		return;
	}

	if (sourceIndex < 1) {
		logger.error("[arrayUp] 参数异常：索引${0}必须大于1.", sourceIndex);
		return;
	}

	if (sourceIndex >= array.length) {
		logger.error("[arrayUp] 参数异常：索引${0}必须在array长度范围内.", sourceIndex);
		return;
	}

	arraySwap(array, sourceIndex, sourceIndex - 1);
}

/**
 * 将数组中指定索引的元素向下移动一位
 * @param {Array} array 要进行移动操作的数组
 * @param {number} sourceIndex 要移动的元素的索引
 * @throws {Error} 当输入参数无效时抛出异常
 *
 * @example
 * var arr = [1, 2, 3, 4, 5];
 * arrayDown(arr, 2); // 数组变为 [1, 3, 2, 4, 5]
 *
 * @example
 * var arr = ['a', 'b', 'c'];
 * arrayDown(arr, 0); // 数组变为 ['b', 'a', 'c']
 */
export function arrayDown(array, sourceIndex) {
	if (!isArray(array)) {
		logger.error("[arrayDown] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
		return;
	}

	if (sourceIndex < 0) {
		logger.error("[arrayDown] 参数异常：索引${0}必须大于0.", sourceIndex);
		return;
	}

	if (sourceIndex >= array.length - 1) {
		logger.error("[arrayDown] 参数异常：索引${0}必须在array长度范围内.", sourceIndex);
		return;
	}

	arraySwap(array, sourceIndex, sourceIndex + 1);
}

/**
 * 对数组进行排序
 * @param {Array} array - 要排序的数组
 * @param {Array|string} fields - 排序字段或字段数组
 * @param {Array} options - 排序选项数组
 * @return {Array} - 排序后的数组
 *
 * @example
 * let arr = [
 *   { name: "John", age: 25 },
 *   { name: "Alice", age: 30 },
 *   { name: "Bob", age: 20 }
 * ];
 *
 * // 示例一：按年龄升序排序
 * arraySort(arr, "age");
 * // Output: [{ name: "Bob", age: 20 }, { name: "John", age: 25 }, { name: "Alice", age: 30 }]
 *
 * // 示例二：先按名称升序排序，再按年龄升序排序
 * arraySort(arr, ["name", "age"]);
 * // Output: [{ name: "Alice", age: 30 }, { name: "Bob", age: 20 }, { name: "John", age: 25 }]
 *
 * // 示例三：按年龄降序排序
 * arraySort(arr, "age", [sortConsts.DESCENDING]);
 * // Output: [{ name: "Alice", age: 30 }, { name: "John", age: 25 }, { name: "Bob", age: 20 }]
 *
 * // 示例四：先按名称升序排序，对名称不区分大小写
 * arraySort(arr, ["name", "age"], [sortConsts.CASEINSENSITIVE]);
 * // Output: [{ name: "Alice", age: 30 }, { name: "Bob", age: 20 }, { name: "John", age: 25 }]
 *
 * // 示例五：按年龄数字降序排序
 * arraySort(arr, "age", [sortConsts.NUMERIC, sortConsts.DESCENDING]);
 * // Output: [{ name: "Alice", age: 30 }, { name: "John", age: 25 }, { name: "Bob", age: 20 }]
 *
 * // 示例六：如果存在重复元素，则返回0，不进行排序
 * arraySort(arr, ["name", "age"], [sortConsts.UNIQUESORT]);
 * // Output: 0
 *
 * // 示例七：按年龄数字升序排序，返回排序后的索引数组
 * arraySort(arr, "age", [sortConsts.NUMERIC, sortConsts.RETURNINDEXEDARRAY]);
 * // Output: [2, 0, 1]
 *
 * // 示例八：按年龄字母升序排序，对字母不区分大小写，返回排序后的索引数组
 * arraySort(arr, "age", [sortConsts.CASEINSENSITIVE, sortConsts.RETURNINDEXEDARRAY]);
 * // Output: [2, 0, 1]
 *
 * // 示例九：按名称字母升序排序，对字母不区分大小写，返回排序后的索引数组
 * arraySort(arr, "name", [sortConsts.CASEINSENSITIVE, sortConsts.RETURNINDEXEDARRAY]);
 * // Output: [1, 2, 0]
 *
 * // 示例十：按年龄降序排序，对字母不区分大小写，返回排序后的索引数组
 * arraySort(arr, "age", [sortConsts.DESCENDING, sortConsts.CASEINSENSITIVE, sortConsts.RETURNINDEXEDARRAY]);
 * // Output: [1, 0, 2]
 */
export const arraySort = (function () {
	/**
	 * 将源数组中的元素添加到目标数组中，去重
	 * @param {Array} target 目标数组
	 * @param {Array} source 源数组
	 * @returns {Array} 去重后的目标数组
	 */
	function addToTargetArrayWithDeduplication(target, source) {
		for (const element of source) {
			addToTargetArrayIfNotContains(target, element); // 调用 addToTargetArrayIfNotContains() 函数将元素添加到目标数组中
		}
		return target;
	}

	/**
	 * 如果目标数组不包含指定对象，则将对象添加到目标数组中
	 * @param {Array} target 目标数组
	 * @param {Object} object 要添加的对象
	 * @returns {Array} 目标数组
	 */
	function addToTargetArrayIfNotContains(target, object) {
		if (!isTargetArrayContains(target, object)) {
			// 检查目标数组是否包含指定对象
			target.push(object); // 将对象添加到目标数组中
		}
		return target;
	}

	/**
	 * 检查目标数组是否包含指定对象
	 * @param {Array} target 目标数组
	 * @param {Object} object 要检查的对象
	 * @returns {boolean} 是否包含指定对象
	 */
	function isTargetArrayContains(target, object) {
		return target.includes(object); // 使用 includes() 方法检查目标数组是否包含指定对象
	}

	/**
	 * 根据字段和排序选项对数组进行筛选
	 * @param {Array} array 要筛选的数组
	 * @param {string} field 筛选的字段
	 * @param {Array} option 排序选项
	 * @returns {boolean} 是否存在重复元素
	 */
	function hasDuplicateElements(array, field, option) {
		let filtered = [];
		if (option & sortConsts.NUMERIC) {
			// 如果排序选项包含 NUMERIC，则将数组元素转为浮点数
			filtered = array.map((item) => parseFloat(item[field]));
		} else if (option & sortConsts.CASEINSENSITIVE) {
			// 如果排序选项包含 CASEINSENSITIVE，则将字符串元素转为小写
			filtered = array.map((item) => item[field].toLowerCase());
		} else {
			// 否则直接使用原始值
			filtered = array.map((item) => item[field]);
		}
		return filtered.length !== addToTargetArrayWithDeduplication([], filtered).length;
	}

	/**
	 * 对两个元素进行排序比较
	 * @param {Object} frontItem 前一个元素
	 * @param {Object} postItem 后一个元素
	 * @param {Array} fields 排序字段数组
	 * @param {Array} options 排序选项数组
	 * @returns {number} 比较结果
	 */
	function compareElementsForSorting(frontItem, postItem, fields, options) {
		return (function recursiveSort(fields, options) {
			let result,
				frontItemValue,
				postItemValue,
				option = options[0],
				sub_fields = fields[0].match(/[^.]+/g); // 将字段拆分为子字段

			(function getValues(subFields, frontItem, postItem) {
				let field = subFields[0];
				if (subFields.length > 1) {
					getValues(subFields.slice(1), frontItem[field], postItem[field]);
				} else {
					frontItemValue = frontItem[field];
					postItemValue = postItem[field];
				}
			})(sub_fields, frontItem, postItem);

			if (option & sortConsts.NUMERIC) {
				// 如果排序选项包含 NUMERIC，则按数值进行比较
				result = parseFloat(frontItemValue) - parseFloat(postItemValue);
			} else {
				if (option & sortConsts.CASEINSENSITIVE) {
					// 如果排序选项包含 CASEINSENSITIVE，则将字符串转换为小写进行比较
					frontItemValue = frontItemValue.toLowerCase();
					postItemValue = postItemValue.toLowerCase();
				}
				result = frontItemValue > postItemValue ? 1 : frontItemValue < postItemValue ? -1 : 0;
			}

			if (result === 0 && fields.length > 1) {
				result = recursiveSort(fields.slice(1), options.slice(1)); // 如果结果相等且还有子字段，则递归比较子字段
			} else if (option & sortConsts.DESCENDING) {
				result *= -1; // 如果排序选项包含 DESCENDING，则反转结果
			}

			return result;
		})(fields, options);
	}

	return function sort(array, fields, options) {
		if (!isArray(array)) {
			logger.error("[arraySort] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
			return;
		}

		fields = isArray(fields) ? fields : [fields];
		options = isArray(options) ? options : [options];

		// 如果选项数量与字段数量不匹配，则重置选项为一个空数组
		if (options.length !== fields.length) {
			logger.warn("[arraySort] 参数警告：fields<${0}>与options<${1}>数量不匹配,选项重置.", JSON.stringify(fields), JSON.stringify(options));
			options = [];
		}

		let hasDuplicate = fields.some(function (field, index) {
			return hasDuplicateElements(array, field, options[index]); // 检查是否存在重复元素
		});

		if (isTargetArrayContains(options, sortConsts.UNIQUESORT) && hasDuplicate) return 0;

		let compareFn = function (frontItem, postItem) {
			return compareElementsForSorting(frontItem, postItem, fields, options); // 比较函数
		};

		let result;
		if (options[0] && sortConsts.RETURNINDEXEDARRAY) {
			result = [...array].sort(compareFn); // 如果排序选项包含 RETURNINDEXEDARRAY，则返回新数组进行排序
		} else {
			result = array.sort(compareFn); // 否则在原数组上进行排序
		}

		return result;
	};
})();

/**
 * 随机打乱数组的顺序
 * @param {Array} arr 要进行打乱操作的数组
 * @returns {Array} 打乱后的数组
 *
 * @example
 * var arr = [1, 2, 3, 4, 5];
 * arrayShuffle(arr); // 可能返回 [3, 1, 5, 2, 4]
 *
 * @example
 * var arr = ['a', 'b', 'c'];
 * arrayShuffle(arr); // 可能返回 ['b', 'c', 'a']
 */
export const arrayShuffle = (function () {
	/**
	 * 获取随机整数
	 * @param {number} max 最大值
	 * @returns {number} 随机整数
	 */
	function getRandom(max) {
		return Math.floor(Math.random() * max);
	}

	/**
	 * Fisher-Yates shuffle 算法随机排序
	 * @param {Array} array 要进行排序的数组
	 * @returns {Array} 排序后的数组
	 */
	function fisherYatesShuffle(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = getRandom(i + 1);
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	/**
	 * 缓存随机排序
	 * @param {Array} source 要进行排序的源数组
	 * @returns {Array} 排序后的新数组
	 */
	function cachedShuffle(source) {
		var seed = []; // 缓存前一个序列的副本
		var target = []; // 保存排序后的数组
		var indexMap = []; // 保存原来顺序的索引

		// 保存原来顺序的索引
		for (var i = 0, len = source.length; i < len; i++) {
			indexMap.push(i);
		}

		fisherYatesShuffle(indexMap); // 使用 Fisher-Yates shuffle 算法进行随机排序

		// 使用索引映射填充新数组
		for (var i = 0, len = source.length; i < len; i++) {
			target.push(source[indexMap[i]]);
			seed.push(target[i]);
		}

		return target;
	}

	return function (array) {
		if (!isArray(array)) {
			logger.error("[arrayShuffle] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
			return;
		}

		var len = array.length;
		if (len <= 5) {
			// 对于长度不超过 5 的数组，使用冒泡排序
			for (var i = 0; i < len - 1; i++) {
				for (var j = i + 1; j < len; j++) {
					if (Math.random() >= 0.5) {
						var temp = array[i];
						array[i] = array[j];
						array[j] = temp;
					}
				}
			}
		} else if (len <= 30) {
			// 对于长度不超过 30 的数组，使用插入排序
			for (var i = 1; i < len; i++) {
				var j = i - 1;
				var key = array[i];
				while (j >= 0 && Math.random() >= 0.5) {
					array[j + 1] = array[j];
					j--;
				}
				array[j + 1] = key;
			}
		} else {
			// 更长的数组使用 Fisher-Yates shuffle 算法进行重排，以及缓存前一个序列
			cachedShuffle.lastSeed = cachedShuffle.lastSeed || [];
			if (JSON.stringify(cachedShuffle.lastSeed) === JSON.stringify(array)) {
				array = cachedShuffle(cachedShuffle.lastTarget);
			} else {
				cachedShuffle.lastSeed = array;
				cachedShuffle.lastTarget = array.slice(0);
				array = cachedShuffle(array);
			}
		}

		return array;
	};
})();

/**
 * 去除数组中的重复元素，返回一个新数组。
 * @param {Array} arr 要去重的数组。
 * @returns {Array} 去重后的新数组。
 *
 * @example
 * var arr = [1, 2, 2, 3, 4, 4, 5];
 * var uniqueArr = arrayUnique(arr);
 * console.log(uniqueArr); // [1, 2, 3, 4, 5]
 */
export function arrayUnique(array) {
	if (!isArray(array)) {
		logger.error("[arrayUnique] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
		return [];
	}

	return [...new Set(array)];
}

/**
 * 合并多个数组，并可选择是否去除重复元素。
 * @param {...Array} arrays 要合并的多个数组。
 * @returns {Array} 合并后的数组。
 *
 * @example
 * var arr1 = [1, 2, 3];
 * var arr2 = [4, 5];
 * var mergedArr = arrayMerge(arr1, arr2);
 * console.log(mergedArr); // [1, 2, 3, 4, 5]
 *
 * var arr3 = [1, 2, 3];
 * var arr4 = [2, 3, 4];
 * var mergedUniqueArr = arrayMerge(arr3, arr4, true);
 * console.log(mergedUniqueArr); // [1, 2, 3, 4]
 */
export function arrayMerge(...arrays) {
	if (!isArray(arrays)) {
		logger.error("[arrayMerge] 参数异常：arrays<${0}>必须是数组类型.", JSON.stringify(arrays));
		return [];
	}

	var result = [];
	let isUnique = false;

	if (arrays.length && isBoolean(arrays[arrays.length - 1])) {
		isUnique = arrays[arrays.length - 1];
		arrays.splice(arrays.length - 1, 1);
	}

	result = Array.prototype.concat.apply(result, arrays);
	return isUnique ? arrayUnique(result) : result;
}

/**
 * 根据给定的权重数组选择一个对应的值
 * @param {Array} array - 值的数组
 * @param {Array} weights - 权重数组
 * @returns {*} - 返回根据权重选择的值
 *
 * @example
 * const fruits = ['apple', 'banana', 'orange'];
 * const weights = [1, 2, 3];
 * console.log(arrayWeight(fruits, weights)); // 根据权重数组选择一个值，如 'orange'
 */
export function arrayWeight(array, weights) {
	if (!isArray(array)) {
		logger.error("[arrayWeight] 参数异常：array<${0}>必须是数组类型.", JSON.stringify(array));
		return [];
	}

	if (!isArray(weights)) {
		logger.error("[arrayWeight] 参数异常：weights<${0}>必须是数组类型.", JSON.stringify(weights));
		return [];
	}

	let sumOfWeights = weights.reduce((acc, val) => acc + val);
	let randomNum = Math.random() * sumOfWeights;

	for (let i = 0; i < array.length; i++) {
		if (randomNum < weights[i]) {
			return array[i];
		}
		randomNum -= weights[i];
	}
}
