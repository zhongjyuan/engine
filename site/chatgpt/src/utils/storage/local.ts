import { deCrypto, enCrypto } from "../crypto";

// 定义存储数据的接口
interface StorageData<T = any> {
	data: T;
	expire: number | null;
}

// 创建本地存储实例的函数
export function createLocalStorage(options?: {
	expire?: number | null;
	crypto?: boolean;
}) {
	const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7; // 默认缓存时间为一周

	// 解构选项对象，设置默认值
	const { expire, crypto } = Object.assign(
		{
			expire: DEFAULT_CACHE_TIME,
			crypto: true,
		},
		options
	);

	// 设置本地存储数据的函数
	function set<T = any>(key: string, data: T) {
		const storageData: StorageData<T> = {
			data,
			expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
		};

		const json = crypto ? enCrypto(storageData) : JSON.stringify(storageData);
		window.localStorage.setItem(key, json);
	}

	// 获取本地存储数据的函数
	function get(key: string) {
		const json = window.localStorage.getItem(key);
		if (json) {
			let storageData: StorageData | null = null;

			try {
				storageData = crypto ? deCrypto(json) : JSON.parse(json);
			} catch {
				// 防止解析失败
			}

			if (storageData) {
				const { data, expire } = storageData;
				if (expire === null || expire >= Date.now()) return data;
			}

			remove(key);
			return null;
		}
	}

	// 移除本地存储数据的函数
	function remove(key: string) {
		window.localStorage.removeItem(key);
	}

	// 清空本地存储的函数
	function clear() {
		window.localStorage.clear();
	}

	return {
		set,
		get,
		remove,
		clear,
	};
}

// 创建默认的本地存储实例 ls
export const ls = createLocalStorage();

// 创建不加密且没有过期时间限制的本地存储实例 ss
export const ss = createLocalStorage({ expire: null, crypto: false });
