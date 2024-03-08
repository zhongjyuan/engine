/// <reference types="vite/client" />

/**
 * 全局环境变量接口，用于描述在 import.meta.env 中可用的变量
 */
interface ImportMetaEnv {
	readonly VITE_GLOB_API_URL: string; // 全局 API URL 地址
	readonly VITE_GLOB_API_TIMEOUT: string; // 全局 API 超时时间
	readonly VITE_APP_API_BASE_URL: string; // 应用程序 API 基础 URL 地址
}
