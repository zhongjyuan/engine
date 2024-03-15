const urlManagement = require("./urlManagement.js");

/**
 * 自动管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日18:48:06
 */
const autoManagement = {
	/**
	 * 根据提供的字符串列表，在输入框中进行自动完成。
	 * @param {HTMLInputElement} input - 输入框元素。
	 * @param {string[]} strings - 字符串列表。
	 * @returns {Object} - 自动完成结果对象：
	 *   valid: 是否有效。
	 *   matchIndex: 匹配项的索引。
	 */
	complete: function (input, strings) {
		// 如果选择的文本后面还有其他内容，无法进行自动完成
		if (input.selectionEnd !== input.value.length) {
			return {
				valid: false,
			};
		}

		var text = input.value.substring(0, input.selectionStart);

		for (var i = 0; i < strings.length; i++) {
			// 检查是否可以进行自动完成
			if (strings[i].toLowerCase().indexOf(text.toLowerCase()) === 0) {
				input.value = text + strings[i].substring(input.selectionStart);
				input.setSelectionRange(text.length, strings[i].length);
				input.setAttribute("data-autocomplete", strings[i]);

				return {
					valid: true,
					matchIndex: i,
				};
			}
		}
		input.removeAttribute("data-autocomplete");

		return {
			valid: false,
		};
	},

	/**
	 * 基于结果项进行自动完成 URL。
	 * 返回值：1 - 自动完成了完整的 URL，0 - 自动完成了域名，-1 - 没有自动完成。
	 * @param {HTMLInputElement} input - 输入框元素。
	 * @param {string} url - URL。
	 * @returns {number} - 自动完成结果：
	 *   1: 自动完成了完整的 URL。
	 *   0: 自动完成了域名。
	 *  -1: 没有自动完成。
	 */
	completeURL: function (input, url) {
		var urlObj = new URL(url);
		var hostname = urlObj.hostname;

		// 可能的自动完成 URL 的不同变体
		var possibleAutocompletions = [
			// 首先是域名，包括非标准端口（如 localhost:8080）
			hostname + (urlObj.port ? ":" + urlObj.port : ""),

			// 如果不匹配，则尝试去掉 www 的主机名。正则表达式需要在末尾加上斜杠，所以我们添加一个斜杠，运行正则表达式，然后移除它
			(hostname + "/").replace(urlManagement.wwwRegex, "$1").replace("/", ""),

			// 接着尝试完整的 URL
			urlManagement.prettyURL(url),

			// 然后尝试带查询字符串的 URL
			urlManagement.basicURL(url),

			// 最后只尝试 URL 的协议部分
			url,
		];

		var autocompleteResult = autoManagement.complete(input, possibleAutocompletions);

		if (!autocompleteResult.valid) {
			return -1;
		} else if (autocompleteResult.matchIndex < 2 && urlObj.pathname !== "/") {
			return 0;
		} else {
			return 1;
		}
	},
};

module.exports = autoManagement;
