/**
 * 人对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class People {
	/**名称 */
	name: string;

	/**年龄 */
	age: number = 27;

	/**
	 * 人对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param name 名称
	 */
	constructor(name: string) {
		this.name = name;
	}

	/**
	 * 信息
	 */
	info() {
		console.log(`My name is ${this.name}, and I am ${this.age} years old`);
	}
}
