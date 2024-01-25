import logger from "@base/logger";
import { camelCase, removeWhitespace } from "./format";
import { isFunction, isObject, isString } from "./default";

export default {
	on: logger.decorator(on, "tool-dom-on"),
	off: logger.decorator(off, "tool-dom-off"),
	once: logger.decorator(once, "tool-dom-once"),
	isDom: logger.decorator(isDom, "tool-dom-is-dom"),
	isHidden: logger.decorator(isHidden, "tool-dom-is-hidden"),
	hasClass: logger.decorator(hasClass, "tool-dom-has-class"),
	addClass: logger.decorator(addClass, "tool-dom-add-class"),
	removeClass: logger.decorator(removeClass, "tool-dom-remove-class"),
	getStyle: logger.decorator(getStyle, "tool-dom-get-style"),
	setStyle: logger.decorator(setStyle, "tool-dom-set-style"),
	animateScale: logger.decorator(animateScale, "tool-dom-animate-scale"),
	eventPosition: logger.decorator(eventPosition, "tool-dom-event-position"),
	queryElement: logger.decorator(queryElement, "tool-dom-query-element"),
	queryAllElement: logger.decorator(queryAllElement, "tool-dom-query-all-element"),
	queryParentElement: logger.decorator(queryParentElement, "tool-dom-query-parent-element"),
};

/**
 * 是否DOM元素
 * @param {*} element 元素对象
 * @returns {boolean} 如果变量是 DOM 元素，则返回 true，否则返回 false。
 *
 * @example
 * var divElement = document.createElement("div");
 * var isDomElement = isDom(divElement);
 * console.log(isDomElement); // 输出 true
 *
 * var str = "Hello, World!";
 * var isDomStr = isDom(str);
 * console.log(isDomStr); // 输出 false
 */
export function isDom(element) {
	let result = false;
	var dom = document.createElement("element");
	try {
		dom.appendChild(element.cloneNode(true));
		result = element.nodeType === 1;
	} catch (e) {
		result = element === window || element === document;
	}

	return result;
}

/**
 * 判断一个元素是否隐藏（不可见）。
 * @param {Element} element 元素对象
 * @returns {boolean} - 如果元素隐藏，则返回true；否则返回false。
 *
 * @example
 * var element = document.getElementById("myElement");
 * if (isHidden(element)) {
 *   console.log("元素隐藏");
 * } else {
 *   console.log("元素可见");
 * }
 */
