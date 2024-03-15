const settingManagement = require("../settings/renderSettingManagement.js");

const { webviews } = require("./webviewManagement.js");

const statisticalManagement = require("./statisticalManagement.js");

/**
 * 页面翻译对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:00:41
 */
const pageTranslations = {
	/** 翻译 API 地址 */
	apiURL: "https://translate-api.minbrowser.org/translate",

	/** 翻译隐私信息 */
	translatePrivacyInfo:
		"When you translate a page, the page contents are sent to Min's servers. We don't save your translations or use them to identify you.",

	/** 支持的语言列表 */
	languages: [
		{
			name: "English",
			code: "en",
		},
		{
			name: "Arabic",
			code: "ar",
		},
		{
			name: "Chinese",
			code: "zh",
		},
		{
			name: "Dutch",
			code: "nl",
		},
		{
			name: "French",
			code: "fr",
		},
		{
			name: "German",
			code: "de",
		},
		{
			name: "Hindi",
			code: "hi",
		},
		{
			name: "Indonesian",
			code: "id",
		},
		{
			name: "Irish",
			code: "ga",
		},
		{
			name: "Italian",
			code: "it",
		},
		{
			name: "Japanese",
			code: "ja",
		},
		{
			name: "Korean",
			code: "ko",
		},
		{
			name: "Polish",
			code: "pl",
		},
		{
			name: "Portuguese",
			code: "pt",
		},
		{
			name: "Russian",
			code: "ru",
		},
		{
			name: "Spanish",
			code: "es",
		},
		{
			name: "Turkish",
			code: "tr",
		},
		{
			name: "Ukranian",
			code: "uk",
		},
		{
			name: "Vietnamese",
			code: "vi",
		},
	],

	/**
	 * 获取语言列表
	 * @returns 语言列表
	 */
	getLanguageList: function () {
		const userPrefs = navigator.languages.map((lang) => lang.split("-")[0]);
		const topLangs = pageTranslations.languages.filter((lang) => userPrefs.includes(lang.code));

		// Translations to/from English are the highest quality in Libretranslate, so always show that near the top
		if (!topLangs.some((lang) => lang.code === "en")) {
			topLangs.push(pageTranslations.languages.find((lang) => lang.code === "en"));
		}
		const otherLangs = pageTranslations.languages.filter((lang) => !userPrefs.includes(lang.code) && lang.code !== "en");
		return [topLangs, otherLangs];
	},

	/**
	 * 翻译页面内容
	 * @param {*} tabId - 标签页 ID
	 * @param {*} language - 目标语言
	 * @returns
	 */
	translateInto(tabId, language) {
		statisticalManagement.incrementValue("translatePage." + language);

		if (!settingManagement.get("translatePrivacyPrompt")) {
			const accepted = confirm(pageTranslations.translatePrivacyInfo);
			if (accepted) {
				settingManagement.set("translatePrivacyPrompt", true);
			} else {
				return;
			}
		}
		webviews.callAsync(tabId, "send", ["translate-page", language]);
	},

	/**
	 * 发起翻译请求
	 * @param {*} tab - 标签页
	 * @param {*} data - 请求数据
	 */
	makeTranslationRequest: async function (tab, data) {
		const requestOptions = {
			method: "POST",
			body: JSON.stringify({
				q: data[0].query,
				source: "auto",
				target: data[0].lang,
			}),
			headers: { "Content-Type": "application/json" },
		};

		fetch(pageTranslations.apiURL, requestOptions)
			.then((res) => res.json())
			.then(function (result) {
				console.log(result);
				webviews.callAsync(tab, "send", [
					"translation-response-" + data[0].requestId,
					{
						response: result,
					},
				]);
			})
			.catch(function (e) {
				// retry once
				setTimeout(function () {
					console.warn("retrying translation request");
					fetch(pageTranslations.apiURL, requestOptions)
						.then((res) => res.json())
						.then(function (result) {
							console.log("after retry", result);
							webviews.callAsync(tab, "send", [
								"translation-response-" + data[0].requestId,
								{
									response: result,
								},
							]);
						});
				}, 5000);
			});
	},

	/**
	 * 初始化
	 */
	initialize: function () {
		webviews.bindIPC("translation-request", this.makeTranslationRequest);
	},
};

module.exports = pageTranslations;
