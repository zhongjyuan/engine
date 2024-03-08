import type { AxiosProgressEvent, GenericAbortSignal } from "axios";
import { post } from "@/utils/request";

export function fetchChatAPI<T = any>(
	prompt: string,
	options?: { conversationId?: string; parentMessageId?: string },
	signal?: GenericAbortSignal
) {
	return post<T>({
		url: "http://47.116.100.195:188/api/generate",
		data: { prompt, options, userId: window.location.hash },
		signal,
	});
}

export function fetchChatConfig<T = any>() {
	return post<T>({
		url: "http://47.116.100.195:188/api/config",
	});
}

export function fetchChatAPIProcess<T = any>(params: {
	prompt: string;
	network?: boolean;
	options?: { conversationId?: string; parentMessageId?: string };
	signal?: GenericAbortSignal;
	onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}) {
	return post<T>({
		url: "http://47.116.100.195:188/api/generateStream",
		data: {
			prompt: params.prompt,
			userId: window.location.hash,
			network: !!params.network,
		},
		signal: params.signal,
		onDownloadProgress: params.onDownloadProgress,
	});
}

export function fetchSession<T>() {
	return post<T>({
		url: "http://47.116.100.195:188/api/session",
	});
}

export function fetchVerify<T>(token: string) {
	return post<T>({
		url: "http://47.116.100.195:188/api/verify",
		data: { token },
	});
}
