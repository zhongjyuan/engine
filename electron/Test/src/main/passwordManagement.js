/**导入electron的安全存储模块 */
const safeStorage = require("electron").safeStorage;

/**
 * 密码管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日19:30:21
 */
const passwordManagement = {
	/*
	 * file format:
	 * {
	 *   version: 1,
	 *   credentials: [
	 *     {
	 *       domain:,
	 *       username:,
	 *       password:
	 *     }
	 *   ]
	 * }
	 */

	/**保存密码文件的路径 */
	passwordFilePath: path.join(userDataPath, "passwordStore"),

	/**
	 * 读取保存的密码文件并返回内容
	 * @returns {Object} 保存的密码文件内容
	 */
	readByFile: function () {
		/**文件对象 */
		let file;

		try {
			// 读取密码文件
			file = fs.readFileSync(passwordManagement.passwordFilePath);
		} catch (e) {
			if (e.code !== "ENOENT") {
				console.warn(e);
				throw new Error(e);
			}
		}

		if (file) {
			// 解密密码文件内容并返回
			return JSON.parse(safeStorage.decryptString(file));
		} else {
			return {
				version: 1,
				credentials: [],
			};
		}
	},

	/**
	 * 将内容写入保存的密码文件中
	 * @param {*} content 要写入的内容
	 */
	writeToFile: function (content) {
		// 加密并写入密码文件
		fs.writeFileSync(passwordManagement.passwordFilePath, safeStorage.encryptString(JSON.stringify(content)));
	},

	/**
	 * 将账户信息添加到密码文件中
	 * @param {*} account 要添加的账户信息
	 */
	saveCredential: function (account) {
		const fileContent = passwordManagement.readByFile();

		// 删除重复的凭据
		for (let i = 0; i < fileContent.credentials.length; i++) {
			if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
				fileContent.credentials.splice(i, 1);
				i--;
			}
		}

		// 添加账户信息
		fileContent.credentials.push(account);

		passwordManagement.writeToFile(fileContent);
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 处理设置密码的请求
		ipc.handle("credentialStoreSetPassword", async function (event, account) {
			return passwordManagement.saveCredential(account);
		});

		// 处理删除密码的请求
		ipc.handle("credentialStoreDeletePassword", async function (event, account) {
			const fileContent = passwordManagement.readByFile();

			for (let i = 0; i < fileContent.credentials.length; i++) {
				if (fileContent.credentials[i].domain === account.domain && fileContent.credentials[i].username === account.username) {
					fileContent.credentials.splice(i, 1);
					i--;
				}
			}

			return passwordManagement.writeToFile(fileContent);
		});

		// 处理获取账户信息的请求
		ipc.handle("credentialStoreGetCredentials", async function () {
			return passwordManagement.readByFile().credentials;
		});
	},
};

passwordManagement.initialize();
