const webviewMenuManagement = require("./webviewMenuManagement.js");

const searchbar = require("./searchbar/searchbar.js");

/**
 * 右键菜单管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:19:35
 */
const contextMenuManagement = {
	/**
	 * 初始化函数
	 * 设置右键菜单的功能
	 */
	initialize: function () {
		document.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			e.stopPropagation();

			var inputMenu = [
				[
					{
						label: l("undo"),
						role: "undo",
					},
					{
						label: l("redo"),
						role: "redo",
					},
				],
				[
					{
						label: l("cut"),
						role: "cut",
					},
					{
						label: l("copy"),
						role: "copy",
					},
					{
						label: l("paste"),
						role: "paste",
					},
				],
				[
					{
						label: l("selectAll"),
						role: "selectall",
					},
				],
			];

			let node = e.target;

			while (node) {
				if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
					if (node.id === "tab-editor-input") {
						inputMenu[1].push({
							label: l("pasteAndGo"),
							click: function () {
								searchbar.openURL(window.clipboard.readText());
							},
						});
					}

					webviewMenuManagement.open(inputMenu);

					break;
				}
				node = node.parentNode;
			}
		});
	},
};

module.exports = contextMenuManagement;
