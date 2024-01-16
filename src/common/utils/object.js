import logger from "../logManagement";
import { isArray, isEmpty, isNullOrUndefined, isObject, isString } from "./default";

export default {
	keys: logger.decorator(objectKeys, "tool-object-keys"),
	clone: logger.decorator(objectClone, "tool-object-clone"),
	merge: logger.decorator(objectDeepMerge, "tool-object-deep-merge"),
	transpose: logger.decorator(objectTranspose, "tool-object-transpose"),
	propertyValue: logger.decorator(objectPropertyValue, "tool-object-property-value"),
	hasOwn: logger.decorator(objectHasOwn, "tool-object-has-own"),
	hasOwns: logger.decorator(objectHasOwns, "tool-object-has-owns"),
	namespace: logger.decorator(namespace, "tool-namespace"),
	existNamespace: logger.decorator(isExistNamespace, "tool-is-exist-namespace"),
};

/**
 * 交换数组或对象中指定索引的两个元素的值。
 * @param {Array|Object} array 要操作的数组或对象。
 * @param {number|string} index1 要交换的第一个元素的索引。
 * @param {number|string} index2 要交换的第二个元素的索引。
 *
 * @example
 * var arr = [1, 2, 3, 4, 5];
 * objectTranspose(arr, 1, 3);
 * console.log(arr); // [1, 4, 3, 2, 5]
 *
 * var obj = { a: 10, b: 20, c: 30 };
 * objectTranspose(obj, 'b', 'c');
 * console.log(obj); // { a: 10, b: 30, c: 20 }
 */
export function objectTranspose(array, index1, index2) {
	if (!isArray(array) && !isObject(array)) {
		logger.error("[objectTranspose] 参数异常：array<${0}>必须是数组类型和对象类型.", JSON.stringify(array));
		return;
	}

	if (isArray(array) && (!array[index1] || !array[index2])) {
		logger.error("[objectTranspose] 参数异常：array<${0}>不存在索引<${1}>或者$索引<{2}>.", JSON.stringify(array), index1, index2);
		return;
	}

	if (isObject(array) && (!array.hasOwnProperty(index1) || !array.hasOwnProperty(index2))) {
		logger.error("[objectTranspose] 参数异常：array<${0}>不存在属性<${1}>或者$属性<{2}>.", JSON.stringify(array), index1, index2);
		return;
	}

	var temp = array[index1];
	array[index1] = array[index2];
	array[index2] = temp;
}

/**
 * 获取对象的所有键名
 * @param {Object} object 目标对象
 * @returns {Array} 包含对象所有键名的数组
 *
 * @example
 * var obj = { name: "John", age: 30, city: "New York" };
 * var keys = objectKeys(obj);
 * console.log(keys); // 输出 ["name", "age", "city"]
 *
 * @example
 * var obj = { 1: "one", 2: "two", 3: "three" };
 * var keys = objectKeys(obj);
 * console.log(keys); // 输出 ["1", "2", "3"]
 */
export function objectKeys(object) {
	if (!isObject(object)) {
		logger.error("[objectKeys] 参数异常：object<${0}>必须是对象类型.", JSON.stringify(object));
		return;
	}

	var keys = [];
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			// 将键名转为字符串，并添加到数组中
			keys.push(key.toString());
		}
	}

	return keys;
}

/**
 * 克隆一个对象
 * @param {Object} object 要克隆的对象
 * @returns {Object} 克隆后生成的新对象
 *
 * @example
 * var obj = { name: "John", age: 30 };
 * var cloneObj = objectClone(obj);
 * console.log(cloneObj); // 输出 { name: "John", age: 30 }
 *
 * @example
 * var arr = [1, 2, 3];
 * var cloneArr = objectClone(arr);
 * console.log(cloneArr); // 输出 [1, 2, 3]
 */
export function objectClone(object) {
	if (!isArray(object) && !isObject(object)) {
		logger.error("[objectClone] 参数异常：object<${0}>必须是数组类型和对象类型.", JSON.stringify(object));
		return;
	}

	var targetObject;
	if (isObject(object)) {
		if (isEmpty(object)) {
			// 如果目标对象为null，则直接赋值为null
			targetObject = null;
		} else {
			if (isArray(object)) {
				// 如果目标对象是数组，则深层克隆数组内的每个元素
				targetObject = [];
				for (var i = 0, len = object.length; i < len; i++) {
					targetObject.push(objectClone(object[i]));
				}
			} else {
				// 如果目标对象是普通对象，则深层克隆所有键值对
				targetObject = {};
				for (var key in object) {
					if (Object.prototype.hasOwnProperty.call(object, key)) {
						targetObject[key] = objectClone(object[key]);
					}
				}
			}
		}
	} else {
		// 如果目标对象不是对象类型，则直接返回目标对象本身
		targetObject = object;
	}

	return targetObject;
}

