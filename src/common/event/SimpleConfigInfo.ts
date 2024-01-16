import EventDictionary from "./EventDictionary";
import EventDispatcher from "./EventDispatcher";
import { dictionary as DicEvent } from "@common/consts/event";

/**
 * 简单配置对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class SimpleConfigInfo extends EventDispatcher {
	/**
	 * 变更对象
	 */
	protected _changeObj: EventDictionary = new EventDictionary();

	/**
	 * 简单配置对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 */
	constructor() {
		super();
		this._changeObj = new EventDictionary();
		this._changeObj.addEventListener(DicEvent.PRE_ADD, this.changeObjAddPre, this);
		this._changeObj.addEventListener(DicEvent.ADD, this.changeObjAdd, this);
		this._changeObj.addEventListener(DicEvent.PRE_UPDATE, this.changeObjUpdatePre, this);
		this._changeObj.addEventListener(DicEvent.UPDATE, this.changeObjUpdate, this);
		this._changeObj.addEventListener(DicEvent.PRE_DEL, this.changeObjDeletePre, this);
		this._changeObj.addEventListener(DicEvent.DEL, this.changeObjDelete, this);
		this._changeObj.addEventListener(DicEvent.PRE_CLEAN, this.changeObjCleanPre, this);
		this._changeObj.addEventListener(DicEvent.CLEAN, this.changeObjClean, this);
	}

	/**账号 */
	private _account: string = "";
	private static ACCOUNT: string = "ACCOUNT";
	public static ACCOUNT_CHANGE: string = "ACCOUNT_CHANGE";

	/**账号 */
	public get account(): string {
		return this._account;
	}

	/**账号 */
	public set account(value: string) {
		this._account = value;
		this._changeObj[SimpleConfigInfo.ACCOUNT] = true;
	}

	/**昵称 */
	private _nickName: string = "";
	private static NICKNAME: string = "NICKNAME";
	public static NICKNAME_CHANGE: string = "NICKNAME_CHANGE";

	/**昵称 */
	public get nickName(): string {
		return this._nickName;
	}

	/**昵称 */
	public set nickName(value: string) {
		this._nickName = value;
		this._changeObj[SimpleConfigInfo.NICKNAME] = true;
	}

	/**账号变更 */
	private accountChange(newData: string, oldData: string, key: any) {
		this.emit(SimpleConfigInfo.ACCOUNT_CHANGE, this);
	}

	/**
	 * 变更对象增加属性前处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjAddPre(newData: any, oldData: any, key: any) {
		switch (key) {
			case SimpleConfigInfo.ACCOUNT:
				// 业务校验...
				break;
			case SimpleConfigInfo.NICKNAME:
				// 业务校验...
				break;
			default:
				break;
		}
	}

	/**
	 * 变更对象增加属性处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjAdd(newData: any, oldData: any, key: any) {
		switch (key) {
			case SimpleConfigInfo.ACCOUNT:
				this.emit(SimpleConfigInfo.ACCOUNT_CHANGE, this);
				break;
			case SimpleConfigInfo.NICKNAME:
				this.emit(SimpleConfigInfo.NICKNAME_CHANGE, this);
				break;
			default:
				break;
		}
	}

	/**
	 * 变更对象更新属性前处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjUpdatePre(newData: any, oldData: any, key: any) {
		switch (key) {
			case SimpleConfigInfo.ACCOUNT:
				// 业务校验...
				break;
			case SimpleConfigInfo.NICKNAME:
				// 业务校验...
				break;
			default:
				break;
		}
	}

	/**
	 * 变更对象更新属性处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjUpdate(newData: any, oldData: any, key: any) {
		switch (key) {
			case SimpleConfigInfo.ACCOUNT:
				this.emit(SimpleConfigInfo.ACCOUNT_CHANGE, this);
				break;
			case SimpleConfigInfo.NICKNAME:
				this.emit(SimpleConfigInfo.NICKNAME_CHANGE, this);
				break;
			default:
				break;
		}
	}

	/**
	 * 变更对象删除属性前处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjDeletePre(newData: any, oldData: any, key: any) {}

	/**
	 * 变更对象删除属性处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjDelete(newData: any, oldData: any, key: any) {}

	/**
	 * 变更对象清除属性前处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjCleanPre(newData: any, oldData: any, key: any) {}

	/**
	 * 变更对象清除属性处理
	 * @param newData 新数据
	 * @param oldData 旧数据
	 * @param key 键
	 */
	private changeObjClean(newData: any, oldData: any, key: any) {}

	/**
	 * 提交
	 */
	public commit() {
		if (this._changeObj[SimpleConfigInfo.ACCOUNT]) this.emit(SimpleConfigInfo.ACCOUNT_CHANGE, this);

		if (this._changeObj[SimpleConfigInfo.NICKNAME]) this.emit(SimpleConfigInfo.NICKNAME_CHANGE, this);
	}
}
