export * from "./request";
export * from "./storage/local";

/**
 * 检查给定路径是否为绝对路径。
 * @param {string} path - 待检查的路径字符串。
 * @returns {boolean} - 如果是绝对路径则返回 true，否则返回 false。
 */
export const isAbsolutePath = (path) => {
	// 使用正则表达式检查路径是否为绝对路径
	return /^(?:[a-z]+:)?\/\//i.test(path);
};

/**
 * 生成一个随机的大写字母和数字组合的字符串作为名称。
 *
 * @returns {string} - 随机生成的名称
 */
export const generateName = () => {
	// 生成一个随机的字符串，包括大写字母和数字，长度为8
	return Math.random().toString(36).substring(2, 10).toUpperCase();
};

/**
 * 生成随机数
 * @param {number} rememberedValue - 上一次生成的随机数
 * @param {boolean} shouldRemember - 是否记住上一次生成的随机数，默认为false
 * @param {number} max - 生成随机数的最大值，默认为10
 * @returns {number} 生成的随机数
 */
export const randomNumber = (rememberedValue = null, shouldRemember = false, max = 10) => {
	if (shouldRemember && rememberedValue !== null) {
		let temp = rememberedValue; // 保存上次生成的随机数
		rememberedValue = null; // 重置记忆的值
		return temp; // 返回上次保存的随机数
	} else if (shouldRemember) {
		rememberedValue = Math.floor(Math.random() * max); // 生成新的随机数并保存
		return rememberedValue; // 返回新生成的随机数
	}

	return Math.floor(Math.random() * max); // 返回普通生成的随机数
};

/**
 * 获取对象中指定路径下的值。
 * @param {Object} obj - 要查找值的对象。
 * @param {string} path - 要查询的路径，使用点号分隔不同级别的属性。
 * @returns {any} - 返回路径下的值，如果路径无效则返回 false。
 */
export const getPropertyValue = (obj, path) => {
	// 如果路径为 null 或 undefined，则直接返回 undefined
	if (path == null) return undefined;

	// 克隆传入的对象，避免修改原始对象
	let targetObj = { ...obj };

	// 将路径字符串按点号分割成数组
	const pathArray = path.split(".");

	// 遍历路径数组，逐级深入对象直到找到目标值
	for (let i = 0; i < pathArray.length; i++) {
		targetObj = targetObj[pathArray[i]];
		// 如果中间某一级属性不存在，则返回 undefined
		if (targetObj === undefined) return undefined;
	}

	// 返回最终路径下的值
	return targetObj;
};

/**
 * 修改对象中指定路径的属性值
 *
 * @param {Object} obj - 需要修改的对象
 * @param {string} path - 属性路径，用点号分隔不同层级
 * @param {string|boolean} val - 新的属性值，可选，默认为"togg"表示切换当前值
 * @returns {Object} - 更新后的对象
 */
export const updatePropertyValue = (obj, path, val = "togg") => {
	var tmp = obj; // 临时变量保存对象引用
	path = path.split("."); // 将路径字符串以点号分割成数组

	for (var i = 0; i < path.length - 1; i++) {
		tmp = tmp[path[i]]; // 沿着路径访问对象的每一层级
	}

	if (val == "togg") {
		tmp[path[path.length - 1]] = !tmp[path[path.length - 1]]; // 如果val为"togg"，则切换当前属性值的布尔值
	} else {
		tmp[path[path.length - 1]] = val; // 否则将属性值设置为传入的val
	}

	return obj; // 返回更新后的对象
};
