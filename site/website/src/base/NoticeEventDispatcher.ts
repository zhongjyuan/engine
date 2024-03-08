import EventDispatcher from "./event/EventDispatcher";

/**
 * 通知管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class NoticeEventDispatcher extends EventDispatcher {
	/**静态实例 */
	protected static _instance: NoticeEventDispatcher;

	/**获取实例 */
	public static get Instance(): NoticeEventDispatcher {
		return NoticeEventDispatcher._instance || (NoticeEventDispatcher._instance = new NoticeEventDispatcher());
	}

	/**
	 * 发送
	 * @param type 类型
	 * @param args 参数
	 */
	public send(type: string | number, ...args: any[]) {
		this.notifyEventDefine(type, ...args);
	}
}