/**
 * 深层合并对象函数，将一个对象的属性递归地合并到另一个对象中。
 *
 * @param {Object} target 目标对象，属性将被合并到该对象中。
 * @param {Object} source 源对象，其属性将被合并到目标对象中。
 * @param {boolean} overwrite 可选参数，指示是否覆盖目标对象中已有的属性，默认为 true。
 * @param {boolean} deep 可选参数，指示是否进行深层合并，默认为 true。如果为 false，则只进行浅层合并。
 *
 * @returns {Object} 合并后的目标对象。
 *
 * @example
 * const target = { a: { b: 1 } };
 * const obj = { a: { c: 2 } };
 *
 * // 使用深层合并将 obj 的属性合并到 target 中
 * const merged = objectDeepMerge(target, obj);
 * console.log(merged); // 输出：{ a: { b: 1, c: 2 } }
 *
 * @example
 * const user = {
 *   name: 'John',
 *   address: {
 *     city: 'New York',
 *     country: 'USA'
 *   }
 * };
 * const updates = {
 *   address: {
 *     city: 'San Francisco'
 *   },
 *   age: 30
 * };
 *
 * // 使用深层合并将 updates 的属性合并到 user 中，更新地址的城市和添加年龄属性
 * objectDeepMerge(user, updates);
 * console.log(user);
 * // 输出：
 * // {
 * //   name: 'John',
 * //   address: {
 * //     city: 'San Francisco',
 * //     country: 'USA'
 * //   },
 * //   age: 30
 * // }
 */
export function objectDeepMerge(target, source, overwrite = true, deep = true) {
	if (!isObject(target)) {
		logger.error("[objectDeepMerge] 参数异常：target<${0}>必须是对象类型.", JSON.stringify(target));
		return target;
	}

	if (!isObject(source)) {
		logger.error("[objectDeepMerge] 参数异常：source<${0}>必须是对象类型.", JSON.stringify(source));
		return target;
	}

	overwrite = !!overwrite;
	deep = !!deep;

	var props = Object.keys(source);
	for (var i = 0, len = props.length; i < len; i++) {
		if (target.hasOwnProperty(props[i]) && !overwrite) {
			continue;
		}

		if (deep && isObject(obj[props[i]])) {
			target[props[i]] = {};
			objectDeepMerge(target[props[i]], obj[props[i]], overwrite, deep);
		} else {
			target[props[i]] = obj[props[i]];
		}
	}

	return target;
}

/**
 * 从目标对象中获取指定路径的属性值
 *
 * @param {Object} target 目标对象
 * @param {string} path 属性路径，以点号分隔
 * @param {boolean} [validate=false] 是否验证路径的有效性，默认为 false
 * @return {*} 属性值
 *
 * @example
 * // 示例一：获取单层属性值
 * const obj = {
 *   name: 'John',
 *   age: 30,
 * };
 * const name = objectPropertyValue(obj, 'name');
 * console.log(name); // 输出: John
 *
 * @example
 * // 示例二：获取多层嵌套属性值
 * const obj2 = {
 *   person: {
 *     name: 'Alice',
 *     age: 25,
 *   },
 * };
 * const age = objectPropertyValue(obj2, 'person.age');
 * console.log(age); // 输出: 25
 *
 * @example
 * // 示例三：验证路径有效性
 * const obj3 = {
 *   a: {
 *     b: {
 *       c: 'Hello World',
 *     },
 *   },
 * };
 * const value = objectPropertyValue(obj3, 'a.b.d', true);
 * console.log(value); // 输出: undefined，因为路径 'a.b.d' 无效
 */
export function objectPropertyValue(target, path = "", valid = false) {
	if (!isObject(target)) {
		logger.error("[objectPropertyValue] 参数异常：target<${0}>必须是对象类型.", JSON.stringify(target));
		return;
	}

	if (!target || isEmpty(path)) return;

	let effective = /^(\w|\d|\$)(\w|\d|\$|-)*(\.(\w|\d|\$)(\w|\d|\$|-)*)*$/.test(path);
	if (valid && !effective) return;

	let paths = path.split(".");
	let currentModel = target;
	let value;
	for (let i = 0; i < paths.length; i++) {
		let key = paths[i];
		currentModel = currentModel[key];
		if (isEmpty(currentModel) && i < paths.length - 1) break;
		if (i === paths.length - 1) value = currentModel;
	}

	return value;
}

