/**
 * macOS 的 Handoff 支持模块
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日11:14:14
 */
const macHandoff = {
	/**
	 * 初始化
	 */
	initialize: function () {
		// 如果当前平台是 macOS
		if (window.platformType === "mac") {
			// 当选中标签页时触发的事件处理函数
			window.tasks.on("tab-selected", function (id) {
				if (window.tabs.get(id)) {
					// 如果当前标签页是私密模式
					if (window.tabs.get(id).private) {
						// 发送空的 URL 给 Handoff
						window.ipc.send("handoffUpdate", { url: "" });
					} else {
						// 发送当前标签页的 URL 给 Handoff
						window.ipc.send("handoffUpdate", { url: window.tabs.get(id).url });
					}
				}
			});

			// 当标签页更新时触发的事件处理函数
			window.tasks.on("tab-updated", function (id, key) {
				if (key === "url" && window.tabs.getSelected() === id) {
					// 如果当前标签页是私密模式
					if (window.tabs.get(id).private) {
						// 发送空的 URL 给 Handoff
						window.ipc.send("handoffUpdate", { url: "" });
					} else {
						// 发送当前标签页的 URL 给 Handoff
						window.ipc.send("handoffUpdate", { url: window.tabs.get(id).url });
					}
				}
			});
		}
	},
};

module.exports = macHandoff;
