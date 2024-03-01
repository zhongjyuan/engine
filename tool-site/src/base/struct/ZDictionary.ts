/**
 * 字典类，用于存储键值对数据。
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class ZDictionary {
	[key: string]: any;
	/**
	 * 创建一个新的字典对象
	 * @constructor
	 */
	constructor() {}

	/**
	 * 判断字典中是否存在指定的键
	 * @param {any} key - 待判断的键
	 * @returns {boolean} 如果字典中存在指定的键，返回 true；否则，返回 false
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.has("key1"); // true
	 * myDict.has("key2"); // false
	 */
	has(key: any): boolean {
		return this.hasOwnProperty(key);
	}

	/**
	 * 设置指定的键值对到字典中
	 * @param {any} key - 键
	 * @param {any} val - 值
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.get("key1"); // "value1"
	 */
	set(key: any, val: any) {
		this[key] = val;
	}

	/**
	 * 获取字典的长度（键值对的数量）
	 * @returns {number} 字典的长度
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.set("key2", "value2");
	 * myDict.length; // 2
	 */
	get length(): number {
		let count = 0;
		for (let k in this) {
			if (k == "__dispatcher" || k == "__list") continue;
			count++;
		}
		return count;
	}

	/**
	 * 删除指定的键值对
	 * @param {any} key - 键
	 * @returns {boolean} 如果成功删除指定的键值对，返回 true；否则，返回 false
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.delete("key1"); // true
	 * myDict.delete("key2"); // false
	 */
	delete(key: any): boolean {
		if (this.has(key)) {
			delete this[key];
			return true;
		}
		return false;
	}

	/**
	 * 获取指定键的值
	 * @param {any} key - 键
	 * @returns {any} 指定键的值，如果键不存在则返回 undefined
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.get("key1"); // "value1"
	 * myDict.get("key2"); // undefined
	 */
	get(key: any): any {
		return this.has(key) ? this[key] : undefined;
	}

	/**
	 * 获取字典中所有的值组成的数组
	 * @returns {any[]} 字典中所有的值组成的数组
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.set("key2", "value2");
	 * myDict.values; // ["value1", "value2"]
	 */
	get values(): any[] {
		let values: any[] = [];
		for (let k in this) {
			if (this.has(k)) {
				if (k == "__dispatcher" || k == "__list") continue;
				values.push(this[k]);
			}
		}
		return values;
	}

	/**
	 * 对字典中的每个键值对执行指定的函数
	 * @param {Function} func - 对每个键值对执行的函数
	 * @example
	 * const myDict = new ZDictionary();
	 * myDict.set("key1", "value1");
	 * myDict.set("key2", "value2");
	 * myDict.forEach((value, key) => {
	 *     console.log(key + ": " + value);
	 * });
	 * // Output:
	 * // "key1: value1"
	 * // "key2: value2"
	 */
	forEach(func: Function) {
		for (let k in this) {
			if (this.has(k)) {
				if (k == "__dispatcher" || k == "__list") continue;
				func(this[k], k);
			}
		}
	}
}
