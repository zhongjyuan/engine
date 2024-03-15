const { clipboard } = require("electron");
const Parser = require("expr-eval").Parser;

const searchbarPluginManagement = require("../searchbarPluginManagement");

/**
 * 计算插件对象
 */
const calculatorPlugin = {
	/**解析器对象 */
	math: new Parser(),

	/**所有运算符和常量的数组 */
	mathOps: {
		get all() {
			var ops = [];

			for (const op of Object.keys(calculatorPlugin.math)) {
				ops = ops.concat(Object.keys(calculatorPlugin.math[op]));
			}

			return ops;
		},
	},
	
	/**有效输入的正则表达式 */
	validRegex: null,

	/**
	 * 执行数学计算
	 * @param {string} text 输入的文本
	 * @param {HTMLInputElement} input 搜索栏输入框
	 * @param {Event} event 触发事件
	 */
	doMath: function (text, input, event) {
		var result; // 计算结果

		// 执行数学计算
		searchbarPluginManagement.reset("calculatorPlugin"); // 重置插件

		try {
			result = calculatorPlugin.math.evaluate(text).toString(); // 计算结果并转换为字符串
			// 如果计算结果包含NaN，则不进行处理
			if (result.includes("NaN")) {
				return;
			}
		} catch (e) {
			return;
		}

		// 添加计算结果到搜索栏插件中
		searchbarPluginManagement.addResult("calculatorPlugin", {
			icon: "carbon:calculator",
			title: result,
			descriptionBlock: l("clickToCopy"), // 点击复制提示
		});

		const container = searchbarPluginManagement.getContainer("calculatorPlugin"); // 获取搜索栏容器

		if (container.childNodes.length === 1) {
			// 如果搜索栏容器中只有一个计算结果
			const item = container.childNodes[0]; // 获取该计算结果
			item.addEventListener("click", (e) => {
				// 点击事件监听
				const titleEl = item.querySelector(".title"); // 获取计算结果元素
				const descriptionBlockEl = item.querySelector(".description-block"); // 获取提示元素

				clipboard.writeText(titleEl.innerText); // 复制计算结果到剪贴板
				descriptionBlockEl.innerText = `${l("copied")}!`; // 修改提示文本
			});
		}
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		calculatorPlugin.math.consts.pi = Math.PI; // 添加常量π
		calculatorPlugin.math.consts.e = Math.E; // 添加自然常数e

		calculatorPlugin.validRegex = new RegExp(
			`^([ 0-9()[\\],;.]+|${calculatorPlugin.mathOps.all
				.join("|")
				.replace(/([+*[\]/?^$])/g, "\\$1")
				.replace("||||", "|\\|\\||")})+$`
		);

		searchbarPluginManagement.register("calculatorPlugin", {
			index: 1, // 插件在搜索栏中的位置
			trigger: function (text) {
				// 判断输入是否满足条件
				if (
					text.length < 3 || // 输入长度需大于等于3
					text.length > 100 || // 输入长度需小于等于100
					(!/__proto__|prototype|constructor/i.test(text) && // 避免输入危险关键字
						!calculatorPlugin.validRegex.test(text)) // 避免输入无效表达式
				) {
					return false; // 返回false表示不触发插件
				}

				try {
					const expression = calculatorPlugin.math.parse(text); // 尝试解析输入的数学表达式
					// 如果表达式中没有运算符，则不触发插件
					if (expression.tokens.length <= 1) {
						return false;
					}
				} catch (e) {
					return false;
				}

				return true; // 返回true表示触发插件
			},
			showResults: debounce(calculatorPlugin.doMath, 200), // 执行计算并显示计算结果
		});
	},
};

module.exports = calculatorPlugin;
