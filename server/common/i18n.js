import languages from "../../config/language.json";

/**
 * 多语言配置
 * @returns
 */
export function languages() {
	return languages;
}

/**
 * 多语言工具
 * @param {*} key 键
 * @param {*} language 语言
 * @returns
 */
export function language(key, language) {
	return languages[`${key}.${language}`];
}
