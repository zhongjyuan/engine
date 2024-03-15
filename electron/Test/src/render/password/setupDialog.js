const fs = require("fs");
const path = require("path");

const settingManagement = require("../../settings/renderSettingManagement.js");

const ProcessSpawner = require("../utils/ProcessSpawner.js");

const modalMode = require("../modalMode.js");

const uiManagement = require("../uiManagement.js");
const { webviews } = require("../webviewManagement.js");

/**
 * 设置对话框对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:04:40
 */
const setupDialog = {
	/**对话框元素 */
	dialog: document.getElementById("manager-setup-dialog"),

	/**拖放区域元素 */
	dragBox: document.getElementById("manager-setup-drop-box"),

	/**主要指南元素 */
	primaryInstructions: document.getElementById("manager-setup-instructions-primary"),

	/**次要指南元素 */
	secondaryInstructions: document.getElementById("manager-setup-instructions-secondary"),

	/** 当前的密码管理器对象 */
	manager: null,

	/** 设置模式（"installer" 或其他） */
	setupMode: null,
	
	/** 安装程序完成的超时定时器 */
	installerCompletionTimeout: null,

	/**
	 * 等待安装程序完成的函数
	 */
	waitForInstallerComplete: function () {
		setupDialog.manager.checkIfConfigured().then(function (configured) {
			if (configured) {
				setupDialog.afterInstall();
				setupDialog.installerCompletionTimeout = null;
			} else {
				setupDialog.installerCompletionTimeout = setTimeout(setupDialog.waitForInstallerComplete, 2000);
			}
		});
	},

	/**
	 * 安装工具到指定路径
	 * @param {*} filePath 安装文件路径
	 * @param {*} callback 回调函数
	 * @returns {Promise} 返回一个 Promise 对象
	 */
	install: function (filePath, callback) {
		return new Promise((resolve, reject) => {
			try {
				// 工具目录路径
				const toolsDir = path.join(window.globalArgs["user-data-path"], "tools");
				if (!fs.existsSync(toolsDir)) {
					fs.mkdirSync(toolsDir);
				}

				// 目标文件路径
				const targetFilePath = setupDialog.manager.getLocalPath();
				fs.createReadStream(filePath)
					.pipe(fs.createWriteStream(targetFilePath))
					.on("finish", function () {
						fs.chmodSync(targetFilePath, "755");
						resolve(targetFilePath);
					})
					.on("error", function (error) {
						reject(error);
					});
			} catch (e) {
				reject(e);
			}
		});
	},

	/**
	 * 启动安装程序
	 * @param {*} filePath 安装程序文件路径
	 * @param {*} platform 平台类型
	 * @returns {Promise} 返回一个 Promise 对象
	 */
	launchInstaller: function (filePath, platform) {
		if (window.platform === "mac") {
			return new ProcessSpawner("open", [filePath]).execute();
		} else {
			return new ProcessSpawner(filePath).execute();
		}
	},

	/**
	 * 安装完成后的回调函数
	 * @param {*} toolPath 安装的工具路径
	 */
	afterInstall: function (toolPath) {
		setupDialog.manager
			.signInAndSave(toolPath)
			.then(() => {
				setupDialog.hide();
			})
			.catch(function (e) {
				console.warn(e);
				if (setupDialog.setupMode === "installer") {
					// 显示对话框
					setupDialog.afterInstall();
				} else {
					// 安装失败后的清理操作。
					const targetFilePath = setupDialog.manager.getLocalPath();
					if (fs.existsSync(targetFilePath)) {
						fs.unlinkSync(targetFilePath);
					}

					const message = (e.error || "").replace(/\n$/gm, "");
					setupDialog.dragBox.innerHTML = l("passwordManagerSetupUnlockError") + message + " " + l("passwordManagerSetupRetry");
				}
			});
	},

	/**
	 * 显示设置对话框
	 * @param {*} manager 密码管理器对象
	 */
	show: function (manager) {
		setupDialog.manager = manager;
		setupDialog.setupMode = manager.getSetupMode();

		document.getElementById("manager-setup-heading").textContent = l("passwordManagerSetupHeading").replace("%p", manager.name);
		document.getElementById("password-manager-setup-link").textContent = l("passwordManagerSetupLink").replace("%p", manager.name);
		document.getElementById("password-manager-setup-link-installer").textContent = l("passwordManagerSetupLinkInstaller").replace("%p", manager.name);

		setupDialog.dragBox.textContent = l("passwordManagerSetupDragBox");

		if (setupDialog.setupMode === "installer") {
			setupDialog.primaryInstructions.hidden = true;
			setupDialog.secondaryInstructions.hidden = false;

			setupDialog.installerCompletionTimeout = setTimeout(setupDialog.waitForInstallerComplete, 2000);
		} else {
			setupDialog.primaryInstructions.hidden = false;
			setupDialog.secondaryInstructions.hidden = true;
		}

		modalMode.toggle(true, {
			onDismiss: function () {
				settingManagement.set("passwordManager", null);
				setupDialog.hide();
			},
		});

		setupDialog.dialog.hidden = false;
		webviews.requestPlaceholder("managerSetup");
	},

	/**
	 * 隐藏设置对话框
	 */
	hide: function () {
		setupDialog.manager = null;
		setupDialog.setupMode = null;
		clearTimeout(setupDialog.installerCompletionTimeout);
		setupDialog.installerCompletionTimeout = null;

		modalMode.toggle(false);
		setupDialog.dialog.hidden = true;
		webviews.hidePlaceholder("managerSetup");
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		document.getElementById("manager-setup-disable").addEventListener("click", function () {
			settingManagement.set("passwordManager", null);
			setupDialog.hide();
		});

		document.getElementById("manager-setup-close").addEventListener("click", function () {
			settingManagement.set("passwordManager", null);
			setupDialog.hide();
		});

		document.getElementById("password-manager-setup-link").addEventListener("click", function () {
			uiManagement.addTab(
				window.tabs.add({
					url: setupDialog.manager.getDownloadLink(),
				}),
				{ openInBackground: true }
			);
		});

		document.getElementById("password-manager-setup-link-installer").addEventListener("click", function () {
			uiManagement.addTab(
				window.tabs.add({
					url: setupDialog.manager.getDownloadLink(),
				}),
				{ openInBackground: true }
			);
		});

		setupDialog.dragBox.ondragover = () => {
			return false;
		};

		setupDialog.dragBox.ondragleave = () => {
			return false;
		};

		setupDialog.dragBox.ondragend = () => {
			return false;
		};

		setupDialog.dragBox.ondrop = (e) => {
			e.preventDefault();

			if (e.dataTransfer.files.length === 0) {
				return;
			}

			setupDialog.dragBox.innerHTML = l("passwordManagerSetupInstalling");

			const filePath = e.dataTransfer.files[0].path;

			// 尝试过滤掉非可执行文件（注意：不完全准确）
			if (e.dataTransfer.files[0].type !== "" && !e.dataTransfer.files[0].name.endsWith(".exe")) {
				setupDialog.dragBox.innerHTML = l("passwordManagerSetupRetry");
				return;
			}

			if (setupDialog.setupMode === "installer") {
				setupDialog.launchInstaller(filePath, window.platformType);
			} else {
				setupDialog.install(filePath).then(setupDialog.afterInstall);
			}

			return false;
		};
	},
};

setupDialog.initialize();

module.exports = setupDialog;
