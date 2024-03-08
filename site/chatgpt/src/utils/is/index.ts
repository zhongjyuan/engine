// 检查值是否为数字类型
export function isNumber<T extends number>(
	value: T | unknown
): value is number {
	return Object.prototype.toString.call(value) === "[object Number]";
}

// 检查值是否为字符串类型
export function isString<T extends string>(
	value: T | unknown
): value is string {
	return Object.prototype.toString.call(value) === "[object String]";
}

// 检查值是否为布尔类型
export function isBoolean<T extends boolean>(
	value: T | unknown
): value is boolean {
	return Object.prototype.toString.call(value) === "[object Boolean]";
}

// 检查值是否为 null
export function isNull<T extends null>(value: T | unknown): value is null {
	return Object.prototype.toString.call(value) === "[object Null]";
}

// 检查值是否为 undefined
export function isUndefined<T extends undefined>(
	value: T | unknown
): value is undefined {
	return Object.prototype.toString.call(value) === "[object Undefined]";
}

// 检查值是否为对象类型
export function isObject<T extends object>(
	value: T | unknown
): value is object {
	return Object.prototype.toString.call(value) === "[object Object]";
}

// 检查值是否为数组类型
export function isArray<T extends any[]>(value: T | unknown): value is T {
	return Object.prototype.toString.call(value) === "[object Array]";
}

// 检查值是否为函数类型
export function isFunction<T extends (...args: any[]) => any | void | never>(
	value: T | unknown
): value is T {
	return Object.prototype.toString.call(value) === "[object Function]";
}

// 检查值是否为日期类型
export function isDate<T extends Date>(value: T | unknown): value is T {
	return Object.prototype.toString.call(value) === "[object Date]";
}

// 检查值是否为正则表达式类型
export function isRegExp<T extends RegExp>(value: T | unknown): value is T {
	return Object.prototype.toString.call(value) === "[object RegExp]";
}

// 检查值是否为 Promise 类型
export function isPromise<T extends Promise<any>>(
	value: T | unknown
): value is T {
	return Object.prototype.toString.call(value) === "[object Promise]";
}

// 检查值是否为 Set 类型
export function isSet<T extends Set<any>>(value: T | unknown): value is T {
	return Object.prototype.toString.call(value) === "[object Set]";
}

// 检查值是否为 Map 类型
export function isMap<T extends Map<any, any>>(value: T | unknown): value is T {
	return Object.prototype.toString.call(value) === "[object Map]";
}

// 检查值是否为 File 类型
export function isFile<T extends File>(value: T | unknown): value is T {
	return Object.prototype.toString.call(value) === "[object File]";
}
