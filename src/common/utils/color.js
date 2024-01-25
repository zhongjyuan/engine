import logger from "@base/logger";

export default {
	HSBToHEX: logger.decorator(HSBToHEX, "tool-color-HSBToHEX"),
	HSBToRGB: logger.decorator(HSBToRGB, "tool-color-HSBToRGB"),
	RGBToHSB: logger.decorator(RGBToHSB, "tool-color-RGBToHSB"),
	RGBToHEX: logger.decorator(RGBToHEX, "tool-color-RGBToHEX"),
	HEXToRGB: logger.decorator(HEXToRGB, "tool-color-HEXToRGB"),
	HEXToHSB: logger.decorator(HEXToHSB, "tool-color-HEXToHSB"),
};

/**
 * 将HSB颜色值转换为RGB颜色值
 * @param {object} hsb - 包含HSB颜色值的对象，具有属性h、s和b
 * @returns {object} 包含RGB颜色值的对象，具有属性r、g和b
 */
export function HSBToRGB(hsb) {
	var rgb = {};
	var h = Math.round(hsb.h); // 四舍五入得到整数色相值
	var s = Math.round((hsb.s * 255) / 100); // 饱和度转换为0-255的整数值
	var v = Math.round((hsb.b * 255) / 100); // 明度转换为0-255的整数值

	if (s == 0) {
		rgb.r = rgb.g = rgb.b = v; // 当饱和度为0时，三个分量都为明度的值
	} else {
		var t1 = v;
		var t2 = ((255 - s) * v) / 255;
		var t3 = ((t1 - t2) * (h % 60)) / 60;

		if (h == 360) h = 0; // 如果色相为360，则将其设置为0

		if (h < 60) {
			rgb.r = t1;
			rgb.b = t2;
			rgb.g = t2 + t3;
		} else if (h < 120) {
			rgb.g = t1;
			rgb.b = t2;
			rgb.r = t1 - t3;
		} else if (h < 180) {
			rgb.g = t1;
			rgb.r = t2;
			rgb.b = t2 + t3;
		} else if (h < 240) {
			rgb.b = t1;
			rgb.r = t2;
			rgb.g = t1 - t3;
		} else if (h < 300) {
			rgb.b = t1;
			rgb.g = t2;
			rgb.r = t2 + t3;
		} else if (h < 360) {
			rgb.r = t1;
			rgb.g = t2;
			rgb.b = t1 - t3;
		} else {
			rgb.r = 0;
			rgb.g = 0;
			rgb.b = 0;
		}
	}

	return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) }; // 返回包含RGB颜色值的对象
}

/**
 * 将RGB颜色值转换为HSB颜色模型
 * @param {object} rgb - 包含RGB颜色值的对象，具有属性r、g和b
 * @returns {object} 包含HSB颜色模型值的对象，具有属性h、s和b
 */
export function RGBToHSB(rgb) {
	var hsb = { h: 0, s: 0, b: 0 }; // 初始化HSB颜色模型对象
	var min = Math.min(rgb.r, rgb.g, rgb.b); // 获取RGB值中的最小值
	var max = Math.max(rgb.r, rgb.g, rgb.b); // 获取RGB值中的最大值
	var delta = max - min; // 计算最大值与最小值之差

	hsb.b = max; // 设置亮度值为最大值

	if (max != 0) {
		hsb.s = (255 * delta) / max; // 如果最大值不为0，则计算饱和度
	}

	if (hsb.s != 0) {
		// 如果饱和度不为0
		if (rgb.r == max) {
			hsb.h = (rgb.g - rgb.b) / delta; // 计算色调
		} else if (rgb.g == max) {
			hsb.h = 2 + (rgb.b - rgb.r) / delta; // 计算色调
		} else {
			hsb.h = 4 + (rgb.r - rgb.g) / delta; // 计算色调
		}
	} else {
		hsb.h = -1; // 如果饱和度为0，则将色调设置为-1
	}

	hsb.h *= 60; // 将色调乘以60
	if (hsb.h < 0) {
		hsb.h += 360; // 如果色调小于0，则加上360
	}

	hsb.s *= 100 / 255; // 将饱和度转换为百分比
	hsb.b *= 100 / 255; // 将亮度转换为百分比

	return hsb; // 返回HSB颜色模型对象
}

/**
 * 将RGB颜色值转换为十六进制颜色代码
 * @param {object} rgb - 包含RGB颜色值的对象，具有属性r、g和b
 * @returns {string} 表示十六进制颜色代码的字符串
 */
export function RGBToHEX(rgb) {
	var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)]; // 将RGB值转换为十六进制字符串
	hex.map(function (str, i) {
		if (str.length == 1) {
			hex[i] = "0" + str; // 如果长度为1，则在前面添加字符"0"
		}
	});

	return hex.join(""); // 连接为一个字符串并返回十六进制颜色代码
}

/**
 * 将十六进制颜色代码转换为RGB颜色值
 * @param {string} hex - 十六进制颜色代码，可以包含 "#" 前缀，也可以没有
 * @returns {object} 包含RGB颜色值的对象，具有属性r、g和b
 */
export function HEXToRGB(hex) {
	hex = parseInt(hex.indexOf("#") > -1 ? hex.substring(1) : hex, 16); // 将十六进制颜色代码转换为整数
	return { r: hex >> 16, g: (hex & 0x00ff00) >> 8, b: hex & 0x0000ff }; // 使用位运算获取RGB颜色值
}

/**
 * 将十六进制颜色代码转换为HSB颜色模型值
 * @param {string} hex - 十六进制颜色代码，包含#号
 * @returns {object} 包含HSB颜色模型值的对象，具有属性h、s和b
 */
export function HEXToHSB(hex) {
	return RGBToHSB(HEXToRGB(hex));
}

/**
 * 将HSB颜色模型值转换为十六进制颜色代码
 * @param {object} hsb - 包含HSB颜色模型值的对象，具有属性h、s和b
 * @returns {string} 十六进制颜色代码，包含#号
 */
export function HSBToHEX(hsb) {
	return RGBToHEX(HSBToRGB(hsb));
}
