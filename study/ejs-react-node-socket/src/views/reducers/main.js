import { WEBSOCKET_CLIENT, LANGUAGE_CHOOSE } from "../actions/main";

/**
 * 程序入口状态容器
 * @param {*} state 数据源(好比组件群里的“群文件”，它是一个单一的数据源，而且是只读的)
 * @param {*} action 动作
 * @returns
 */
export default function mainReducer(
	state = {
		collapsed: false,
		language: "zh-CN",
		socket: null,
		results: [],
		images: {
			data: [],
			pagination: { defaultPageSize: 15, total: 0, pageSize: 15, current: 1 },
			loading: false,
		},
		mutilateLanguage: {},
	},
	action
) {
	/**Object.assign:用来复制对象的可枚举属性到目标对象，利用这个特性可以实现对象属性的合并。 */
	switch (action.type) {
		case WEBSOCKET_CLIENT:
			return Object.assign({}, state, {
				socket: action.value,
			});
		case LANGUAGE_CHOOSE:
			return Object.assign({}, state, {
				language: action.value,
				collapsed: state.collapsed,
			});
		default:
			return state;
	}
}
