/**
 * 将日期对象转换成指定格式的日期字符串
 * @author zhongjyuan
 * @date   2023年5月12日10:07:49
 * @email  zhongjyuan@outlook.com
 * @param {*} format 表达式
 * @returns
 */
Date.prototype.format = function(format) {
	const cache = new Map();
	if (!format) {
		format = "yyyy-MM-dd hh:mm:ss";
	}

	// 在此处添加更多的时间格式化项
	const o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds(),
		// 添加年份、季度、星期等扩展
		"y+": ((year) => {
			const key = `${year}+${format}`;
			if (cache.has(key)) {
				return cache.get(key);
			}
			const value = year.toString().substr(4 - RegExp.$1.length);
			cache.set(key, value);
			return value;
		})(this.getFullYear()),
		W: (function(date) {
			const key = `W+${date}`;
			if (cache.has(key)) {
				return cache.get(key);
			}
			const num = date.getDay();
			const CN_DAY = ["日", "一", "二", "三", "四", "五", "六"];
			const value = `星期${CN_DAY[num]}`;
			cache.set(key, value);
			return value;
		})(this),
		ap: this.getHours() < 12 ? "上午" : "下午",
		GMT: (function() {
			const localTime = new Date();
			const offset = -localTime.getTimezoneOffset() / 60;
			return `${offset > 0 ? "+" : "-"}${String(offset).padStart(2, "0")}00`;
		})(),
	};

	// 构建正则表达式并遍历对象 o
	for (let k in o) {
		const reg = new RegExp("(" + k + ")");
		if (reg.test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}

	return format;
};
