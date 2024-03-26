import i18n from "i18next"; // 导入 i18next 库
import Backend from "i18next-xhr-backend"; // 导入 i18next-xhr-backend 插件，用于通过 XHR 加载国际化资源文件
import LanguageDetector from "i18next-browser-languagedetector"; // 导入 i18next-browser-languagedetector 插件，用于根据用户浏览器的语言设置应用程序语言

import { i18nextPlugin } from "translation-check"; // 导入 translation-check 模块，可能是自定义的翻译检查插件
import { initReactI18next } from "react-i18next"; // 导入 react-i18next 模块，用于在 React 中使用 i18next

const fallbackLng = ["zh"]; // 设置默认的回退语言为中文
const availableLanguages = ["en", "da", "de", "es", "fr", "hi", "hu", "ja", "ko", "nl", "ru", "tr", "zh", "si"]; // 定义可用的语言列表

i18n
	.use(Backend) // 使用 Backend 插件加载翻译文件
	.use(LanguageDetector) // 使用 LanguageDetector 插件检测用户语言
	.use(initReactI18next) // 将 i18n 实例传递给 react-i18next
	.use(i18nextPlugin) // 使用自定义的 translation-check 插件
	.init({
		fallbackLng, // 设置回退语言为中文
		backend: {
			loadPath: "locales/{{lng}}/translate.json", // 设置翻译文件加载路径
		},
		detection: {
			checkWhitelist: true, // 语言检测选项
		},
		debug: false, // 是否启用调试模式
		whitelist: availableLanguages, // 设置支持的语言列表
		interpolation: {
			escapeValue: false, // 在 React 中不需要转义值
		},
	});

export default i18n; // 导出 i18n 实例用于应用中的国际化功能
