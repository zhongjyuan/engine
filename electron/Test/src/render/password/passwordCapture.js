const settingManagement = require("../../settings/renderSettingManagement.js");

const { webviews } = require("../webviewManagement.js");

const passwordFactory = require("./passwordFactory.js");

/**
 * 密码捕获功能对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:01:49
 */
const passwordCapture = {
	/** 密码捕获提示栏元素 */
	bar: document.getElementById("password-capture-bar"),
	/** 描述信息元素 */
	description: document.getElementById("password-capture-description"),
	/** 用户名输入框元素 */
	usernameInput: document.getElementById("password-capture-username"),
	/** 密码输入框元素 */
	passwordInput: document.getElementById("password-capture-password"),
	/** 显示密码按钮元素 */
	revealButton: document.getElementById("password-capture-reveal-password"),
	/** 保存按钮元素 */
	saveButton: document.getElementById("password-capture-save"),
	/** 永不保存按钮元素 */
	neverSaveButton: document.getElementById("password-capture-never-save"),
	/** 忽略按钮元素 */
	closeButton: document.getElementById("password-capture-ignore"),
	/** 当前域名 */
	currentDomain: null,
	/** 密码捕获提示栏的高度 */
	barHeight: 0,

	/**
	 * 显示密码捕获提示栏
	 * @param {string} username - 用户名
	 * @param {string} password - 密码
	 */
	showCaptureBar: function (username, password) {
		passwordCapture.description.textContent = l("passwordCaptureSavePassword").replace("%s", passwordCapture.currentDomain);
		passwordCapture.bar.hidden = false;

		passwordCapture.passwordInput.type = "password";
		passwordCapture.revealButton.classList.add("carbon:view");
		passwordCapture.revealButton.classList.remove("carbon:view-off");

		passwordCapture.usernameInput.value = username || "";
		passwordCapture.passwordInput.value = password || "";

		passwordCapture.barHeight = passwordCapture.bar.getBoundingClientRect().height;

		webviews.adjustMargin([passwordCapture.barHeight, 0, 0, 0]);
	},

	/**
	 * 隐藏密码捕获提示栏
	 */
	hideCaptureBar: function () {
		webviews.adjustMargin([passwordCapture.barHeight * -1, 0, 0, 0]);

		passwordCapture.bar.hidden = true;
		passwordCapture.usernameInput.value = "";
		passwordCapture.passwordInput.value = "";
		passwordCapture.currentDomain = null;
	},

	/**
	 * 切换密码可见性
	 */
	togglePasswordVisibility: function () {
		if (passwordCapture.passwordInput.type === "password") {
			passwordCapture.passwordInput.type = "text";
			passwordCapture.revealButton.classList.remove("carbon:view");
			passwordCapture.revealButton.classList.add("carbon:view-off");
		} else {
			passwordCapture.passwordInput.type = "password";
			passwordCapture.revealButton.classList.add("carbon:view");
			passwordCapture.revealButton.classList.remove("carbon:view-off");
		}
	},

	/**
	 * 处理接收到的用户名和密码
	 * @param {*} tab
	 * @param {*} args
	 * @param {*} frameId
	 * @returns
	 */
	handleRecieveCredentials: function (tab, args, frameId) {
		var domain = args[0][0];
		if (domain.startsWith("www.")) {
			domain = domain.slice(4);
		}

		// 检查是否设置了永不保存密码的域名列表，如果在列表中则直接返回
		if (settingManagement.get("passwordsNeverSaveDomains") && settingManagement.get("passwordsNeverSaveDomains").includes(domain)) {
			return;
		}

		var username = args[0][1] || "";
		var password = args[0][2] || "";

		passwordFactory.getConfiguredPasswordManager().then(function (manager) {
			if (!manager || !manager.saveCredential) {
				// 无法保存密码
				return;
			}

			// 检查该用户名和密码的组合是否已经保存过
			manager.getSuggestions(domain).then(function (credentials) {
				var alreadyExists = credentials.some((cred) => cred.username === username && cred.password === password);
				if (!alreadyExists) {
					if (!passwordCapture.bar.hidden) {
						passwordCapture.hideCaptureBar();
					}

					passwordCapture.currentDomain = domain;
					passwordCapture.showCaptureBar(username, password);
				}
			});
		});
	},

	/**
	 * 初始化密码捕获功能
	 */
	initialize: function () {
		passwordCapture.usernameInput.placeholder = l("username");
		passwordCapture.passwordInput.placeholder = l("password");

		webviews.bindIPC("password-form-filled", passwordCapture.handleRecieveCredentials);

		passwordCapture.saveButton.addEventListener("click", function () {
			if (passwordCapture.usernameInput.checkValidity() && passwordCapture.passwordInput.checkValidity()) {
				passwordFactory.getConfiguredPasswordManager().then(function (manager) {
					manager.saveCredential(passwordCapture.currentDomain, passwordCapture.usernameInput.value, passwordCapture.passwordInput.value);

					passwordCapture.hideCaptureBar();
				});
			}
		});

		passwordCapture.neverSaveButton.addEventListener("click", function () {
			settingManagement.set(
				"passwordsNeverSaveDomains",
				(settingManagement.get("passwordsNeverSaveDomains") || []).concat([passwordCapture.currentDomain])
			);
			passwordCapture.hideCaptureBar();
		});

		passwordCapture.closeButton.addEventListener("click", passwordCapture.hideCaptureBar);
		passwordCapture.revealButton.addEventListener("click", passwordCapture.togglePasswordVisibility);

		// 当窗口大小改变时，密码捕获提示栏的高度可能发生变化，需要调整 webview 的外边距
		window.addEventListener("resize", function () {
			if (!passwordCapture.bar.hidden) {
				var oldHeight = passwordCapture.barHeight;
				passwordCapture.barHeight = passwordCapture.bar.getBoundingClientRect().height;
				webviews.adjustMargin([passwordCapture.barHeight - oldHeight, 0, 0, 0]);
			}
		});
	},
};

module.exports = passwordCapture;
