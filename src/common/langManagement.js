import logger from "./logManagement";

/**
 * 多语言对象
 * @author zhongjyuan
 * @date   2024年1月8日15:12:46
 * @email  zhongjyuan@outlook.com
 * @returns {object} 多语言对象
 */
export default ((runtime) => {
	/**
	 * 获取当前语言
	 * @returns {string} 当前语言
	 */
	function currentLanguage() {
		/**语言(默认语言为中文) */
		var lang = "zh-CN";

		// 在浏览器环境中获取语言设置
		if (typeof navigator !== "undefined" && typeof navigator.language !== "undefined") {
			lang = navigator.language;
		}

		// 在 Node.js 环境中获取语言设置
		else if (typeof process !== "undefined" && typeof process.env !== "undefined" && typeof process.env.LANG !== "undefined") {
			lang = process.env.LANG;
		}

		// 在 Electron 应用程序中获取语言设置(nodeJS)
		// else if (typeof require !== "undefined" && typeof require("electron") !== "undefined") {
		// 	const electron = require("electron");
		// 	if (electron.app) {
		// 		lang = electron.app.getLocale();
		// 	}
		// }

		return lang;
	}

	/**
	 * 根据字符串 ID 获取翻译后的字符串
	 * @param {string} stringId 字符串 ID
	 * @returns {string} 翻译后的字符串
	 */
	function translate(stringId) {
		if (!runtime.lang) {
			runtime.lang = currentLanguage();
		}

		// 从用户语言中获取基础语言，例如：es-419 -> es, nl-BE -> nl
		var userBaseLanguage = runtime.lang.split("-")[0];

		// 尝试使用用户语言进行精确匹配
		if (
			runtime.languages[runtime.lang] &&
			runtime.languages[runtime.lang].translations[stringId] &&
			runtime.languages[runtime.lang].translations[stringId].unsafeHTML !== null
		) {
			return runtime.languages[runtime.lang].translations[stringId];
			// 如果语言代码是特定地区的语言，则尝试使用基础语言进行匹配
		} else if (
			runtime.languages[userBaseLanguage] &&
			runtime.languages[userBaseLanguage].translations[stringId] &&
			runtime.languages[userBaseLanguage].translations[stringId].unsafeHTML !== null
		) {
			return runtime.languages[userBaseLanguage].translations[stringId];
		} else {
			// 默认回退到 zh-CN
			return runtime.languages["zh-CN"].translations[stringId];
		}
	}

	/**
	 * 加载多语言设置
	 */
	function load() {
		/**
		 * 用于静态 HTML 页面
		 * 将本地化字符串插入所有具有 [data-string] 属性的元素中
		 * 设置所有具有 [data-label] 属性的元素的正确属性
		 * 设置所有具有 [data-value] 属性的元素的值属性
		 */
		if (typeof document !== "undefined") {
			if (runtime.languages[currentLanguage()] && runtime.languages[currentLanguage()].rtl) {
				document.body.classList.add("rtl");
			}

			// 将翻译后的字符串插入带有 [data-string] 属性的元素中
			document.querySelectorAll("[data-string]").forEach(function (el) {
				var str = translate(el.getAttribute("data-string"));
				if (typeof str === "string") {
					el.textContent = str;
				} else if (str && str.unsafeHTML && el.hasAttribute("data-allowHTML")) {
					el.innerHTML = str.unsafeHTML;
				}
			});

			// 设置带有 [data-label] 属性的元素的正确属性
			document.querySelectorAll("[data-label]").forEach(function (el) {
				var str = translate(el.getAttribute("data-label"));
				if (typeof str === "string") {
					el.setAttribute("title", str);
					el.setAttribute("aria-label", str);
				} else {
					throw new Error("invalid data-label value: " + str);
				}
			});

			// 设置带有 [data-value] 属性的元素的值属性
			document.querySelectorAll("[data-value]").forEach(function (el) {
				var str = translate(el.getAttribute("data-value"));
				if (typeof str === "string") {
					el.setAttribute("value", str);
				} else {
					throw new Error("invalid data-value value: " + str);
				}
			});
		}
	}

	return {
		load: logger.decorator(load, "lang-load"),
		translate: logger.decorator(translate, "lang-translate"),
		currentLanguage: logger.decorator(currentLanguage, "lang-currentLanguage"),
	};
})(window.zhongjyuan.runtime);
