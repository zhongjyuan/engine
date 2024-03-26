import axios from "axios";

// create an axios instance
const service = axios.create({
	baseURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_APP_BASE_API : import.meta.env.VITE_SERVER, // url = base url + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
	(config) => {
		// 做一些请求前置，例如添加token
		// const token = useAuthStore().token;
		// if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	(response) => {
		const res = response.data;
		// if the custom code is not 200, it is judged as an error.
		if (res.code !== 200) {
			// 配置响应拦截
			return Promise.reject(new Error(res.msg || "网络异常，请稍后~"));
		} else {
			return res;
		}
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	}
);

export default service;
