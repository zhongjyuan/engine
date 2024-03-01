import ZDictionary from "@base/struct/ZDictionary";
import { dictionary as DicEvent } from "@common/consts/event";

import EventDispatcher from "./EventDispatcher";

/**
 * 事件字典对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class EventDictionary extends ZDictionary {
	[key: string]: any;
	/**数据值集合 */
	private __list: any[];
	/**事件调度对象 */
	private __dispatcher: EventDispatcher;

	/**
	 * 事件字典对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 */
	constructor() {
		super();
		this.__list = [];
		this.__dispatcher = new EventDispatcher();
	}

	/**
	 * 增加数据值
	 * @param value 数据值
	 */
	private addValue(value: Object) {
		this.__list.push(value);
	}

	/**
	 * 移除数据值
	 * @param value 数据值
	 */
	private delValue(value: Object) {
		let index: number = this.__list.indexOf(value);
		if (index > -1) this.__list.splice(index, 1);
	}

	/**
	 * 更新数据值
	 * @param oldValue 旧数据值
	 * @param newValue 新数据值
	 */
	private updateValue(oldValue: Object, newValue: Object) {
		let index: number = this.__list.indexOf(oldValue);
		if (index > -1) this.__list.splice(index, 1, newValue);
	}

	/**
	 * 设置数据
	 * @param key 数据键
	 * @param value 数据值
	 */
	private setData(key: any, value: Object) {
		if (this[key]) {
			this.__dispatcher.emit(DicEvent.PRE_UPDATE, [value, this[key], key]); //参数为newData,oldData,key

			this.updateValue(this[key], value);

			this[key] = value;

			this.__dispatcher.emit(DicEvent.UPDATE, [value, this[key], key]); //参数为newData,oldData,key
		} else {
			this.__dispatcher.emit(DicEvent.PRE_ADD, [value, this[key], key]); //参数为newData,oldData,key

			this.addValue(value);

			this[key] = value;

			this.__dispatcher.emit(DicEvent.ADD, [value, this[key], key]); //参数为newData,oldData,key
		}
	}

	/**
	 * 移除数据
	 * @param key 数据键
	 */
	private delData(key: any) {
		if (this[key]) {
			let oldValue: Object = this[key];

			this.__dispatcher.emit(DicEvent.PRE_DEL, [null, oldValue, key]); //参数为newData,oldData,key

			this.delValue(oldValue);

			delete this[key];

			this.__dispatcher.emit(DicEvent.DEL, [null, oldValue, key]); //参数为newData,oldData,key
		}
	}

	/**
	 * 处理NULL数据值
	 * @param key 数据键
	 * @param value 数据值
	 * @returns
	 */
	private handleNullValue(key: any, value: Object): boolean {
		if (value == null) {
			this.delData(key);
			return false;
		}

		return true;
	}

	/**
	 * 增加
	 * @param key 键
	 * @param value 值
	 */
	public add(key: any, value: Object) {
		if (this.handleNullValue(key, value)) this.setData(key, value);
	}

	/**
	 * 更新
	 * @param key 键
	 * @param value 值
	 */
	public update(key: any, value: Object) {
		if (this.handleNullValue(key, value)) this.setData(key, value);
	}

	/**
	 * 移除
	 * @param key 键
	 */
	public del(key: any) {
		this.delData(key);
	}

	/**
	 * 清除
	 */
	public clean() {
		this.__dispatcher.emit(DicEvent.PRE_CLEAN);

		let temp: any[] = this.keys;
		for (const s of temp) {
			delete this[s];
		}

		this.__list = [];
		this.__dispatcher.emit(DicEvent.CLEAN);
	}

	/**
	 * 设置
	 * @param dic 事件字典
	 */
	public set(dic: EventDictionary) {
		this.clean();
		for (let i in dic) {
			this.add(i, dic[i]);
		}
	}

	/**
	 * 复制
	 * @param dic 事件字典
	 * @returns
	 */
	public copy(dic: EventDictionary) {
		let copy = new EventDictionary();
		copy.values = dic.values.concat();
		return copy;
	}

	/**
	 * 切片[返回一个键/值对的数组,使用key 和 value访问]
	 * @param startIndex 开始下标
	 * @param endIndex 结束下标
	 * @returns
	 */
	public slice(startIndex: number = 0, endIndex: number = 166777215): any[] {
		let sliced: any[] = this.keys.slice(startIndex, endIndex);
		let result: any[] = [];

		for (let i: number = 0; i < sliced.length; i++) {
			let obj: { [key: string]: any } = {};

			obj["key"] = sliced[i];
			obj["value"] = this[sliced[i]];

			result.push(obj);

			this.delValue(this[sliced[i]]);
			delete this[sliced[i]];
		}

		return result;
	}

	/**
	 * 切片[返回一个键/值对的数组,使用key 和 value访问]
	 * @param startIndex 开始下标
	 * @param deleteCount 删除数量
	 * @returns
	 */
	public splice(startIndex: number, deleteCount: number): any[] {
		let spliced: any[] = this.keys.splice(startIndex, deleteCount);
		let result: any[] = [];

		for (let i: number = 0; i < spliced.length; i++) {
			let obj: { [key: string]: any } = {};

			obj["key"] = spliced[i];
			obj["value"] = this[spliced[i]];

			result.push(obj);

			this.delValue(this[spliced[i]]);
			delete this[spliced[i]];
		}

		return result;
	}

	/**
	 * 数据键集合
	 */
	public get keys(): any[] {
		let temp: any[] = [];

		for (let key in this) {
			if (!key.startsWith("__")) {
				temp.push(key);
			}
		}

		return temp;
	}

	/**
	 * 数据值集合
	 */
	public get values(): any[] {
		return this.__list;
	}

	/**
	 * 数据值集合
	 */
	public set values(list: any[]) {
		this.__list = list;
	}

	/**
	 * 触发事件
	 * @param event 事件类型
	 */
	public dispatchEvent(event: any) {
		this.__dispatcher.emit(event);
	}

	/**
	 * 增加事件监听
	 * @param type 事件类型
	 * @param listener 监听函数
	 * @param target 执行域
	 */
	public addEventListener(type: string, listener: Function, target: Object) {
		this.__dispatcher.on(type, listener, target);
	}

	/**
	 * 移除事件监听
	 * @param type 事件类型
	 * @param listener 监听函数
	 * @param target 执行域
	 */
	public removeEventListener(type: string, listener: Function, target: Object) {
		this.__dispatcher.off(type, listener, target);
	}
}
