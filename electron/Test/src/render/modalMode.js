/**
 * 专注模式管理器，封装了专注模式的相关逻辑和状态。
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:11:36
 */
const modalMode = {
	/**标识 */
	flag: false,

	/**专注模式消失时执行的回调函数。 */
	onDismiss: null,

	/**覆盖层元素，用于在专注模式下覆盖整个窗口。 */
	overlay: document.getElementById("overlay"),

	/**
	 * 判断专注模式是否启用。
	 * @returns {boolean} 专注模式是否启用。
	 */
	enabled: function () {
		return modalMode.flag;
	},

	/**
	 * 开启或关闭专注模式，并设置专注模式消失的回调函数。
	 * @param {boolean} enabled 是否开启专注模式。
	 * @param {object} listeners 监听器对象，包含 onDismiss 回调函数。
	 */
	toggle: function (enabled, listeners = {}) {
		if (enabled && listeners.onDismiss) {
			modalMode.onDismiss = listeners.onDismiss;
		}

		if (!enabled) {
			modalMode.onDismiss = null;
		}

		modalMode.flag = enabled;
		if (enabled) {
			document.body.classList.add("is-modal-mode");
		} else {
			document.body.classList.remove("is-modal-mode");
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		/**点击覆盖层时执行的函数，执行专注模式消失的回调函数并清空其值。 */
		modalMode.overlay.addEventListener("click", function () {
			if (modalMode.onDismiss) {
				modalMode.onDismiss();
				modalMode.onDismiss = null;
			}
		});
	},
};

module.exports = modalMode;
