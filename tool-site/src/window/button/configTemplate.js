/**window 按钮配置模版 */
export default {
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
		/**前面位置下标 */
		lastIndex: 0,
		/**后面位置下标 */
		nextIndex: 0,
		/**处于鼠标按下状态 */
		mouseDown: false,
		/**是否处于重新定位状态 */
		positionable: false,
	},
};
