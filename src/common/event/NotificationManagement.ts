import EventDispatcher from "./EventDispatcher";

/**
 * 通知管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class NotificationManagement extends EventDispatcher {
	/**静态实例 */
	protected static _instance: NotificationManagement;

	/**获取实例 */
	public static get Instance(): NotificationManagement {
		return NotificationManagement._instance || (NotificationManagement._instance = new NotificationManagement());
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
