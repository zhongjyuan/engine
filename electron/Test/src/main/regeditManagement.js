/**`regedit` 模块，用于操作 Windows 注册表 */
var regedit = require("regedit");

/**当前程序的安装路径 */
const installPath = process.execPath;

/**
 * 注册表管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月14日18:37:28
 */
const regeditManagement = {
	/**
	 * 注册表项键值
	 */
	keys: [
		"HKCU\\Software\\Classes\\WorkBench", // 创建 WorkBench 的类别（Class）
		"HKCU\\Software\\Classes\\WorkBench\\Application", // 创建 WorkBench 应用程序的类别
		"HKCU\\Software\\Classes\\WorkBench\\DefaulIcon", // 创建 WorkBench 的默认图标
		"HKCU\\Software\\Classes\\WorkBench\\shell\\open\\command", // 创建打开 WorkBench 的命令
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities\\FileAssociations", // 创建 WorkBench 的文件关联
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities\\StartMenu", // WorkBench Min 的开始菜单项
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities\\URLAssociations", // 创建 WorkBench 的 URL 关联
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\DefaultIcon", // 创建 WorkBench 的默认图标
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\InstallInfo", // 创建 WorkBench 的安装信息
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\shell\\open\\command", // 创建打开 WorkBench 的命令
	],

	/**
	 * 配置函数，用于设置注册表项的键值对
	 */
	config: {
		"HKCU\\Software\\RegisteredApplications": {
			WorkBench: {
				value: "Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities", // 定义 WorkBench 的能力
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Classes\\WorkBench": {
			default: {
				value: "WorkBench Browser Document", // 定义默认值
				type: "REG_DEFAULT", // 指定键值的类型为默认值
			},
		},
		"HKCU\\Software\\Classes\\WorkBench\\Application": {
			ApplicationIcon: {
				value: installPath + ",0", // 应用程序图标路径和索引
				type: "REG_SZ", // 指定键值的类型为字符串
			},
			ApplicationName: {
				value: "WorkBench", // 应用程序名称
				type: "REG_SZ", // 指定键值的类型为字符串
			},
			AppUserModelId: {
				value: "WorkBench", // 应用程序 ID
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Classes\\WorkBench\\DefaulIcon": {
			ApplicationIcon: {
				value: installPath + ",0", // 应用程序图标路径和索引
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Classes\\WorkBench\\shell\\open\\command": {
			default: {
				value: '"' + installPath + '" "%1"', // 打开 Min 的命令
				type: "REG_DEFAULT", // 指定键值的类型为默认值
			},
		},
		"HKCU\\Software\\Classes\\.htm\\OpenWithProgIds": {
			Min: {
				value: "Empty", // 定义空值
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Classes\\.html\\OpenWithProgIds": {
			Min: {
				value: "Empty", // 定义空值
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities\\FileAssociations": {
			".htm": {
				value: "WorkBench", // 定义文件关联
				type: "REG_SZ", // 指定键值的类型为字符串
			},
			".html": {
				value: "WorkBench", // 定义文件关联
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities\\StartMenu": {
			StartMenuInternet: {
				value: "WorkBench", // 定义开始菜单项
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\Capabilities\\URLAssociations": {
			http: {
				value: "WorkBench", // 定义 URL 关联
				type: "REG_SZ", // 指定键值的类型为字符串
			},
			https: {
				value: "WorkBench", // 定义 URL 关联
				type: "REG_SZ", // 指定键值的类型为字符串
			},
		},
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\DefaultIcon": {
			default: {
				value: installPath + ",0", // 默认图标路径和索引
				type: "REG_DEFAULT", // 指定键值的类型为默认值
			},
		},
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\InstallInfo": {
			IconsVisible: {
				value: 1, // 定义键值为 1
				type: "REG_DWORD", // 指定键值的类型为整数
			},
		},
		"HKCU\\Software\\Clients\\StartMenuInternet\\WorkBench\\shell\\open\\command": {
			default: {
				value: installPath, // 打开 Min 的命令
				type: "REG_DEFAULT", // 指定键值的类型为默认值
			},
		},
	},

	/**
	 * 安装函数，用于创建注册表键值对并设置值
	 * @returns {Promise} 返回一个 Promise 对象，用于异步操作
	 */
	install: function () {
		// 返回一个 Promise 对象，用于异步操作
		return new Promise(function (resolve, reject) {
			// 创建注册表键值对
			regedit.createKey(regeditManagement.keys, function (err) {
				if (err) {
					// 如果出错，则返回 reject
					reject(err);
				} else {
					// 如果成功，则设置键值对的值
					regedit.putValue(regeditManagement.config, function (err) {
						if (err) {
							// 如果出错，则返回 reject
							reject(err);
						} else {
							// 如果成功，则返回 resolve
							resolve();
						}
					});
				}
			});
		});
	},

	/**
	 * 卸载函数，用于删除注册表键值对
	 * @returns {Promise} 返回一个 Promise 对象，用于异步操作
	 */
	uninstall: function () {
		// 返回一个 Promise 对象，用于异步操作
		return new Promise(function (resolve, reject) {
			// 删除注册表键值对
			regedit.deleteKey(regeditManagement.keys, function (err) {
				if (err) {
					// 如果出错，则返回 reject
					reject(err);
				} else {
					// 如果成功，则返回 resolve
					resolve();
				}
			});
		});
	},
};
