/**
 * 常见状态
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月7日15:14:34
 */
export const status = {
	NORMAL: { value: 1, remind: "正常" },
	ABNORMAL: { value: 0, remind: "异常" },

	OFFICIAL: { value: 1, remind: "正式" },
	DRAFT: { value: 0, remind: "草稿" },

	OPEN: { value: 1, remind: "打开" },
	CLOSE: { value: 0, remind: "关闭" },

	VISIBLE: { value: 1, remind: "可见" },
	HIDDEN: { value: 0, remind: "隐藏" },

	ENABLE: { value: 1, remind: "启用" },
	DISABLE: { value: 0, remind: "禁用" },

	ACTIVE: { value: 1, remind: "激活" },
	INACTIVE: { value: 0, remind: "停用" },

	PLAYING: { value: 1, remind: "播放中" },
	PAUSING: { value: 0, remind: "暂停中" },

	START: { value: 1, remind: "开始" },
	FINISH: { value: 0, remind: "结束" },

	ONLINE: { value: 1, remind: "在线" },
	OFFLINE: { value: 0, remind: "离线" },

	LOCK: { value: 1, remind: "锁定" },
	UNLOCK: { value: 0, remind: "解锁" },
};

/**
 * 优先级
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月14日18:13:12
 */
export const priority = {
	LOW: { value: 1, remind: "低优先级" },
	MEDIUM: { value: 2, remind: "中优先级" },
	HIGH: { value: 3, remind: "高优先级" },
};

/**
 * 严重程度
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月14日18:13:17
 */
export const severity = {
	LOW: { value: 1, remind: "低严重程度" },
	MEDIUM: { value: 2, remind: "中严重程度" },
	HIGH: { value: 3, remind: "高严重程度" },
};

/**
 * 进度
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月14日18:13:23
 */
export const progress = {
	NOT_STARTED: { value: 0, remind: "未开始" },
	IN_PROGRESS: { value: 50, remind: "进行中" },
	COMPLETED: { value: 100, remind: "已完成" },
};

/**
 * 审批状态
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月14日18:13:27
 */
export const approval = {
	PENDING: { value: 1, remind: "待审批" },
	APPROVED: { value: 2, remind: "已批准" },
	REJECTED: { value: 3, remind: "已拒绝" },
	REPULSED: { value: 4, remind: "已打回" },
	REVOKED: { value: 5, remind: "已撤销" },
	WITHDRAWN: { value: 6, remind: "已撤回" },
	SUSPENDED: { value: 7, remind: "已挂起" },
	REMINDED: { value: 8, remind: "已催办" },
	TRANSFERRED: { value: 9, remind: "已转办" },
	ADDSIGNED: { value: 10, remind: "已加签" },
	CC: { value: 11, remind: "已抄送" },
	ARCHIVED: { value: 12, remind: "已归档" },
	EXPIRED: { value: 13, remind: "已过期" },
	IN_PROGRESS: { value: 14, remind: "审批中" },
};

/**
 * 可用性
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月14日18:13:33
 */
export const availability = {
	AVAILABLE: { value: 1, remind: "可用" },
	UNAVAILABLE: { value: 0, remind: "不可用" },
	MAINTENANCE: { value: 2, remind: "维护中" },
};

/**
 * 连接状态
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月14日18:13:38
 */
export const connection = {
	CONNECTED: { value: 1, remind: "已连接" },
	DISCONNECTED: { value: 0, remind: "已断开连接" },
	RECONNECTING: { value: 2, remind: "重新连接中" },
};

/**状态枚举 */
export default {
	...status,
	priority: priority,
	severity: severity,
	progress: progress,
	approval: approval,
	availability: availability,
	connection: connection,
};
