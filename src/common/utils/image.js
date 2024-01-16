import logger from "../logManagement";
import { isEmpty, isFunction, isString } from "./default";

export default {
	size: logger.decorator(imageSize, "tool-image-size"),
	toBase64: logger.decorator(imageToBase64, "tool-image-to-base64"),
	themeColor: logger.decorator(imageThemeColor, "tool-image-theme-color"),
};

/**
 * 获取图像尺寸
 * @param {String} imageUrl - 图像的URL
 * @param {Function} callback - 图像加载完成后的回调函数
 * @example
 * getSize("https://example.com/image.jpg", function(dimensions) {
 *   console.log("Width:", dimensions.width);
 *   console.log("Height:", dimensions.height);
 * });
 * @example
 * getSize("https://example.com/image2.jpg", handleSize);
 * function handleSize(dimensions) {
 *   console.log("Width:", dimensions.width);
 *   console.log("Height:", dimensions.height);
 * }
 */
export function imageSize(imageUrl, callback) {
	if (!isString(imageUrl)) {
		logger.error("[imageSize] 参数异常：imageUrl<${0}>必须是字符串类型.", JSON.stringify(imageUrl));
		return;
	}

	if (isEmpty(imageUrl)) {
		logger.error("[imageSize] 参数异常：imageUrl<${0}>是必须的.", JSON.stringify(imageUrl));
		return;
	}

	if (!isFunction(callback)) {
		logger.error("[imageSize] 参数异常：callback<${0}>必须是函数类型.", JSON.stringify(callback));
		return;
	}

	// 创建一个新的 Image 对象
	var img = new Image();

	// 设置图像的源 URL
	img.src = imageUrl;

	// 当图像加载完成后执行回调函数
	img.onload = function () {
		if (callback) {
			// 调用回调函数，并传入图像的宽度和高度作为参数
			callback({
				width: img.width,
				height: img.height,
			});
		}
	};
}

/**
 * 将图像转换为 Base64 编码
 * @param {HTMLImageElement} image - 要转换的图像
 * @returns {string} - 转换后的 Base64 编码字符串
 * @example
 * const img = new Image();
 * img.src = "https://example.com/image.jpg";
 * const base64Data = toBase64(img);
 * console.log(base64Data);
 */
export function imageToBase64(image) {
	// 创建一个新的 canvas 元素
	var canvas = document.createElement("canvas");

	// 设置 canvas 的宽度和高度与图像相同
	canvas.width = image.width;
	canvas.height = image.height;

	// 获取 2D 绘图上下文
	var ctx = canvas.getContext("2d");

	// 将图像绘制到 canvas 上
	ctx.drawImage(image, 0, 0, image.width, image.height);

	// 获取图像的扩展名
	var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();

	// 使用指定的扩展名将 canvas 转换为 Base64 字符串
	return canvas.toDataURL("image/" + ext);
}

/**
 * 将图像转换为主题颜色
 * @param {string} imageUrl - 图像的 URL
 * @param {function} callback - 回调函数，接收转换后的颜色作为参数
 * @param {number} light - 亮度参数，默认为 1.0
 * @example
 * toThemeColor("https://example.com/image.jpg", function(color) {
 *   console.log(color);
 * });
 */
export function imageThemeColor(imageUrl, callback, light) {
	if (!isString(imageUrl)) {
		logger.error("[imageThemeColor] 参数异常：imageUrl<${0}>必须是字符串类型.", JSON.stringify(imageUrl));
		return;
	}

	if (isEmpty(imageUrl)) {
		logger.error("[imageThemeColor] 参数异常：imageUrl<${0}>是必须的.", JSON.stringify(imageUrl));
		return;
	}

	if (!isFunction(callback)) {
		logger.error("[imageThemeColor] 参数异常：callback<${0}>必须是函数类型.", JSON.stringify(callback));
		return;
	}

	if (!light) {
		light = 1.0; // 默认亮度为1.0
	}

	var img = new Image(); // 创建一个图像对象
	img.src = imageUrl; // 设置图像的URL
	img.crossOrigin = "anonymous"; // 跨域声明（仅在 Chrome 和 Firefox 上有效）

	img.onload = function () {
		// 图像加载完成后执行
		try {
			var canvas = document.createElement("canvas"); // 创建画布元素
			canvas.width = img.width; // 设置画布的宽度为图像的宽度
			canvas.height = img.height; // 设置画布的高度为图像的高度

			var ctxt = canvas.getContext("2d"); // 获取2D绘图上下文
			ctxt.drawImage(img, 0, 0); // 在画布上绘制图像
			var data = ctxt.getImageData(0, 0, img.width, img.height).data; // 读取整张图片的像素数据

			var r = 0, // 红色总和
				g = 0, // 绿色总和
				b = 0, // 蓝色总和
				a = 0; // 透明度总和
			var red, green, blue, alpha;
			var pixel = img.width * img.height; // 像素总数
			for (var i = 0, len = data.length; i < len; i += 4) {
				// 遍历像素数据
				red = data[i]; // 红色分量
				r += red; // 红色色深累加
				green = data[i + 1]; // 绿色分量
				g += green; // 绿色色深累加
				blue = data[i + 2]; // 蓝色分量
				b += blue; // 蓝色色深累加
				alpha = data[i + 3]; // 透明度分量
				a += alpha; // 透明度累加
			}

			r = parseInt((r / pixel) * light); // 计算平均红色色深，并乘以亮度参数
			g = parseInt((g / pixel) * light); // 计算平均绿色色深，并乘以亮度参数
			b = parseInt((b / pixel) * light); // 计算平均蓝色色深，并乘以亮度参数
			a = 1; // 固定透明度为1

			var color = "rgba(" + r + "," + g + "," + b + "," + a + ")"; // 构造颜色字符串
			if (callback) {
				callback(color); // 执行回调函数，将颜色作为参数传递
			}
		} catch (e) {
			logger.error("[imageThemeColor] error：${0}", e.message); // 捕获异常，并打印错误信息
		}
	};
}
