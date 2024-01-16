/**window 磁贴配置模版 */
export default {
	/**网格定位(从左往右) */
	x: 0,
	/**网格定位(从上往下) */
	y: 0,
	/**网格定位(x轴占位) */
	w: 2,
	/**网格定位(y轴占位) */
	h: 2,
	/**唯一标识 */
	id: "",
	/**承载应用标识 */
	app: "",
	/**标题 */
	title: "",
	/**参数对象(打开时拼接) */
	params: {},
	/**Hash值 */
	hash: "",
	/**拖拽对象 */
	drag: {
		/**网格定位(从左往右) */
		x: 0,
		/**网格定位(从上往下) */
		y: 0,
		/**网格定位(x轴占位) */
		w: 2,
		/**网格定位(y轴占位) */
		h: 2,
		/**处于鼠标按下状态 */
		mouseDown: false,
		/**是否处于大小变更状态 */
		resizable: false,
		/**是否处于重新定位状态 */
		positionable: false,
	},
};
