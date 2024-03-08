/**window 应用配置模版 */
export default {
	/**角标 */
	badge: 0,
	/**自启动 */
	autoRun: 0,
	/**是否插件类型 */
	plugin: false,
	/**是否单例类型 */
	single: false,
	/**是否大小可变 */
	resizable: true,
	/**打开模式 */
	openMode: "normal",
	/**是否显示背景 */
	background: false,
	/**是否显示地址栏 */
	addressBar: false,
	/**地址是否随机增加令牌 */
	urlRandomToken: true,
	/**地址 */
	url: "",
	/**磁贴地址(进行磁贴Iframe嵌套) */
	tileUrl: "",
	/**标题 */
	title: "应用模板",
	/**版本 */
	version: "1.0.0",
	/**开发方 */
	developer: "zhongjyuan",
	/**描述 */
	description: "App Template",
	/**图标 */
	icon: {
		/**类型[fa|image|str] */
		type: "fa",
		/**内容*/
		content: "wpforms",
		/**底色 */
		background: "#436fde",
	},
	/**尺寸 */
	size: {
		/**宽度(x为桌面宽度) */
		width: "x*0.8",
		/**高度(y为桌面高度) */
		height: "y*0.8-80",
	},
	/**定位 */
	position: {
		/**X轴位置(x为桌面宽度) */
		x: "x*0.05",
		/**Y轴位置(y为桌面高度) */
		y: "y*0.05",
		/**开启顶部定位(Y) */
		top: true,
		/**开启左侧定位(X) */
		left: true,
		/**是否自动偏移(多个窗体错开) */
		autoOffset: true,
	},
};
