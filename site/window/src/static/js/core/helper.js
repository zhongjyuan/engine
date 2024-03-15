/**
 * 帮助对象
 * @author zhongjyuan
 * @date   2023年5月12日11:26:33
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.helper = {
	/**
	 * 刷新
	 * @author zhongjyuan
	 * @date   2023年5月13日17:58:21
	 * @email  zhongjyuan@outlook.com
	 */
	f5: function() {
		location.reload();
	},

	/**
	 * 语言环境信息
	 * @author zhongjyuan
	 * @date   2023年5月15日09:38:47
	 * @email  zhongjyuan@outlook.com
	 * @param {*} defaultLang 默认语言
	 * @returns
	 */
	lang: function(defaultLang) {
		const language = (navigator.language || navigator.browserLanguage || "").toLowerCase();

		if (!language && typeof defaultLang !== "undefined") {
			return defaultLang;
		}

		return language || "zh_cn"; // 默认返回 zh_cn
	},

	/**
	 * 设备唯一标识符
	 * @author zhongjyuan
	 * @date   2023年5月13日18:13:52
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	UUID: function() {
		var d = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		return uuid;
	},

	/**
	 * 参数值
	 * @author zhongjyuan
	 * @date   2023年5月15日11:15:09
	 * @email  zhongjyuan@outlook.com
	 * @param {*} name 参数名称
	 * @returns
	 */
	paramValue: function(name) {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.has(name) ? searchParams.get(name) : null;
	},

	/**
	 * 转对象/数组
	 * @author zhongjyuan
	 * @date   2023年5月15日11:34:13
	 * @email  zhongjyuan@outlook.com
	 * @param {*} str 字符串
	 * @returns
	 */
	evalObject: function(str) {
		return eval("(" + str + ")");
	},

	/**
	 * 字符串格式化
	 *
	 * eg: format('my name is: ${0}; age: ${1}','zhongjyuan','27')
	 *
	 * 使用字符串模板的方式将若干个参数替换一个带占位符（${0}、${1} 等）的主字符串中的占位符为真实参数值，并返回替换后的字符串
	 * @author zhongjyuan
	 * @date   2023年5月15日10:22:09
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	format: function() {
		var num = arguments.length;
		var originString = arguments[0];
		for (var i = 1; i < num; i++) {
			var pattern = "\\$\\{" + (i - 1) + "\\}";
			var re = new RegExp(pattern, "g");
			originString = originString.replace(re, arguments[i]);
		}
		return originString;
	},

	/**
	 * 清除字符串两边空格
	 * @method trim
	 * @param string {string}
	 * @return {string|undefined}
	 */
	trim: function(string) {
		if (!ZHONGJYUAN.helper.check.isString(string)) {
			ZHONGJYUAN.logger.warn("helper.trim 参数string非字符串类型");
		}
		return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
	},

	/**
	 * 提取文档(多行文本+注释)
	 * @author zhongjyuan
	 * @date   2023年5月15日10:22:21
	 * @email  zhongjyuan@outlook.com
	 * @param {*} fn 函数
	 * @returns
	 */
	collectDoc: function(fn) {
		var match = fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//);
		return match ? match[1].replace(/\r/g, "") : "";
	},

	/**
	 * 等待执行
	 * @author zhongjyuan
	 * @date   2023年5月15日10:27:01
	 * @email  zhongjyuan@outlook.com
	 * @param {*} condition 执行条件
	 * @param {*} callback 回调函数
	 * @param {*} interval 等待时间间隔
	 */
	wait: function(condition, callback, interval = 100) {
		var itv = setInterval(function() {
			if (condition) {
				clearInterval(itv);
				callback();
			}
		}, interval);
	},

	/**
	 * 轮询执行
	 * @author zhongjyuan
	 * @date   2023年5月15日10:27:59
	 * @email  zhongjyuan@outlook.com
	 * @param {*} condition 条件函数
	 * @param {*} callback 回调函数
	 * @param {*} max_retry 最大重试次数
	 * @param {*} interval 等待时间间隔
	 */
	poll: function(condition, callback, max_retry = 100, interval = 100) {
		var times = 0;
		var itv = setInterval(function() {
			if (times >= max_retry) {
				// 达到最大重试次数，不再继续轮询
				clearInterval(itv);
				console.error("Reached max retry times in wait function.");
				return;
			}
			try {
				if (condition()) {
					// 条件满足，执行回调函数并清除轮询定时器
					clearInterval(itv);
					callback();
				}
			} catch (e) {
				clearInterval(itv); // 处理异常情况
				console.error("Error in wait function: " + e.message);
			}
			times++;
		}, interval);
	},

	/**
	 * 执行
	 * @author zhongjyuan
	 * @date   2023年5月13日18:36:59
	 * @email  zhongjyuan@outlook.com
	 * @param {*} functionString 函数字符串
	 * @returns
	 */
	execute: function(functionString) {
		return Function('"use strict";return (' + functionString + ")")();
	},

	/**
	 * 当前页面URL地址
	 * @author zhongjyuan
	 * @date   2023年5月13日18:11:51
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	currentUrl: function() {
		return window.location.href;
	},

	/**
	 * 当前页面标题
	 * @author zhongjyuan
	 * @date   2023年5月13日18:12:56
	 * @email  zhongjyuan@outlook.com
	 */
	currentTitle: function() {
		return document.title;
	},

	/**
	 * 当前时间
	 * @author zhongjyuan
	 * @date   2023年5月13日18:11:02
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	currentTime: function() {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();

		return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	},

	/**
	 * 开启网页全屏
	 * @author zhongjyuan
	 * @date   2023年5月13日18:23:31
	 * @email  zhongjyuan@outlook.com
	 * @param {*} element 目标元素
	 */
	openFullscreen: function(element) {
		element = element || document.documentElement;

		//W3C
		if (element.requestFullscreen) {
			element.requestFullscreen();
		}

		//FireFox
		else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		}

		//Chrome等
		else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen();
		}

		//IE11
		else if (element.msRequestFullscreen) {
			element.body.msRequestFullscreen();
		}
	},

	/**
	 * 关闭网页全屏
	 * @author zhongjyuan
	 * @date   2023年5月13日18:23:36
	 * @email  zhongjyuan@outlook.com
	 */
	closeFullscreen: function() {
		//W3C
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}

		//FireFox
		else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		}

		//Chrome等
		else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}

		//IE11
		else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	},

	/**
	 * 系统信息
	 * @author zhongjyuan
	 * @date   2023年5月13日18:00:44
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	os: function() {
		var userAgent = navigator.userAgent.toLowerCase();

		if (/windows/.test(userAgent)) {
			return "Windows";
		}

		if (/macintosh/.test(userAgent)) {
			return "Mac OS";
		}

		if (/linux/.test(userAgent)) {
			return "Linux";
		}

		if (/iphone|ipad|ipod/.test(userAgent)) {
			return "iOS";
		}

		if (/android/.test(userAgent)) {
			return "Android";
		}

		return "Unknown";
	},

	/**
	 * 系统版本信息
	 * @author zhongjyuan
	 * @date   2023年5月13日18:04:46
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	osVersion: function() {
		var userAgent = navigator.userAgent.toLowerCase();

		if (/windows/.test(userAgent)) {
			var winVersion = "Unknown";

			if (/windows nt 5.0/.test(userAgent)) {
				winVersion = "Windows 2000";
			} else if (/windows nt 5.1|windows xp/.test(userAgent)) {
				winVersion = "Windows XP";
			} else if (/windows nt 5.2/.test(userAgent)) {
				winVersion = "Windows Server 2003";
			} else if (/windows nt 6.0/.test(userAgent)) {
				winVersion = "Windows Vista";
			} else if (/windows nt 6.1|windows 7/.test(userAgent)) {
				winVersion = "Windows 7";
			} else if (/windows nt 6.2|windows 8/.test(userAgent)) {
				winVersion = "Windows 8";
			} else if (/windows nt 6.3|windows 8.1/.test(userAgent)) {
				winVersion = "Windows 8.1";
			} else if (/windows nt 10.0|windows 10/.test(userAgent)) {
				winVersion = "Windows 10";
			}

			return winVersion;
		}

		if (/macintosh/.test(userAgent)) {
			var macVersion = "Unknown";

			if (/mac os x 10_0/.test(userAgent)) {
				macVersion = "Cheetah";
			} else if (/mac os x 10_1/.test(userAgent)) {
				macVersion = "Puma";
			} else if (/mac os x 10_2/.test(userAgent)) {
				macVersion = "Jaguar";
			} else if (/mac os x 10_3/.test(userAgent)) {
				macVersion = "Panther";
			} else if (/mac os x 10_4/.test(userAgent)) {
				macVersion = "Tiger";
			} else if (/mac os x 10_5/.test(userAgent)) {
				macVersion = "Leopard";
			} else if (/mac os x 10_6/.test(userAgent)) {
				macVersion = "Snow Leopard";
			} else if (/mac os x 10_7/.test(userAgent)) {
				macVersion = "Lion";
			} else if (/mac os x 10_8/.test(userAgent)) {
				macVersion = "Mountain Lion";
			} else if (/mac os x 10_9/.test(userAgent)) {
				macVersion = "Mavericks";
			} else if (/mac os x 10_10/.test(userAgent)) {
				macVersion = "Yosemite";
			} else if (/mac os x 10_11/.test(userAgent)) {
				macVersion = "El Capitan";
			} else if (/mac os x 10_12/.test(userAgent)) {
				macVersion = "Sierra";
			} else if (/mac os x 10_13/.test(userAgent)) {
				macVersion = "High Sierra";
			} else if (/mac os x 10_14/.test(userAgent)) {
				macVersion = "Mojave";
			} else if (/mac os x 10_15/.test(userAgent)) {
				macVersion = "Catalina";
			} else if (/mac os x 11_0/.test(userAgent) || /mac os 11_0/.test(userAgent)) {
				macVersion = "Big Sur";
			}

			return macVersion;
		}

		if (/iphone|ipad|ipod/.test(userAgent)) {
			var iosVersion = "Unknown";
			var match = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/);

			if (match !== null) {
				iosVersion = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3] || 0, 10)];
				iosVersion = iosVersion.join(".");
			}

			return "iOS " + iosVersion;
		}

		if (/android/.test(userAgent)) {
			var androidVersion = "Unknown";
			var match = userAgent.match(/android\s([0-9\.]*)/);

			if (match !== null) {
				androidVersion = match[1];
			}

			return "Android " + androidVersion;
		}

		return "Unknown";
	},

	/**
	 * 系统屏幕分辨率信息
	 * @author zhongjyuan
	 * @date   2023年5月13日18:08:59
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	osResolution: function() {
		return {
			width: window.screen.width,
			height: window.screen.height,
		};
	},

	/**
	 * 浏览器信息
	 * @author zhongjyuan
	 * @date   2023年5月13日17:58:56
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	browser: function() {
		var userAgent = navigator.userAgent.toLowerCase();
		var browserType = "";

		switch (true) {
			case userAgent.indexOf("opera") > -1:
				browserType = "Opera";
				break;

			case userAgent.indexOf("firefox") > -1:
				browserType = "Firefox";
				break;

			case userAgent.indexOf("chrome") > -1:
				browserType = "Chrome";
				break;

			case userAgent.indexOf("safari") > -1:
				browserType = "Safari";
				break;

			default:
				if (/msie|trident/.test(userAgent)) {
					browserType = "IE";
				}
		}

		return browserType;
	},

	/**
	 * 浏览器版本信息
	 * @author zhongjyuan
	 * @date   2023年5月13日18:06:39
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	browserVersion: function() {
		var userAgent = navigator.userAgent.toLowerCase();

		var browserName = "Unknown";
		var fullVersion = "";

		if (/firefox/.test(userAgent)) {
			browserName = "Firefox";
			var match = userAgent.match(/firefox\/([\d\.]+)/);
			if (match !== null) {
				fullVersion = match[1];
			}
		} else if (/opr/.test(userAgent)) {
			browserName = "Opera";
			var match = userAgent.match(/opr\/([\d\.]+)/);
			if (match !== null) {
				fullVersion = match[1];
			}
		} else if (/edg/.test(userAgent)) {
			browserName = "Microsoft Edge";
			var match = userAgent.match(/edg\/([\d\.]+)/);
			if (match !== null) {
				fullVersion = match[1];
			}
		} else if (/chrome/.test(userAgent)) {
			browserName = "Google Chrome";
			var match = userAgent.match(/chrome\/([\d\.]+)/);
			if (match !== null) {
				fullVersion = match[1];
			}
		} else if (/safari/.test(userAgent)) {
			browserName = "Safari";
			var match = userAgent.match(/version\/([\d\.]+)/);
			if (match !== null) {
				fullVersion = match[1];
			}
		} else if (/msie/.test(userAgent) || /trident/.test(userAgent)) {
			browserName = "Internet Explorer";
			var match = userAgent.match(/(msie|rv:?)\s?([\d\.]+)/);
			if (match !== null) {
				fullVersion = match[2];
			}
		}

		return browserName + " " + fullVersion;
	},

	/**
	 * 浏览器分辨率信息
	 * @author zhongjyuan
	 * @date   2023年5月13日18:17:12
	 * @email  zhongjyuan@outlook.com
	 * @returns
	 */
	browserResolution: function() {
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return {
			width: width,
			height: height,
		};
	},

	/**
	 * 对象所有键名
	 * @author zhongjyuan
	 * @date   2023年5月13日18:33:53
	 * @email  zhongjyuan@outlook.com
	 * @param {*} object 目标对象
	 * @returns
	 */
	objectKeys: function(object) {
		var keys = [];

		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				keys.push(key.toLocaleString());
			}
		}

		return keys;
	},

	/**
	 * 对象克隆
	 * @author zhongjyuan
	 * @date   2023年5月13日19:21:47
	 * @email  zhongjyuan@outlook.com
	 * @param {*} object 目标对象
	 * @returns
	 */
	objectClone: function(object) {
		var targetObject;
		if (typeof object === "object") {
			if (object === null) {
				targetObject = null;
			} else {
				if (object instanceof Array) {
					targetObject = [];
					for (var i = 0, len = object.length; i < len; i++) {
						targetObject.push(this.clone(object[i]));
					}
				} else {
					targetObject = {};
					for (var key in object) {
						if (Object.prototype.hasOwnProperty.call(object, key)) {
							targetObject[key] = this.clone(object[key]);
						}
					}
				}
			}
		} else {
			targetObject = object;
		}
		return targetObject;
	},

	/**
	 * 字符串截断
	 * @author zhongjyuan
	 * @date   2023年5月13日19:48:18
	 * @email  zhongjyuan@outlook.com
	 * @param {*} str 目标字符串
	 * @param {*} len 截断长度
	 * @param {*} ellipsis 后缀[默认...]
	 * @returns
	 */
	stringTruncation: function(str, len, ellipsis) {
		if (typeof str !== "string" || typeof len !== "number") {
			// 参数校验
			throw new TypeError("textOverFlow: invalid arguments");
		}

		if (len <= 0) {
			// 目标长度小于等于 0，直接返回空串
			return "";
		}

		if (str.length <= len) {
			// 长度小于等于目标长度
			return str;
		}

		ellipsis = typeof ellipsis === "undefined" ? "..." : String(ellipsis); // 省略号默认值为 '...'

		return str.slice(0, len - ellipsis.length) + ellipsis; // 从头部截取目标长度减去省略号长度的子串，并在末尾加上省略号
	},

	/**
	 * 数组交换
	 * @author zhongjyuan
	 * @date   2023年5月15日14:08:29
	 * @email  zhongjyuan@outlook.com
	 * @param {*} array 目标数组
	 * @param {*} sourceIndex 源下标
	 * @param {*} targetIndex 目标下标
	 * @returns
	 */
	arraySwap: function(array, sourceIndex, targetIndex) {
		array[sourceIndex] = array.splice(targetIndex, 1, array[sourceIndex])[0];
		return array;
	},

	/**
	 * 数组上移
	 * @author zhongjyuan
	 * @date   2023年5月15日14:09:56
	 * @email  zhongjyuan@outlook.com
	 * @param {*} array 目标数组
	 * @param {*} sourceIndex 源下标
	 */
	arrayUp: function(array, sourceIndex) {
		const { arraySwap } = this;
		if (!Array.isArray(array) || sourceIndex < 1 || sourceIndex >= array.length) {
			throw new Error("Invalid input parameters.");
		} else {
			arraySwap(array, sourceIndex, sourceIndex - 1);
		}
	},

	/**
	 * 数组下移
	 * @author zhongjyuan
	 * @date   2023年5月15日14:18:57
	 * @email  zhongjyuan@outlook.com
	 * @param {*} array 目标数组
	 * @param {*} sourceIndex 源下标
	 */
	arrayDown: function(array, sourceIndex) {
		const { arraySwap } = this;
		if (!Array.isArray(array) || sourceIndex < 0 || sourceIndex >= array.length - 1) {
			throw new Error("Invalid input parameters.");
		} else {
			arraySwap(array, sourceIndex, sourceIndex + 1);
		}
	},

	/**
	 * 数组随机排序
	 * @author zhongjyuan
	 * @date   2023年5月13日19:35:02
	 * @email  zhongjyuan@outlook.com
	 */
	arrayShuffle: (function() {
		/**
		 * 获取随机整数
		 * @param {*} max 最大值
		 * @returns
		 */
		function getRandom(max) {
			return Math.floor(Math.random() * max);
		}

		/**
		 * Fisher-Yates shuffle 算法随机排序
		 * @param {*} array
		 * @returns
		 */
		function fisherYatesShuffle(array) {
			var i, j, temp;
			for (i = array.length - 1; i > 0; i--) {
				j = getRandom(i + 1);
				temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}

		/**
		 * 缓存随机排序
		 * @param {*} source
		 * @returns
		 */
		function cachedShuffle(source) {
			var seed = [],
				target = [],
				indexMap = [];

			// 保存原来顺序的索引
			for (var i = 0, len = source.length; i < len; i++) {
				indexMap.push(i);
			}

			fisherYatesShuffle(indexMap);

			// 这里尝试用类似移动指针的思路来对新数组进行填充
			for (var i = 0, len = source.length; i < len; i++) {
				target.push(source[indexMap[i]]);
				seed.push(target[i]);
			}

			return target;
		}

		return function(arr) {
			var len = arr.length;

			if (len <= 5) {
				// 对于长度不超过 5 的数组，使用冒泡排序
				for (var i = 0; i < len - 1; i++) {
					for (var j = i + 1; j < len; j++) {
						if (Math.random() >= 0.5) {
							var temp = arr[i];
							arr[i] = arr[j];
							arr[j] = temp;
						}
					}
				}
			} else if (len <= 30) {
				// 对于长度不超过 30 的数组，使用插入排序
				for (var i = 1; i < len; i++) {
					var j = i - 1,
						key = arr[i];
					while (j >= 0 && Math.random() >= 0.5) {
						arr[j + 1] = arr[j];
						j--;
					}
					arr[j + 1] = key;
				}
			} else {
				// 更长的数组使用Fisher-Yates shuffle 算法进行重排，以及缓存前一个序列
				cachedShuffle.lastSeed = cachedShuffle.lastSeed || [];
				if (JSON.stringify(cachedShuffle.lastSeed) === JSON.stringify(arr)) {
					console.log("Using cache...");
					arr = cachedShuffle(cachedShuffle.lastTarget);
				} else {
					cachedShuffle.lastSeed = arr;
					cachedShuffle.lastTarget = arr.slice(0);
					arr = cachedShuffle(arr);
				}
			}

			return arr;
		};
	})(),

	/**
	 * 遍历数组和对象属性
	 * @method forEach
	 * @param data {object|array}
	 * @param callback {function}
	 */
	forEach: function(data, callback) {
		if (!ZHONGJYUAN.helper.check.isFunction(callback)) {
			ZHONGJYUAN.logger.warn("helper.forEach() callback参数不是函数:${0}", callback);
			return;
		}

		if (ZHONGJYUAN.helper.check.isArray(data)) {
			data.forEach(callback);
		} else if (ZHONGJYUAN.helper.check.isPlainObject(data)) {
			Object.keys(data).forEach(function(key) {
				callback.call(data, data[key], key);
			});
		} else {
			ZHONGJYUAN.logger.warn("helper.forEach() data参数不是对象也不是数组:${0}", data);
		}
	},

	/**
	 * 校验对象
	 * @author zhongjyuan
	 * @date   2023年5月13日18:26:46
	 * @email  zhongjyuan@outlook.com
	 */
	check: {
		/**
		 * 是否IE浏览器
		 * @author zhongjyuan
		 * @date   2023年5月13日18:27:41
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		isIE: function() {
			return ZHONGJYUAN.helper.browser() === "IE";
		},

		/**
		 * 是否移动设备
		 * @author zhongjyuan
		 * @date   2023年5月13日19:14:49
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		isMobile: function() {
			const userAgent = navigator.userAgent;
			const mobileDevicesRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

			return mobileDevicesRegex.test(userAgent);
		},

		/**
		 * 是否小屏幕
		 * @author zhongjyuan
		 * @date   2023年5月13日19:16:56
		 * @email  zhongjyuan@outlook.com
		 * @param {*} threshold 屏幕宽度阈值
		 * @returns
		 */
		isSmallScreen: function(threshold) {
			if (!threshold) {
				threshold = 768;
			}
			return document.body.clientWidth < threshold;
		},

		/**
		 * 是否正常
		 * @author zhongjyuan
		 * @date   2023年5月13日18:30:49
		 * @email  zhongjyuan@outlook.com
		 * @param {*} value 值
		 * @returns
		 */
		isNormal: function(value) {
			return !(typeof value === "undefined" || value === null || value === "");
		},

		/**
		 * 是否数组类型
		 * @author zhongjyuan
		 * @date   2023年5月13日18:31:26
		 * @email  zhongjyuan@outlook.com
		 * @param {*} object 目标对象
		 * @returns
		 */
		isArray: function(object) {
			return Array.isArray(object);
		},

		/**
		 * 是否在数组内
		 * @author zhongjyuan
		 * @date   2023年5月13日18:32:41
		 * @email  zhongjyuan@outlook.com
		 * @param {*} array 目标数组
		 * @param {*} needle 目标元素
		 * @returns
		 */
		inArray: function(array, needle) {
			for (var i = 0; i < array.length; i++) {
				if (needle === array[i]) return true;
			}
			return false;
		},
		_Type: {},

		/**
		 * 返回判定基本数据类型的函数
		 * @author zhongjyuan
		 * @date   2023年6月30日16:37:22
		 * @email  zhongjyuan@outlook.com
		 * @param {*} type 可选值：Object/String/Boolean/Function/Date/Number/Array
		 */
		isType: function(type) {
			if (!this._Type[type]) {
				this._Type[type] = function(obj) {
					return Object.prototype.toString.call(obj) === "[object " + type + "]";
				};
			}
			return this._Type[type];
		},

		/**
		 * 判定是否数组
		 * @method isArray
		 * @param obj {any}
		 * @return {boolean}
		 */
		isArray: function(obj) {
			return this.isType("Array")(obj);
		},

		/**
		 * 判断是否字符串
		 * @method isString
		 * @param obj {any}
		 * @return {boolean}
		 */
		isString: function(obj) {
			return this.isType("String")(obj);
		},

		/**
		 * 判断是否boolean类型
		 * @method isBoolean
		 * @param obj {any}
		 * @return {boolean}
		 */
		isBoolean: function(obj) {
			return this.isType("Boolean")(obj);
		},

		/**
		 * 判定是否函数
		 * @method isFunction
		 * @param obj {any}
		 * @return {boolean}
		 */
		isFunction: function(obj) {
			return this.isType("Function")(obj);
		},

		/**
		 * 判定是日期类型
		 * @method isDate
		 * @param obj {any}
		 * @return {boolean}
		 */
		isDate: function(obj) {
			return this.isType("Date")(obj);
		},

		/**
		 * 判定是否数字类型
		 * @method isNumber
		 * @param obj {any}
		 * @return {boolean}
		 */
		isNumber: function(obj) {
			return this.isType("Number")(obj);
		},

		/**
		 * 判定是否整数
		 * @method isInt
		 * @param obj {any}
		 * @return {boolean}
		 */
		isInt: function(obj) {
			return this.isNumeric(obj) && String(obj).indexOf(".") === -1;
		},

		/**
		 * 判定是否Null值
		 * @method isNull
		 * @param obj {any}
		 * @return {boolean}
		 */
		isNull: function(obj) {
			return obj === null;
		},

		/**
		 * 判定是否undefined
		 * @method isUndefined
		 * @param obj {any}
		 * @return {boolean}
		 */
		isUndefined: function(obj) {
			return obj === void 0;
		},

		/**
		 * 判定是否null或者undefined值
		 * @method isNullOrUndefined
		 * @param obj {any}
		 * @return {boolean}
		 */
		isNullOrUndefined: function(obj) {
			return this.isNull(obj) || this.isUndefined(obj);
		},

		/**
		 * 判定是否数值型数据，包含字符串数据
		 * @method isNumeric
		 * @param obj {any}
		 * @return {boolean}
		 */
		isNumeric: function(obj) {
			return obj - parseFloat(obj) >= 0;
		},

		/**
		 * 判定是否普通对象
		 * @method isPlainObject
		 * @param obj {any}
		 * @return {boolean}
		 */
		isPlainObject: function(obj) {
			return (obj && typeof obj === "object" && Object.getPrototypeOf(obj) === Object.prototype) || false;
		},

		/**
		 * 方便用于数据模型验证添加
		 * @method isObject 与 isPlainObject相同
		 * @param obj {any}
		 * @return {boolean}
		 */
		isObject: function(obj) {
			return this.isPlainObject(obj);
		},

		/**
		 * 判定是否为空值（null/undefined/''/NaN）
		 * @method isEmpty
		 * @param obj {any}
		 * @return {boolean}
		 */
		isEmpty: function(obj) {
			return this.isNull(obj) || this.isUndefined(obj) || (this.isString(obj) && obj === "") || Object.is(NaN, obj);
		},
	},

	/**
	 * 随机对象
	 * @author zhongjyuan
	 * @date   2023年5月13日17:35:28
	 * @email  zhongjyuan@outlook.com
	 */
	random: (function() {
		/**
		 * 生成指定范围内随机整数
		 * @author zhongjyuan
		 * @date   2023年5月13日17:37:24
		 * @email  zhongjyuan@outlook.com
		 * @param {*} min 最小值
		 * @param {*} max 最大值
		 * @returns
		 */
		function int(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}

		/**
		 * 随机生成指定长度的字符串
		 * @author zhongjyuan
		 * @date   2023年5月13日17:48:08
		 * @email  zhongjyuan@outlook.com
		 * @param {*} length 要生成的随机字符串的长度
		 * @param {*} exclude 不希望出现在随机字符串中的字符的数组
		 * @param {*} append 一个需要叠加进随机串的字符数组
		 * @returns
		 */
		function string(length, exclude, append) {
			let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			let result = "";

			if (exclude && exclude.length > 0) {
				const excludeChars = exclude.join("");
				characters = characters.replace(new RegExp(`[${excludeChars}]`, "g"), "");
			}

			if (append && append.length > 0) {
				characters += append.join("");
			}

			for (let i = 0; i < length; i++) {
				const index = Math.floor(Math.random() * characters.length);
				result += characters.charAt(index);
			}

			return result;
		}

		/**
		 * 生成[0.200]范围内随机颜色
		 * @author zhongjyuan
		 * @date   2023年5月13日17:38:28
		 * @email  zhongjyuan@outlook.com
		 * @returns
		 */
		function color() {
			let red = this.int(0, 200);
			let green = this.int(0, 200);
			let blue = this.int(0, 200);
			return `rgb(${red},${green},${blue})`;
		}

		/**
		 * 根据概率权重从数组中随机选择一个元素
		 *
		 * eg: 从数组['apple', 'banana', 'orange', 'pear']中根据概率权重随机选择一个元素：
		 *
		 * let values = ['apple', 'banana', 'orange', 'pear'];
		 *
		 * let weights = [0.3, 0.4, 0.2, 0.1]; // 每个元素的概率权重
		 *
		 * let randomValue = weightedRandom(values, weights);
		 * @author zhongjyuan
		 * @date   2023年5月13日17:53:46
		 * @email  zhongjyuan@outlook.com
		 * @param {*} array 目标数组
		 * @param {*} weights 权重数组
		 * @returns
		 */
		function weight(array, weights) {
			let sumOfWeights = weights.reduce((acc, val) => acc + val);
			let randomNum = Math.random() * sumOfWeights;
			for (let i = 0; i < array.length; i++) {
				if (randomNum < weights[i]) {
					return array[i];
				}
				randomNum -= weights[i];
			}
		}

		return {
			int: int,
			string: string,
			color: color,
			weight: weight,
		};
	})(),

	/**
	 * 加载Style内容
	 * @author zhongjyuan
	 * @date   2023年5月13日18:39:26
	 * @email  zhongjyuan@outlook.com
	 * @param {*} url 文件地址
	 * @param {*} callback 回调函数
	 */
	loadStyle: function(url, callback) {
		const style = document.createElement("link");
		style.type = "text/css";
		style.rel = "stylesheet";
		style.href = url;

		if (callback) {
			const onReadyStateChange = () => {
				if (style.readyState === "loaded" || style.readyState === "complete") {
					style.removeEventListener("readystatechange", onReadyStateChange);
					callback(style);
				}
			};
			const onLoad = () => {
				style.removeEventListener("load", onLoad);
				callback(style);
			};
			style.addEventListener("load", onLoad);
			style.addEventListener("readystatechange", onReadyStateChange);
		}

		document.head.appendChild(style);
	},

	/**
	 * 加载Script内容
	 * @author zhongjyuan
	 * @date   2023年5月13日18:40:44
	 * @email  zhongjyuan@outlook.com
	 * @param {*} url 文件地址
	 * @param {*} callback 回调函数
	 * @param {*} body 加载至body节点[默认加载至head节点]
	 */
	loadScript: function(url, callback, body = false) {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;

		if (callback) {
			const onReadyStateChange = () => {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					script.removeEventListener("readystatechange", onReadyStateChange);
					callback(script);
				}
			};
			const onLoad = () => {
				script.removeEventListener("load", onLoad);
				callback(script);
			};
			script.addEventListener("load", onLoad);
			script.addEventListener("readystatechange", onReadyStateChange);
		}

		if (!body) {
			document.head.appendChild(script);
		} else {
			document.body.appendChild(script);
		}
	},

	/**
	 * 加载预读取内容
	 * @author zhongjyuan
	 * @date   2023年5月13日18:41:34
	 * @email  zhongjyuan@outlook.com
	 * @param {*} url 文件地址
	 * @param {*} callback 回调函数
	 */
	loadPrefetch: function(url, callback) {
		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = url;

		let called = false;

		if (typeof callback === "function") {
			function handleReadyStateChange() {
				if (!called && (this.readyState === "loaded" || this.readyState === "complete")) {
					called = true;
					callback(link);
				}
			}

			link.addEventListener("load", () => {
				if (!called) {
					called = true;
					callback(link);
				}
			});

			link.addEventListener("error", () => {
				ZHONGJYUAN.logger.error(`Failed to prefetch resource ${url}`);
			});

			link.addEventListener("readystatechange", handleReadyStateChange);
		}

		setTimeout(() => {
			if (!called) {
				called = true;
				callback(link);
			}
		}, 1000);

		document.head.appendChild(link);
	},

	/**
	 * 加载完成后执行
	 * @author zhongjyuan
	 * @date   2023年5月13日18:47:29
	 * @email  zhongjyuan@outlook.com
	 * @param {*} callback 回调函数
	 */
	loadAfter: function(callback) {
		const oldLoad = window.onload;

		window.onload = function() {
			if (oldLoad && typeof oldLoad === "function") {
				oldLoad();
			}
			callback();
		};
	},

	/**
	 * URL处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日11:29:54
	 * @email  zhongjyuan@outlook.com
	 */
	url: {
		/**
		 * 将URL地址解析成对象
		 * @author zhongjyuan
		 * @date   2023年5月15日11:30:04
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL 字符串。如果没有，则默认取当前页面的 URL 作为解析对象。
		 * @returns
		 */
		parseObject: function(url) {
			url || (url = location.href);
			var a = document.createElement("a");
			a.href = url;
			a.href = a.href; //神奇的代码，借助a标签把相对路径转换为绝对路径
			return {
				source: url,
				protocol: a.protocol.replace(":", ""),
				host: a.hostname,
				port: a.port,
				query: a.search,
				params: (function() {
					var ret = {},
						seg = a.search.replace(/^\?/, "").split("&"),
						len = seg.length,
						i = 0,
						s;
					for (; i < len; i++) {
						if (!seg[i]) {
							continue;
						}
						s = seg[i].split("=");
						ret[s[0]] = s[1];
					}
					return ret;
				})(),
				file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
				hash: a.hash.replace("#", ""),
				path: a.pathname.replace(/^([^\/])/, "/$1"),
				relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
				segments: a.pathname.replace(/^\//, "").split("/"),
			};
		},

		format: function(url) {
			url = url.replace(/(^\s*)|(\s*$)/g, "");
			var preg = /^(https?:\/\/|\.\.?\/|\/\/?)/i;
			if (!preg.test(url)) {
				url = "//" + url;
			}
			return url;
		},

		/**
		 * 获取url上query参数，没匹配到返回null
		 * @method getQueryString
		 * @param name {string}
		 * @param url {string} 可选，默认为当前url
		 * @return string|null
		 */
		getQueryString: function(name, url, isDeCode) {
			isDeCode = ZHONGJYUAN.helper.check.isBoolean(isDeCode) ? isDeCode : true;
			if (!ZHONGJYUAN.helper.check.isString(name) || name === "") {
				ZHONGJYUAN.logger.warn("helper.url.getQueryString 参数name必须为字符串且不为空:${0}", arguments);
				return "";
			}

			url = url || (window && window.location.href) || "";
			name = name.replace(/[\[\]]/g, "\\$&");
			const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
			const results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return "";
			const val = results[2].replace(/\+/g, " ");
			return isDeCode ? decodeURIComponent(val) : val;
		},

		/**
		 * 给url设置params参数
		 * @method setQueryString
		 * @param params {object}
		 * @param url {string} 不传默认为当前地址
		 * @return string
		 */
		setQueryString: function(params, url = window.location.href, transcoding = true) {
			if (!ZHONGJYUAN.helper.check.isPlainObject(params)) {
				ZHONGJYUAN.logger.warn("helper.url.setUrlParam()参数不是普通对象:${0}", params);
			}

			let isEmpty = url === "";
			let noParam = true;
			let urls = null;
			// url === ''时，返回key=val&key=val
			if (!isEmpty) {
				if (url.indexOf("#") > -1) {
					urls = url.split("#");
					url = urls.slice(1).join("#");
				}

				noParam = url.indexOf("?") === -1;
				url = noParam ? url + "?" : url;
			}

			ZHONGJYUAN.helper.forEach(params, function(val, key) {
				if (ZHONGJYUAN.helper.check.isEmpty(val)) {
					val = "";
				} else {
					val = transcoding ? encodeURIComponent(val) : val;
				}

				url += (noParam ? "" : "&") + key + "=" + val;
				if (noParam) {
					noParam = false;
				}
			});

			return urls ? `${urls[0]}#${url}` : url;
		},

		/**
		 * 给当前url追加params参数 (新的参数会覆盖原有的)
		 * @method appendQuery
		 * @param params {object} 参数
		 * @param url {string} 参数
		 * @return string
		 */
		appendQuery(params = {}, url = window.location.href) {
			if (!ZHONGJYUAN.helper.check.isPlainObject(params)) {
				ZHONGJYUAN.logger.warn("helper.url.appendQuery 参数不是普通对象:${0}", params);
				return;
			}
			if (!ZHONGJYUAN.helper.check.isString(url)) {
				ZHONGJYUAN.logger.warn("helper.url.appendQuery 参数url必须为字符串:${0}", url);
				return;
			}

			let urls = null;
			if (url.indexOf("#") > -1) {
				urls = url.split("#");
				url = urls.slice(1).join("#");
			}

			const [baseUrl, queryString] = url.split("?");
			let query = params;
			if (queryString) {
				query = queryString.split("&").reduce((tempObj, temp) => {
					const [key, val] = temp.split("=");
					tempObj[key] = decodeURIComponent(val);
					return tempObj;
				}, {});
				Object.assign(query, params);
			}
			const str = Object.keys(query)
				.map((key) => `${key}=${encodeURIComponent(query[key])}`)
				.join("&");
			return `${urls ? urls[0] + "#" : ""}${baseUrl}?${str}`;
		},

		/**
		 * 获取query参数对象
		 * @method parseQuery
		 * @param url {string} 提取query的url地址
		 * @param separator {string} 分隔符，默认是&
		 * @param decode {boolean} 反编码
		 * @return string
		 */
		parseQuery: function(url, separator = "&", decode) {
			if (!ZHONGJYUAN.helper.check.isString(url)) {
				ZHONGJYUAN.logger.warn("helper.url.parseQuery() url参数不是字符串:${0}", url);
			}

			let patRes;
			const params = {};
			const regex = new RegExp(`[?${separator}]([^=]*)(=([^${separator}#]*)|${separator}|#|$)`, "g");
			while ((patRes = regex.exec(url))) {
				params[patRes[1]] = decode ? decodeURIComponent(patRes[3] || "") : patRes[3] || "";
			}

			return params;
		},

		/**
		 * 替换请求api上path参数
		 * @method replacePathParams
		 * @param {string} url 请求api地址
		 * @param {object} params api上占位符替换字符对象
		 */
		replacePathParams(url, params) {
			if (!ZHONGJYUAN.helper.check.isPlainObject(params)) {
				ZHONGJYUAN.logger.warn("helper.url.replacePathParams() params参数不是对象:${0}", params);
			}

			url = url.replace(/{([^}]*)}/g, function(pat, param) {
				if (params && params.hasOwnProperty(param)) {
					return params[param];
				}

				return pat;
			});

			return url;
		},
	},

	/**
	 * json处理对象
	 * @author zhongjyuan
	 * @date   2023年5月13日19:27:46
	 * @email  zhongjyuan@outlook.com
	 */
	json: {
		/**
		 * 格式化
		 * @author zhongjyuan
		 * @date   2023年5月15日10:30:43
		 * @email  zhongjyuan@outlook.com
		 * @param {*} json json对象
		 * @param {*} space 空格数
		 * @returns
		 */
		format: function(json, space = 4) {
			try {
				if (typeof json === "string") {
					json = JSON.parse(json);
				} else if (!json) {
					console.error("Invalid input for json.format function.");
					return "";
				}
				var formatted = JSON.stringify(json, null, space);
				return formatted;
			} catch (error) {
				console.error("Unable to format JSON data: " + error.message);
				return "";
			}
		},

		/**
		 * 合并两个json对象属性为一个对象
		 * @author zhongjyuan
		 * @date   2023年5月13日19:27:52
		 * @email  zhongjyuan@outlook.com
		 * @param {*} jsonObject1
		 * @param {*} jsonObject2
		 * @param {*} recursion 是否进行递归合并
		 */
		merge: function(jsonObject1, jsonObject2, recursion) {
			var resultJsonObject = {};

			for (var attr in jsonObject1) {
				resultJsonObject[attr] = jsonObject1[attr];
			}

			for (var attr in jsonObject2) {
				resultJsonObject[attr] =
					recursion === true &&
					!ZHONGJYUAN.helper.check.isArray(resultJsonObject[attr]) &&
					!ZHONGJYUAN.helper.check.isArray(jsonObject2[attr]) &&
					recursion === true &&
					typeof resultJsonObject[attr] === "object" &&
					typeof jsonObject2[attr] === "object"
						? this.merge(resultJsonObject[attr], jsonObject2[attr], false)
						: jsonObject2[attr];
			}

			return resultJsonObject;
		},

		/**
		 * 深度拷贝对象
		 * @author zhongjyuan
		 * @date   2023年5月13日19:28:02
		 * @email  zhongjyuan@outlook.com
		 * @param {*} obj  需要复制的对象
		 * @returns
		 */
		deepCopy: function(obj) {
			return JSON.parse(JSON.stringify(obj));
		},
	},

	/**
	 * 装换对象
	 * @author zhongjyuan
	 * @date   2023年5月13日19:27:40
	 * @email  zhongjyuan@outlook.com
	 */
	convert: {
		/**
		 * 转整数，存在小数会四舍五入
		 * @method parseInt
		 * @param number {string|number}
		 * @param defaultValue {string|number} 当number不是数字格式时返回的值，默认范围0
		 * @return number
		 * @example
		 */
		parseInt: function(number, defaultValue) {
			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				arguments.length < 2 && ZHONGJYUAN.logger.warn("helper.convert.parseInt 参数number不是数字格式:${0}", number);
				return arguments.length < 2 ? 0 : defaultValue;
			}

			return parseInt(Math.round(parseFloat(number)), 10);
		},

		/**
		 * 字符串转Date
		 * @author zhongjyuan
		 * @date   2023年5月15日14:24:05
		 * @email  zhongjyuan@outlook.com
		 * @param {*} str 时间字符串
		 * @returns
		 */
		stringToDate: function(str) {
			const regex = /[-: \/]/g;

			const [year, month, day, hour, minute, second] = str.split(regex).map((num) => parseInt(num));

			return new Date(year, month - 1, day, hour, minute, second);
		},

		/**
		 * 时间戳转字符串
		 * @author zhongjyuan
		 * @date   2023年5月13日19:12:03
		 * @email  zhongjyuan@outlook.com
		 * @param {*} timestamp 时间戳
		 * @param {*} format 表达式字符串
		 * @returns
		 */
		timestampToString: function(timestamp, format = "yyyy-MM-dd hh:mm:ss") {
			const date = new Date(timestamp * 1000);

			const formattedDate = {
				yyyy: date.getFullYear(),
				MM: String(date.getMonth() + 1).padStart(2, "0"),
				dd: String(date.getDate()).padStart(2, "0"),
				hh: String(date.getHours()).padStart(2, "0"),
				mm: String(date.getMinutes()).padStart(2, "0"),
				ss: String(date.getSeconds()).padStart(2, "0"),
			};

			Object.entries(formattedDate).forEach(([key, value]) => {
				format = format.replace(key, value);
			});

			return format;
		},

		/**
		 * 字符串转换时间
		 * @method parseDate
		 * @param strDate {string}
		 * @return date|null
		 */
		parseDate: function(strDate, defaultValue) {
			if (ZHONGJYUAN.helper.check.isDate(strDate)) {
				return strDate;
			}

			defaultValue = arguments.length === 2 ? defaultValue : null;
			if (!ZHONGJYUAN.helper.check.isString(strDate) || strDate === "") {
				return defaultValue;
			}

			strDate = strDate.toLowerCase();
			strDate = strDate
				.replace("年", "-")
				.replace("月", "-")
				.replace("日", " ")
				.replace("时", ":")
				.replace("分", "")
				.replace("t", " ")
				.replace("z", "");

			var reg = /^(\d{4})([-|/])(\d{1,2})\2(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?(.\d{1,4})?$/;
			var result = strDate.match(reg);
			if (ZHONGJYUAN.helper.check.isNull(result)) {
				reg = /^(\d{1,2}):(\d{1,2})(:(\d{1,2}))?$/;
				result = strDate.match(reg);

				if (ZHONGJYUAN.helper.check.isNull(result)) {
					return defaultValue;
				}

				let date = new Date(1970, 1, 1, result[1], result[2], result[4] || 0);

				if (
					date.getHours() !== ((result[1] && parseFloat(result[1])) || 0) ||
					date.getMinutes() !== ((result[2] && parseFloat(result[2])) || 0) ||
					date.getSeconds() !== ((result[4] && parseFloat(result[4])) || 0)
				) {
					return defaultValue;
				}

				return date;
			} else {
				result[3] = result[3] - 1;
				let date = new Date(result[1], result[3], result[4], result[6] || 0, result[7] || 0, result[9] || 0);

				if (
					date.getFullYear() !== parseFloat(result[1]) ||
					date.getMonth() !== parseFloat(result[3]) ||
					date.getDate() !== parseFloat(result[4]) ||
					date.getHours() !== ((result[6] && parseFloat(result[6])) || 0) ||
					date.getMinutes() !== ((result[7] && parseFloat(result[7])) || 0) ||
					date.getSeconds() !== ((result[9] && parseFloat(result[9])) || 0)
				) {
					return defaultValue;
				}
				return date;
			}
		},

		/**
		 * 中国标准日期格式=> 2017-05-17 10:38:06
		 * @method formatDate
		 * @param date {string|date} 转换日期
		 * @param fmt {string} 格式化参数
		 * @returns {string}
		 */
		formatDate: function(date, fmt = "yyyy-MM-dd hh:mm:ss") {
			if (!ZHONGJYUAN.helper.check.isString(date) && !ZHONGJYUAN.helper.check.isDate(date)) {
				return "";
			}

			if (ZHONGJYUAN.helper.check.isString(date)) {
				if (date === "") {
					return "";
				}
				date = this.parseDate(date);

				if (ZHONGJYUAN.helper.check.isNull(date)) {
					return "";
				}
			}

			if (date.getFullYear() === 1573) {
				return "";
			}

			const hours = date.getHours();
			var o = {
				"M+": date.getMonth() + 1, // 月份
				"d+": date.getDate(), // 日
				"h+": hours, // 小时
				"H+": hours, // 支持24小时解析
				"m+": date.getMinutes(), // 分
				"s+": date.getSeconds(), // 秒
			};

			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}

			for (var k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return fmt;
		},

		/**
		 * 编码字符串中的html
		 * @method escapeHtml
		 * @param target {string}
		 * @return {string}
		 */
		escapeHtml: function(target) {
			if (!ZHONGJYUAN.helper.check.isString(target)) {
				ZHONGJYUAN.logger.warn("helper.convert.escapeHtml 参数target不是字符串类型:${0}", target);
				return "";
			}
			return target
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		},

		/**
		 * 解码字符串中的html
		 * @method escapeHtml
		 * @param target {string}
		 * @return {string}
		 */
		unescapeHtml: function(target) {
			if (!ZHONGJYUAN.helper.check.isString(target)) {
				ZHONGJYUAN.logger.warn("helper.convert.unescapeHtml 参数target不是字符串类型:${0}", target);
				return "";
			}
			return target
				.replace(/&quot;/g, '"')
				.replace(/&gt;/g, ">")
				.replace(/&lt;/g, "<")
				.replace(/&amp;/g, "&")
				.replace(/&#([\d]+);/g, function($0, $1) {
					return String.fromCharCode(parseInt($1, 10));
				});
		},

		/**
		 * 特殊字符进行转义
		 * @author zhongjyuan
		 * @date   2023年5月13日19:39:47
		 * @email  zhongjyuan@outlook.com
		 */
		specialcharToEncode: (function() {
			const htmlEscapeChars = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#039;",
			};

			const htmlRegExp = /[&<>"']/g;

			return function(str) {
				if (!str) {
					// 处理空字符串
					return "";
				}

				if (!str.includes("&")) {
					// 不包含 &
					return str;
				}

				if (htmlRegExp.test(str)) {
					// 包含 HTML 特殊字符
					str = str.replace(htmlRegExp, function(match) {
						return htmlEscapeChars[match];
					});
				} else {
					// 包含 &，但未包含其他 HTML 特殊字符
					str = str.replace(/&/g, "&amp;");
				}

				return str;
			};
		})(),

		/**
		 * 特殊字符进行恢复
		 * @author zhongjyuan
		 * @date   2023年5月13日19:43:03
		 * @email  zhongjyuan@outlook.com
		 */
		specialcharToDecode: (function() {
			const htmlUnescapeChars = [
				{
					reg: /&amp;/g,
					val: "&",
				},
				{
					reg: /&lt;/g,
					val: "<",
				},
				{
					reg: /&gt;/g,
					val: ">",
				},
				{
					reg: /&quot;/g,
					val: '"',
				},
				{
					reg: /&#039;/g,
					val: "'",
				},
			];

			const htmlUnescapeRegExp = /&(amp|lt|gt|quot|#039);/g;

			return function(str) {
				if (!str || str.length === 0) {
					return "";
				}

				if (!htmlUnescapeRegExp.test(str)) {
					return str;
				}

				for (let i = 0; i < htmlUnescapeChars.length; i++) {
					const char = htmlUnescapeChars[i];
					str = str.replace(char.reg, char.val);
				}

				return str;
			};
		})(),

		/**
		 * 转换首字母大写
		 * @method capitalize
		 * @param letter {string}
		 * @return {string}
		 * @example
		 * var result = capitalize('abc') // 'Abc'
		 */
		capitalize: function(letter) {
			if (!ZHONGJYUAN.helper.check.isString(letter)) {
				ZHONGJYUAN.logger.warn("helper.convert.capitalize参数letter不是字符串:${0}", letter);
			}

			if (letter === "") {
				return letter;
			}

			return letter.charAt(0).toUpperCase() + letter.substring(1).toLowerCase();
		},

		/**
		 * 字符串转camel格式
		 * @method camelCase
		 * @param name {string}
		 * @return {string}
		 */
		camelCase: function(name) {
			if (!ZHONGJYUAN.helper.check.isString(name)) {
				ZHONGJYUAN.logger.warn("helper.convert.camelCase 参数name非字符串:${0}", arguments);
			}

			return name.replace(/([:\-_]+(.))/g, function(_, separator, letter, offset) {
				return offset ? letter.toUpperCase() : letter;
			});
		},

		/**
		 * 转换数据类型名称
		 * @method capitalizeTypeName
		 * @param type {string|function}
		 * @return {string}
		 * @example
		 * var result = capitalizeTypeName(Object) // 'Object'
		 */
		capitalizeTypeName: function(type) {
			if (ZHONGJYUAN.helper.check.isString(type) && type !== "") {
				return this.capitalize(type);
			} else if (ZHONGJYUAN.helper.check.isFunction(type)) {
				var result = type.toString().match(/^function\s*?(\w+)\(/);
				if (ZHONGJYUAN.helper.check.isArray(result)) {
					return this.capitalize(result[1]);
				}
			}

			return "";
		},

		/**
		 * 转换汉字大写金额
		 * @method amountToChinese
		 * @param amount {number}
		 * @return {string}
		 * @example
		 * var result = amountToChinese(100) // '壹百元整'
		 */
		amountToChinese: function(amount) {
			if (!ZHONGJYUAN.helper.check.isNumeric(amount)) {
				ZHONGJYUAN.logger.warn("helper.convert.amountToChinese 参数amount不是数字格式:${0}", amount);
				return "";
			}
			let unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分";
			let str = "";
			amount += "00";

			let i = amount.indexOf(".");
			if (i >= 0) {
				amount = amount.substring(0, i) + amount.substr(i + 1, 2);
			}

			if (unit.length < amount.length) {
				ZHONGJYUAN.logger.warn("helper.convert.amountToChinese 参数amount超出可转换范围:${0}", amount);
			} else {
				unit = unit.substr(unit.length - amount.length);
			}

			for (i = 0; i < amount.length; i++) {
				str += "零壹贰叁肆伍陆柒捌玖".charAt(amount.charAt(i)) + unit.charAt(i);
			}

			return str
				.replace(/零角零分$/, "整")
				.replace(/零[仟佰拾]/g, "零")
				.replace(/零{2,}/g, "零")
				.replace(/零([亿|万])/g, "$1")
				.replace(/零+元/, "元")
				.replace(/亿零{0,3}万/, "亿")
				.replace(/^元/, "零元");
		},

		/**
		 * 转换小数格式
		 * @method parseDecimal
		 * @param number {string|number}
		 * @param places {number} 小数点位数，默认保留2位小数位
		 * @param defaultValue {string|number} 当number不是数字格式时返回的值，默认为'0.00'
		 * @param min {number} 最小值，可选；当number小于最小值时返回最小值
		 * @param max {number} 最大值，可选；当number大于最大值时返回最大值
		 * @return string
		 */
		parseDecimal: function(number, places, min, max, defaultValue) {
			if (!ZHONGJYUAN.helper.check.isNullOrUndefined(places)) {
				if (!ZHONGJYUAN.helper.check.isInt(places) || (ZHONGJYUAN.helper.check.isInt(places) && parseFloat(places) < 0)) {
					ZHONGJYUAN.logger.warn("helper.convert.parseDecimal 参数places不是整数类型:${0}", arguments);
					places = 2;
				}
			} else {
				places = 2;
			}

			var minValue;
			var maxValue;
			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				arguments.length < 5 && ZHONGJYUAN.logger.warn("helper.convert.parseDecimal 参数number不是数字格式:${0}", arguments);
				return arguments.length < 5 ? "0.00" : defaultValue;
			}

			if (!ZHONGJYUAN.helper.check.isNullOrUndefined(min)) {
				if (ZHONGJYUAN.helper.check.isNumeric(min)) {
					minValue = parseFloat(min);
					if (parseFloat(number) < minValue) {
						number = parseFloat(min);
					}
				} else {
					ZHONGJYUAN.logger.warn("helper.convert.parseDecimal 参数min不是数字格式:${0}", arguments);
				}
			}

			if (!ZHONGJYUAN.helper.check.isNullOrUndefined(max)) {
				if (ZHONGJYUAN.helper.check.isNumeric(max)) {
					maxValue = parseFloat(max);
					if (parseFloat(number) > parseFloat(max)) {
						number = parseFloat(max);
					}
				} else {
					ZHONGJYUAN.logger.warn("helper.convert.parseDecimal 参数max不是数字格式:${0}", arguments);
				}
			}

			if (!ZHONGJYUAN.helper.check.isUndefined(minValue) && !ZHONGJYUAN.helper.check.isUndefined(maxValue)) {
				if (minValue > maxValue) {
					ZHONGJYUAN.logger.warn("helper.convert.parseDecimal 参数min比参数max大:${0}", arguments);
				}
			}

			return parseFloat(number).toFixed(places);
		},
		/**
		 * 转百分比
		 * @method parsePercent
		 * @param number {string|number} 数字或者数字格式字符串
		 * @param places {int} 小数点位数，默认没有小数位
		 * @param defaultValue 可选，当number不合法时返回的值，默认为''
		 * @return string
		 */
		parsePercent: function(number, places, defaultValue) {
			if (
				!ZHONGJYUAN.helper.check.isNullOrUndefined(places) &&
				(!ZHONGJYUAN.helper.check.isInt(places) || (ZHONGJYUAN.helper.check.isInt(places) && parseFloat(places) < 0))
			) {
				ZHONGJYUAN.logger.warn("helper.convert.parsePercent 参数places不是正整数类型:${0}", arguments);
				places = 0;
			}
			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				arguments.length < 3 && ZHONGJYUAN.logger.warn("helper.convert.parsePercent 参数number不是数字格式:${0}", arguments);
				return arguments.length < 3 ? "" : defaultValue;
			}

			return (number * 100).toFixed(places || 0) + "%";
		},
		/**
		 * 数字转千分位格式
		 * @method toThousands
		 * @param number {number|string} 需转换的数字或者字符串数字
		 * @param places {number} 小数点位数，默认不保留小数位
		 * @param defaultValue {any} 参数number不符合数字格式时返回该默认值,默认为''
		 * @return string
		 */
		toThousands: function(number, places, defaultValue) {
			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				arguments.length < 3 && ZHONGJYUAN.logger.warn("helper.convert.toThousands 参数number不是数字格式:${0}", arguments);
				return arguments.length < 3 ? "" : defaultValue;
			}

			if (
				!ZHONGJYUAN.helper.check.isNullOrUndefined(places) &&
				(!ZHONGJYUAN.helper.check.isInt(places) || (ZHONGJYUAN.helper.check.isInt(places) && parseFloat(places) < 0))
			) {
				ZHONGJYUAN.logger.warn("helper.convert.toThousands 参数places不是整数:${0}", arguments);
				places = 0;
			}

			number = parseFloat(number);
			var lt = number < 0;
			number = Math.abs(number).toFixed(places || 0);
			var decimal = "";
			var integer = "";

			if (number.indexOf(".") !== -1) {
				decimal = number.substr(number.indexOf(".") + 1);
				number = number.substr(0, number.indexOf("."));
			}

			while (number.length > 3) {
				integer = "," + number.slice(-3) + integer;
				number = number.slice(0, number.length - 3);
			}
			if (number) {
				integer = number + integer;
			}
			return (lt ? "-" : "") + integer + (decimal ? "." + decimal : "");
		},
	},

	/**
	 * IO处理对象
	 * @author zhongjyuan
	 * @date   2023年5月15日10:33:13
	 * @email  zhongjyuan@outlook.com
	 */
	io: {
		/**
		 * 跨域请求
		 * @author zhongjyuan
		 * @date   2023年5月15日09:55:12
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url 请求URL地址
		 * @param {*} data 数据
		 * @param {*} callback 回调函数
		 * @param {*} data_name 数据名称
		 * @param {*} callback_name 回调函数名称
		 * @param {*} timeout 超时阈值[超时后取消请求并清除回调函数]
		 */
		jsonp: function(url, data, callback, data_name, callback_name, timeout = 10000) {
			data_name = data_name || "data";
			callback_name = callback_name || "callback";

			var func_name = "callback_" + Date.now() + "_" + Math.floor(Math.random() * 1000); // 使用时间戳和随机数生成函数名称

			if (!ZHONGJYUAN.io.jsonp_funcs) {
				ZHONGJYUAN.io.jsonp_funcs = {};
			}
			ZHONGJYUAN.io.jsonp_funcs[func_name] = callback;

			var timer = setTimeout(function() {
				cleanup();
				console.error("JSONP request timeout.");
			}, timeout);

			var rel = url;
			if (url.indexOf("?") < 0) {
				rel += "?";
			} else if (/[?&]$/.test(url)) {
				// 判断是否需要添加 &
				rel += "&";
			}

			rel += callback_name + "=" + encodeURIComponent('ZHONGJYUAN.helper.http.jsonp_funcs["' + func_name + '"]');
			if (data) {
				var data_str = JSON.stringify(data);
				data_str = encodeURIComponent(data_str);
				rel += "&" + data_name + "=" + data_str;
			}

			ZHONGJYUAN.helper.loadScript(rel, cleanup);

			function cleanup() {
				clearTimeout(timer);
				delete ZHONGJYUAN.io.jsonp_funcs[func_name];
			}
		},

		/**
		 * 请求
		 * @author zhongjyuan
		 * @date   2023年5月15日11:35:03
		 * @email  zhongjyuan@outlook.com
		 * @param {*} url URL地址
		 * @param {*} method 请求方式
		 * @param {*} callback 回调函数
		 * @param {*} cache 是否启用缓存
		 * @returns
		 */
		request: function(url, method, callback, cache) {
			if (cache === undefined) cache = true;

			var xmlhttp;
			if (!method) {
				method = "GET";
			}

			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				try {
					xmlhttp = new XMLHttpRequest();
				} catch (e) {
					logger.error(e);
				}
			}

			xmlhttp.open(method, url);
			if (cache) {
				xmlhttp.setRequestHeader("Cache-Control", "max-age=0");
				xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
			}

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status === 200) {
						callback(null, xmlhttp.responseText);
					} else {
						callback(xmlhttp.status, xmlhttp.responseText);
					}
				}
			};

			try {
				xmlhttp.send(null);
			} catch (e) {
				callback(e, "");
			}
		},

		/**
		 * @method http
		 * @param options {object} 配置对象
		 *     @param options.type {string} 请求类型
		 *     @param options.url {string} 请求地址
		 *     @param options.contentType {string} 请求消息主体编码，默认是application/x-www-form-urlencoded
		 *     @param options.data {object|string|number} 请求数据，适用于options.type为'PUT', 'POST', and 'PATCH'
		 *     @param options.params {object} URL参数
		 *     @param options.beforeSend {function} 请求前钩子函数，默认参数是当前options
		 *     @param options.success {function} 请求成功函数
		 *     @param options.error {function} 请求失败执行函数
		 *     @param options.complete {function} 请求执行完成函数，不管成功失败都会执行
		 *     @param options.dataType {string} 请求返回数据类型，默认是JSON
		 *     @param options.timeout {number} 请求超时时间，单位毫秒
		 *     @param options.context {object} 相关回调函数上下文，默认是window
		 *     @param options.headers {object} 请求头信息
		 *     @param options.host {string} 请求host
		 *     @param options.crossSite {boolean} 是否跨域访问，默认为false
		 */
		http: function(options) {
			if (ZHONGJYUAN.helper.check.isEmpty(options)) {
				ZHONGJYUAN.logger.warn("helper.io.http参数为空:${0}", options);
			}
		},

		/**
		 * 文件对象
		 * @author zhongjyuan
		 * @date   2023年5月15日10:35:17
		 * @email  zhongjyuan@outlook.com
		 */
		file: {
			/**
			 * 获取文件URL地址
			 * @author zhongjyuan
			 * @date   2023年5月15日16:03:41
			 * @email  zhongjyuan@outlook.com
			 * @param {*} elementId 元素主键[input:file元素的id]
			 * @returns
			 */
			getUrl: function(elementId) {
				var url;

				if (navigator.userAgent.indexOf("MSIE") >= 1) {
					// IE
					url = document.getElementById(elementId).value;
				} else if (navigator.userAgent.indexOf("Firefox") > 0) {
					// Firefox
					url = window.URL.createObjectURL(document.getElementById(elementId).files.item(0));
				} else if (navigator.userAgent.indexOf("Chrome") > 0) {
					// Chrome
					url = window.URL.createObjectURL(document.getElementById(elementId).files.item(0));
				}

				return url;
			},

			/**
			 * 保存
			 * @author zhongjyuan
			 * @date   2023年5月15日11:11:18
			 * @email  zhongjyuan@outlook.com
			 * @param {*} data 数据
			 * @param {*} filename 文件名
			 * @returns
			 */
			save: function(data, filename) {
				"use strict";

				// 检查输入参数
				if (!data || !filename) {
					console.error("缺少输入参数：data 和 filename 是必需的。");
					return;
				}

				var view = window || global,
					doc = view.document,
					get_URL = function() {
						return view.URL || view.webkitURL || view;
					},
					create_object_url = function(data) {
						if (typeof Blob === "function") {
							return get_URL().createObjectURL(new Blob([data], { type: "octet/stream" }));
						} else if (typeof data === "object" && data instanceof String) {
							return "data:application/octet-stream;base64," + btoa(data);
						} else if (typeof data === "object") {
							return get_URL().createObjectURL(data);
						} else {
							throw new Error("无法为类型为 " + typeof data + " 的项目创建 URL。");
						}
					},
					download_file = function(url, filename) {
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
				if (typeof data === "object" || data instanceof Blob) {
					var object_url = get_URL().createObjectURL(data);
					download_file(object_url, filename);
					revoke(object_url);
				}
				// 对于文本类型的数据，使用 data URI scheme 进行 “下载”
				else if (typeof data === "string") {
					var url = create_object_url(data);
					download_file(url, filename);
				}
				// 不支持的数据类型
				else {
					console.error("无效的输入参数：只有 Blob 对象或 String 文本受支持。");
					return;
				}

				// 之后撤销对象 URL
				function revoke(url) {
					setTimeout(function() {
						get_URL().revokeObjectURL(url);
					}, 1000); // 延迟撤销对象 URL 以保证兼容性

					// 如果 download 属性不能保存 blob，则使用陈旧的技术来进行回退。
					if (typeof InstallTrigger !== "undefined") {
						console.warn(
							"[Firefox] 必须手动启用“另存为”对话框提示。 https://support.mozilla.org/zh-CN/kb/how-to-download-and-install-firefox-on-windows/"
						);
					}
				}
			},
		},

		/**
		 * 图片对象
		 * @author zhongjyuan
		 * @date   2023年5月15日16:02:26
		 * @email  zhongjyuan@outlook.com
		 */
		image: {
			/**
			 * 图片大小
			 * @author zhongjyuan
			 * @date   2023年5月15日16:02:31
			 * @email  zhongjyuan@outlook.com
			 * @param {*} imageUrl 图片 URL
			 * @param {*} callback 回调函数
			 */
			toSize: function(imageUrl, callback) {
				var img = new Image();
				img.src = imageUrl;
				img.onload = function() {
					if (callback) {
						callback({
							width: img.width,
							height: img.height,
						});
					}
				};
			},

			/**
			 * 转Base64编码
			 * @author zhongjyuan
			 * @date   2023年5月15日16:04:22
			 * @email  zhongjyuan@outlook.com
			 * @param {*} image Image对象
			 * @returns
			 */
			toBase64: function(image) {
				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;

				var ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0, image.width, image.height);
				var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();

				return canvas.toDataURL("image/" + ext);
			},

			/**
			 * 图片主题色[转换为 RGBA 颜色值]
			 * @author zhongjyuan
			 * @date   2023年5月15日16:02:44
			 * @email  zhongjyuan@outlook.com
			 * @param {*} imageUrl 图片 URL
			 * @param {*} callback 回调函数
			 * @param {*} light 亮度系数
			 */
			toThemeColor: function(imageUrl, callback, light) {
				if (!light) {
					light = 1.0;
				}

				var img = new Image();
				img.src = imageUrl;
				img.crossOrigin = "anonymous"; //跨域声明（只在chrome和firefox有效——吗？）

				img.onload = function() {
					try {
						var canvas = document.createElement("canvas");
						canvas.width = img.width;
						canvas.height = img.height;

						var ctxt = canvas.getContext("2d");
						ctxt.drawImage(img, 0, 0);
						var data = ctxt.getImageData(0, 0, img.width, img.height).data; //读取整张图片的像素。

						var r = 0,
							g = 0,
							b = 0,
							a = 0;
						var red, green, blue, alpha;
						var pixel = img.width * img.height;
						for (var i = 0, len = data.length; i < len; i += 4) {
							red = data[i];
							r += red; //红色色深
							green = data[i + 1];
							g += green; //绿色色深
							blue = data[i + 2];
							b += blue; //蓝色色深
							alpha = data[i + 3];
							a += alpha; //透明度
						}

						r = parseInt((r / pixel) * light);
						g = parseInt((g / pixel) * light);
						b = parseInt((b / pixel) * light);
						a = 1; //a/pixel/255;

						var color = "rgba(" + r + "," + g + "," + b + "," + a + ")";
						if (callback) {
							callback(color);
						}
					} catch (e) {
						console.debug(e);
					}
				};
			},
		},
	},

	/**
	 * 事件对象
	 * @author zhongjyuan
	 * @date   2023年5月12日12:00:57
	 * @email  zhongjyuan@outlook.com
	 */
	event: (function() {
		/**
		 * 初始化事件列表
		 * @author zhongjyuan
		 * @date   2023年5月12日12:01:37
		 * @email  zhongjyuan@outlook.com
		 */
		function initializeHandles() {
			if (!this.handles) {
				Object.defineProperty(this, "handles", {
					value: {},
					enumerable: false,
					configurable: true,
					writable: true,
				});
			}
		}

		/**
		 * 监听事件
		 * @author zhongjyuan
		 * @date   2023年5月12日12:01:46
		 * @email  zhongjyuan@outlook.com
		 * @param {*} event 事件
		 * @param {*} callback 回调函数
		 */
		function on(event, callback) {
			initializeHandles();

			if (!this.handles[event.name]) {
				this.handles[event.name] = [];
			}

			this.handles[event.name].push(callback);
		}

		/**
		 * 触发事件
		 * @author zhongjyuan
		 * @date   2023年5月12日12:01:55
		 * @email  zhongjyuan@outlook.com
		 * @param {*} event 事件
		 */
		function emit(event) {
			var handles = this.handles && this.handles[event.name];

			if (handles && handles.length > 0) {
				handles = handles.slice();
				var args = Array.prototype.slice.call(arguments, 1);

				for (var i = 0; i < handles.length; i++) {
					handles[i].apply(this, args);
				}
			}
		}

		/**
		 * 闭包方式将某些方法设置为私有函数
		 */
		return {
			on: on,
			emit: emit,
		};
	})(),

	/**
	 * DOM处理对象
	 * @author zhongjyuan
	 * @date   2023年6月30日16:40:43
	 * @email  zhongjyuan@outlook.com
	 */
	dom: {
		/**
		 * 判断是否dom元素
		 * @method isDom
		 * @param element {htmlelement}
		 * @return {boolean}
		 */
		isDom: function(element) {
			var div = document.createElement("div");
			try {
				div.appendChild(element.cloneNode(true));
				return element.nodeType === 1;
			} catch (e) {
				return element === window || element === document;
			}
		},

		/**
		 * 判断元素是否隐藏不可见
		 * @param {htmlelement} el 判断元素
		 */
		isHidden: function(element) {
			if (!this.isDom(element)) {
				ZHONGJYUAN.logger.warn("helper.dom.isHidden 参数element不是html元素:${0}", arguments);
				return false;
			}

			return !(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		},

		/**
		 * 获取html元素，返回一个，不存在返回null
		 * @method query
		 * @param element {string} 合法的CSS选择语法
		 * @return {dom|null}
		 */
		query: function(element, dom = document) {
			if (ZHONGJYUAN.helper.check.isString(element)) {
				return dom.querySelector(element);
			} else {
				return element;
			}
		},

		/**
		 * 获取html元素，可返回多个，不存在返回null
		 * @method query
		 * @param element {string} 合法的CSS选择语法
		 * @return {doms|null}
		 */
		queryAll: function(element, dom = document) {
			if (ZHONGJYUAN.helper.check.isString(element)) {
				return dom.querySelectorAll(element);
			} else {
				return element;
			}
		},

		/**
		 * 转换为DOM元素
		 */
		transformToDom: function(html) {
			const wrap = document.createElement("div");
			const fragment = document.createDocumentFragment();

			wrap.innerHTML = html;
			fragment.appendChild(wrap);

			return fragment.firstChild;
		},

		/**
		 * 判断元素是否有className
		 * @method hasClass
		 * @param element {htmlElement} 元素
		 * @param className {string} 判断类名称
		 * @return {boolean}
		 */
		hasClass: function(element, className) {
			if (!this.isDom(element) || !ZHONGJYUAN.helper.check.isString(className)) {
				ZHONGJYUAN.logger.warn("helper.dom.hasClass 参数错误：element不是html元素或className非字符串:${0}", arguments);
				return false;
			}

			if (className.indexOf(" ") !== -1) {
				ZHONGJYUAN.logger.warn("helper.dom.hasClass 参数className不能包含空格:${0}", arguments);
			}
			if (element.classList) {
				return element.classList.contains(className);
			} else {
				return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
			}
		},

		/**
		 * 给元素添加className
		 * @method addClass
		 * @param element {htmlElement} 元素
		 * @param cls {string} 类名称
		 */
		addClass: function(element, classNames) {
			if (!this.isDom(element)) {
				ZHONGJYUAN.logger.warn("helper.dom.addClass 参数element非html元素:${0}", arguments);
				return;
			}
			var originClassName = element.className;
			var currentClassNames = (classNames || "").split(" ");

			for (var i = 0, j = currentClassNames.length; i < j; i++) {
				var currentClassName = currentClassNames[i];
				if (!currentClassName) continue;

				if (element.classList) {
					element.classList.add(currentClassName);
				} else {
					if (!ZHONGJYUAN.helper.dom.hasClass(element, currentClassName)) {
						originClassName += " " + currentClassName;
					}
				}
			}

			if (!element.classList) {
				element.className = originClassName;
			}
		},

		/**
		 * 移除元素className
		 * @method removeClass
		 * @param element {htmlElement}
		 * @param className {string}
		 */
		removeClass: function(element, className) {
			if (!this.isDom(element) || !ZHONGJYUAN.helper.check.isString(className)) {
				ZHONGJYUAN.logger.warn("helper.dom.addClass 参数element非html元素或者className非字符串:${0}", arguments);
				return;
			}
			var currentClassNames = className.split(" ");
			var currentClassName = " " + element.className + " ";

			for (var i = 0, j = currentClassNames.length; i < j; i++) {
				var currentClassName = currentClassNames[i];
				if (!currentClassName) continue;

				if (element.classList) {
					element.classList.remove(currentClassName);
				} else {
					if (this.hasClass(element, currentClassName)) {
						currentClassName = currentClassName.replace(" " + currentClassName + " ", " ");
					}
				}
			}

			if (!element.classList) {
				element.className = ZHONGJYUAN.helper.trim(currentClassName);
			}
		},

		/**
		 * 获取元素某个样式
		 * @method getStyle
		 * @param element {htmlElement}
		 * @param sytleName {string} 样式名称
		 * @param defaultVal {any} 报错或者不存在样式时返回默认值，默认为null
		 * @return {string|number|null}
		 */
		getStyle: function(element, styleName, defaultVal) {
			defaultVal = arguments.length > 2 ? defaultVal : null;
			if (!this.isDom(element) || !ZHONGJYUAN.helper.check.isString(styleName)) {
				ZHONGJYUAN.logger.warn("helper.dom.getStyle 参数element不是html元素或者styleName非字符串:${0}", arguments);
				return defaultVal;
			}

			styleName = ZHONGJYUAN.helper.convert.camelCase(styleName);
			if (styleName === "float") {
				styleName = "cssFloat";
			}

			try {
				var computed = document.defaultView.getComputedStyle(element, "");
				return element.style[styleName] || computed ? computed[styleName] : defaultVal;
			} catch (e) {
				return element.style[styleName];
			}
		},

		/**
		 * 设置元素某个样式
		 * @method setStyle
		 * @param element {htmlelement}
		 * @param styleName {string} 样式名称
		 * @param value {any} 设置值
		 */
		setStyle: function(element, styleName, value) {
			if (!this.isDom(element) || (!ZHONGJYUAN.helper.check.isString(styleName) && !ZHONGJYUAN.helper.check.isPlainObject(styleName))) {
				ZHONGJYUAN.logger.warn("helper.dom.setStyle 参数element不是html元素或者styleName非字符串和对象:${0}", arguments);
				return;
			}

			if (typeof styleName === "object") {
				for (var prop in styleName) {
					if (styleName.hasOwnProperty(prop)) {
						this.setStyle(element, prop, styleName[prop]);
					}
				}
			} else {
				styleName = ZHONGJYUAN.helper.convert.camelCase(styleName);
				element.style[styleName] = value;
			}
		},

		/**
		 * 监听事件
		 * @method on
		 * @param element {htmlElement} 需绑定元素
		 * @param event {string} 绑定事件名称
		 * @param handler {function} 事件执行函数
		 */
		on: function(element, event, handler) {
			if (this.isDom(element) && ZHONGJYUAN.helper.check.isString(event) && ZHONGJYUAN.helper.check.isFunction(handler)) {
				element.addEventListener(event, handler, false);
			} else {
				ZHONGJYUAN.logger.warn("helper.dom.on 参数错误：element不是html元素、event非字符串、handler不是函数:${0}", arguments);
			}
		},

		/**
		 * 取消监听事件
		 * @method off
		 * @param element {htmlElement} 需绑定元素
		 * @param event {stirng} 绑定事件名称
		 * @param handler {function} 事件执行函数
		 */
		off: function(element, event, handler) {
			if (ZHONGJYUAN.helper.check.isDom(element) && ZHONGJYUAN.helper.check.isString(event)) {
				element.removeEventListener(event, handler, false);
			} else {
				ZHONGJYUAN.logger.warn("helper.dom.off 参数错误：el不是html元素或event非字符串:${0}", arguments);
			}
		},

		/**
		 * 只绑定一次监听事件
		 * @method once
		 * @param el {htmlElement} 需绑定元素
		 * @param event {string} 绑定事件名称
		 * @param handler {function} 事件执行函数
		 */
		once: function(element, event, handler) {
			if (!this.isDom(element) || !ZHONGJYUAN.helper.check.isString(event) || !ZHONGJYUAN.helper.check.isFunction(handler)) {
				return ZHONGJYUAN.logger.warn("helper.dom.once 参数错误：el不是html元素或event非字符串或handler不是函数:${0}", arguments);
			}

			var listener = function() {
				if (handler) {
					handler.apply(this, arguments);
				}
				this.off(element, event, listener);
			};

			this.on(element, event, listener);
		},
	},

	/**
	 * 计算处理对象
	 * @author zhongjyuan
	 * @date   2023年6月30日17:41:40
	 * @email  zhongjyuan@outlook.com
	 */
	compute: {
		/**
		 * 获取两个时间差，不符合日期格式返回-1或者指定默认值
		 * @method getDateInterval
		 * @param start {date|string}
		 * @param end {date|string}
		 * @param unit {string} 单位类型，默认是毫秒，可传值：d（日）/h（小时）/m（分钟）/s(秒)/ms(毫秒)
		 * @param defaultValue {any} 当日期格式无效时返回指定的默认值
		 * @return number
		 */
		getDateInterval: function(start, end, unit, defaultValue) {
			if (ZHONGJYUAN.helper.check.isString(start)) {
				start = ZHONGJYUAN.helper.convert.parseDate(start);
			}

			if (ZHONGJYUAN.helper.check.isString(end)) {
				end = ZHONGJYUAN.helper.convert.parseDate(end);
			}

			defaultValue = arguments > 3 ? defaultValue : -1;
			if (!ZHONGJYUAN.helper.check.isDate(start) || !ZHONGJYUAN.helper.check.isDate(end)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateInterval 参数start或end不是日期格式或者转换日期格式失败:${0};${1}", start, end);
				return defaultValue;
			}
			unit = arguments.length < 3 ? "ms" : unit;
			const divisorMap = {
				ms: 1,
				s: 1000,
				m: 1000 * 60,
				h: 1000 * 60 * 60,
				d: 1000 * 60 * 60 * 24,
			};

			if (!divisorMap.hasOwnProperty(unit)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateInterval 参数unit暂只支持d/h/m/s/ms之一:${0};${1};${2}", start, end, unit);
				unit = "ms";
			}

			return Math.abs(start * 1 - end * 1) / divisorMap[unit];
		},

		/**
		 * 获取相隔几天后的日期
		 * @method getDateByDaysApart
		 * @param date {Date|string}
		 * @param number {number}
		 * @param defaultValue {any} 当指定date、number无效时返回指定的默认值，默认范围null
		 * @return Date|null
		 * @example
		 *   var threeDaysLater = getDateByDaysApart(new Date(), 3);
		 */
		getDateByDaysApart: function(date, number, defaultValue) {
			if (ZHONGJYUAN.helper.check.isString(date)) {
				date = ZHONGJYUAN.helper.convert.parseDate(date);
			}

			defaultValue = arguments.length > 2 ? defaultValue : null;
			if (!ZHONGJYUAN.helper.check.isDate(date)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByDaysApart 参数date不是日期格式或者不能转换日期类型:${0}", date);
				return defaultValue;
			}

			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByDaysApart 参数number不是有效数字:${0}", number);
				return defaultValue;
			}

			return new Date(date.getTime() + 60 * 60 * 1000 * 24 * number);
		},

		/**
		 * 获取相隔几月后的日期
		 * @method getDateByMonthApart
		 * @param date {Date|string}
		 * @param number {number}
		 * @param defaultValue {any} 当指定date、number无效时返回指定的默认值，默认范围null
		 * @return Date|null
		 * @example
		 *   var threeMonthLater = getDateByMonthApart(new Date(), 3); // 往后3个月
		 */
		getDateByMonthApart: function(date, number, defaultValue) {
			defaultValue = arguments.length > 2 ? defaultValue : null;
			if (ZHONGJYUAN.helper.check.isString(date)) {
				date = ZHONGJYUAN.helper.convert.parseDate(date);
			}

			if (!ZHONGJYUAN.helper.check.isDate(date)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByMonthApart 参数date不是日期格式或者不能转换日期类型:${0}", date);
				return defaultValue;
			} else {
				date = new Date(date.getTime());
			}

			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByMonthApart 参数number不是有效数字:${0}", number);
				return defaultValue;
			}

			date.setMonth(date.getMonth() + number);

			return date;
		},

		/**
		 * 获取当前月份后的日期
		 * @method getDateByMonthApartExtend
		 * @param date {Date|string}
		 * @param number {number}
		 * @param isStart {bool} true：本月开始日期 false：结束日期及滚动日期
		 * @param defaultValue {any} 当指定date、number无效时返回指定的默认值，默认范围null
		 * @return Date|null
		 * @example
		 *   var threeMonthLater = getDateByMonthApartExtend(new Date(), 2); // 往后3个月
		 */
		getDateByMonthApartExtend: function(date, number, isStart, defaultValue) {
			defaultValue = arguments.length > 2 ? defaultValue : null;
			if (ZHONGJYUAN.helper.check.isString(date)) {
				date = ZHONGJYUAN.helper.convert.parseDate(date);
			}

			if (!ZHONGJYUAN.helper.check.isDate(date)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByMonthApartExtend 参数date不是日期格式或者不能转换日期类型:${0}", date);
				return defaultValue;
			} else {
				date = new Date(date.getTime());
			}

			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByMonthApartExtend 参数number不是有效数字:${0}", number);
				return defaultValue;
			}

			// 结束日期是否滚动月份
			var nowMonth = !isStart && number > 0 ? date.getMonth() + number : date.getMonth(); // 获取月份
			var nowYear = date.getFullYear(); // 当前年
			if (isStart) {
				return new Date(nowYear, nowMonth, 1);
			} else {
				return new Date(nowYear, nowMonth + 1, 0);
			}
		},

		/**
		 * 获取相隔几年后的日期
		 * @method getDateByYearApart
		 * @param date {Date|string}
		 * @param number {number}
		 * @param defaultValue {any} 当指定date、number无效时返回指定的默认值，默认范围null
		 * @return Date|null
		 * @example
		 *   var threeYearLater = getDateByYearApart(new Date(), 3); // 往后3个月
		 */
		getDateByYearApart: function(date, number, defaultValue) {
			defaultValue = arguments.length > 2 ? defaultValue : null;
			if (ZHONGJYUAN.helper.check.isString(date)) {
				date = ZHONGJYUAN.helper.convert.parseDate(date);
			}

			if (!ZHONGJYUAN.helper.check.isDate(date)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByYearApart 参数date不是日期格式或者不能转换日期类型:${0}", date);
				return defaultValue;
			} else {
				date = new Date(date.getTime());
			}

			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByYearApart 参数number不是有效数字:${0}", number);
				return defaultValue;
			}

			date.setYear(date.getFullYear() + number);

			return date;
		},

		/**
		 * 获取年日期
		 * @method getDateByYearApartExtend
		 * @param date {Date|string}
		 * @param number {number}
		 * @param isStart {bool} true：本年开始日期 false：结束日期及滚动日期
		 * @param defaultValue {any} 当指定date、number无效时返回指定的默认值，默认范围null
		 * @return Date|null
		 * @example
		 * var threeYearLater = getDateByYearApartExtend(new Date(), 2); // 往后三年
		 */
		getDateByYearApartExtend: function(date, number, isStart, defaultValue) {
			defaultValue = arguments.length > 2 ? defaultValue : null;
			if (ZHONGJYUAN.helper.check.isString(date)) {
				date = ZHONGJYUAN.helper.convert.parseDate(date);
			}

			if (!ZHONGJYUAN.helper.check.isDate(date)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByYearApartExtend 参数date不是日期格式或者不能转换日期类型:${0}", date);
				return defaultValue;
			} else {
				date = new Date(date.getTime());
			}

			if (!ZHONGJYUAN.helper.check.isNumeric(number)) {
				ZHONGJYUAN.logger.warn("helper.compute.getDateByYearApartExtend 参数number不是有效数字:${0}", number);
				return defaultValue;
			}

			// 结束日期是否滚动月份
			var nowYear = !isStart && number > 0 ? date.getFullYear() + number : date.getFullYear(); // 当前年
			if (isStart) {
				return new Date(nowYear, 0, 1);
			} else {
				return new Date(nowYear, 12, 0);
			}
		},
	},

	/**
	 * 根据事件获取定位
	 * @author zhongjyuan
	 * @date   2023年5月23日14:39:26
	 * @email  zhongjyuan@outlook.com
	 * @param {*} event 事件对象
	 * @param {*} mouse 是否鼠标
	 */
	getPositionByEvent: function(event, mouse) {
		var position = {
			x: 0,
			y: 0,
		};

		//是鼠标
		if (mouse) {
			position.x = event.pageX;
			position.y = event.pageY;
		}

		//是触屏
		else {
			var touches = event.changedTouches ? event.changedTouches : event.originalEvent.changedTouches;
			position.x = touches[0].pageX;
			position.y = touches[0].pageY;
		}

		return position;
	},
};
