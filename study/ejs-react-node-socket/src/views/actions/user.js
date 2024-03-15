import subscribe from "../../tools/socket/subscribe";

import { loadMutilateLanguage } from "./main";

export const LOGOUT = "LOGOUT";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const NEEDUPDATEPASSWORD = "NEEDUPDATEPASSWORD";

/**
 * 登录
 * @param {*} user 用户信息
 * @returns
 */
export function login(user) {
	return (dispatch, getState) => {
		if (should_login(getState(), user)) {
			return dispatch(login_fetch(user, getState()));
		}
	};
}

/**
 * 是否应该登录
 * @param {*} state 数据源
 * @returns
 */
function should_login(state) {
	return !state.account.isLogin && !state.account.isLogining;
}

/**
 * 登录请求
 * @param {*} user 用户信息
 * @param {*} state 数据源
 * @returns
 */
function login_fetch(user, state) {
	return (dispatch) => {
		dispatch(login(user));

		state.main.socket.emit(subscribe.login.request, JSON.stringify(user));

		state.main.socket.on(subscribe.login.response, function (data) {
			dispatch(login_success(JSON.parse(data)));
			dispatch(loadMutilateLanguage());
		});

		state.main.socket.on(subscribe.login.error, function (data) {
			dispatch(login_fail(data));
		});

		state.main.socket.on(subscribe.account.needupdatepassword, function (data) {
			dispatch(needUpdateStatus(true));
		});
	};
}

/**
 * 登录成功
 * @param {*} data 账号信息
 * @returns
 */
function login_success(data) {
	return {
		type: LOGIN_SUCCESS,
		user: data,
		isLogin: data.isLogin,
	};
}

/**
 * 登录失败
 * @param {*} data 响应信息
 * @returns
 */
function login_fail(data) {
	return {
		type: LOGIN_FAIL,
		value: data,
	};
}

/**
 * 需要更新密码
 * @param {*} data 是否需要更新密码
 * @returns
 */
export function needUpdatePassword(data) {
	return {
		type: NEEDUPDATEPASSWORD,
		value: data,
	};
}