export function isHidden(element) {
	if (isString(element)) {
		element = document.getElementById(element);
	}

	if (!isDom(element)) {
		logger.error("[isHidden] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return false;
	}

	return !(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

/**
 * 开启事件监听
 * @param {Element} element 元素对象
 * @param {string} event 事件名称
 * @param {Function} handler 事件处理
 *
 * @example
 * var element = document.getElementById("myButton");
 *
 * on(element, "click", function(event) {
 *   console.log("按钮被点击了");
 * });
 */
export function on(element, event, handler) {
	if (!isDom(element)) {
		logger.error("[on] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return;
	}

	if (!isString(event)) {
		logger.error("[on] 参数异常：event<${0}>必须是字符串类型.", JSON.stringify(event));
		return;
	}

	if (!isFunction(handler)) {
		logger.error("[on] 参数异常：handler<${0}>必须是函数类型.", JSON.stringify(handler));
		return;
	}

	element.addEventListener(event, handler, false);
}

/**
 * 关闭事件监听
 * @param {Element} element 元素对象
 * @param {string} event 事件名称
 * @param {Function} handler 事件处理
 *
 * @example
 * var element = document.getElementById("myButton");
 * var clickHandler = function(event) {
 *   console.log("按钮被点击了");
 * };
 *
 * on(element, "click", clickHandler);
 *
 * // 解绑事件处理函数
 * off(element, "click", clickHandler);
 */
export function off(element, event, handler) {
	if (!isDom(element)) {
		logger.error("[off] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return;
	}

	if (!isString(event)) {
		logger.error("[off] 参数异常：event<${0}>必须是字符串类型.", JSON.stringify(event));
		return;
	}

	if (!isFunction(handler)) {
		logger.error("[off] 参数异常：handler<${0}>必须是函数类型.", JSON.stringify(handler));
		return;
	}

	element.removeEventListener(event, handler, false);
}

/**
 * 一次性事件监听
 * @param {Element} element 元素对象
 * @param {string} event 事件名称
 * @param {Function} handler 事件处理
 *
 * @example
 * var element = document.getElementById("myButton");
 *
 * once(element, "click", function(event) {
 *   console.log("按钮被点击了");
 * });
 */
export function once(element, event, handler) {
	if (!isDom(element)) {
		logger.error("[once] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return;
	}

	if (!isString(event)) {
		logger.error("[once] 参数异常：event<${0}>必须是字符串类型.", JSON.stringify(event));
		return;
	}

	if (!isFunction(handler)) {
		logger.error("[once] 参数异常：handler<${0}>必须是函数类型.", JSON.stringify(handler));
		return;
	}

	var listener = function () {
		if (handler) {
			handler.apply(this, arguments);
		}
		off(element, event, listener);
	};

	on(element, event, listener);
}

/**
 * DOM元素查询
 * @param {string|Element} element 元素名称
 * @param {Document} dom DOM对象
 * @returns {Element|null} 查询到的 DOM 元素，如果未找到则返回 null。
 *
 * @example
 * var divElement = queryElement("#myDiv");
 * console.log(divElement); // 输出查询到的 DOM 元素
 *
 * var containerElement = document.getElementById("container");
 * var result = queryElement(containerElement);
 * console.log(result); // 输出 containerElement
 */
export function queryElement(element, dom = document) {
	if (isString(element)) {
		return dom.querySelector(element);
	} else {
		return element;
	}
}

/**
 * DOM元素查询(一组)
 * @param {string|Element} element 元素名称
 * @param {Document} dom DOM对象
 * @returns {NodeList|Element[]} 查询到的 DOM 元素列表或数组，如果未找到则返回空列表或空数组。
 *
 * @example
 * var list = queryAllElement(".item");
 * console.log(list); // 输出查询到的 DOM 元素列表或数组
 *
 * var containerElement = document.getElementById("container");
 * var result = queryAllElement(containerElement);
 * console.log(result); // 输出包含 containerElement 的数组
 */
export function queryAllElement(element, dom = document) {
	if (isString(element)) {
		return dom.querySelectorAll(element);
	} else {
		return element;
	}
}

/**
 * 查询父元素。
 * @param {string|HTMLElement} dom - 要查询的元素或元素 ID。
 * @param {string} defaultElement - 默认父元素 ID（可选）。
 * @returns {HTMLElement} - 查询到的父元素。
 *
 * @example
 * // 示例 1: 使用元素作为参数
 * const element = document.getElementById('myElement');
 * const parentElement1 = queryParentElement(element);
 * console.log(parentElement1); // 输出: element 的父元素
 *
 * // 示例 2: 使用元素 ID 作为参数
 * const parentElement2 = queryParentElement('myElement');
 * console.log(parentElement2); // 输出: 具有 ID 'myElement' 的元素的父元素
 *
 * // 示例 3: 使用默认父元素 ID
 * const parentElement3 = queryParentElement('myElement', 'defaultElement');
 * console.log(parentElement3); // 输出: 具有 ID 'defaultElement' 的元素或文档主体元素
 */
export function queryParentElement(dom, defaultElement = window.zhongjyuan.runtime.setting.custom.rootElement) {
	return isDom(dom) ? dom : (isString(dom) && document.getElementById(dom)) || document.getElementById(defaultElement) || document.body;
}

/**
 * 检查一个元素是否具有指定的 CSS 类名。
 * @param {Element} element 元素对象
 * @param {string} className 样式类名
 * @returns {boolean} 如果元素具有指定的类名，则返回 true；否则返回 false。
 *
 * @example
 * var element = document.getElementById("myElement");
 * var hasClass = hasClass(element, "active");
 * console.log(hasClass); // 检查元素是否具有 "active" 类名
 */
export function hasClass(element, className) {
	if (!isDom(element)) {
		logger.error("[hasClass] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return false;
	}

	if (!isString(className)) {
		logger.error("[hasClass] 参数异常：className<${0}>必须是字符串类型.", JSON.stringify(className));
		return false;
	}

	if (className.indexOf(" ") !== -1) {
		logger.error("[hasClass] 参数异常：className<${0}>必须不能包含空格：${0}", JSON.stringify(className));
		return false;
	}

	if (element.classList) {
		return element.classList.contains(className);
	} else {
		return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
	}
}

/**
 * 向一个元素添加指定的 CSS 类名。
 * @param {Element} element 元素对象
 * @param {string} classNames 样式类名(支持多个[空格隔开])
 *
 * @example
 * var element = document.getElementById("myElement");
 * addClass(element, "active");
 *
 * // 添加多个类名
 * addClass(element, "bold italic");
 */
export function addClass(element, classNames) {
	if (!isDom(element)) {
		logger.error("[addClass] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return false;
	}

	if (!isString(classNames)) {
		logger.error("[addClass] 参数异常：classNames<${0}>必须是字符串类型.", JSON.stringify(classNames));
		return false;
	}

	var originClassName = element.className;
	var currentClassNames = (classNames || "").split(" ");

	for (var i = 0, j = currentClassNames.length; i < j; i++) {
		var currentClassName = currentClassNames[i];
		if (!currentClassName) continue;

		if (element.classList) {
			element.classList.add(currentClassName);
		} else {
			if (!hasClass(element, currentClassName)) {
				originClassName += " " + currentClassName;
			}
		}
	}

	if (!element.classList) {
		element.className = originClassName;
	}
}

/**
 * 从一个元素中移除指定的 CSS 类名。
 * @param {Element} element 元素对象
 * @param {string} classNames 样式类名(支持多个[空格隔开])
 *
 * @example
 * var element = document.getElementById("myElement");
 * removeClass(element, "active");
 *
 * // 移除多个类名
 * removeClass(element, "bold italic");
 */
export function removeClass(element, classNames) {
	if (!isDom(element)) {
		logger.error("[removeClass] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return false;
	}

	if (!isString(classNames)) {
		logger.error("[addClremoveClassass] 参数异常：classNames<${0}>必须是字符串类型.", JSON.stringify(classNames));
		return false;
	}

	var originClassName = " " + element.className + " ";
	var currentClassNames = classNames.split(" ");

	for (var i = 0, j = currentClassNames.length; i < j; i++) {
		var currentClassName = currentClassNames[i];
		if (!currentClassName) continue;

		if (element.classList) {
			element.classList.remove(currentClassName);
		} else {
			if (hasClass(element, currentClassName)) {
				originClassName = originClassName.replace(" " + currentClassName + " ", " ");
			}
		}
	}

	if (!element.classList) {
		element.className = removeWhitespace(originClassName);
	}
}

/**
 * 获取样式
 * @param {Element} element 元素对象
 * @param {string} styleName 样式名
 * @param {*} defaultValue 样式默认值
 * @returns {*} - 返回指定样式属性的值，若获取失败则返回默认值。
 *
 * @example
 * var element = document.getElementById("myElement");
 * var color = getStyle(element, "color");
 * console.log("元素的颜色值为：" + color);
 */
export function getStyle(element, styleName, defaultValue) {
	defaultValue = arguments.length > 2 ? defaultValue : null;

	if (!isDom(element)) {
		logger.error("[getStyle] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return defaultValue;
	}

	if (!isString(styleName)) {
		logger.error("[getStyle] 参数异常：styleName必须是字符串类型：${0}", JSON.stringify(styleName));
		return defaultValue;
	}

	styleName = camelCase(styleName);
	if (styleName === "float") {
		styleName = "cssFloat";
	}

	try {
		var computed = document.defaultView.getComputedStyle(element, "");
		return element.style[styleName] || computed ? computed[styleName] : defaultValue;
	} catch (e) {
		return element.style[styleName];
	}
}

/**
 * 设置样式
 * @param {Element} element 元素对象
 * @param {string|Object} styleName 样式名
 * @param {*} value 样式值
 *
 * @example
 * var element = document.getElementById("myElement");
 *
 * // 设置单个样式属性
 * setStyle(element, "color", "red");
 *
 * // 设置多个样式属性
 * setStyle(element, {
 *   color: "red",
 *   backgroundColor: "blue"
 * });
 */
export function setStyle(element, styleName, value) {
	if (!isDom(element)) {
		logger.error("[setStyle] 参数异常：element<${0}>必须是DOM元素.", JSON.stringify(element));
		return false;
	}

	if (!isString(styleName) && !isObject(styleName)) {
		logger.error("[getStyle] 参数异常：styleName<${0}>必须是字符串类型或对象类型.", JSON.stringify(styleName));
		return false;
	}

	if (isObject(styleName)) {
		for (var prop in styleName) {
			if (styleName.hasOwnProperty(prop)) {
				setStyle(element, prop, styleName[prop]);
			}
		}
	} else {
		styleName = camelCase(styleName);
		element.style[styleName] = value;
	}
}

/**
 * 根据事件获取位置信息
 *
 * @memberof event
 * @function eventPosition
 * @param {Event} event - 触发的事件对象
 * @returns {{x: number, y: number}} - 包含 x 和 y 坐标的位置对象
 *
 * @example
 * // 鼠标事件
 * const event = { pageX: 100, pageY: 200 };
 * const position = eventPosition(event);
 * console.log(position); // { x: 100, y: 200 }
 *
 * @example
 * // 触屏事件
 * const event = { changedTouches: [{ pageX: 150, pageY: 250 }] };
 * const position = eventPosition(event);
 * console.log(position); // { x: 150, y: 250 }
 */
export function eventPosition(event) {
	// 初始化位置对象
	var position = {
		x: 0, // 默认 x 坐标为 0
		y: 0, // 默认 y 坐标为 0
	};

	var isMouse = !event.changedTouches; //是否是鼠标事件，false为触屏；
	// 判断是否为鼠标事件
	if (isMouse) {
		position.x = event.pageX; // 获取鼠标的页面 x 坐标
		position.y = event.pageY; // 获取鼠标的页面 y 坐标
	}

	// 判断是否为触屏事件
	else {
		var touches = event.changedTouches ? event.changedTouches : event.originalEvent.changedTouches;
		position.x = touches[0].pageX; // 获取触摸点的页面 x 坐标
		position.y = touches[0].pageY; // 获取触摸点的页面 y 坐标
	}

	return position; // 返回位置对象
}

/**
 * 对指定的 DOM 元素执行缩放动画效果。
 * @param {HTMLElement} element - 需要执行动画的 DOM 元素。
 *
 * @example
 * // 示例:
 * const element = document.getElementById('myElement');
 * animateScale(element); // 执行元素缩放动画效果。
 */
export function animateScale(element) {
	// 取消过渡效果，将元素缩放至一半大小
	element.style.transition = "0s";
	element.style.transform = "scale(0.5)";

	// 设置延时任务，在 10 毫秒后执行
	window.setTimeout(function () {
		// 添加过渡效果，将元素恢复至原始大小
		element.style.transition = "0.3s";
		element.style.transform = "scale(1)";
	}, 10);
}

export function mouseDrag(event, element, data) {
	// 忽略右键
	if (event.which === 3) return;

	// 获取定位
	var point = eventPosition(event);

	// 事件模式: 鼠标事件[true]、触屏事件[false]
	var mouseEvent = !event.changedTouches;

	// 更新拖拽信息
	data.drag.x = point.x;
	data.drag.y = point.y;
	data.drag.positionable = true;

	// 鼠标抬起函数
	var mouseUp = function (event) {
		if (!data.drag.positionable) return;
		data.drag.positionable = false;

		//事件解绑
		if (mouseEvent) {
			$(element).off({
				mousemove: mouseMove,
				mouseup: mouseUp,
			});
		} else {
			$(element).off({
				touchmove: mouseMove,
				touchend: mouseUp,
			});
		}
	};

	// 鼠标移动函数
	var mouseMove = function (event) {
		if (!data.drag.positionable) return;

		var point = eventPosition(event);
		var eventX = point.x;
		var eventY = point.y;

		data.style.position.x += data.style.position.left ? eventX - data.drag.x : data.drag.x - eventX;
		data.style.position.y += data.style.position.top ? eventY - data.drag.y : data.drag.y - eventY;

		element.style.transform = "translate(" + data.style.position.x + "px, " + data.style.position.y + "px)";

		data.drag.x = point.x;
		data.drag.y = point.y;
	};

	//事件绑定
	if (mouseEvent) {
		$(element).on({
			mouseup: mouseUp,
			mousemove: mouseMove,
		});
	} else {
		$(element).on({
			touchend: mouseUp,
			touchmove: mouseMove,
		});
	}
}
