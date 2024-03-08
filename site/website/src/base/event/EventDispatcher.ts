import EventDefine from "./EventDefine";

/**
 * 事件调度对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class EventDispatcher {
	/**类名 */
	protected static className: string = "EventDispatcher";

	/**消息级别 */
	protected _notifyLevel = 0;

	/**事件仓储对象 */
	protected _eventStorage: { [key: string | number]: any };

	/**事件调度对象 */
	constructor() {
		this._eventStorage = {};
	}

	/**
	 * 增加监听
	 * @param type 类型
	 * @param handle 处理
	 * @param caller 执行域
	 */
	public on(type: string | number, handle: Function, caller: any) {
		let eventDefines: EventDefine[] = this._eventStorage[type];
		if (!eventDefines) {
			eventDefines = this._eventStorage[type] = [];
		} else if (this._notifyLevel !== 0) {
			//这里 1、是为了防止外部修改数据，2、是事件派发比事件监听使用的更多，这样concat操作会少很多。
			this._eventStorage[type] = eventDefines = eventDefines.concat();
		}

		this.createEventDefine(eventDefines, type, caller, handle);
	}

	/**
	 * 去除监听
	 * @param type 类型
	 * @param handle 处理
	 * @param caller 执行域
	 * @returns
	 */
	public off(type: string | number, handle: Function, caller: any) {
		let eventDefines: EventDefine[] = this._eventStorage[type];
		if (!eventDefines) {
			return;
		}

		//这里 1、是为了防止外部修改数据，2、是事件派发比事件移除使用的更多，这样concat操作会少很多。同事件监听一样。
		if (this._notifyLevel !== 0) {
			this._eventStorage[type] = eventDefines = eventDefines.concat();
		}

		this.removeEventDefine(eventDefines, caller, handle);

		if (eventDefines.length == 0) {
			this._eventStorage[type] = null;
		}
	}

	/**
	 * 去除所有监听
	 */
	public offAll() {
		this._eventStorage = {};
	}

	/**
	 * 根据类型去除监听
	 * @param type 类型0
	 */
	public offByType(type: string | number) {
		let eventDefines: EventDefine[] = this._eventStorage[type];
		if (eventDefines) {
			this._eventStorage[type] = null;
		}
	}

	/**
	 * 是否存在监听
	 * @param type 类型
	 * @returns
	 */
	public has(type: string | number): boolean {
		return this.hasEventDefine(type);
	}

	/**
	 * 触发监听
	 * @param type 类型
	 * @param args 参数
	 */
	public emit(type: string | number, ...args: any[]) {
		this.notifyEventDefine(type, ...args);
	}

	/**
	 * 创建事件定义
	 * @param eventDefines 事件集合
	 * @param type 类型
	 * @param caller 执行域
	 * @param handle 处理函数
	 * @returns
	 */
	protected createEventDefine(eventDefines: any[], type: string | number, caller: any, handle: Function): boolean {
		let result: boolean = true;

		let eventCount = eventDefines.length;
		for (let i = 0; i < eventCount; i++) {
			if (eventDefines[i].handle == handle && eventDefines[i].caller == caller && eventDefines[i].dispatcher == this) {
				result = false;
				break;
			}
		}

		if (result) eventDefines.push({ type: type, caller: caller, handle: handle, dispatcher: this });

		return result;
	}

	/**
	 * 移除事件定义
	 * @param eventDefines 事件集合
	 * @param caller 执行域
	 * @param handle 处理函数
	 * @returns
	 */
	protected removeEventDefine(eventDefines: any[], caller: any, handle: Function): boolean {
		let result: boolean = false;

		let eventCount = eventDefines.length;
		for (let i = 0; i < eventCount; i++) {
			if (eventDefines[i].handle == handle && eventDefines[i].caller == caller && eventDefines[i].dispatcher == this) {
				eventDefines.splice(i, 1);
				result = true;
				break;
			}
		}

		return result;
	}

	/**
	 * 是否存在事件定义
	 * @param type 类型
	 * @returns
	 */
	protected hasEventDefine(type: string | number): boolean {
		let eventDefine = this._eventStorage;
		return !!eventDefine[type];
	}

	/**
	 * 通知事件定义
	 * @param type 类型
	 * @param args 参数
	 * @returns
	 */
	protected notifyEventDefine(type: string | number, ...args: any[]) {
		let eventDefine = this._eventStorage;

		let eventDefines: EventDefine[] = eventDefine[type];
		if (!eventDefines) {
			return true;
		}

		let eventCount = eventDefines.length;
		if (eventCount == 0) {
			return;
		}

		//做个标记，防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为dispatch()方法调用通常比on()等方法频繁。
		this._notifyLevel++;
		for (let i = 0; i < eventCount; i++) {
			let event = eventDefines[i];
			event.handle.call(event.caller, ...args);
		}
		this._notifyLevel--;
	}
}
