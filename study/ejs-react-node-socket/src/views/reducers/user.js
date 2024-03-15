import {
	LOGOUT,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGIN_REQUEST,
	NEEDUPDATEPASSWORD,
} from "../actions/user";

/**
 * 用户状态容器
 * @param {*} state 数据源(好比组件群里的“群文件”，它是一个单一的数据源，而且是只读的)
 * @param {*} action 动作
 * @returns
 */
export default function userReducer(
	state = {
		user: {},
		errMsg: null,
		isLogin: false,
		isLogining: false,
		needUpdatePassword: false,
		updatePasswordForm: [],
	},
	action
) {
	switch (action.type) {
		case LOGIN_FAIL:
			return Object.assign({}, state, {
				isLogining: false,
				errMsg: action.value,
			});
		case LOGIN_SUCCESS:
			return Object.assign({}, state, {
				isLogining: false,
				user: action.user,
				isLogin: action.isLogin,
			});
		case LOGIN_REQUEST:
			return Object.assign({}, state, {
				isLogining: true,
			});
		case NEEDUPDATEPASSWORD:
			return Object.assign({}, state, {
				isLogining: false,
				needUpdatePassword: action.value,
			});
		case LOGOUT:
			return Object.assign({}, state, {
				isLogin: false,
				user: {},
			});
		default:
			return state;
	}
}
