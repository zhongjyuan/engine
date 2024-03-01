import EventDispatcher from "./EventDispatcher";

/**
 * 事件定义对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default interface EventDefine {
	/**类型 */
	type: string | number;

	/**执行域 */
	caller: any;

	/**处理 */
	handle: Function;

	/**调度器 */
	dispatcher: EventDispatcher;
}
