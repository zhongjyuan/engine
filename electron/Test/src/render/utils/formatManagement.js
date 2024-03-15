/**
 * 格式化管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日18:55:40
 */
const formatManagement = {
	/**日期格式化实例 */
	dateFormatInstance: new Intl.DateTimeFormat(navigator.language, { year: "numeric", month: "long" }),

	/**
	 * 格式化相对日期
	 * @param {Date} date - 需要格式化的日期对象
	 * @returns {string} - 格式化后的相对日期字符串
	 */
	relativeDate: function (date) {
		/**获取当前时间戳 */
		var currentTime = Date.now();

		/**获取今天的开始时间 */
		var startOfToday = new Date();
		startOfToday.setHours(0);
		startOfToday.setMinutes(0);
		startOfToday.setSeconds(0);

		/**一天的毫秒数 */
		var msPerDay = 24 * 60 * 60 * 1000;

		/**计算今天已经过去的毫秒数 */
		var timeElapsedToday = currentTime - startOfToday.getTime();

		/**定义相对日期范围 */
		var relativeDateRanges = [
			[0, 60000, l("timeRangeJustNow")], // 刚刚
			[60000, 300000, l("timeRangeMinutes")], // 几分钟前
			[300000, 3600000, l("timeRangeHour")], // 几小时前
			[3600000, timeElapsedToday, l("timeRangeToday")], // 今天
			[timeElapsedToday, timeElapsedToday + msPerDay, l("timeRangeYesterday")], // 昨天
			[timeElapsedToday + msPerDay, 604800000, l("timeRangeWeek")], // 一周前
			[604800000, 2592000000, l("timeRangeMonth")], // 一个月前
		];

		/**计算传入日期与当前时间的差值 */
		var diff = Date.now() - date;

		// 遍历相对日期范围
		for (var i = 0; i < relativeDateRanges.length; i++) {
			// 如果差值落在某个范围内，则返回对应的相对日期字符串
			if (relativeDateRanges[i][0] <= diff && relativeDateRanges[i][1] >= diff) {
				return relativeDateRanges[i][2];
			}
		}

		// 如果日期超出了相对日期范围，则使用日期格式化实例进行格式化
		return formatManagement.dateFormatInstance.format(new Date(date));
	},
};

module.exports = formatManagement;
