/**electron 的 TouchBar 模块 */
const TouchBar = require("electron").TouchBar;

/**electron 的 nativeImage 模块 */
const nativeImage = require("electron").nativeImage;

/**TouchBar 模块中的相关成员 */
const { TouchBarButton, TouchBarSpacer } = TouchBar;

/**
 * 触控栏管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月14日18:27:21
 */
const touchBarManagement = {
	/**
	 * 获取适合触控栏尺寸的图标
	 * @param {string} name - 图标名称
	 * @returns {nativeImage} - 返回一个适合触控栏尺寸的图标对象
	 */
	icon: function (name) {
		// 使用 nativeImage 创建的图标默认太大了，需要将其缩小到适合触控栏的尺寸
		var image = nativeImage.createFromNamedImage(name, [-1, 0, 1]);

		var size = image.getSize();

		return image.resize({
			width: Math.round(size.width * 0.65),
			height: Math.round(size.height * 0.65),
		});
	},

	/**
	 * 构建触控栏对象
	 * @param {*} options - 选项对象
	 * @returns {TouchBar|null} - 返回构建的触控栏对象，如果不是 macOS 则返回 null
	 */
	build: function (options = {}) {
		// 如果不是运行在 macOS 上，则返回 null
		if (!isMac) {
			return null;
		}

		// 构建触控栏对象
		return new TouchBar({
			items: [
				// 后退按钮
				new TouchBarButton({
					/**辅助功能标签 */
					accessibilityLabel: l("goBack"),
					/**图标 */
					icon: touchBarManagement.icon("NSImageNameTouchBarGoBackTemplate"),
					/**点击事件处理函数 */
					click: function () {
						// 发送 IPC 消息到当前窗口，执行返回操作
						sendIPCToWindow(windowManagement.getCurrentWin(), "goBack");
					},
				}),
				// 前进按钮
				new TouchBarButton({
					/**辅助功能标签 */
					accessibilityLabel: l("goForward"),
					/**图标 */
					icon: touchBarManagement.icon("NSImageNameTouchBarGoForwardTemplate"),
					/**点击事件处理函数 */
					click: function () {
						// 发送 IPC 消息到当前窗口，执行前进操作
						sendIPCToWindow(windowManagement.getCurrentWin(), "goForward");
					},
				}),
				/**可伸缩的空间 */
				new TouchBarSpacer({ size: "flexible" }),
				// 搜索栏按钮
				new TouchBarButton({
					/**显示在菜单中的文本 */
					label: "    " + l("searchbarPlaceholder") + "                     ",
					/**图标 */
					icon: touchBarManagement.icon("NSImageNameTouchBarSearchTemplate"),
					/**图标定位 */
					iconPosition: "left",
					/**点击事件处理函数 */
					click: function () {
						// 发送 IPC 消息到当前窗口，打开编辑器
						sendIPCToWindow(windowManagement.getCurrentWin(), "openEditor");
					},
				}),
				/**可伸缩的空间 */
				new TouchBarSpacer({ size: "flexible" }),
				// 添加标签页按钮
				new TouchBarButton({
					/**辅助功能标签 */
					accessibilityLabel: l("goForward"),
					/**图标 */
					icon: touchBarManagement.icon("NSImageNameTouchBarAdd"),
					/**点击事件处理函数 */
					click: function () {
						// 发送 IPC 消息到当前窗口，执行添加标签页的操作
						sendIPCToWindow(windowManagement.getCurrentWin(), "addTab");
					},
				}),
				// 查看任务按钮
				new TouchBarButton({
					/**辅助功能标签 */
					accessibilityLabel: l("viewTasks"),
					/**图标 */
					icon: touchBarManagement.icon("NSImageNameTouchBarListViewTemplate"),
					/**点击事件处理函数 */
					click: function () {
						// 发送 IPC 消息到当前窗口，切换任务悬浮窗口的显示状态
						sendIPCToWindow(windowManagement.getCurrentWin(), "toggleTaskOverlay");
					},
				}),
			],
		});
	},
};