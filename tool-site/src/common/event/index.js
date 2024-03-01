import logger from "@base/logger";
import { isEmpty, isFunction, isString } from "@common/utils/default";

/**
 * 事件管理对象
 * @author zhongjyuan
 * @date   2023年5月12日11:43:59
 * @email  zhongjyuan@outlook.com
 * @returns {object} 事件对象
 */
export default ((runtime) => {
	/**
	 * 监听事件
	 *
	 * @memberof event
	 * @function on
	 * @param {string} eventName - 事件名称
	 * @param {Function} callback - 回调函数
	 * @example
	 * // 监听 'click' 事件，并绑定回调函数 handleClick
	 * on('click', handleClick);
	 */
	function on(eventName, callback) {
		if (!isString(eventName) || isEmpty(eventName)) {
			logger.error("[event.on] 参数异常：eventName<${0}>必须是字符串类型并不能为空.", JSON.stringify(eventName));
			return;
		}

		if (!isFunction(callback)) {
			logger.error("[event.on] 参数异常：callback<${0}>必须是函数类型.", JSON.stringify(callback));
			return;
		}

		window.zhongjyuan.createRuntimeProperty("event_handles", "object");
		if (!runtime.event_handles[eventName]) runtime.event_handles[eventName] = [];

		runtime.event_handles[eventName].push(callback || function () {});
	}

	/**
	 * 触发事件
	 *
	 * @memberof event
	 * @function emit
	 * @param {string} eventName - 事件名称
	 * @param {...*} args - 传递给回调函数的参数
	 * @example
	 * // 触发 'click' 事件，并传递参数 'param1' 和 'param2'
	 * emit('click', 'param1', 'param2');
	 */
	function emit(eventName) {
		// 获取 eventName 对应的处理程序数组
		var handles = runtime.event_handles && runtime.event_handles[eventName];

		// 如果处理程序数组存在且长度大于0
		if (handles && handles.length > 0) {
			// 复制处理程序数组，并获取除 eventName 参数外的其他参数
			handles = handles.slice();
			var args = Array.prototype.slice.call(arguments, 1);

			// 遍历处理程序数组，依次执行回调函数并传递参数
			for (var i = 0; i < handles.length; i++) {
				handles[i].apply(this, args);
			}
		}
	}

	/**
	 * 关闭事件
	 *
	 * @memberof event
	 * @function off
	 * @param {string} eventName - 事件名称
	 * @param {...*} args - 传递给回调函数的参数
	 * @example
	 * // 触发 'click' 事件，并传递参数 'param1' 和 'param2'
	 * off('click', 'param1', 'param2');
	 */
	function off(eventName) {
		eventName && delete runtime.event_handles[eventName];
	}

	/**
	 * 闭包方式将某些方法设置为私有函数
	 */
	return {
		on: logger.decorator(on, "tool-event-on"),
		emit: logger.decorator(emit, "tool-event-emit"),
		off: logger.decorator(off, "tool-event-off"),
	};
})(window.zhongjyuan.runtime);
