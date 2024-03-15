const fs = require("fs");
const path = require("path");

const ProcessSpawner = require("../utils/ProcessSpawner.js");

// Bitwarden密码管理器。需要会话密钥来解锁保险库。

/**
 * Bitwarden 管理对象(表示Bitwarden密码管理器)
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日10:04:43
 */
class BitwardenManagement {
	/**
	 * 构造函数，初始化Bitwarden实例
	 */
	constructor() {
		/** 名称 */
		this.name = "Bitwarden";

		/** 会话密钥 */
		this.sessionKey = null;

		/** 最后一次调用列表 */
		this.lastCallList = {};
	}

	/**
	 * 获取下载链接
	 * @returns 下载链接
	 */
	getDownloadLink() {
		switch (window.platformType) {
			case "mac":
				return "https://vault.bitwarden.com/download/?app=cli&platform=macos";
			case "windows":
				return "https://vault.bitwarden.com/download/?app=cli&platform=windows";
			case "linux":
				return "https://vault.bitwarden.com/download/?app=cli&platform=linux";
		}
	}

	/**
	 * 获取本地路径
	 * @returns 本地路径
	 */
	getLocalPath() {
		return path.join(window.globalArgs["user-data-path"], "tools", platformType === "windows" ? "bw.exe" : "bw");
	}

	/**
	 * 获取设置模式
	 * @returns 设置模式
	 */
	getSetupMode() {
		return "dragdrop";
	}

	// 返回Bitwarden-CLI工具路径，通过检查可能的位置。
	// 首先检查该工具是否专门为Min安装，
	// 通过检查设置值。如果未设置或不指向有效的可执行文件，
	// 则检查全局是否可用'bw'。

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

		/**全局变量(环境变量) */
		const global = await new ProcessSpawner("bw").checkCommandExists();

		if (global) {
			return "bw";
		}

		return null;
	}

	// 检查是否正确配置了Bitwarden集成，
	// 通过尝试获取有效的Bitwarden-CLI工具路径。

	/**
	 * 检查是否已配置Bitwarden集成
	 * @returns 是否已配置
	 */
	async checkIfConfigured() {
		this.path = await this._getToolPath();
		return this.path != null;
	}

	// 返回当前Bitwarden-CLI状态。如果有会话密钥，则
	// 认为密码存储已解锁。

	/**
	 * 判断密码存储是否已解锁
	 * @returns 是否已解锁
	 */
	isUnlocked() {
		return this.sessionKey != null;
	}

	// 尝试获取给定域名的凭据建议列表。

	/**
	 * 获取凭据建议
	 * @param {*} domain 域名
	 * @returns 凭据建议列表
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

	// 加载给定域名的凭据建议列表。

	/**
	 * 加载凭据建议
	 * @param {*} command 命令
	 * @param {*} domain 域名
	 * @returns 凭据建议列表
	 */
	async loadSuggestions(command, domain) {
		try {
			const process = new ProcessSpawner(command, ["list", "items", "--url", this.sanitize(domain), "--session", this.sessionKey]);
			const data = await process.execute();

			const matches = JSON.parse(data);
			const credentials = matches.map((match) => {
				const {
					login: { username, password },
				} = match;
				return { username, password, manager: "Bitwarden" };
			});

			return credentials;
		} catch (ex) {
			const { error, data } = ex;
			console.error("Error accessing Bitwarden CLI. STDOUT: " + data + ". STDERR: " + error);
			return [];
		}
	}

	/**
	 * 强制同步
	 * @param {*} command 命令
	 */
	async forceSync(command) {
		try {
			const process = new ProcessSpawner(command, ["sync", "--session", this.sessionKey]);
			await process.execute();
		} catch (ex) {
			const { error, data } = ex;
			console.error("Error accessing Bitwarden CLI. STDOUT: " + data + ". STDERR: " + error);
		}
	}

	// 尝试使用给定的主密码解锁密码存储。

	/**
	 * 解锁密码存储
	 * @param {*} password 主密码
	 * @returns 解锁是否成功
	 */
	async unlockStore(password) {
		try {
			const process = new ProcessSpawner(this.path, ["unlock", "--raw", password]);
			const result = await process.execute();

			if (!result) {
				throw new Error();
			}

			this.sessionKey = result;
			await this.forceSync(this.path);

			return true;
		} catch (ex) {
			const { error, data } = ex;

			console.error("Error accessing Bitwarden CLI. STDOUT: " + data + ". STDERR: " + error);

			if (error.includes("not logged in")) {
				await this.signInAndSave();
				return await this.unlockStore(password);
			}

			throw ex;
		}
	}

	/**
	 * 登录并保存凭据
	 * @param {*} path 路径
	 * @returns 是否登录成功
	 */
	async signInAndSave(path = this.path) {
		// It's possible to be already logged in
		const logoutProcess = new ProcessSpawner(path, ["logout"]);
		try {
			await logoutProcess.execute();
		} catch (e) {
			console.warn(e);
		}

		// show credentials dialog

		var signInFields = [
			{ placeholder: "Client ID", id: "clientID", type: "password" },
			{ placeholder: "Client Secret", id: "clientSecret", type: "password" },
		];

		const credentials = window.ipc.sendSync("prompt", {
			text: l("passwordManagerBitwardenSignIn"),
			values: signInFields,
			ok: l("dialogConfirmButton"),
			cancel: l("dialogSkipButton"),
			width: 500,
			height: 260,
		});

		for (const key in credentials) {
			if (credentials[key] === "") {
				throw new Error("no credentials entered");
			}
		}

		const process = new ProcessSpawner(path, ["login", "--apikey"], {
			BW_CLIENTID: credentials.clientID.trim(),
			BW_CLIENTSECRET: credentials.clientSecret.trim(),
		});

		await process.execute();

		return true;
	}

	// 基本域名清理。删除任何非ASCII符号。

	/**
	 * 清理域名
	 * @param {*} domain 域名
	 * @returns 清理后的域名
	 */
	sanitize(domain) {
		return domain.replace(/[^a-zA-Z0-9.-]/g, "");
	}
}

module.exports = BitwardenManagement;
