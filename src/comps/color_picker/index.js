import logger from "@common/logManagement";
import { HEXToHSB, HSBToRGB, RGBToHEX, RGBToHSB } from "@common/utils/color";
import { setStyle, queryParentElement } from "@common/utils/dom";

import { comp_color_picker as htmlTemplate } from "./html";

/**
 * 取色器 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月14日11:33:05
 */
export default (() => {
	/**
	 * 渲染调色板项
	 * @returns {string} 包含调色板项的 HTML 字符串
	 */
	function renderPaletteItem() {
		let result = "";

		let palette = [
			"rgb(0, 0, 0)",
			"rgb(67, 67, 67)",
			"rgb(102, 102, 102)",
			"rgb(204, 204, 204)",
			"rgb(217, 217, 217)",
			"rgb(255, 255, 255)",
			"rgb(152, 0, 0)",
			"rgb(255, 0, 0)",
			"rgb(255, 153, 0)",
			"rgb(255, 255, 0)",
			"rgb(0, 255, 0)",
			"rgb(0, 255, 255)",
			"rgb(74, 134, 232)",
			"rgb(0, 0, 255)",
			"rgb(153, 0, 255)",
			"rgb(255, 0, 255)",
			"rgb(230, 184, 175)",
			"rgb(244, 204, 204)",
			"rgb(252, 229, 205)",
			"rgb(255, 242, 204)",
			"rgb(217, 234, 211)",
			"rgb(208, 224, 227)",
			"rgb(201, 218, 248)",
			"rgb(207, 226, 243)",
			"rgb(217, 210, 233)",
			"rgb(234, 209, 220)",
			"rgb(221, 126, 107)",
			"rgb(234, 153, 153)",
			"rgb(249, 203, 156)",
			"rgb(255, 229, 153)",
			"rgb(182, 215, 168)",
			"rgb(162, 196, 201)",
			"rgb(164, 194, 244)",
			"rgb(159, 197, 232)",
			"rgb(180, 167, 214)",
		];

		palette.forEach((item) => (result += `<p style='width:20px;height:20px;background:${item};margin:0 5px;border: solid 1px #d0d0d0;'></p>`));

		return result;
	}

	/**
	 * 渲染输入框
	 * @returns {string} 包含输入框的 HTML 字符串
	 */
	function renderInputWrap() {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		var inputHtml = "";
		switch (setting.mode) {
			case "hex":
				var hex = "#" + RGBToHEX(HSBToRGB(setting.hsb));
				inputHtml += `
						<div style="padding-left: 6px; width: 100%;">
							<div style="position: relative;">
								<input class="picker-color-input" value="${hex}" spellcheck="false" style="font-size: 11px; color: rgb(51, 51, 51); width: 100%; border-radius: 2px; border: none; box-shadow: rgb(218, 218, 218) 0px 0px 0px 1px inset; height: 21px; text-align: center;">
								<span style="text-transform: uppercase; font-size: 11px; line-height: 11px; color: rgb(150, 150, 150); text-align: center; display: block; margin-top: 12px;">hex</span>
							</div>
						</div>`;
				break;
			case "rgb":
				for (var i = 0; i < 3; i++) {
					inputHtml += `<div style="padding-left: 6px; width: 100%;">
							<div style="position: relative;">
								<input class="picker-color-input" value="${
									setting.rgba["rgb"[i]]
								}" spellcheck="false" style="font-size: 11px; color: rgb(51, 51, 51); width: 100%; border-radius: 2px; border: none; box-shadow: rgb(218, 218, 218) 0px 0px 0px 1px inset; height: 21px; text-align: center;">
								<span style="text-transform: uppercase; font-size: 11px; line-height: 11px; color: rgb(150, 150, 150); text-align: center; display: block; margin-top: 12px;">${
									"rgb"[i]
								}</span>
							</div>
						</div>`;
				}
			default:
		}
		return inputHtml;
	}

	/**
	 * 添加事件监听器
	 * @param {HTMLElement} element - 要添加监听器的元素
	 * @param {Function} callback - 当事件触发时要执行的回调函数
	 */
	function addEventListener(element, callback) {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		/**
		 * 当鼠标按下时触发的回调函数
		 * @param {MouseEvent} e - 鼠标事件对象
		 */
		element.addEventListener(
			"mousedown",
			function (e) {
				setting.downX = e.pageX;
				setting.downY = e.pageY;
				callback.call(setting, setting.downX, setting.downY, element);

				/**
				 * 当鼠标移动时触发的回调函数
				 * @param {MouseEvent} e - 鼠标事件对象
				 */
				function mousemove(e) {
					setting.moveX = e.pageX;
					setting.moveY = e.pageY;
					callback.call(setting, setting.moveX, setting.moveY, element);
					e.preventDefault();
				}

				/**
				 * 当鼠标松开时触发的回调函数
				 * @param {MouseEvent} e - 鼠标事件对象
				 */
				function mouseup(e) {
					element.removeEventListener("mousemove", mousemove, false);
					element.removeEventListener("mouseup", mouseup, false);
				}

				element.addEventListener("mousemove", mousemove, false);
				element.addEventListener("mouseup", mouseup, false);
			},
			false
		);
	}

	/**
	 * 设置选择器按钮的位置
	 * @param {number} x - 鼠标的X坐标
	 * @param {number} y - 鼠标的Y坐标
	 * @param {HTMLElement} elem - 选择器器按钮所在的容器元素
	 */
	function setPickerButtonPosition(x, y, elem) {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 计算按钮相对面板的左边距和上边距
		var LEFT = parseInt(x - setting.pancelLeft),
			TOP = parseInt(y - setting.pancelTop);

		// 限制按钮的左边距和上边距在合理范围内
		setting.pickerButtonLeft = Math.max(0, Math.min(LEFT, setting.componentPancelElementWidth));
		setting.pickerButtonTop = Math.max(0, Math.min(TOP, setting.componentPancelElementHeight));

		// 设置选择器按钮的样式
		setStyle(setting.componentPickerButtonElement, {
			left: setting.pickerButtonLeft + "px",
			top: setting.pickerButtonTop + "px",
		});

		// 根据按钮位置计算HSB的值
		setting.hsb.s = parseInt((100 * setting.pickerButtonLeft) / setting.componentPancelElementWidth);
		setting.hsb.b = parseInt((100 * (setting.componentPancelElementHeight - setting.pickerButtonTop)) / setting.componentPancelElementHeight);

		// 更新显示的颜色
		setShowColor();

		// 更新颜色值
		setValue(setting.rgba);
	}

	/**
	 * 设置选择器条的位置
	 * @param {number} x - 鼠标的X坐标
	 * @param {number} y - 鼠标的Y坐标
	 * @param {HTMLElement} elem - 选择器条所在的容器元素
	 */
	function setPickerBarPosition(x, y, elem) {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 获取选择器条元素和容器元素的相关信息
		var elem_width = elem.offsetWidth,
			rect = elem.getBoundingClientRect(),
			X = Math.max(0, Math.min(x - rect.x, elem_width)),
			pickerColorBarElement = elem.getElementsByTagName("div")[0];

		// 根据选择器条元素的类型进行相应的操作
		if (pickerColorBarElement === setting.componentPickerColorBarElement) {
			// 设置选择器条的样式和H值
			setStyle(pickerColorBarElement, { left: X + "px" });
			setting.hsb.h = parseInt((360 * X) / elem_width);
		} else {
			// 设置选择器条的样式和A值
			setStyle(pickerColorBarElement, { left: X + "px" });
			setting.rgba.a = X / elem_width;
		}

		// 更新显示的颜色
		setShowColor();

		// 更新面板颜色
		setPancelColor(setting.hsb.h);

		// 更新颜色值
		setValue(setting.rgba);
	}

	/**
	 * 设置显示的颜色
	 */
	function setShowColor() {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 将 HSB 转换为 RGB
		var rgb = HSBToRGB(setting.hsb);

		// 更新 RGBA 中的 R、G、B 值
		setting.rgba.r = rgb.r;
		setting.rgba.g = rgb.g;
		setting.rgba.b = rgb.b;

		// 设置显示颜色元素的背景色，包括 RGB 和透明度
		setStyle(setting.componentShowColorElement, {
			background: "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + setting.rgba.a + ")",
		});
	}

	/**
	 * 设置面板颜色
	 * @param {number} h - H 值，取值范围为 0~360
	 */
	function setPancelColor(h) {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 将 HSB 转换为 RGB
		var rgb = HSBToRGB({ h: h, s: 100, b: 100 });

		// 设置面板元素的背景色，包括 RGB 和透明度
		setStyle(setting.componentPancelElement, {
			background: "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + setting.rgba.a + ")",
		});
	}

	/**
	 * 设置颜色值
	 * @param {object} rgb - 包含 R、G、B 值的对象
	 */
	function setValue(rgb) {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 将 RGB 转换为 HEX
		var hex = "#" + RGBToHEX(rgb);

		// 渲染输入包裹元素
		setting.componentInputWrapElement.innerHTML = renderInputWrap();

		// 调用回调函数，将颜色值传递给回调函数
		setting.options.callback(setting.parentElement, hex);
	}

	/**
	 * 改变颜色
	 * @param {string} value - 表示颜色值的字符串
	 */
	function changeColor(value) {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		switch (setting.mode) {
			case "hex":
				// 如果颜色值是十六进制表示，则进行处理
				value = value.slice(1);
				if (value.length == 3) {
					// 如果颜色值是缩写形式（如 "#abc"），则将其转换为完整形式（如 "#aabbcc"）
					value = "#" + value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
					setting.hsb = HEXToHSB(value);
				} else if (value.length == 6) {
					// 如果颜色值是完整形式（如 "#aabbcc"），直接进行转换
					setting.hsb = HEXToHSB(value);
				}
				break;
			case "rgb":
				// 获取输入框元素和对应的 RGB 值
				var inputs = setting.componentElement.getElementsByTagName("input"),
					rgb = {
						r: inputs[0].value ? parseInt(inputs[0].value) : 0,
						g: inputs[1].value ? parseInt(inputs[1].value) : 0,
						b: inputs[2].value ? parseInt(inputs[2].value) : 0,
					};

				// 将 RGB 值转换为 HSB 值
				setting.hsb = RGBToHSB(rgb);
		}

		// 改变组件显示
		changeComponent();
	}

	/**
	 * 改变组件显示
	 */
	function changeComponent() {
		// 获取颜色选择器对象
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 根据饱和度值计算选择器按钮的左偏移量
		setting.pickerButtonLeft = parseInt((setting.hsb.s * setting.componentPancelElementWidth) / 100);

		// 根据亮度值计算选择器按钮的上偏移量
		setting.pickerButtonTop = parseInt(((100 - setting.hsb.b) * setting.componentPancelElementHeight) / 100);

		// 设置选择器按钮元素的样式
		setStyle(setting.componentPickerButtonElement, {
			left: setting.pickerButtonLeft + "px",
			top: setting.pickerButtonTop + "px",
		});

		// 根据色相值计算色相选择条的左偏移量
		setStyle(setting.componentPickerColorBarElement, {
			left: (setting.hsb.h / 360) * setting.componentPickerColorBarElement.parentNode.offsetWidth + "px",
		});

		// 设置显示颜色
		setShowColor();

		// 设置色板颜色
		setPancelColor(setting.hsb.h);

		// 将 HSB 颜色值转换为十六进制表示的颜色字符串
		var hex = "#" + RGBToHEX(HSBToRGB(setting.hsb));

		// 调用回调函数，向父元素传递新的颜色值
		setting.options.callback(setting.parentElement, hex);
	}

	/**
	 * 切换颜色选择器的输入模式
	 */
	function switchMode() {
		// 获取颜色选择器对象
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		// 切换输入模式，如果当前为十六进制模式，则切换到 RGB 模式，否则切换到十六进制模式
		setting.mode = setting.mode == "hex" ? "rgb" : "hex";

		// 重新渲染输入框 DOM 元素
		setting.componentInputWrapElement.innerHTML = renderInputWrap();
	}

	/**
	 * 创建颜色选择器组件
	 * @param {Object} options - 选项对象
	 * @param {string} options.dom - 绑定的元素ID
	 * @param {string} options.color - 初始颜色值
	 * @param {Function} options.callback - 回调函数，接收选中颜色的元素和值作为参数
	 */
	function create(options = {}) {
		clear();

		import(/* webpackChunkName: "comp_color_picker" */ "./index.css");

		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting; // 引入颜色选择器组件

		let mode = ["hex", "rgb"], // 颜色选择模式
			setColor = "rgb(255,0,0)", // 初始颜色
			dom = options.dom || "", // 绑定的元素ID
			color = options.color || "", // 初始颜色值
			callback = options.callback || function (dom, value) {}; // 回调函数

		var parentElement = queryParentElement(dom); // 获取绑定的父元素

		// 检查父元素是否存在
		if (!(parentElement && parentElement.nodeType && parentElement.nodeType === 1)) {
			throw `Colorpicker: not found  ID:${dom}  HTMLElement,not ${{}.toString.call(dom)}`;
		}

		// 设置颜色选择器的选项
		setting.options = {
			...options,
			dom,
			mode,
			color,
			setColor,
			callback,
		};

		// 初始化颜色选择器的各个元素
		setting.parentElement = null; // 绑定的元素
		setting.componentElement = null; // 最外层容器
		setting.componentMaskElement = null; // 拾色器后面固定定位的透明div，用于点击隐藏拾色器
		setting.componentPaletteElement = null; // 色块
		setting.componentPancelElement = null; // 色彩面板
		setting.componentPickerButtonElement = null; // 拾色器色块按钮
		setting.componentShowColorElement = null; // 显示当前颜色
		setting.componentPickerColorBarElement = null; // 颜色条
		setting.componentPickerColorInputElement = null; // 显示hex的表单
		setting.componentModeButtonElement = null; // 切换输入框模式按钮
		setting.componentInputWrapElement = null; // 输入框外层容器

		setting.pancelTop = 0; // 色彩面板顶部偏移量
		setting.pancelLeft = 0; // 色彩面板左侧偏移量

		setting.downX = 0; // 按下鼠标时的X坐标
		setting.downY = 0; // 按下鼠标时的Y坐标
		setting.moveX = 0; // 移动鼠标时的X坐标
		setting.moveY = 0; // 移动鼠标时的Y坐标

		setting.pickerButtonTop = 0; // 拾色器按钮顶部偏移量
		setting.pickerButtonLeft = 0; // 拾色器按钮左侧偏移量

		setting.mode = "hex"; // input框当前的模式

		setting.rgba = { r: 0, g: 0, b: 0, a: 1 }; // rgba颜色值
		setting.hsb = { h: 0, s: 100, b: 100 }; // hsb颜色值

		var rgb = setColor.slice(4, -1).split(","); // 解析初始颜色值的RGB值
		setting.rgba.r = parseInt(rgb[0]);
		setting.rgba.g = parseInt(rgb[1]);
		setting.rgba.b = parseInt(rgb[2]);

		var componentElement = document.createElement("div"); // 创建组件元素
		componentElement.innerHTML = htmlTemplate; // 设置组件的HTML模板
		componentElement.setAttribute("id", setting.domId);
		componentElement.setAttribute("class", setting.domId);

		/**组件渲染之前元素 */
		setting.parentElement = parentElement; // 绑定的元素
		setting.componentElement = componentElement; // 最外层容器
		setting.componentMaskElement = componentElement.children[0]; // 拾色器后面固定定位的透明div
		setting.componentPaletteElement = componentElement.getElementsByClassName("palette")[0]; // 色块
		setting.componentPancelElement = componentElement.getElementsByClassName("color-pancel")[0]; // 色彩面板
		setting.componentPickerButtonElement = componentElement.getElementsByClassName("picker-button")[0]; // 拾色器色块按钮
		setting.componentShowColorElement = componentElement.getElementsByClassName("show-color")[0]; // 显示当前颜色
		setting.componentPickerColorBarElement = componentElement.getElementsByClassName("picker-color-bar")[0]; // 颜色条
		setting.componentModeButtonElement = componentElement.getElementsByClassName("mode-button")[0]; // 切换输入框模式按钮
		setting.componentInputWrapElement = componentElement.getElementsByClassName("input-wrap")[0]; // 输入框外层容器

		/**渲染组件 */
		setting.componentInputWrapElement.innerHTML = renderInputWrap(); // 渲染输入框外层容器
		setting.componentPaletteElement.innerHTML = renderPaletteItem(); // 渲染色块

		parentElement.appendChild(componentElement); // 将组件元素添加到页面中

		/**组件渲染之后元素 */
		setting.componentPancelElementWidth = setting.componentPancelElement.offsetWidth; // 色彩面板的宽度
		setting.componentPancelElementHeight = setting.componentPancelElement.offsetHeight; // 色彩面板的高度
		setting.componentPickerColorInputElement = componentElement.getElementsByClassName("picker-color-input")[0]; // 显示hex的表单输入框
		setStyle(setting.componentPancelElement, {
			background: `rgb(${setting.rgba.r},${setting.rgba.g},${setting.rgba.b})`,
		}); // 设置色彩面板背景颜色
		setStyle(setting.componentShowColorElement, {
			background: `rgb(${setting.rgba.r},${setting.rgba.g},${setting.rgba.b})`,
		}); // 设置显示当前颜色的元素背景颜色

		/**计算偏移量 */
		var elem = setting.parentElement;
		var top = elem.offsetTop;
		var left = elem.offsetLeft;
		while (elem.offsetParent) {
			top += elem.offsetParent.offsetTop;
			left += elem.offsetParent.offsetLeft;
			elem = elem.offsetParent;
		}

		setting.pancelTop = top + setting.parentElement.offsetHeight; // 色彩面板的顶部偏移量
		setting.pancelLeft = left + setting.componentPaletteElement.clientWidth; // 色彩面板的左侧偏移量
		setStyle(setting.componentElement, {
			position: "absolute",
			"z-index": 2,
			display: "none",
			left: left + "px",
			top: top + setting.parentElement.offsetHeight + "px",
		}); // 设置组件元素的样式

		addEventListener(setting.componentPancelElement, setPickerButtonPosition, true); // 监听色彩面板元素的事件，用于设置拾色器按钮位置
		addEventListener(setting.componentPickerColorBarElement.parentNode, setPickerBarPosition, false); // 监听颜色条的父元素事件，用于设置颜色条位置

		setting.parentElement.addEventListener(
			"click",
			function () {
				show();
			},
			false
		); // 父元素点击事件，显示颜色选择器

		setting.componentMaskElement.addEventListener(
			"click",
			function (e) {
				hide();
			},
			false
		); // 遮罩层点击事件，隐藏颜色选择器

		setting.componentModeButtonElement.addEventListener(
			"click",
			function () {
				switchMode();
			},
			false
		); // 切换模式按钮点击事件，切换输入框模式

		setting.componentElement.addEventListener(
			"input",
			function (e) {
				var target = e.target,
					value = target.value;
				changeColor(value);
			},
			false
		); // 输入框输入事件，改变颜色

		setting.componentPaletteElement.addEventListener(
			"click",
			function (e) {
				if (e.target.tagName.toLocaleLowerCase() == "p") {
					let colorStr = e.target.style.background; // 获取被点击色块的背景颜色
					let rgb = colorStr.slice(4, -1).split(","); // 解析RGB值
					let rgba = {
						r: parseInt(rgb[0]),
						g: parseInt(rgb[1]),
						b: parseInt(rgb[2]),
					};
					switch (setting.mode) {
						case "hex":
							changeColor("#" + RGBToHEX(rgba)); // 转换为HEX颜色并改变颜色
							break;
						case "rgb":
							let inputs = setting.componentElement.getElementsByTagName("input"); // 获取输入框
							inputs[0].value = rgba.r;
							inputs[1].value = rgba.g;
							inputs[2].value = rgba.b;
							changeColor(colorStr); // 改变颜色
							break;
					}
				}
			},
			false
		);

		color != "" && changeColor(color); // 如果传入了初始颜色，则改变颜色
	}

	function show() {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		setStyle(setting.componentElement, { display: "block" });
	}

	function hide() {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;

		setStyle(setting.componentElement, { display: "none" });
	}

	function clear() {
		var { comp_color_picker: setting } = window.zhongjyuan.runtime.setting;
		if (setting.componentElement) setting.componentElement.remove();
	}

	return {
		create: logger.decorator(create, "color-picker-create"),
		clear: logger.decorator(clear, "color-picker-clear"),
		show: logger.decorator(show, "color-picker-show"),
		hide: logger.decorator(hide, "color-picker-hide"),
	};
})();
