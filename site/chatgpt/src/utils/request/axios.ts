import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "@/store";

// 创建一个 Axios 实例
const service: AxiosInstance = axios.create({
	// 设置 baseURL 为环境变量中的 API 地址
	baseURL: import.meta.env.VITE_GLOB_API_URL,
});

// 请求拦截器
service.interceptors.request.use(
	// 在发送请求之前执行的函数
	(config) => {
		// 从认证存储中获取 token
		const token = useAuthStore().token;
		// 如果存在 token，则在请求头中添加 Authorization 字段
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	// 请求错误处理
	(error) => {
		return Promise.reject(error.response);
	}
);

// 响应拦截器
service.interceptors.response.use(
	// 对响应数据进行处理
	(response: AxiosResponse): AxiosResponse => {
		// 如果响应状态码为 200，则直接返回响应数据
		if (response.status === 200) return response;

		// 如果响应状态码不为 200，则抛出错误
		throw new Error(response.status.toString());
	},
	// 响应错误处理
	(error) => {
		return Promise.reject(error);
	}
);

export default service;
