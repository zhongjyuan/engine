// 为 String 原型添加 strip 方法，用于去除字符串两端指定字符（c）
String.prototype.strip = function (c) {
	// 初始化变量 i 和 j，分别指向字符串开头和结尾
	var i = 0,
		j = this.length - 1;

	// 循环找到从字符串开头开始第一个不为 c 的字符，更新 i
	while (this[i] === c) i++;

	// 循环找到从字符串结尾开始第一个不为 c 的字符，更新 j
	while (this[j] === c) j--;

	// 使用 slice 方法截取去除两端指定字符后的部分，并返回结果
	return this.slice(i, j + 1);
};

// 为 String 原型添加 count 方法，用于统计字符串中指定字符（c）出现的次数
String.prototype.count = function (c) {
	// 初始化结果变量为0
	var i = 0,
		result = 0;

	// 循环遍历字符串中的每个字符
	for (i; i < this.length; i++) if (this[i] == c) result++; // 如果当前字符等于指定字符，结果加1

	return result; // 返回统计结果
};
