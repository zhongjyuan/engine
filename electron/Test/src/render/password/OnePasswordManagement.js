const fs = require("fs");
const path = require("path");

const ProcessSpawner = require("../utils/ProcessSpawner.js");
const versionManagement = require("../utils/versionManagement.js");

const settingManagement = require("../../settings/renderSettingManagement.js");

// 1Password password manager. Requires session key to unlock the vault.

/**
 * OnePasswordManagement 管理对象(表示1Password密码管理)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 22023年12月20日10:06:52
 */
class OnePasswordManagement {
	/**
	 * 构造函数
	 */
	constructor() {
		/** 名称 */
		this.name = "1Password";

		/** 会话密钥 */
		this.sessionKey = null;

		/** 会话密钥创建时间 */
		this.sessionKeyCreated = 0;

		/** 会话密钥生命周期 */
		this.sessionKeyLifetime = 30 * 60 * 1000;

		/** 上一次调用列表 */
		this.lastCallList = {};

		/** 设备ID */
		this.deviceID = settingManagement.get("1passwordDeviceID");

		/** 如果没有设备ID，则创建一个 */
		if (!settingManagement.get("1passwordDeviceID")) {
			settingManagement.set("1passwordDeviceID", this._createDeviceID());
		}
	}

	/**
	 * 创建设备ID
	 * @returns 设备ID
	 */
	_createDeviceID() {
		let out = "";

		const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
		for (let i = 0; i < 26; i++) {
			out += chars[Math.floor(Math.random() * chars.length)];
		}

		return out;
	}

	/**
	 * 获取下载链接
	 * @returns 下载链接
	 */
	getDownloadLink() {
		switch (window.platformType) {
			case "mac":
				return "https://cache.agilebits.com/dist/1P/op2/pkg/v2.2.0/op_apple_universal_v2.2.0.pkg";
			case "windows":
				return "https://cache.agilebits.com/dist/1P/op2/pkg/v2.2.0/op_windows_amd64_v2.2.0.zip";
			case "linux":
				return "https://cache.agilebits.com/dist/1P/op2/pkg/v2.2.0/op_linux_amd64_v2.2.0.zip";
		}
	}

	/**
	 * 获取本地路径
	 * @returns 本地路径
	 */
	getLocalPath() {
		return path.join(window.globalArgs["user-data-path"], "tools", window.platformType === "windows" ? "op.exe" : "op");
	}

	/**
	 * 获取设置模式
	 * @returns 设置模式
	 */
	getSetupMode() {
		return window.platformType === "mac" ? "installer" : "dragdrop";
	}

	// 返回 1Password-CLI 工具路径通过检查可能的位置。
	// 首先它检查工具是否专门针对 Min 安装的，通过检查设置值。如果未设置或者不指向有效的可执行文件，则检查全局是否可用 'op'。

	/**
	 * 获取工具路径
	 * @returns 工具路径
	 */
	async _getToolPath() {
		/**本地路径 */
		const localPath = this.getLocalPath();
		if (localPath) {
			let local = false;

			try {
				await fs.promises.access(localPath, fs.constants.X_OK);
				local = true;
			} catch (e) {}

			if (local) {
				return localPath;
			}
		}

		const global = await new ProcessSpawner("op").checkCommandExists();

		if (global) {
			return "op";
		}

		return null;
	}

	/**
	 * 检查版本
	 * @param {*} command 命令
	 * @returns 是否符合版本要求
	 */
	async _checkVersion(command) {
		const process = new ProcessSpawner(command, ["--version"]);
		const data = await process.executeSyncInAsyncContext();

		return versionManagement.compare("2.2.0", data) >= 0;
	}

	// 检查是否已配置 1Password 集成，尝试获取有效的 1Password-CLI 工具路径。
	/**
	 * 检查是否已配置
	 * @returns 是否已配置
	 */
	async checkIfConfigured() {
		this.path = await this._getToolPath();
		return this.path != null && (await this._checkVersion(this.path));
	}

	// 返回当前的 1Password-CLI 状态。如果有会话密钥，则密码存储被视为已解锁。
	/**
	 * 判断是否已解锁
	 * @returns 是否已解锁
	 */
	isUnlocked() {
		return this.sessionKey !== null && Date.now() - this.sessionKeyCreated < this.sessionKeyLifetime;
	}

	// 尝试为给定的域名获取凭据建议列表。
	/**
	 * 获取凭据建议
	 * @param {*} domain 域名
	 * @returns 凭据建议
	 */
	async getSuggestions(domain) {
		if (this.lastCallList[domain] != null) {
			return this.lastCallList[domain];
		}

		const command = this.path;
		if (!command) {
			return Promise.resolve([]);
		}

		if (!this.isUnlocked()) {
			throw new Error();
		}

		this.lastCallList[domain] = this.loadSuggestions(command, domain)
			.then((suggestions) => {
				this.lastCallList[domain] = null;
				return suggestions;
			})
			.catch((ex) => {
				this.lastCallList[domain] = null;
			});

		return this.lastCallList[domain];
	}

