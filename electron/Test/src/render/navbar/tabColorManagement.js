const textColor = require("../../../exts/textColor/textColor.js");

const settingManagement = require("../../settings/renderSettingManagement.js");

const { webviews } = require("../webviewManagement.js");

/**
 * 标签页颜色管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:40:01
 */
const tabColorManagement = {
	/**小时数 */
	hours: 1,

	/**是否使用网站主题 */
	useSiteTheme: true,

	// 创建用于提取颜色的图像和画布元素
	/**加载图像的 img 元素 */
	colorExtractorImage: document.createElement("img"),

	/**绘制图像的 canvas 元素 */
	colorExtractorCanvas: document.createElement("canvas"),

	/**绘制图像的 canvas 元素 的 2D 上下文对象 */
	colorExtractorContext: null,

	/**默认颜色对象，包括私密模式、浅色模式、深色模式的背景颜色和文字颜色 */
	defaultColors: {
		/**私密模式 */
		private: ["rgb(58, 44, 99)", "white"],
		/**浅色模式 */
		lightMode: ["rgb(255, 255, 255)", "black"],
		/**深色模式 */
		darkMode: ["rgb(33, 37, 43)", "white"],
	},

	/**
	 * 获取当前时间的小时数
	 * @returns {number} 当前时间的小时数
	 */
	getHours: function () {
		const date = new Date();
		return date.getHours() + date.getMinutes() / 60;
	},

	/**
	 * 从图像中获取主要颜色
	 * @param {HTMLImageElement} image 图像元素
	 * @returns {Array} 包含红、绿、蓝三个通道值的数组，表示图像的主要颜色
	 */
	getColorFromImage: function (image) {
		// 获取图像宽度和高度
		const w = tabColorManagement.colorExtractorImage.width;
		const h = tabColorManagement.colorExtractorImage.height;

		// 设置画布尺寸和绘制图像
		tabColorManagement.colorExtractorCanvas.width = w;
		tabColorManagement.colorExtractorCanvas.height = h;
		tabColorManagement.colorExtractorContext.drawImage(tabColorManagement.colorExtractorImage, 0, 0, w, h);

		// 获取图像数据并定义像素列表
		const data = tabColorManagement.colorExtractorContext.getImageData(0, 0, w, h).data;

		const pixels = {};

		// 定义变量 d, add, sum，用于计算像素点权重
		let d, add, sum;

		// 遍历图像数据，按照 offset 跳跃读取每一个像素点并计算其权重
		const offset = Math.max(1, Math.round(0.00032 * w * h));
		for (let i = 0; i < data.length; i += 4 * offset) {
			// 将当前像素点 RGB 值转成字符串格式，如 "100,200,150"
			d = Math.round(data[i] / 5) * 5 + "," + Math.round(data[i + 1] / 5) * 5 + "," + Math.round(data[i + 2] / 5) * 5;

			// 计算像素点权重
			add = 1;
			sum = data[i] + data[i + 1] + data[i + 2];

			// 亮度较低或较高的像素点权重降低
			if (sum < 310) {
				add = 0.35;
			}

			if (sum < 50) {
				add = 0.01;
			}

			// 靠近白色的像素点权重降低
			if (data[i] > 210 || data[i + 1] > 210 || data[i + 2] > 210) {
				add = 0.5 - 0.0001 * sum;
			}

			// 将像素点权重加入像素列表中
			if (pixels[d]) {
				pixels[d] = pixels[d] + add;
			} else {
				pixels[d] = add;
			}
		}

		// 找出像素列表中权重最大的 RGB 值，作为图像的主要颜色
		let largestPixelSet = null;
		let ct = 0;
		for (const k in pixels) {
			if (k === "255,255,255" || k === "0,0,0") {
				pixels[k] *= 0.05;
			}
			if (pixels[k] > ct) {
				largestPixelSet = k;
				ct = pixels[k];
			}
		}

		// 将主要颜色的 RGB 值转成数字
		const res = largestPixelSet.split(",");
		for (let i = 0; i < res.length; i++) {
			res[i] = parseInt(res[i]);
		}

		return res;
	},

	/**
	 * 从字符串中获取颜色
	 * @param {string} str 包含颜色值的字符串，格式可以是 "#RRGGBB"、"rgb(r, g, b)" 或 "rgba(r, g, b, a)"，例如 "#FF0000"、"rgb(255, 0, 0)"、"rgba(255, 0, 0, 1)"
	 * @returns {Array} 包含红、绿、蓝三个通道值的数组，表示提取的颜色值，范围在 0 到 255 之间
	 */
	getColorFromString: function (str) {
		// 清空画布
		tabColorManagement.colorExtractorContext.clearRect(0, 0, 1, 1);

		// 设置画布填充样式为指定的颜色值
		tabColorManagement.colorExtractorContext.fillStyle = str;

		// 在画布上绘制一个矩形，实际上就是填充指定颜色的像素点
		tabColorManagement.colorExtractorContext.fillRect(0, 0, 1, 1);

		// 获取画布上该像素点的颜色信息
		const rgb = Array.from(tabColorManagement.colorExtractorContext.getImageData(0, 0, 1, 1).data).slice(0, 3);

		return rgb;
	},

	/**
	 * 将 RGB 数组转换为 RGB 字符串
	 * @param {Array} rgb 包含红、绿、蓝三个通道值的数组，范围在 0 到 255 之间
	 * @returns {string} RGB 字符串，格式为 "rgb(r, g, b)"，其中 r、g、b 分别表示红、绿、蓝通道的值
	 */
	getRGBString: function (rgb) {
		// 将 RGB 数组中的值拼接成 RGB 字符串
		return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
	},

	/**
	 * 根据背景颜色获取合适的文字颜色
	 * @param {Array} bg 包含红、绿、蓝三个通道值的数组，表示背景颜色，范围在 0 到 255 之间
	 * @returns {string} 白色或黑色文字颜色，返回 "white" 表示白色文字，返回 "black" 表示黑色文字
	 */
	getTextColor: function (bg) {
		// 将 RGB 值归一化到 [0, 1] 范围内
		const obj = {
			r: bg[0] / 255,
			g: bg[1] / 255,
			b: bg[2] / 255,
		};

		// 调用 textColor 函数，传入归一化后的背景颜色值，得到输出结果
		const output = textColor(obj);

		// 如果输出的黑色权重大于 0.5，则返回黑色作为文字颜色；否则返回白色
		if (output.black > 0.5) {
			return "black";
		}

		return "white";
	},

	/**
	 * 计算颜色的亮度
	 * @param {Array} color 包含红、绿、蓝三个通道值的数组，每个通道值的范围在 0 到 255 之间
	 * @returns {number} 颜色的亮度，范围为 0~1
	 */
	calculateLuminance: function (color) {
		// 根据亮度计算公式对颜色的三个通道进行加权求和
		return 0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2];
	},

	/**
	 * 判断颜色是否为低对比度颜色
	 * @param {Array} color 包含红、绿、蓝三个通道值的数组，范围在 0 到 255 之间
	 * @returns {boolean} 是否为低对比度颜色，返回 true 表示是低对比度颜色，返回 false 表示不是低对比度颜色
	 */
	isLowContrast: function (color) {
		// 判断颜色的三个通道值是否全部大于 235 或者全部小于 15，若是则返回 true，表示为低对比度颜色
		return color.filter((i) => i > 235 || i < 15).length === 3;
	},

	/**
	 * 设置页面的背景和前景颜色，并根据颜色对页面元素进行样式设置
	 * @param {string} bg 背景颜色，使用 CSS 颜色值表示
	 * @param {string} fg 前景颜色，使用 CSS 颜色值表示
	 * @param {boolean} isLowContrast 是否为低对比度模式，如果为 true，则会应用低对比度背景样式
	 */
	setColor: function (bg, fg, isLowContrast) {
		// 设置根元素的 CSS 变量，以便在页面中应用背景和前景颜色
		document.body.style.setProperty("--theme-background-color", bg);
		document.body.style.setProperty("--theme-foreground-color", fg);

		// 获取所有使用背景颜色类的元素，并将它们的背景颜色设置为指定的背景颜色
		const backgroundElements = document.getElementsByClassName("theme-background-color");
		for (let i = 0; i < backgroundElements.length; i++) {
			backgroundElements[i].style.backgroundColor = bg;
		}

		// 获取所有使用文本颜色类的元素，并将它们的文本颜色设置为指定的前景颜色
		const textElements = document.getElementsByClassName("theme-text-color");
		for (let i = 0; i < textElements.length; i++) {
			textElements[i].style.color = fg;
		}

		// 根据前景颜色是否为白色，为根元素添加或移除暗黑主题类
		if (fg === "white") {
			document.body.classList.add("dark-theme");
		} else {
			document.body.classList.remove("dark-theme");
		}

		// 根据是否为低对比度模式，为根元素添加或移除低对比度背景类
		if (isLowContrast) {
			document.body.classList.add("theme-background-low-contrast");
		} else {
			document.body.classList.remove("theme-background-low-contrast");
		}
	},

	/**
	 * 根据当前时间和主题模式调整颜色
	 * @param {Array} color 包含红、绿、蓝三个通道值的数组，作为基准颜色，范围在 0 到 255 之间
	 * @returns {Array} 包含红、绿、蓝三个通道值的数组，表示调整后的颜色，范围在 0 到 255 之间
	 */
	adjustColorForTheme: function (color) {
		// 获取设置中的暗黑模式是否开启，如果未设置或为 true 或非负数，则表示开启自动暗黑模式
		const darkMode = settingManagement.get("darkMode");
		const isAuto = darkMode === undefined || darkMode === true || darkMode >= 0;

		let colorChange = 1;
		if (isAuto) {
			// 如果处于自动暗黑模式下，并且处于晚上 9 点到次日 6:15 之间，则颜色逐渐变暗
			if (hours > 20) {
				colorChange = 1.01 / (1 + 0.9 * Math.pow(Math.E, 1.5 * (hours - 22.75)));
			} else if (hours < 6.5) {
				colorChange = 1.04 / (1 + 0.9 * Math.pow(Math.E, -2 * (hours - 5)));
			}
		}

		// 如果当前主题模式为暗黑模式，则颜色变暗的程度限制在 0.6 以内
		if (window.isDarkMode) {
			colorChange = Math.min(colorChange, 0.6);
		}

		// 返回新的颜色数组，每个通道值都乘上变换系数，然后四舍五入取整
		return [Math.round(color[0] * colorChange), Math.round(color[1] * colorChange), Math.round(color[2] * colorChange)];
	},

	/**
	 * 更新主题颜色
	 * @param {string} color 主题颜色值，使用 CSS 颜色值表示
	 * @param {number} tabId 标签页ID
	 * @returns {void}
	 */
	updateFromThemeColor: function (color, tabId) {
		// 如果颜色为空，则将标签页的主题颜色设置为null
		if (!color) {
			window.tabs.tabs.update(tabId, {
				themeColor: null,
			});
			return;
		}

		// 将颜色转换为RGB格式
		const rgb = tabColorManagement.getColorFromString(color);

		// 根据主题调整颜色
		const rgbAdjusted = tabColorManagement.adjustColorForTheme(rgb);

		// 更新标签页的主题颜色属性
		window.tabs.update(tabId, {
			themeColor: {
				color: tabColorManagement.getRGBString(rgbAdjusted), // 设置颜色
				textColor: tabColorManagement.getTextColor(rgbAdjusted), // 设置文本颜色
				isLowContrast: tabColorManagement.isLowContrast(rgbAdjusted), // 判断是否低对比度
			},
		});
	},

	/**
	 * 通过图像更新标签页背景颜色和图标
	 * @param {Array} favicons 图标URL列表
	 * @param {number} tabId 标签页ID
	 * @param {Function} callback 回调函数
	 * @returns {void}
	 */
	updateFromImage: function (favicons, tabId, callback) {
		// 如果标签页是私密模式，则不需要更新标签页的背景和图标
		if (window.tabs.get(tabId).private === true) {
			return;
		}

		// 使用请求空闲回调来异步获取图像颜色，避免UI阻塞。
		requestIdleCallback(
			function () {
				// 当图像加载完成时调用
				tabColorManagement.colorExtractorImage.onload = function (e) {
					// 从图像中获取背景颜色
					const backgroundColor = tabColorManagement.getColorFromImage(tabColorManagement.colorExtractorImage);

					// 根据主题调整背景颜色
					const backgroundColorAdjusted = tabColorManagement.adjustColorForTheme(backgroundColor);

					// 更新标签页的背景颜色和图标属性
					window.tabs.update(tabId, {
						backgroundColor: {
							color: tabColorManagement.getRGBString(backgroundColorAdjusted), // 设置背景颜色
							textColor: tabColorManagement.getTextColor(backgroundColorAdjusted), // 设置文本颜色
							isLowContrast: tabColorManagement.isLowContrast(backgroundColorAdjusted), // 判断是否低对比度
						},
						favicon: {
							url: favicons[0], // 设置图标URL
							luminance: tabColorManagement.calculateLuminance(backgroundColor), // 获取亮度值
						},
					});

					// 如果有回调函数，则执行回调函数
					if (callback) {
						callback();
					}
				};

				tabColorManagement.colorExtractorImage.src = favicons[0]; // 加载第一个图标URL
			},
			{
				timeout: 1000, // 设置请求空闲超时时间为1秒
			}
		);
	},

	/**
	 * 更新标签页的颜色方案
	 * @returns {void}
	 */
	updateColors: function () {
		// 获取当前选中的标签页
		const tab = window.tabs.get(window.tabs.getSelected());

		// 如果标签页是私密模式，则设置私密模式的颜色方案并返回
		if (tab.private) {
			return tabColorManagement.setColor(tabColorManagement.defaultColors.private[0], tabColorManagement.defaultColors.private[1]);
		}

		// 如果使用网站主题颜色
		if (tabColorManagement.useSiteTheme) {
			// 使用主题颜色
			if (tab.themeColor && tab.themeColor.color) {
				return tabColorManagement.setColor(tab.themeColor.color, tab.themeColor.textColor, tab.themeColor.isLowContrast);
			}

			// 使用从页面图标提取的颜色
			if (tab.backgroundColor && tab.backgroundColor.color) {
				return tabColorManagement.setColor(tab.backgroundColor.color, tab.backgroundColor.textColor, tab.backgroundColor.isLowContrast);
			}
		}

		// 否则使用默认颜色方案
		if (window.isDarkMode) {
			return tabColorManagement.setColor(tabColorManagement.defaultColors.darkMode[0], tabColorManagement.defaultColors.darkMode[1]);
		}

		return tabColorManagement.setColor(tabColorManagement.defaultColors.lightMode[0], tabColorManagement.defaultColors.lightMode[1]);
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		tabColorManagement.hours = tabColorManagement.getHours();
		tabColorManagement.colorExtractorContext = tabColorManagement.colorExtractorCanvas.getContext("2d");

		/**每5分钟更新一次小时数 */
		setInterval(() => {
			tabColorManagement.hours = tabColorManagement.getHours();
		}, 5 * 60 * 1000);

		// 监听页面图标更新事件
		webviews.bindEvent("page-favicon-updated", function (tabId, favicons) {
			tabColorManagement.updateFromImage(favicons, tabId, function () {
				if (tabId === window.tabs.getSelected()) {
					tabColorManagement.updateColors();
				}
			});
		});

		// 监听网页主题颜色变化事件
		webviews.bindEvent("did-change-theme-color", function (tabId, color) {
			tabColorManagement.updateFromThemeColor(color, tabId);
			if (tabId === window.tabs.getSelected()) {
				tabColorManagement.updateColors();
			}
		});

		/*
		 * 当页面导航开始时重置图标颜色，以防新页面没有图标继承旧的图标颜色
		 * 但是不会立即渲染，因为新的图标颜色还没有收到，
		 * 我们希望从旧颜色 > 新颜色，而不是旧颜色 > 默认值 > 新颜色
		 */
		webviews.bindEvent("did-start-navigation", function (tabId, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
			if (isMainFrame) {
				window.tabs.update(tabId, {
					backgroundColor: null,
					favicon: null,
				});
			}
		});

		/*
		 * 页面加载完成后始终重新渲染一次
		 * 这是为了在该页面不指定颜色时返回默认颜色
		 */
		webviews.bindEvent("did-finish-load", function (tabId) {
			tabColorManagement.updateColors();
		});

		// 主题变化可能会影响标签页颜色
		window.addEventListener("themechange", function (e) {
			tabColorManagement.updateColors();
		});

		// 监听siteTheme设置变化
		settingManagement.listen("siteTheme", function (value) {
			if (value !== undefined) {
				tabColorManagement.useSiteTheme = value;
			}
		});

		window.tasks.on("tab-selected", tabColorManagement.updateColors);
	},
};

module.exports = tabColorManagement;
