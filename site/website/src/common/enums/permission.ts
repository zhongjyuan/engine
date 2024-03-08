/**
 * 权限
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月7日15:14:34
 */
export const permission = {
	view: { value: 0, remind: "查看" },
	read: { value: 1, remind: "阅读" },
	add: { value: 2, remind: "添加" },
	edit: { value: 3, remind: "编辑" },
	remove: { value: 4, remind: "移除" },
	close: { value: 5, remind: "关闭" },
	batch: { value: 6, remind: "批量" },
	draft: { value: 7, remind: "暂存" },
	cancel: { value: 8, remind: "取消" },
	submit: { value: 9, remind: "提交" },
	import: { value: 10, remind: "导入" },
	export: { value: 11, remind: "导出" },
	upload: { value: 12, remind: "上传" },
	download: { value: 13, remind: "下载" },
	reset: { value: 14, remind: "重置" },
	change: { value: 15, remind: "变更" },
	revert: { value: 16, remind: "恢复" },
	revoke: { value: 17, remind: "撤销" },
	union: { value: 18, remind: "合并" },
	split: { value: 19, remind: "拆分" },
	count: { value: 20, remind: "统计" },
	print: { value: 21, remind: "打印" },
	assign: { value: 22, remind: "分配" },
	setting: { value: 23, remind: "设置" },
	skip: { value: 24, remind: "跳过" },
	link: { value: 25, remind: "关联" },
	move: { value: 26, remind: "移动" },
	copy: { value: 27, remind: "复制" },
	paste: { value: 28, remind: "粘贴" },
	check: { value: 29, remind: "复核" },
	handle: { value: 30, remind: "处理" },
	preview: { value: 31, remind: "预览" },
	convert: { value: 32, remind: "切换" },
	warrant: { value: 33, remind: "授权" },
	abandon: { value: 34, remind: "作废" },
	publish: { value: 35, remind: "发布" },
	rollback: { value: 36, remind: "返回" },
	play: { value: 37, remind: "播放" },
	like: { value: 38, remind: "点赞" },
	share: { value: 39, remind: "分享" },
	comment: { value: 40, remind: "评论" },
	initiate: { value: 41, remind: "发起" },
	withdraw: { value: 42, remind: "撤回" },
	approve: { value: 43, remind: "审批" },
	reject: { value: 44, remind: "驳回" },
	adjust: { value: 45, remind: "调整" },
	cc: { value: 46, remind: "抄送" },
	urge: { value: 47, remind: "催办" },
	forward: { value: 48, remind: "转发" },
	circulate: { value: 49, remind: "传阅" },
	archive: { value: 50, remind: "归档" },
	addSign: { value: 51, remind: "加签" },
	countesign: { value: 52, remind: "会签" },
	rejectReview: { value: 53, remind: "打回重审" },
	rejectAdjust: { value: 54, remind: "打回调整" },
};

/**权限枚举 */
export default {
	...permission,
};