	// 加载给定域名的凭据建议。
	/**
	 * 加载凭据建议
	 * @param {*} command 命令
	 * @param {*} domain 域名
	 * @returns 凭据列表
	 */
	async loadSuggestions(command, domain) {
		try {
			const process = new ProcessSpawner(command, ["item", "list", "--categories", "login", "--session=" + this.sessionKey, "--format=json"], {
				OP_DEVICE: this.deviceID,
			});
			const data = await process.executeSyncInAsyncContext();

			const matches = JSON.parse(data);

			const credentials = matches.filter((match) => {
				try {
					var matchHost = new URL(match.urls.find((url) => url.primary).href).hostname;
					if (matchHost.startsWith("www.")) {
						matchHost = matchHost.slice(4);
					}
					return matchHost === domain;
				} catch (e) {
					return false;
				}
			});

			var expandedCredentials = [];

			for (var i = 0; i < credentials.length; i++) {
				const item = credentials[i];
				const process = new ProcessSpawner(command, ["item", "get", item.id, "--session=" + this.sessionKey, "--format=json"], {
					OP_DEVICE: this.deviceID,
				});
				const output = await process.executeSyncInAsyncContext();
				const credential = JSON.parse(output);

				var usernameFields = credential.fields.filter((f) => f.label === "username");
				var passwordFields = credential.fields.filter((f) => f.label === "password");

				if (usernameFields.length > 0 && passwordFields.length > 0) {
					expandedCredentials.push({
						username: usernameFields[0].value,
						password: passwordFields[0].value,
						manager: "1Password",
					});
				}
			}

			return expandedCredentials;
		} catch (ex) {
			const { error, data } = ex;
			console.error("Error accessing 1Password CLI. STDOUT: " + data + ". STDERR: " + error, ex);
			return [];
		}
	}

	// 尝试使用给定的主密码解锁密码存储。
	/**
	 * 解锁密码存储
	 * @param {*} password 主密码
	 * @returns 是否解锁成功
	 */
	async unlockStore(password) {
		try {
			const process = new ProcessSpawner(this.path, ["signin", "--raw", "--account", "min-autofill"], { OP_DEVICE: this.deviceID }, 5000);
			const result = await process.executeSyncInAsyncContext(password);
			// 没有会话密钥 -> 密码无效
			if (!result) {
				throw new Error();
			}

			this.sessionKey = result;
			this.sessionKeyCreated = Date.now();
			return true;
		} catch (ex) {
			console.error("Error accessing 1Password CLI. ", ex, ex.toString());

			const e = ex.toString().toLowerCase();

			// 如果根本没有注册任何帐户，CLI 将提示添加一个帐户，导致超时
			if (e.includes("etimedout") || e.includes("no account")) {
				await this.signInAndSave();
				return await this.unlockStore(password);
			}

			throw ex;
		}
	}

	/**
	 * 登录并保存
	 * @param {*} path 路径
	 * @returns 是否登录成功并保存
	 */
	async signInAndSave(path = this.path) {
		// 可能已经登录
		const logoutProcess = new ProcessSpawner(path, ["signout"], { OP_DEVICE: this.deviceID }, 5000);
		try {
			await logoutProcess.executeSyncInAsyncContext();
		} catch (e) {
			console.warn(e);
		}

		// 显示凭据对话框
		var signInFields = [
			{ placeholder: l("email"), id: "email", type: "text" },
			{ placeholder: l("password"), id: "password", type: "password" },
			{ placeholder: l("secretKey"), id: "secretKey", type: "password" },
		];

		// 通过尝试使用它来验证工具以解锁密码存储。
		const credentials = window.ipc.sendSync("prompt", {
			text: l("passwordManagerSetupSignIn"),
			values: signInFields,
			ok: l("dialogConfirmButton"),
			cancel: l("dialogSkipButton"),
			width: 500,
			height: 250,
		});

		for (const key in credentials) {
			if (credentials[key] === "") {
				throw new Error("no credentials entered");
			}
		}

		const process = new ProcessSpawner(
			path,
			[
				"account",
				"add",
				"--address",
				"my.1password.com",
				"--email",
				credentials.email,
				"--secret-key",
				credentials.secretKey,
				"--shorthand",
				"min-autofill",
				"--signin",
				"--raw",
			],
			{ OP_DEVICE: this.deviceID }
		);

		const key = await process.executeSyncInAsyncContext(credentials.password);
		if (!key) {
			throw new Error();
		}

		return true;
	}
}

module.exports = OnePasswordManagement;
