/**
 * 键盘导航助手对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:13:23
 */
const keyboardNavigationHelper = {
	/** 存储各组的容器元素 */
	groups: {}, // 组名: [容器]

	/**
	 * 将焦点移动到指定方向
	 * @param {*} group 组名
	 * @param {*} direction 移动方向，1表示向前，-1表示向后
	 * @returns
	 */
	moveFocus: function (group, direction) {
		/**存储容器中的可聚焦元素 */
		var items = [];

		/**当前真实聚焦的元素 */
		var realFocusItem;

		/**当前虚拟聚焦的元素 */
		var fakeFocusItem;

		// 遍历组中的容器，获取可聚焦的元素
		keyboardNavigationHelper.groups[group].forEach(function (container) {
			items = items.concat(
				Array.from(container.querySelectorAll('input:not(.ignores-keyboard-focus), [tabindex="-1"]:not(.ignores-keyboard-focus)'))
			);

			if (!realFocusItem) {
				realFocusItem = container.querySelector(":focus");
			}

			if (!fakeFocusItem) {
				fakeFocusItem = container.querySelector(".fakefocus");
			}
		});

		/**当前聚焦的元素 */
		var currentItem = fakeFocusItem || realFocusItem;

		if (!items) {
			return;
		}

		if (!currentItem) {
			items[0].focus();
			return;
		}

		currentItem.classList.remove("fakefocus");

		// 循环遍历可聚焦元素，移动焦点
		while (items.length > 1) {
			var index = items.indexOf(currentItem);

			var nextItem;
			if (items[index + direction]) {
				nextItem = index + direction;
			} else if (index === 0 && direction === -1) {
				nextItem = items.length - 1;
			} else if (index === items.length - 1 && direction === 1) {
				nextItem = 0;
			}
			items[nextItem].focus();

			if (document.activeElement !== items[nextItem]) {
				// 该项无法聚焦，再试一次
				items.splice(nextItem, 1);
			} else {
				// 完成
				break;
			}
		}
	},

	/**
	 * 处理按键事件
	 * @param {*} group 组名
	 * @param {*} e 事件对象
	 */
	handleKeypress: function (group, e) {
		// shift+tab
		if (e.keyCode === 9 && e.shiftKey) {
			e.preventDefault();
			keyboardNavigationHelper.moveFocus(group, -1);
		}

		// tab或向下箭头键
		else if (e.keyCode === 9 || e.keyCode === 40) {
			e.preventDefault();
			keyboardNavigationHelper.moveFocus(group, 1);
		}

		// 向上箭头键
		else if (e.keyCode === 38) {
			e.preventDefault();
			keyboardNavigationHelper.moveFocus(group, -1);
		}
	},

	/**
	 * 将容器添加到指定的组中
	 * @param {*} group 组名
	 * @param {*} container 容器元素
	 */
	addToGroup: function (group, container) {
		if (!keyboardNavigationHelper.groups[group]) {
			keyboardNavigationHelper.groups[group] = [];
		}

		// 根据DOM位置插入容器
		var pos = 0;

		// compareDocumentPosition 是一个有点不寻常的API
		while (
			pos <= keyboardNavigationHelper.groups[group].length - 1 &&
			keyboardNavigationHelper.groups[group][pos].compareDocumentPosition(container) & Node.DOCUMENT_POSITION_FOLLOWING
		) {
			pos++;
		}
		keyboardNavigationHelper.groups[group].splice(pos, 0, container);

		container.addEventListener("keydown", function (e) {
			keyboardNavigationHelper.handleKeypress(group, e);
		});
	},
};

module.exports = keyboardNavigationHelper;
