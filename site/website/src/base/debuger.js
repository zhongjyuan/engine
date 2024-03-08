/**
 * 检测调试对象
 * @author zhongjyuan
 * @date   2024年1月9日14:37:51
 * @email  zhongjyuan@outlook.com
 */
export default ((setting) => {
	/**
	 * 检测调试器是否存在。
	 * @returns {boolean} - 如果检测到调试器，返回true；否则返回false。
	 */
	function _detectDebugger() {
		var stopDate = new Date();
		debugger;
		if (new Date() - stopDate > setting.timeout) {
			if (setting.callback && typeof setting.callback === "function") setting.callback();
			return true;
		}
		return false;
	}

	/**
	 * 初始化函数，连续检测调试器的存在。
	 */
	function init() {
		while (_detectDebugger()) {}
	}

	// 根据检测结果选择执行不同逻辑
	if (!_detectDebugger()) {
		window.onblur = function () {
			setTimeout(init, 500);
		};
	} else {
		init();
	}
})(window.zhongjyuan.runtime.setting.debugger);
