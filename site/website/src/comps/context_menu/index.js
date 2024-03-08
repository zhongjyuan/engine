/**
 * 上下文菜单 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月14日10:28:42
 */
export default (() => {
	/**样式类名 */
	const _className = "comp-context-menu";

	/**
	 * 移除上下文菜单的函数
	 *
	 * @example
	 * // 示例1: 移除具有指定类名的上下文菜单
	 * _remove();
	 */
	function _remove() {
		// 使用类选择器找到具有指定类名的上下文菜单元素，并移除它们
		$("." + _className).remove();
	}

	/**
	 * 阻止事件传播和默认行为的函数
	 * @param {Event} event 触发的事件对象
	 *
	 * @example
	 * // 阻止点击事件的传播和默认行为
	 * const button = document.querySelector('button');
	 * button.addEventListener('click', _stopProp);
	 *
	 * @example
	 * // 阻止表单提交事件的传播和默认行为
	 * const form = document.querySelector('form');
	 * form.addEventListener('submit', _stopProp);
	 */
	function _stopProp(event) {
		// 判断事件是否可被取消
		if (event.cancelable) {
			// 判断默认行为是否已经被禁用
			if (!event.defaultPrevented) {
				event.preventDefault(); // 取消默认行为
			}
		}
		event.stopImmediatePropagation(); // 阻止事件继续传播到其他同类型的事件监听器
		event.stopPropagation(); // 阻止事件继续传播到父元素
	}

	/**
	 * 获取主要内容的函数
	 * @param {string} text 输入的文本
	 * @returns {string} 处理后的文本，去除所有标签
	 *
	 * @example
	 * const htmlText = "<h1>Title</h1><p>Paragraph</p>";
	 * const mainContent = _mainContent(htmlText);
	 * console.log(mainContent); // 输出: "TitleParagraph"
	 *
	 * @example
	 * const htmlText2 = "<div><span>Hello, <b>world!</b></span></div>";
	 * const mainContent2 = _mainContent(htmlText2);
	 * console.log(mainContent2); // 输出: "Hello, world!"
	 */
	function _mainContent(text) {
		return text.replace(/<\/?.+?>/g, ""); // 使用正则表达式替换所有标签为空字符串
	}

	/**
	 * 渲染上下文菜单的函数
	 *
	 * @param {MouseEvent} event 鼠标事件对象
	 * @param {Array|boolean} menu 菜单项数组或布尔值
	 * @param {HTMLElement} trigger 触发上下文菜单的元素
	 * @param {string} theme 主题（可选，默认为 "light"）
	 *
	 * @example
	 * // 示例一
	 * const menu1 = [
	 *   '菜单项一',
	 *   '菜单项二',
	 *   '|', // 分隔线
	 *   ['带子菜单', [
	 *     '子菜单项一',
	 *     '子菜单项二'
	 *   ]]
	 * ];
	 * render(event, menu1, triggerElement, 'dark');
	 *
	 * @example
	 * // 示例二
	 * const menu2 = [
	 *   '菜单项一',
	 *   '菜单项二',
	 *   '|', // 分隔线
	 *   ['带点击事件', function(event) {
	 *     console.log('点击了菜单项');
	 *   }]
	 * ];
	 * render(event, menu2, triggerElement);
	 *
	 * @example
	 * // 示例三
	 * const menu3 = [
	 *   '菜单项一',
	 *   '菜单项二',
	 *   '|', // 分隔线
	 *   ['禁用菜单', null, true], // 第三个元素为 true 表示禁用菜单项
	 *   '|', // 分隔线
	 *   '菜单项三'
	 * ];
	 * render(event, menu3, triggerElement, 'light');
	 *
	 * @example
	 * // 示例四
	 * const menu4 = [
	 *   '菜单项一',
	 *   '菜单项二',
	 *   '|', // 分隔线
	 *   ['带图标', {
	 *     label: '菜单项',
	 *     icon: 'fa fa-file' // 使用 Font Awesome 图标
	 *   }]
	 * ];
	 * render(event, menu4, triggerElement, 'dark');
	 *
	 * @example
	 * // 示例五
	 * const menu5 = [
	 *   '菜单项一',
	 *   {
	 *     label: '菜单项二',
	 *     shortcut: 'Ctrl+K' // 显示快捷键
	 *   },
	 *   '|', // 分隔线
	 *   ['带样式', {
	 *     label: '菜单项',
	 *     className: 'custom-menu-item' // 自定义样式类名
	 *   }]
	 * ];
	 * render(event, menu5, triggerElement, 'light');
	 *
	 */
	function _render(event, menu, trigger, theme = "light") {
		import(/* webpackChunkName: "context-menu" */ "./index.css");

		// 获取鼠标位置
		var x = event.clientX;
		var y = event.clientY;

		// 停止事件传播
		_stopProp(event);

		// 移除已存在的上下文菜单
		_remove();

		// 如果 menu 为假值或为 true，则不渲染菜单
		if (!menu || menu === true) return;

		// 如果 menu 是一个空数组，则使用默认的菜单项
		if (Array.isArray(menu) && menu.length === 0) {
			menu = [["..."]];
		}

		// 创建上下文菜单的 DOM 元素并添加到 body 中
		var dom = $("<div class='" + this._className + " " + theme + "'><ul></ul></div>");
		$("body").append(dom);
		var ul = dom.find("ul");

		// 如果菜单超出页面可视范围，则显示在左侧
		if (x + 150 > document.body.clientWidth) {
			x -= 150;
			ul.addClass("left");
		}

		// 遍历菜单项数组，并根据每个项的类型创建相应的 DOM 元素
		menu.forEach(function (item) {
			if (item === "|") {
				ul.append($("<hr/>")); // 添加分隔线
			} else if (typeof item === "string") {
				ul.append($('<li><div class="title" title="' + _mainContent(item) + '">' + item + "</div></li>")); // 添加简单的菜单项
			} else if (typeof item === "object") {
				var sub = $(
					'<li><div class="title ' + (item[2] === true ? "disable" : "") + '" title="' + _mainContent(item[0]) + '">' + item[0] + "</div></li>"
				);
				ul.append(sub);

				if (Array.isArray(item[1])) {
					sub.addClass("sub"); // 添加子菜单样式
					var subUl = $("<ul></ul>");
					var subMenu = $("<div class='sub " + _className + " " + theme + "'></div>");

					subMenu.append(subUl);
					if (x + 300 > document.body.clientWidth) {
						subMenu.addClass("left");
					}
					sub.append(subMenu);

					var counterForTop = -1;
					item[1].forEach(function (t) {
						if (t === "|") {
							subUl.append($("<hr/>")); // 添加子菜单的分隔线
						} else if (typeof t === "string") {
							subUl.append($('<li><div class="title" title="' + _mainContent(t) + '">' + t + "</div></li>")); // 添加子菜单的简单菜单项
							counterForTop++;
						} else if (typeof t === "object") {
							var subLi = $(
								'<li><div class="title ' + (t[2] === true ? "disable" : "") + '" title="' + _mainContent(t[0]) + '">' + t[0] + "</div></li>"
							);
							subUl.append(subLi);

							if (t[2] !== true) {
								subLi.click(trigger, t[1]); // 给子菜单项添加点击事件
								subLi.click(function () {
									_remove(); // 点击后移除上下文菜单
								});
							}
							counterForTop++;
						}
					});

					if (y + dom.height() > document.body.clientHeight && document.body.clientHeight > 0) {
						subMenu.css("top", "-" + counterForTop * 30 + "px"); // 修正子菜单的位置，使其不超出页面可视范围
					}
				} else if (typeof item[1] === "function" && item[2] !== true) {
					sub.click(trigger, item[1]); // 给菜单项添加点击事件
					sub.click(function () {
						_remove(); // 点击后移除上下文菜单
					});
				}
			}
		});

		// 修正菜单的位置，使其不超出页面可视范围
		if (y + dom.height() > document.body.clientHeight && document.body.clientHeight > 0) {
			y -= dom.height();
		}

		// 设置菜单的位置
		dom.css({
			top: y,
			left: x,
		});
	}

	return { render: _render };
})();
