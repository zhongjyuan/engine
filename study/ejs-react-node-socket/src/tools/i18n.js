import custom_cn from "../../public/config/locales/zh-CN";
import custom_en from "../../public/config/locales/en-US";

const messages = {};
messages["zh-CN"] = custom_cn;
messages["en-US"] = custom_en;
/**
 * 多语言配置
 * @returns 
 */
export function config() {
	return messages;
}

/**
 * 多语言工具
 * @param {*} language 语言
 * @param {*} key 键
 * @returns 
 */
export function tool(language, key) {
	return messages[language][key];
}
