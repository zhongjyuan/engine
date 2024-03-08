import { ss } from "@/utils/storage";

// 本地存储的键名
const LOCAL_NAME = "SECRET_TOKEN";

/**
 * 获取令牌（Token）值
 * @returns 令牌值
 */
export function getToken() {
	return ss.get(LOCAL_NAME);
}

/**
 * 设置令牌（Token）值
 * @param token - 要设置的令牌值
 */
export function setToken(token: string) {
	return ss.set(LOCAL_NAME, token);
}

/**
 * 移除令牌（Token）
 */
export function removeToken() {
	return ss.remove(LOCAL_NAME);
}
