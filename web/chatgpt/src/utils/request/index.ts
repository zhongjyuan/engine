import type {
	AxiosProgressEvent,
	AxiosResponse,
	GenericAbortSignal,
} from "axios";
import request from "./axios"; // 导入封装的 axios 实例
import { useAuthStore } from "@/store";

// 定义 HTTP 请求选项的接口
export interface HttpOption {
	url: string;
	data?: any;
	method?: string;
	headers?: any;
	onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
	signal?: GenericAbortSignal;
	beforeRequest?: () => void;
	afterRequest?: () => void;
}

// 定义响应数据的接口
export interface Response<T = any> {
	data: T;
	message: string | null;
	status: string;
}

// 发起 HTTP 请求的函数
function http<T = any>({
	url,
	data,
	method,
	headers,
	onDownloadProgress,
	signal,
	beforeRequest,
	afterRequest,
}: HttpOption) {
	const successHandler = (res: AxiosResponse<Response<T>>) => {
		const authStore = useAuthStore();

		if (res.data.status === "Success" || typeof res.data === "string")
			return res.data;

		if (res.data.status === "Unauthorized") {
			authStore.removeToken(); // 移除 token
			window.location.reload(); // 刷新页面
		}

		return Promise.reject(res.data);
	};

	const failHandler = (error: Response<Error>) => {
		afterRequest?.(); // 执行请求后操作
		throw new Error(error?.message || "Error");
	};

	beforeRequest?.(); // 执行请求前操作

	method = method || "GET"; // 如果未指定请求方法，默认为 GET

	const params = Object.assign(
		typeof data === "function" ? data() : data ?? {},
		{}
	);

	return method === "GET"
		? request
				.get(url, { params, signal, onDownloadProgress }) // 发起 GET 请求
				.then(successHandler, failHandler)
		: request
				.post(url, params, { headers, signal, onDownloadProgress }) // 发起 POST 请求
				.then(successHandler, failHandler);
}

// 发起 GET 请求的函数
export function get<T = any>({
	url,
	data,
	method = "GET",
	onDownloadProgress,
	signal,
	beforeRequest,
	afterRequest,
}: HttpOption): Promise<Response<T>> {
	return http<T>({
		url,
		method,
		data,
		onDownloadProgress,
		signal,
		beforeRequest,
		afterRequest,
	});
}

// 发起 POST 请求的函数
export function post<T = any>({
	url,
	data,
	method = "POST",
	headers,
	onDownloadProgress,
	signal,
	beforeRequest,
	afterRequest,
}: HttpOption): Promise<Response<T>> {
	return http<T>({
		url,
		method,
		data,
		headers,
		onDownloadProgress,
		signal,
		beforeRequest,
		afterRequest,
	});
}

export default post; // 导出默认的 post 函数
