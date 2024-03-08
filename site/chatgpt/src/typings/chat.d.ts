declare namespace Chat {
	/**
	 * 聊天消息对象
	 */
	interface Chat {
		dateTime: string; // 消息的时间戳
		text: string; // 消息文本内容
		inversion?: boolean; // 是否反转消息显示样式（可选）
		error?: boolean; // 是否为错误消息（可选）
		loading?: boolean; // 是否为加载中消息（可选）
		conversationOptions?: ConversationRequest | null; // 对话选项（可选）
		requestOptions: { prompt: string; options?: ConversationRequest | null }; // 请求选项
	}

	/**
	 * 历史记录对象
	 */
	interface History {
		title: string; // 标题
		isEdit: boolean; // 是否可编辑
		uuid: number; // 唯一标识符
	}

	/**
	 * 聊天状态对象
	 */
	interface ChatState {
		active: number | null; // 活动的聊天序号（null 表示无活动聊天）
		history: History[]; // 历史记录数组
		network: boolean | null; // 网络连接状态（null 表示未知）
		chat: { uuid: number; data: Chat[] }[]; // 聊天数据数组
	}

	/**
	 * 对话请求对象
	 */
	interface ConversationRequest {
		conversationId?: string; // 对话 ID（可选）
		parentMessageId?: string; // 父消息 ID（可选）
	}

	/**
	 * 对话响应对象
	 */
	interface ConversationResponse {
		conversationId: string; // 对话 ID
		detail: {
			choices: {
				finish_reason: string; // 完成原因
				index: number; // 索引
				logprobs: any; // 对数概率
				text: string; // 选项文本
			}[];
			created: number; // 创建时间
			id: string; // ID
			model: string; // 模型
			object: string; // 对象
			usage: {
				completion_tokens: number; // 完成令牌数量
				prompt_tokens: number; // 提示令牌数量
				total_tokens: number; // 总令牌数量
			};
		};
		id: string; // ID
		parentMessageId: string; // 父消息 ID
		role: string; // 角色
		text: string; // 文本内容
	}
}
