import { ss } from "@/utils/storage";

// 本地存储键名
const LOCAL_NAME = "chatStorage";

/**
 * 返回默认的聊天状态
 * @returns 默认的聊天状态对象
 */
export function defaultState(): Chat.ChatState {
	const uuid = Date.now();
	return {
		active: uuid, // 激活的 UUID
		history: [{ uuid, title: "New Chat", isEdit: false }], // 聊天历史记录
		chat: [{ uuid, data: [] }], // 聊天数据
		network: true, // 网络状态，默认为 true
	};
}

/**
 * 获取本地存储中的聊天状态
 * @returns 本地存储中的聊天状态对象
 */
export function getLocalState(): Chat.ChatState {
	const localState = ss.get(LOCAL_NAME); // 从本地存储中获取数据
	if (localState && localState.network === undefined) {
		localState.network = true; // 如果网络状态未定义，则设置为 true
	}
	return localState ?? defaultState(); // 返回本地存储中的数据，如果不存在则返回默认状态
}

/**
 * 设置本地存储中的聊天状态
 * @param state - 要设置的聊天状态对象
 */
export function setLocalState(state: Chat.ChatState) {
	ss.set(LOCAL_NAME, state); // 将聊天状态存储到本地
}
