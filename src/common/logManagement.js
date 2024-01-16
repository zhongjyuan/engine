/**
 * 日志对象
 * @author zhongjyuan
 * @date   2023年5月12日11:43:59
 * @email  zhongjyuan@outlook.com
 * @returns {object} 日志对象
 */
export default ((runtime, setting) => {
	/**
	 * 是否开启Debug模式
	 * @returns 
	 */
	function _isDebug() {
		return setting.level >= setting.DEBUG.level;
	}

	/**
	 * 格式化字符串
	 * @returns {string} 格式化后的字符串
	 * @example
	 * const message = format("Hello, ${0}! Today is ${1}.", "Alice", "Monday");
	 * console.log(message); // "Hello, Alice! Today is Monday."
	 */
	function _format() {
		const num = arguments.length;
		if (num < 1) return "";

		let content = arguments[0];
		for (let i = 1; i < num; i++) {
			const pattern = `\\$\\{${i - 1}\\}`;
			const re = new RegExp(pattern, "g");
			content = content.replace(re, arguments[i]);
		}

		return content;
	}

	/**
	 * 格式化正文
	 * @returns {string} 格式化后的正文
	 */
	function _contentFormat() {
		const args = Array.from(arguments);
		const logLevel = args.pop();
		if (logLevel > setting.TRACE.level) return "";

		const content = _format(...args);
		const timestamp = new Date().format("ap hh:mm:ss:S");
		const stackContent =
			setting.stack.includes(logLevel) && content.indexOf("called") === -1 ? new Error().stack.split("\n").slice(3).join("\n") : "";

		return `%c ${runtime.name} - ${runtime.version} %c ${timestamp} %c ${content} \n%c${stackContent}`;
	}

	/**
	 * 是否支持控制台方法
	 * @author zhongjyuan
	 * @date   2023年5月12日11:46:18
	 * @email  zhongjyuan@outlook.com
	 * @param {*} method 方法
	 * @returns
	 */
	function _isConsoleMethodSupported(method) {
		return window.console && typeof window.console[method] === "function";
	}

	/**
	 * trace日志
	 * @author zhongjyuan
	 * @date   2023年6月1日16:13:40
	 * @email  zhongjyuan@outlook.com
	 */
	function trace() {
		if (_isConsoleMethodSupported("trace") && setting.level >= setting.TRACE.level) {
			console.trace(
				_contentFormat(...arguments, setting.TRACE.level),
				_format(setting.prefixStyle, setting.TRACE.color.prefix, setting.TRACE.background.prefix),
				_format(setting.timestampStyle, setting.TRACE.color.timestamp, setting.TRACE.background.timestamp),
				_format(setting.contentStyle, setting.TRACE.color.content, setting.TRACE.background.content),
				_format(setting.stackStyle, setting.TRACE.color.stack, setting.TRACE.background.stack)
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
		if (_isConsoleMethodSupported("debug") && setting.level >= setting.DEBUG.level) {
			console.log(
				_contentFormat(...arguments, setting.DEBUG.level),
				_format(setting.prefixStyle, setting.DEBUG.color.prefix, setting.DEBUG.background.prefix),
				_format(setting.timestampStyle, setting.DEBUG.color.timestamp, setting.DEBUG.background.timestamp),
				_format(setting.contentStyle, setting.DEBUG.color.content, setting.DEBUG.background.content),
				_format(setting.stackStyle, setting.DEBUG.color.stack, setting.DEBUG.background.stack)
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
		if (_isConsoleMethodSupported("info") && setting.level >= setting.INFO.level) {
			console.info(
				_contentFormat(...arguments, setting.INFO.level),
				_format(setting.prefixStyle, setting.INFO.color.prefix, setting.INFO.background.prefix),
				_format(setting.timestampStyle, setting.INFO.color.timestamp, setting.INFO.background.timestamp),
				_format(setting.contentStyle, setting.INFO.color.content, setting.INFO.background.content),
				_format(setting.stackStyle, setting.INFO.color.stack, setting.INFO.background.stack)
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
		if (_isConsoleMethodSupported("warn") && setting.level >= setting.WARN.level) {
			console.warn(
				_contentFormat(...arguments, setting.WARN.level),
				_format(setting.prefixStyle, setting.WARN.color.prefix, setting.WARN.background.prefix),
				_format(setting.timestampStyle, setting.WARN.color.timestamp, setting.WARN.background.timestamp),
				_format(setting.contentStyle, setting.WARN.color.content, setting.WARN.background.content),
				_format(setting.stackStyle, setting.WARN.color.stack, setting.WARN.background.stack)
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
		if (_isConsoleMethodSupported("error") && setting.level >= setting.ERROR.level) {
			console.error(
				_contentFormat(...arguments, setting.ERROR.level),
				_format(setting.prefixStyle, setting.ERROR.color.prefix, setting.ERROR.background.prefix),
				_format(setting.timestampStyle, setting.ERROR.color.timestamp, setting.ERROR.background.timestamp),
				_format(setting.contentStyle, setting.ERROR.color.content, setting.ERROR.background.content),
				_format(setting.stackStyle, setting.ERROR.color.stack, setting.ERROR.background.stack)
			);
		}
	}

	/**
	 * 日志记录装饰器函数
	 * @param {Object} target - 被修饰的函数
	 * @param {string} targetName - 被修饰的函数名称
	 */
	function decorator(target, targetName) {
		return function () {
			try {
				// 记录 trace 日志
				trace(
					"called [${0}] with arguments: ${1}",
					targetName || target.name,
					JSON.stringify(Array.from(arguments), function (key, value) {
						// 处理函数
						if (typeof value === "function") {
							return value.toString();
						}

						// 处理时间
						if (value instanceof Date) {
							return { __type: "date", value: value.toISOString() };
						}

						// 处理null
						if (value === null) {
							return { __type: "null" };
						}

						// 处理undefined
						if (typeof value === "undefined") {
							return { __type: "undefined" };
						}

						// 处理NaN
						if (Number.isNaN(value)) {
							return { __type: "nan" };
						}

						return value;
					})
				);

				// 调用原始函数
				const result = target.apply(this, arguments);

				// 记录 debug 日志
				debug("called [${0}] => ${1}", targetName || target.name, JSON.stringify(result ? result : "success."));

				return result;
			} catch (e) {
				// 记录 error 日志
				error("called [${0}] encountered an error: ${1}", targetName || target.name, e.message);

				throw e;
			}
		};
	}

	return {
		trace: trace,
		debug: debug,
		info: info,
		warn: warn,
		error: error,
		isDebug: _isDebug,
		decorator: decorator,
	};
})(window.zhongjyuan.runtime, window.zhongjyuan.runtime.setting.logger);
