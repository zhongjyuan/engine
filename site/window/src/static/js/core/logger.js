/**
 * 日志级别
 */
var levels = {
	ERROR: 0,
	WARN: 1,
	LOG: 2,
	DEBUG: 3,
	TRACE: 4,
};

/**
 * 默认输出 Error 级别及以上的日志
 */
var loggerLevel = levels.WARN;
var title = "ZHONGJYUAN";
var version = "2.0.0";

/**
 * 日志对象
 * @author zhongjyuan
 * @date   2023年5月12日11:43:59
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.logger = (function() {
	/**
	 * 是否支持控制台方法
	 * @author zhongjyuan
	 * @date   2023年5月12日11:46:18
	 * @email  zhongjyuan@outlook.com
	 * @param {*} method 方法
	 * @returns
	 */
	function isConsoleMethodSupported(method) {
		return window.console && typeof console[method] === "function";
	}

	/**
	 * trace日志
	 * @author zhongjyuan
	 * @date   2023年6月1日16:13:40
	 * @email  zhongjyuan@outlook.com
	 */
	function trace() {
		if (loggerLevel >= levels.TRACE && isConsoleMethodSupported("log")) {
			var num = arguments.length;
			var content = arguments[0];
			for (var i = 1; i < num; i++) {
				var pattern = "\\$\\{" + (i - 1) + "\\}";
				var re = new RegExp(pattern, "g");
				content = content.replace(re, arguments[i]);
			}

			console.log(
				" %c " + title + " - " + version + " %c " + content,
				"color: #fadfa3; background: #030307; padding: 3px; border-radius: 3px 0 0 3px;",
				"color: #ffffff; background: grey; padding: 3px; border-radius: 0 3px 3px 0;"
			);
		}
	}

	/**
	 * debug日志
	 * @author zhongjyuan
	 * @date   2023年6月1日16:13:21
	 * @email  zhongjyuan@outlook.com
	 */
	function debug() {
		if (loggerLevel >= levels.DEBUG && isConsoleMethodSupported("log")) {
			var num = arguments.length;
			var content = arguments[0];
			for (var i = 1; i < num; i++) {
				var pattern = "\\$\\{" + (i - 1) + "\\}";
				var re = new RegExp(pattern, "g");
				content = content.replace(re, arguments[i]);
			}

			console.log(
				" %c " + title + " - " + version + " %c " + content,
				"color: #fadfa3; background: #030307; padding: 3px; border-radius: 3px 0 0 3px;",
				"color: black; background: cyan; padding: 3px; border-radius: 0 3px 3px 0;"
			);
		}
	}

	/**
	 * info日志
	 * @author zhongjyuan
	 * @date   2023年5月12日11:46:33
	 * @email  zhongjyuan@outlook.com
	 */
	function info() {
		if (loggerLevel >= levels.LOG && isConsoleMethodSupported("log")) {
			var num = arguments.length;
			var content = arguments[0];
			for (var i = 1; i < num; i++) {
				var pattern = "\\$\\{" + (i - 1) + "\\}";
				var re = new RegExp(pattern, "g");
				content = content.replace(re, arguments[i]);
			}

			console.log(
				" %c " + title + " - " + version + " %c " + content,
				"color: #fadfa3; background: #030307; padding: 3px; border-radius: 3px 0 0 3px;",
				"color: #ffffff; background: green; padding: 3px; border-radius: 0 3px 3px 0;"
			);
		}
	}

	/**
	 * warn日志
	 * @author zhongjyuan
	 * @date   2023年5月12日11:46:54
	 * @email  zhongjyuan@outlook.com
	 */
	function warn() {
		if (loggerLevel >= levels.WARN && isConsoleMethodSupported("warn")) {
			var num = arguments.length;
			var content = arguments[0];
			for (var i = 1; i < num; i++) {
				var pattern = "\\$\\{" + (i - 1) + "\\}";
				var re = new RegExp(pattern, "g");
				content = content.replace(re, arguments[i]);
			}

			console.warn(
				" %c " + title + " - " + version + " %c " + content,
				"color: #fadfa3; background: #030307; padding: 3px; border-radius: 3px 0 0 3px;",
				"color: black; background: yellow; padding: 3px; border-radius: 0 3px 3px 0;"
			);
		}
	}

	/**
	 * error日志
	 * @author zhongjyuan
	 * @date   2023年5月12日11:47:13
	 * @email  zhongjyuan@outlook.com
	 */
	function error() {
		if (loggerLevel >= levels.ERROR && isConsoleMethodSupported("error")) {
			var num = arguments.length;
			var content = arguments[0];
			for (var i = 1; i < num; i++) {
				var pattern = "\\$\\{" + (i - 1) + "\\}";
				var re = new RegExp(pattern, "g");
				content = content.replace(re, arguments[i]);
			}

			console.error(
				" %c " + title + " - " + version + " %c " + content,
				"color: #fadfa3; background: #030307; padding: 3px; border-radius: 3px 0 0 3px;",
				"color: #ffffff; background: red; padding: 3px; border-radius: 0 3px 3px 0;"
			);
		}
	}

	/**
	 * 设置日志级别
	 * @author zhongjyuan
	 * @date   2023年5月12日11:47:48
	 * @email  zhongjyuan@outlook.com
	 * @param {*} level 日志级别
	 */
	function setLevel(level) {
		loggerLevel = level;
	}

	/**
	 * 获取日志级别
	 * @author zhongjyuan
	 * @date   2023年5月12日11:48:06
	 * @email  zhongjyuan@outlook.com
	 * @returns 日志级别
	 */
	function getLevel() {
		return loggerLevel;
	}

	/**
	 * 设置项目标题
	 * @author zhongjyuan
	 * @date   2023年5月15日18:55:34
	 * @email  zhongjyuan@outlook.com
	 * @param {*} title 项目标题
	 */
	function setTitle(title) {
		title = title;
	}

	/**
	 * 获取项目标题
	 * @author zhongjyuan
	 * @date   2023年5月15日18:55:47
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	function getTitle() {
		return title;
	}

	/**
	 * 设置项目版本
	 * @author zhongjyuan
	 * @date   2023年5月15日18:56:07
	 * @email  zhongjyuan@outlook.com
	 * @param {*} version 项目版本
	 */
	function setVersion(version) {
		version = version;
	}

	/**
	 * 获取项目版本
	 * @author zhongjyuan
	 * @date   2023年5月15日18:56:45
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	function getVersion() {
		return version;
	}

	return {
		setLevel: setLevel,
		getLevel: getLevel,
		setTitle: setTitle,
		getTitle: getTitle,
		setVersion: setVersion,
		getVersion: getVersion,
		log: info,
		trace: trace,
		debug: debug,
		info: info,
		warn: warn,
		error: error,
	};
})();
