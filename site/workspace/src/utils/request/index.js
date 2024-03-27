import request from "./axios";

function http({ url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }) {
	const successHandler = (res) => {
		console.log("res.data");
		if (res.data.status === "Success" || typeof res.data === "string") return res.data;

		if (res.data.status === "Unauthorized") {
			// removeToken();
			window.location.reload();
		}
		console.log(res.data);
		return Promise.reject(res.data);
	};

	const failHandler = (error) => {
		console.log("res.error");
		afterRequest?.();
		throw new Error(error.message || "Error");
	};

	beforeRequest && beforeRequest();

	method = method || "GET";

	const params = Object.assign(typeof data === "function" ? data() : data ?? {}, {});

	const requestMethods = {
		GET: request.get,
		POST: request.post,
		PUT: request.put,
		DELETE: request.delete,
	};

	const selectedRequestMethod = requestMethods[method];

	if (!selectedRequestMethod) {
		return Promise.reject(new Error("Unsupported HTTP method"));
	}

	const requestOptions = method === "GET" ? { params, signal, onDownloadProgress } : { data: params, headers, signal, onDownloadProgress };

	return selectedRequestMethod(url, requestOptions).then(successHandler, failHandler);
}

function post({ url, data, method = "POST", headers, onDownloadProgress, signal, beforeRequest, afterRequest }) {
	return http({
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

function del({ url, data, method = "DELETE", headers, onDownloadProgress, signal, beforeRequest, afterRequest }) {
	return http({
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
function put({ url, data, method = "PUT", headers, onDownloadProgress, signal, beforeRequest, afterRequest }) {
	return http({
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
function get({ url, data, method = "GET", onDownloadProgress, signal, beforeRequest, afterRequest }) {
	return http({
		url,
		method,
		data,
		onDownloadProgress,
		signal,
		beforeRequest,
		afterRequest,
	});
}

export { get, post, put, del };
