// 内置密码管理器的类实现，用于管理浏览器的内置密码管理器。

/**
 * Keychain 管理对象(表示内置密码管理器)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日10:06:21
 */
class KeychainManagement {
	/**
	 * 构造函数，初始化Keychain实例
	 */
	constructor() {
		/** 名称 */
		this.name = "Built-in password manager";
	}

	/**
	 * 获取下载链接
	 * @returns 下载链接
	 */
	getDownloadLink() {
		return null;
	}

	/**
	 * 获取本地路径
	 * @returns 本地路径
	 */
	getLocalPath() {
		return null;
	}

	/**
	 * 获取设置模式
	 * @returns 设置模式
	 */
	getSetupMode() {
		return null;
	}

	/**
	 * 检查是否已配置内置密码管理器
	 * @returns 是否已配置
	 */
	async checkIfConfigured() {
		return true;
	}

	/**
	 * 判断密码存储是否已解锁
	 * @returns 是否已解锁
	 */
	isUnlocked() {
		return true;
	}

	/**
	 * 获取凭据建议
	 * @param {*} domain 域名
	 * @returns 凭据建议列表
	 */
	async getSuggestions(domain) {
		return window.ipc.invoke("credentialStoreGetCredentials").then(function (results) {
			return results
				.filter(function (result) {
					return result.domain === domain;
				})
				.map(function (result) {
					return {
						...result,
						manager: "Keychain",
					};
				});
		});
	}

	/**
	 * 保存凭据
	 * @param {*} domain 域名
	 * @param {*} username 用户名
	 * @param {*} password 密码
	 */
	saveCredential(domain, username, password) {
		window.ipc.invoke("credentialStoreSetPassword", { domain, username, password });
	}

	/**
	 * 删除凭据
	 * @param {*} domain 域名
	 * @param {*} username 用户名
	 */
	deleteCredential(domain, username) {
		window.ipc.invoke("credentialStoreDeletePassword", { domain, username });
	}

	/**
	 * 获取所有凭据
	 * @returns 凭据列表
	 */
	getAllCredentials() {
		return window.ipc.invoke("credentialStoreGetCredentials").then(function (results) {
			return results.map(function (result) {
				return {
					...result,
					manager: "Keychain",
				};
			});
		});
	}
}

module.exports = KeychainManagement;
