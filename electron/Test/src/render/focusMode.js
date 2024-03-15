/**
 * 聚焦模式
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:10:30
 */
const focusMode = {
	/**标识 */
	flag: false,

	/**
	 * 显示警告弹窗
	 */
	warn: function () {
		window.ipc.invoke("showFocusModeDialog2");
	},

	/**
	 *
	 * @returns 启动聚焦模式
	 */
	enabled: function () {
		return focusMode.flag;
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		window.ipc.on("enterFocusMode", function () {
			focusMode.flag = true;
			document.body.classList.add("is-focus-mode");
		});

		window.ipc.on("exitFocusMode", function () {
			focusMode.flag = false;
			document.body.classList.remove("is-focus-mode");
		});
	},
};

module.exports = focusMode;