/**
 * 检查对象是否具有指定属性的函数
 *
 * @param {Object} object 要检查的对象
 * @param {string} prop 要检查的属性名
 * @returns {boolean} 如果对象具有指定属性，则返回true；否则返回false
 *
 * @example
 * // 示例1: 检查对象是否具有指定属性
 * var person = { name: 'John', age: 25 };
 *
 * console.log(hasOwn(person, 'name')); // 输出: true
 * console.log(hasOwn(person, 'age')); // 输出: true
 * console.log(hasOwn(person, 'city')); // 输出: false
 *
 * @example
 * // 示例2: 检查对象是否具有继承属性
 * function Person() {
 *   name = 'John';
 * }
 *
 * Person.prototype.age = 25;
 *
 * var john = new Person();
 *
 * console.log(hasOwn(john, 'name')); // 输出: true
 * console.log(hasOwn(john, 'age')); // 输出: false
 */
export function objectHasOwn(object, prop) {
	if (!isObject(target)) {
		logger.error("[objectHasOwn] 参数异常：target<${0}>必须是对象类型.", JSON.stringify(target));
		return;
	}

	return Object.prototype.hasOwnProperty.call(object, prop);
}

/**
 * 检查对象是否具有一组指定属性的函数
 *
 * @param {Object} object 要检查的对象
 * @param {Array} props 要检查的属性名数组
 * @returns {boolean} 如果对象具有全部指定的属性，则返回true；否则返回false
 *
 * @example
 * // 示例1: 检查对象是否具有指定属性
 * var person = { name: 'John', age: 25, city: 'New York' };
 *
 * console.log(hasOwns(person, ['name', 'age'])); // 输出: true
 * console.log(hasOwns(person, ['name', 'city'])); // 输出: true
 * console.log(hasOwns(person, ['name', 'gender'])); // 输出: false
 */
export function objectHasOwns(object, props) {
	if (!isObject(target)) {
		logger.error("[objectHasOwns] 参数异常：target<${0}>必须是对象类型.", JSON.stringify(target));
		return;
	}

	if (!isArray(props)) {
		logger.error("[objectHasOwns] 参数异常：props<${0}>必须是数组类型.", JSON.stringify(props));
		return;
	}

	let result = true;
	props.forEach(function (prop) {
		if (!objectHasOwn(object, prop)) {
			result = false;
			return false;
		}
	});

	return result;
}

/**
 * 创建命名空间并返回该命名空间的最后一级对象。
 * @param {string} namespace 命名空间名称，使用点号（.）分隔多个层级。
 * @param {Object} root 根对象，在该对象下创建命名空间。
 * @returns {Object} 返回命名空间的最后一级对象。
 *
 * @example
 * var myNamespace = namespace('myApp.helper', window);
 * console.log(myNamespace); // { helper: {} }
 *
 * myNamespace.config = { debug: true };
 * console.log(window.myApp.config); // { debug: true }
 */
export function namespace(namespace, root) {
	if (!isString(namespace)) {
		logger.error("[namespace] 参数异常：namespace<${0}>必须是字符串类型.", JSON.stringify(namespace));
		return;
	}

	if (isNullOrUndefined(root)) {
		logger.error("[namespace] 参数异常：root<${0}>是必须的.", JSON.stringify(root));
		return;
	}

	if (isEmpty(namespace)) {
		return root;
	}

	var names = namespace.split(".");
	names.forEach(function (name) {
		if (root.hasOwnProperty(name)) {
			root = root[name];
		} else {
			root[name] = {};
			root = root[name];
		}
	});

	return root;
}

/**
 * 检查命名空间是否存在。
 * @param {string} namespace 命名空间名称，使用点号（.）分隔多个层级。
 * @param {Object} root 根对象，要检查命名空间是否存在的对象。
 * @returns {boolean} 如果命名空间存在则返回 true，否则返回 false。
 *
 * @example
 * var myApp = {
 *   helper: {
 *     config: {
 *       debug: true
 *     }
 *   }
 * };
 *
 * console.log(isExistNamespace('myApp')); // true
 * console.log(isExistNamespace('myApp.helper')); // true
 * console.log(isExistNamespace('myApp.config')); // true
 * console.log(isExistNamespace('myApp.tools')); // false
 */
export function isExistNamespace(namespace, root) {
	if (!isString(namespace) || isEmpty(namespace)) {
		logger.error("[isExistNamespace] 参数异常：namespace<${0}>必须是字符串类型.", JSON.stringify(namespace));
		return;
	}

	if (isNullOrUndefined(root)) {
		logger.error("[isExistNamespace] 参数异常：root<${0}>是必须的.", JSON.stringify(root));
		return;
	}

	var names = namespace.split(".");
	for (var i = 0, len = names.length; i < len; i++) {
		if (!root.hasOwnProperty(names[i])) {
			return false;
		}
		root = root[names[i]];
	}

	return true;
}
