import logger from "@base/logger";
import { isObject, isString } from "@common/utils/default";
import { addClass, hasClass, removeClass, setStyle } from "@common/utils/dom";

/**
 * 水印 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年8月31日11:53:08
 */
export default (() => {
	/**
	 * 设置水印遮罩
	 * @param {*} domId 唯一标识
	 * @param {*} content 文本内容
	 */
	function setWatermark(domId, content) {
		var { comp_watermark: setting } = window.zhongjyuan.runtime.setting;

		/**跳过轮询 */
		if (setting.internalJump) return;

		// 删掉之前的水印(水印不在body上)
		if (document.getElementById(setting.domId)) {
			document.getElementById(setting.domId).remove();
		}

		// 删掉之前的水印(水印在body上)
		if (hasClass(document.body, setting.domId)) {
			document.body.style.removeProperty("background");
			document.body.classList.remove(setting.domId);
		}

		/**水印内容行 */
		var lines = [];
		if (isString(content)) {
			lines.push(content);
		} else if (isObject(content)) {
			for (var value of Object.values(content)) {
				lines.push(value);
			}
		}
		lines.push(new Date().format(setting.timeFormat));

		// 创建一个画布
		var can = document.createElement("canvas");
		can.width = setting.width;
		can.height = setting.height;

		var cans = can.getContext("2d");
		// 旋转角度
		cans.rotate(setting.angle);
		// 字体与大小
		cans.font = `${setting.fontSize} ${setting.fontType}`;
		// 设置文本内容的当前对齐方式
		cans.textAlign = setting.textAlign;
		// 设置填充绘画的颜色、渐变或者模式
		cans.fillStyle = setting.fillStyle;
		// 设置在绘制文本时使用的当前文本基线
		cans.textBaseline = setting.textBaseline;
		// 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
		for (let i = 0; i < lines.length; i++) {
			cans.fillText(lines[i], can.width / 8, can.height / 2 + i * setting.lineHeight);
		}
		setting.background = can.toDataURL("image/png");

		// 检查父级DOM元素
		if (document.getElementById(domId)) {
			var componentElement = document.createElement("div");
			componentElement.setAttribute("id", setting.domId);
			setStyle(componentElement, "cssText", setting.div_style_cssText);
			setStyle(componentElement, "background", `url(${setting.background}) left top repeat`);
			document.getElementById(domId).appendChild(componentElement);
		} else {
			addClass(document.body, setting.domId);
			setStyle(document.body, "background", `url(${setting.background}) left top repeat`);
		}
	}

	/**
	 * 设置水印
	 * @param {string|object} content 水印正文
	 * @param {*} domId DOM元素唯一标识
	 */
	function set(content = "zhongjyuan", domId) {
		import(/* webpackChunkName: "comp_watermark" */ "./index.css");

		var { comp_watermark: setting } = window.zhongjyuan.runtime.setting;

		// 如果存在水印，则移除后覆盖
		if (document.querySelector(`#${setting.domId}, .${setting.domId}`)) clear();

		// 设置水印
		setWatermark(domId, content);

		// 每隔1分钟检查一次水印
		setting.internal = window.setInterval(() => setWatermark(domId, content), setting.internalTime);

		// 窗体大小变更监听
		window.onresize = () => setWatermark(domId, content);
	}

	function show() {
		var { comp_watermark: setting } = window.zhongjyuan.runtime.setting;

		setting.internalJump = false;

		// 水印不在body上
		if (document.getElementById(setting.domId)) {
			setStyle(document.getElementById(setting.domId), "display", "block");
		}

		// 水印在body上
		if (hasClass(document.body, setting.domId)) {
			setStyle(document.body, "background", `url(${setting.background}) left top repeat`);
		}
	}

	function hide() {
		var { comp_watermark: setting } = window.zhongjyuan.runtime.setting;

		setting.internalJump = true;

		// 水印不在body上
		if (document.getElementById(setting.domId)) {
			setStyle(document.getElementById(setting.domId), "display", "none");
		}

		// 水印在body上
		if (hasClass(document.body, setting.domId)) {
			document.body.style.removeProperty("background");
		}
	}

	function clear() {
		var { comp_watermark: setting } = window.zhongjyuan.runtime.setting;

		window.removeEventListener("resize", setWatermark);
		setting.internal && window.clearInterval(setting.internal);

		// 水印不在body上
		if (document.getElementById(setting.domId)) {
			document.getElementById(setting.domId).remove();
		}

		// 水印在body上
		if (hasClass(document.body, setting.domId)) {
			document.body.style.removeProperty("background");
			removeClass(document.body, setting.domId);
		}
	}

	return {
		set: logger.decorator(set, "watermark-set"),
		show: logger.decorator(show, "watermark-show"),
		hide: logger.decorator(hide, "watermark-hide"),
		clear: logger.decorator(clear, "watermark-clear"),
	};
})();
