const path = require("path");

const statisticalManagement = require("./statisticalManagement");

/**
 * 页面新标签对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:02:10
 */
const pageNewTab = {
	/**是否有背景图片 */
	hasBackground: false,

	/**背景图片元素 */
	background: document.getElementById("ntp-background"),

	/**图片选择器元素 */
	picker: document.getElementById("ntp-image-picker"),

	/**删除背景图片元素 */
	deleteBackground: document.getElementById("ntp-image-remove"),

	/**背景图片路径 */
	imagePath: path.join(window.globalArgs["user-data-path"], "newTabBackground"),

	/**
	 * 重新加载背景图片
	 */
	reloadBackground: function () {
		pageNewTab.background.src = pageNewTab.imagePath + "?t=" + Date.now();

		/**
		 * 当图片加载成功时的回调函数
		 */
		function onLoad() {
			pageNewTab.background.hidden = false;

			pageNewTab.hasBackground = true;

			document.body.classList.add("ntp-has-background");

			pageNewTab.background.removeEventListener("load", onLoad);

			pageNewTab.deleteBackground.hidden = false;
		}

		/**
		 * 当图片加载失败时的回调函数
		 */
		function onError() {
			pageNewTab.background.hidden = true;

			pageNewTab.hasBackground = false;

			document.body.classList.remove("ntp-has-background");

			pageNewTab.background.removeEventListener("error", onError);

			pageNewTab.deleteBackground.hidden = true;
		}

		pageNewTab.background.addEventListener("load", onLoad);
		pageNewTab.background.addEventListener("error", onError);
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		pageNewTab.reloadBackground();

		pageNewTab.picker.addEventListener("click", async function () {
			var filePath = await window.ipc.invoke("showOpenDialog", {
				filters: [{ name: "Image files", extensions: ["jpg", "jpeg", "png", "gif", "webp"] }],
			});

			if (!filePath) {
				return;
			}

			await fs.promises.copyFile(filePath[0], pageNewTab.imagePath);

			pageNewTab.reloadBackground();
		});

		pageNewTab.deleteBackground.addEventListener("click", async function () {
			await fs.promises.unlink(pageNewTab.imagePath);

			pageNewTab.reloadBackground();
		});

		statisticalManagement.registerGetter("ntpHasBackground", function () {
			return pageNewTab.hasBackground;
		});
	},
};

module.exports = pageNewTab;
