import logger from "@base/logger";
import { isChrome, isFirefox, isIE } from "./browse";
import { isFunction, isObject, isString } from "./default";

export default {
	url: logger.decorator(fileUrl, "tool-file-url"),
	save: logger.decorator(saveDataToFile, "tool-save-data-to-file"),
};

/**
 * 根据元素 ID 获取相应的 URL
 * @param {string} elementId - 元素的 ID
 * @returns {string} - 获取到的 URL
 * @example
 * // 获取文本输入框的值
 * var url = fileUrl("textInput");
 * console.log(url); // 输出文本输入框的值
 * @example
 * // 获取文件输入框选择的第一个文件的 URL
 * var url = fileUrl("fileInput");
 * console.log(url); // 输出文件的 URL
 */
export function fileUrl(elementId) {
	var url;

	if (isIE() && document.getElementById(elementId)) {
		// 如果用户使用的是 IE 浏览器
		url = document.getElementById(elementId).value; // 通过元素 ID 获取其 value 属性，即元素的值
	} else if ((isFirefox() || isChrome()) && document.getElementById(elementId) && document.getElementById(elementId).files) {
		// 如果用户使用的是 Firefox 或 Chrome 浏览器
		url = window.URL.createObjectURL(document.getElementById(elementId).files.item(0)); // 通过元素 ID 获取文件列表中的第一个文件，并创建一个 URL
	}

	return url;
}

/**
 * 保存数据到文件
 * @param {String|Blob} data - 要保存的数据，可以是字符串或 Blob 对象
 * @param {String} filename - 保存的文件名
 * @example
 * save("Hello, World!", "example.txt");
 * @example
 * var blob = new Blob(["Hello, World!"], { type: "text/plain" });
 * save(blob, "example.txt");
 */
export function saveDataToFile(data, filename) {
	"use strict";

	// 检查输入参数
	if (!data) {
		logger.error("[saveDataToFile] 参数异常：data是必须的.");
		return;
	}

	if (!filename) {
		logger.error("[saveDataToFile] 参数异常：filename<${0}>是必须的.", JSON.stringify(filename));
		return;
	}

	var view = window || global,
		doc = view.document,
		get_URL = function () {
			return view.URL || view.webkitURL || view;
		},
		create_object_url = function (data) {
			if (isFunction(Blob)) {
				return get_URL().createObjectURL(new Blob([data], { type: "octet/stream" }));
			} else if (isObject(data) && data instanceof String) {
				return "data:application/octet-stream;base64," + btoa(data);
			} else if (isString(data)) {
				return get_URL().createObjectURL(data);
			} else {
				throw new Error("[saveDataToFile] 无法为类型为 " + typeof data + " 的项目创建 URL。");
			}
		},
		download_file = function (url, filename) {
			var support_save_link = "download" in doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
			if (support_save_link) {
				var link = document.createElement("a");
				link.href = url;
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link); // 清理 DOM 元素
			} else {
				location.href = url;
			}
		};

	// 创建 Blob 对象后创建对象 URL
	if (isObject(data) || data instanceof Blob) {
		var object_url = get_URL().createObjectURL(data);
		download_file(object_url, filename);
		revoke(object_url);
	}
	// 对于文本类型的数据，使用 data URI scheme 进行 “下载”
	else if (isString(data)) {
		var url = create_object_url(data);
		download_file(url, filename);
	}
	// 不支持的数据类型
	else {
		logger.error("[saveDataToFile] 参数异常：data必须是Blob对象或字符串类型.");
		return;
	}

	/**
	 * 撤销对象 URL
	 * @param {String} url - 要撤销的 URL
	 */
	function revoke(url) {
		setTimeout(function () {
			get_URL().revokeObjectURL(url);
		}, 1000); // 延迟撤销对象 URL 以保证兼容性

		// 如果 download 属性不能保存 blob，则使用陈旧的技术来进行回退。
		if (typeof InstallTrigger !== "undefined") {
			logger.warn(
				"[saveDataToFile] Firefox 必须手动启用“另存为”对话框提示。 https://support.mozilla.org/zh-CN/kb/how-to-download-and-install-firefox-on-windows/"
			);
		}
	}
}
