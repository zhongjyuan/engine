import subscribe from "../../tools/socket/subscribe";

export const SOCKET_CLIENT = "SOCKET_CLIENT";
export const LANGUAGE_CHOOSE = "LANGUAGE_CHOOSE";

export const CACHE_MUTILATELANGUAGE = "CACHE_MUTILATELANGUAGE";

/**
 * Socket客户端保存
 * @param {*} socket
 * @returns
 */
export function socketClientSave(socket) {
	return {
		type: SOCKET_CLIENT,
		value: socket,
	};
}

/**
 * 语言切换
 * @param {*} value 值
 * @returns
 */
export function languageChoose(value) {
	return {
		type: LANGUAGE_CHOOSE,
		value: value,
	};
}

/**
 * 加载多语言
 * @returns 
 */
export function loadMutilateLanguage() {
	return (dispatch, getState) => {
		const state = getState();

		state.main.socket.emit(subscribe.mutilatelanguage.request, "");

		state.main.socket.removeListener(subscribe.mutilatelanguage.response);

		state.main.socket.on(subscribe.mutilatelanguage.response, function (data) {
			let mutilateLanguage = {};
			if (data != null) {
				let languages = JSON.parse(data);
				languages.map((language) => {
					mutilateLanguage[language.id] = language;
				});
			}
			dispatch(cacheMutilateLanguage(mutilateLanguage));
		});
	};
}

/**
 * 缓存多语言
 * @param {*} data 多语言数据
 * @returns 
 */
function cacheMutilateLanguage(data) {
	return {
		type: CACHE_MUTILATELANGUAGE,
		value: data,
	};
}
