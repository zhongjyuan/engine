/**
 * 生成星级评分
 * @param {Object} item 包含数据的对象
 * @param {number} isReversed 是否反转，默认为 0，不反转；1 表示反转
 * @returns {number} 星级评分
 */
export const generateStarRating = (item, isReversed = 0) => {
	// 初始化星级评分为 0
	let stars = 0;

	// 遍历数据对象中的 URL 字符串
	for (let i = 0; i < item.data.url.length; i++) {
		// 根据是否反转选择计算方式
		if (isReversed) {
			stars += item.data.url[i].charCodeAt() / (i + 3); // 反转时的计算方式
		} else {
			stars += item.data.url[i].charCodeAt() / (i + 2); // 非反转时的计算方式
		}
	}

	// 根据是否反转确定最终星级评分取值范围和精度
	if (isReversed) {
		stars = stars % 12;
		stars = Math.round(stars * 1000);
	} else {
		stars = stars % 4;
		stars = Math.round(stars * 10) / 10;
	}

	// 返回最终的星级评分
	return 1 + stars; // 结果需要加 1
};

/**
 * 计算 calculateEmap 值
 * @param {number} value 输入的值
 * @returns {number} 计算得到的 calculateEmap 值
 */
export const calculateEmap = (value) => {
	value = Math.min(1 / value, 10);
	return value / 11;
};
