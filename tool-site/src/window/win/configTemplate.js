/**window 窗口配置模版 */
export default {
	/**承载应用标识 */
	app: "",
	/**是否处于最小化状态 */
	min: false,
	/**是否处于初始化状态 */
	init: true,
	/**健康轮询最新时间 */
	pong: null,
	/**窗体状态 */
	state: "normal",
	/**是否大小可变 */
	resizable: true,
	/**是否显示地址栏 */
	addressBar: true,
	/**是否子页支持可用 */
	childSupport: false,
	/**历史样式对象 */
	historyStyle: {
		/**定位对象 */
		position: {
			/**X轴定位 */
			x: 0,
			/**Y轴定位 */
			y: 0,
			/**顶部定位 */
			top: 0,
			/**左侧定位 */
			left: 0,
		},
		/**尺寸对象 */
		size: {
			/**宽度 */
			width: 0,
			/**高度 */
			height: 0,
		},
	},
	/**样式对象 */
	style: {
		/**定位对象 */
		position: {
			/**X轴定位 */
			x: 0,
			/**Y轴定位 */
			y: 0,
			/**顶部定位 */
			top: 0,
			/**左侧定位 */
			left: 0,
		},
		/**尺寸对象 */
		size: {
			/**宽度 */
			width: 0,
			/**高度 */
			height: 0,
		},
	},
	/**拖拽对象 */
	drag: {
		/**X轴定位 */
		x: 0,
		/**Y轴定位 */
		y: 0,
		/**处于鼠标按下状态 */
		mouseDown: false,
		/**是否处于大小变更状态 */
		resizable: false,
		/**是否处于重新定位状态 */
		positionable: false,
	},
	/**地址栏历史对象 */
	historyAddress: {
		/**当前位置 */
		pos: -1,
		/**地址集合 */
		urls: [],
	},
	/**应用源数据 */
	source: {},
	/**窗体Data域(使用ZHONGJYUANAPP时传递给子页面) */
	data: {},
};
