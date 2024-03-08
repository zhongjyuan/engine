import { storageKey } from "@common/utils/storage";

/**
 * 存储管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @param {string} storage 存储对象名称
 *                        可选值："localStorage"、"sessionStorage"
 */
export default class StorageManagement {
	/**
	 * 存储管理对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} storage 存储对象
	 */
	constructor(storage) {
		this.storage = storage;
	}

	/**
	 * 设置存储键
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} key 存储键
	 */
	set(key) {
		// 获取已存在的存储键列表
		let keys = this.getParse();
		// 将传入的键生成带后缀的存储键并添加到列表中
		keys.push(storageKey(key));
		// 去除重复的存储键
		keys = Array.from(new Set([...keys]));
		// 将更新后的存储键列表存储在指定的存储对象中
		window[this.storage].setItem(storageKey("window_" + this.storage + "_manage_keys"), JSON.stringify(keys));
	}

	/**
	 * 获取存储键列表值
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 */
	get() {
		return window[this.storage].getItem(storageKey("window_" + this.storage + "_manage_keys"));
	}

	/**
	 * 移除指定存储键及其对应的值
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} key 存储键
	 */
	remove(key) {
		// 获取已存在的存储键列表
		let keys = this.getParse();
		// 过滤掉要移除的存储键
		keys = keys.filter((k) => k !== storageKey(key));
		// 从存储对象中移除指定存储键及其对应的值
		window[this.storage].removeItem(storageKey(key));
		// 更新存储键列表
		window[this.storage].setItem(storageKey("window_" + this.storage + "_manage_keys"), JSON.stringify(keys));
	}

	/**
	 * 获取解析后的存储键列表
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 */
	getParse() {
		// 获取存储键列表
		let keys = this.get();
		// 若存在存储键列表，则进行解析并返回
		return keys ? JSON.parse(keys) : [];
	}

	/**
	 * 清除存储对象中的所有存储键及对应的值
	 */
	clear() {
		// 获取已存在的存储键列表
		let keys = this.getParse();
		// 遍历存储键列表，逐一移除对应的存储键和值
		for (let key of keys) {
			window[this.storage].removeItem(key);
		}
		// 清空存储键列表
		window[this.storage].removeItem(storageKey("window_" + this.storage + "_manage_keys"));
	}
}
