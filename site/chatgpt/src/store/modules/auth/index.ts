import { defineStore } from "pinia";
import { getToken, removeToken, setToken } from "./helper";
import { store } from "@/store";
// import { fetchSession } from '@/api'

// 授权状态接口
export interface AuthState {
	token: string | undefined; // 令牌值
	session: { auth: boolean } | null; // 会话信息
}

// 使用 Pinia 定义授权存储
export const useAuthStore = defineStore("auth-store", {
	state: (): AuthState => ({
		token: getToken(), // 初始化令牌为从本地存储中获取的值
		session: null, // 初始会话为空
	}),

	actions: {
		/**
		 * 异步获取会话信息
		 */
		async getSession() {
			// try {
			//   const { data } = await fetchSession<{ auth: boolean }>()
			//   this.session = { ...data }
			//   return Promise.resolve(data)
			// }
			// catch (error) {
			//   return Promise.reject(error)
			// }
		},

		/**
		 * 设置令牌值并存储到本地
		 * @param token - 要设置的令牌值
		 */
		setToken(token: string) {
			this.token = token; // 设置令牌值到状态中
			setToken(token); // 存储令牌值到本地
		},

		/**
		 * 移除令牌值
		 */
		removeToken() {
			this.token = undefined; // 清空令牌值
			removeToken(); // 从本地存储中移除令牌值
		},
	},
});

/**
 * 返回不包含 store 的授权存储
 */
export function useAuthStoreWithout() {
	return useAuthStore(store);
}
