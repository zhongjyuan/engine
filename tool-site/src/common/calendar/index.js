import logger from "@base/logger";

/**
 * 日历对象
 * @author zhongjyuan
 * @date   2024年1月11日10:27:13
 * @email  zhongjyuan@outlook.com
 * @returns {object} 多语言对象
 */
export default (() => {
	/**
	 * 农历1900-2100的润大小信息表
	 */
	var lunarInfo = [
		0x04bd8,
		0x04ae0,
		0x0a570,
		0x054d5,
		0x0d260,
		0x0d950,
		0x16554,
		0x056a0,
		0x09ad0,
		0x055d2, // 1900-1909
		0x04ae0,
		0x0a5b6,
		0x0a4d0,
		0x0d250,
		0x1d255,
		0x0b540,
		0x0d6a0,
		0x0ada2,
		0x095b0,
		0x14977, // 1910-1919
		0x04970,
		0x0a4b0,
		0x0b4b5,
		0x06a50,
		0x06d40,
		0x1ab54,
		0x02b60,
		0x09570,
		0x052f2,
		0x04970, // 1920-1929
		0x06566,
		0x0d4a0,
		0x0ea50,
		0x06e95,
		0x05ad0,
		0x02b60,
		0x186e3,
		0x092e0,
		0x1c8d7,
		0x0c950, // 1930-1939
		0x0d4a0,
		0x1d8a6,
		0x0b550,
		0x056a0,
		0x1a5b4,
		0x025d0,
		0x092d0,
		0x0d2b2,
		0x0a950,
		0x0b557, // 1940-1949
		0x06ca0,
		0x0b550,
		0x15355,
		0x04da0,
		0x0a5b0,
		0x14573,
		0x052b0,
		0x0a9a8,
		0x0e950,
		0x06aa0, // 1950-1959
		0x0aea6,
		0x0ab50,
		0x04b60,
		0x0aae4,
		0x0a570,
		0x05260,
		0x0f263,
		0x0d950,
		0x05b57,
		0x056a0, // 1960-1969
		0x096d0,
		0x04dd5,
		0x04ad0,
		0x0a4d0,
		0x0d4d4,
		0x0d250,
		0x0d558,
		0x0b540,
		0x0b6a0,
		0x195a6, // 1970-1979
		0x095b0,
		0x049b0,
		0x0a974,
		0x0a4b0,
		0x0b27a,
		0x06a50,
		0x06d40,
		0x0af46,
		0x0ab60,
		0x09570, // 1980-1989
		0x04af5,
		0x04970,
		0x064b0,
		0x074a3,
		0x0ea50,
		0x06b58,
		0x05ac0,
		0x0ab60,
		0x096d5,
		0x092e0, // 1990-1999
		0x0c960,
		0x0d954,
		0x0d4a0,
		0x0da50,
		0x07552,
		0x056a0,
		0x0abb7,
		0x025d0,
		0x092d0,
		0x0cab5, // 2000-2009
		0x0a950,
		0x0b4a0,
		0x0baa4,
		0x0ad50,
		0x055d9,
		0x04ba0,
		0x0a5b0,
		0x15176,
		0x052b0,
		0x0a930, // 2010-2019
		0x07954,
		0x06aa0,
		0x0ad50,
		0x05b52,
		0x04b60,
		0x0a6e6,
		0x0a4e0,
		0x0d260,
		0x0ea65,
		0x0d530, // 2020-2029
		0x05aa0,
		0x076a3,
		0x096d0,
		0x04afb,
		0x04ad0,
		0x0a4d0,
		0x1d0b6,
		0x0d250,
		0x0d520,
		0x0dd45, // 2030-2039
		0x0b5a0,
		0x056d0,
		0x055b2,
		0x049b0,
		0x0a577,
		0x0a4b0,
		0x0aa50,
		0x1b255,
		0x06d20,
		0x0ada0, // 2040-2049
		0x14b63,
		0x09370,
		0x049f8,
		0x04970,
		0x064b0,
		0x168a6,
		0x0ea50,
		0x06b20,
		0x1a6c4,
		0x0aae0, // 2050-2059
		0x0a2e0,
		0x0d2e3,
		0x0c960,
		0x0d557,
		0x0d4a0,
		0x0da50,
		0x05d55,
		0x056a0,
		0x0a6d0,
		0x055d4, // 2060-2069
		0x052d0,
		0x0a9b8,
		0x0a950,
		0x0b4a0,
		0x0b6a6,
		0x0ad50,
		0x055a0,
		0x0aba4,
		0x0a5b0,
		0x052b0, // 2070-2079
		0x0b273,
		0x06930,
		0x07337,
		0x06aa0,
		0x0ad50,
		0x14b55,
		0x04b60,
		0x0a570,
		0x054e4,
		0x0d160, // 2080-2089
		0x0e968,
		0x0d520,
		0x0daa0,
		0x16aa6,
		0x056d0,
		0x04ae0,
		0x0a9d4,
		0x0a2d0,
		0x0d150,
		0x0f252, // 2090-2099
		0x0d520, // 2100
	];

	/**公里月份天数集 */
	var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	/**
	 * 数字转中文速查表
	 * @Array Of Property
	 * @trans ['日','一','二','三','四','五','六','七','八','九','十']
	 * @return Cn string
	 */
	var chineseNums = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"];

	/**
	 * 日期转农历称呼速查表
	 * @Array Of Property
	 * @trans ['初','十','廿','卅']
	 * @return Cn string
	 */
	var lunarTerms = ["\u521d", "\u5341", "\u5eff", "\u5345"];

	/**
	 * 月份转农历称呼速查表
	 * @Array Of Property
	 * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
	 * @return Cn string
	 */
	var lunarMonths = ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"];

	/**
	 * 天干地支之天干速查表
	 * @Array Of Property trans['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
	 * @return Cn string
	 */
	var gans = ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"];

	/**
	 * 天干地支之地支速查表
	 * @Array Of Property
	 * @trans['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
	 * @return Cn string
	 */
	var zhis = ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"];

	/**
	 * 天干地支之地支速查表<=>生肖
	 * @Array Of Property
	 * @trans['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
	 * @return Cn string
	 */
	var animals = ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"];

	/**
	 * 24节气速查表
	 * @Array Of Property
	 * @trans['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至']
	 * @return Cn string
	 */
	var solarTerms = [
		"\u5c0f\u5bd2",
		"\u5927\u5bd2",
		"\u7acb\u6625",
		"\u96e8\u6c34",
		"\u60ca\u86f0",
		"\u6625\u5206",
		"\u6e05\u660e",
		"\u8c37\u96e8",
		"\u7acb\u590f",
		"\u5c0f\u6ee1",
		"\u8292\u79cd",
		"\u590f\u81f3",
		"\u5c0f\u6691",
		"\u5927\u6691",
		"\u7acb\u79cb",
		"\u5904\u6691",
		"\u767d\u9732",
		"\u79cb\u5206",
		"\u5bd2\u9732",
		"\u971c\u964d",
		"\u7acb\u51ac",
		"\u5c0f\u96ea",
		"\u5927\u96ea",
		"\u51ac\u81f3",
	];

	/**
	 * 1900-2100各年的24节气日期速查表
	 * @Array Of Property
	 * @return 0x string For splice
	 */
	var sTermInfo = [
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c3598082c95f8c965cc920f",
		"97bd0b06bdb0722c965ce1cfcc920f",
		"b027097bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c359801ec95f8c965cc920f",
		"97bd0b06bdb0722c965ce1cfcc920f",
		"b027097bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c359801ec95f8c965cc920f",
		"97bd0b06bdb0722c965ce1cfcc920f",
		"b027097bd097c36b0b6fc9274c91aa",
		"9778397bd19801ec9210c965cc920e",
		"97b6b97bd19801ec95f8c965cc920f",
		"97bd09801d98082c95f8e1cfcc920f",
		"97bd097bd097c36b0b6fc9210c8dc2",
		"9778397bd197c36c9210c9274c91aa",
		"97b6b97bd19801ec95f8c965cc920e",
		"97bd09801d98082c95f8e1cfcc920f",
		"97bd097bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36c9210c9274c91aa",
		"97b6b97bd19801ec95f8c965cc920e",
		"97bcf97c3598082c95f8e1cfcc920f",
		"97bd097bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36c9210c9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c3598082c95f8c965cc920f",
		"97bd097bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c3598082c95f8c965cc920f",
		"97bd097bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c359801ec95f8c965cc920f",
		"97bd097bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c359801ec95f8c965cc920f",
		"97bd097bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf97c359801ec95f8c965cc920f",
		"97bd097bd07f595b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9210c8dc2",
		"9778397bd19801ec9210c9274c920e",
		"97b6b97bd19801ec95f8c965cc920f",
		"97bd07f5307f595b0b0bc920fb0722",
		"7f0e397bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36c9210c9274c920e",
		"97b6b97bd19801ec95f8c965cc920f",
		"97bd07f5307f595b0b0bc920fb0722",
		"7f0e397bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36c9210c9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bd07f1487f595b0b0bc920fb0722",
		"7f0e397bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf7f1487f595b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf7f1487f595b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf7f1487f531b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c965cc920e",
		"97bcf7f1487f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b97bd19801ec9210c9274c920e",
		"97bcf7f0e47f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"9778397bd097c36b0b6fc9210c91aa",
		"97b6b97bd197c36c9210c9274c920e",
		"97bcf7f0e47f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"9778397bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36c9210c9274c920e",
		"97b6b7f0e47f531b0723b0b6fb0722",
		"7f0e37f5307f595b0b0bc920fb0722",
		"7f0e397bd097c36b0b6fc9210c8dc2",
		"9778397bd097c36b0b70c9274c91aa",
		"97b6b7f0e47f531b0723b0b6fb0721",
		"7f0e37f1487f595b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc9210c8dc2",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f595b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"9778397bd097c36b0b6fc9274c91aa",
		"97b6b7f0e47f531b0723b0787b0721",
		"7f0e27f0e47f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"9778397bd097c36b0b6fc9210c91aa",
		"97b6b7f0e47f149b0723b0787b0721",
		"7f0e27f0e47f531b0723b0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"9778397bd097c36b0b6fc9210c8dc2",
		"977837f0e37f149b0723b0787b0721",
		"7f07e7f0e47f531b0723b0b6fb0722",
		"7f0e37f5307f595b0b0bc920fb0722",
		"7f0e397bd097c35b0b6fc9210c8dc2",
		"977837f0e37f14998082b0787b0721",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e37f1487f595b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc9210c8dc2",
		"977837f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"977837f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd097c35b0b6fc920fb0722",
		"977837f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"977837f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"977837f0e37f14998082b0787b06bd",
		"7f07e7f0e47f149b0723b0787b0721",
		"7f0e27f0e47f531b0b0bb0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"977837f0e37f14998082b0723b06bd",
		"7f07e7f0e37f149b0723b0787b0721",
		"7f0e27f0e47f531b0723b0b6fb0722",
		"7f0e397bd07f595b0b0bc920fb0722",
		"977837f0e37f14898082b0723b02d5",
		"7ec967f0e37f14998082b0787b0721",
		"7f07e7f0e47f531b0723b0b6fb0722",
		"7f0e37f1487f595b0b0bb0b6fb0722",
		"7f0e37f0e37f14898082b0723b02d5",
		"7ec967f0e37f14998082b0787b0721",
		"7f07e7f0e47f531b0723b0b6fb0722",
		"7f0e37f1487f531b0b0bb0b6fb0722",
		"7f0e37f0e37f14898082b0723b02d5",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e37f1487f531b0b0bb0b6fb0722",
		"7f0e37f0e37f14898082b072297c35",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e37f0e37f14898082b072297c35",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e37f0e366aa89801eb072297c35",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f149b0723b0787b0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
		"7f0e37f0e366aa89801eb072297c35",
		"7ec967f0e37f14998082b0723b06bd",
		"7f07e7f0e47f149b0723b0787b0721",
		"7f0e27f0e47f531b0723b0b6fb0722",
		"7f0e37f0e366aa89801eb072297c35",
		"7ec967f0e37f14998082b0723b06bd",
		"7f07e7f0e37f14998083b0787b0721",
		"7f0e27f0e47f531b0723b0b6fb0722",
		"7f0e37f0e366aa89801eb072297c35",
		"7ec967f0e37f14898082b0723b02d5",
		"7f07e7f0e37f14998082b0787b0721",
		"7f07e7f0e47f531b0723b0b6fb0722",
		"7f0e36665b66aa89801e9808297c35",
		"665f67f0e37f14898082b0723b02d5",
		"7ec967f0e37f14998082b0787b0721",
		"7f07e7f0e47f531b0723b0b6fb0722",
		"7f0e36665b66a449801e9808297c35",
		"665f67f0e37f14898082b0723b02d5",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e36665b66a449801e9808297c35",
		"665f67f0e37f14898082b072297c35",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e26665b66a449801e9808297c35",
		"665f67f0e37f1489801eb072297c35",
		"7ec967f0e37f14998082b0787b06bd",
		"7f07e7f0e47f531b0723b0b6fb0721",
		"7f0e27f1487f531b0b0bb0b6fb0722",
	];

	function formatDay(month, day) {
		month = month + 1;
		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;
		return "d" + month + day;
	}

	/**
	 * 返回农历y年一整年的总天数
	 * @param lunarYear Number 农历年份
	 * @return Number
	 * @eg:var count = calendar.lYearDays(1987) ;//count=387
	 */
	function lYearDays(lunarYear) {
		var mask; // 掩码，用于按位检查lunarInfoTable数组中的某个值是否为1
		var sum = 348; // 默认的总天数

		for (mask = 0x8000; mask > 0x8; mask >>= 1) {
			sum += lunarInfo[lunarYear - 1900] & mask ? 1 : 0; // 按位与运算，检查lunarInfoTable数组中的特定位是否为1
		}

		return sum + leapDays(lunarYear); // 加上闰月的天数
	}

	/**
	 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
	 * @param lunarYear Number 农历年份
	 * @param lunarMonth Number 农历月份
	 * @return Number (-1、29、30)
	 * @eg:var MonthDay = calendar.lMonthDays(1987,9) ;//MonthDay=29
	 */
	function lMonthDays(lunarYear, lunarMonth) {
		if (lunarMonth > 12 || lunarMonth < 1) {
			return -1;
		} // 月份参数从1至12，参数错误返回-1

		return lunarInfo[lunarYear - 1900] & (0x10000 >> lunarMonth) ? 30 : 29;
	}

	/**
	 * 根据农历日期和小时数计算农历小时的总数
	 * @param lunarYear Number 农历年份
	 * @param lunarMonth Number 农历月份 (1-12)
	 * @param lunarDay Number 农历日期 (1-30)
	 * @param lunarHour Number 农历小时 (0-23)
	 * @return Number 农历小时的总数
	 */
	function lHours(lunarYear, lunarMonth, lunarDay, lunarHour) {
		// 农历月的天数
		const lunarMonthDays = lMonthDays(lunarYear, lunarMonth);

		// 农历小时总数
		const total = lunarMonthDays * 12 + lunarHour;

		return total;
	}

	/**
	 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
	 * @param lunarYear Number 农历年份
	 * @return Number (0-12)
	 * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
	 */
	function leapMonth(lunarYear) {
		return lunarInfo[lunarYear - 1900] & 0xf;
	}

	/**
	 * 返回农历y年闰月的天数 若该年没有闰月则返回0
	 * @param lunarYear Number 农历年份
	 * @return Number (0、29、30)
	 * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
	 */
	function leapDays(lunarYear) {
		if (leapMonth(lunarYear)) {
			return lunarInfo[lunarYear - 1900] & 0x10000 ? 30 : 29;
		}

		return 0;
	}

	/**
	 * 农历年份转换为干支纪年
	 * @param  lunarYear 农历年的年份数
	 * @return Cn string
	 */
	function toGanZhiYear(lunarYear) {
		var ganKey = (lunarYear - 3) % 10;

		var zhiKey = (lunarYear - 3) % 12;

		if (ganKey === 0) ganKey = 10; // 如果余数为0则为最后一个天干

		if (zhiKey === 0) zhiKey = 12; // 如果余数为0则为最后一个地支

		return gans[ganKey - 1] + zhis[zhiKey - 1];
	}

	/**
	 * 传入offset偏移量返回干支
	 * @param offset 相对甲子的偏移量
	 * @return Cn string
	 */

	function toGanZhi(offset) {
		return gans[offset % 10] + zhis[offset % 12];
	}

	/**
	 * 公历月、日判断所属星座
	 * @param  cMonth [description]
	 * @param  cDay [description]
	 * @return Cn string
	 */
	function toAstro(solarMonth, solarDay) {
		var s =
			"\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";

		var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];

		return s.substr(solarMonth * 2 - (solarDay < arr[solarMonth - 1] ? 2 : 0), 2) + "\u5ea7"; // 座
	}

	/**
	 * 返回公历(!)y年m月的天数
	 * @param solarYear Number 公历年份
	 * @param solarMonth Number 公历月份
	 * @return Number (-1、28、29、30、31)
	 * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
	 */
	function sMonthDays(solarYear, solarMonth) {
		if (solarMonth > 12 || solarMonth < 1) {
			return -1;
		} // 若参数错误 返回-1

		var ms = solarMonth - 1;
		if (ms === 1) {
			// 2月份的闰平规律测算后确认返回28或29
			return (solarYear % 4 === 0 && solarYear % 100 !== 0) || solarYear % 400 === 0 ? 29 : 28;
		} else {
			return solarMonth[ms];
		}
	}

	/**
	 * 传入公历(!)y年获得该年第n个节气的公历日期
	 * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
	 * @return day Number
	 * @eg:var _24 = calendar.sTerm(1987,3) ;//_24=4;意即1987年2月4日立春
	 */
	function sTerm(solarYear, index) {
		if (solarYear < 1900 || solarYear > 2100) {
			return -1;
		}

		if (index < 1 || index > 24) {
			return -1;
		}

		var _table = sTermInfo[solarYear - 1900];
		var _info = [
			parseInt("0x" + _table.substr(0, 5)).toString(),
			parseInt("0x" + _table.substr(5, 5)).toString(),
			parseInt("0x" + _table.substr(10, 5)).toString(),
			parseInt("0x" + _table.substr(15, 5)).toString(),
			parseInt("0x" + _table.substr(20, 5)).toString(),
			parseInt("0x" + _table.substr(25, 5)).toString(),
		];

		var _calday = [
			_info[0].substr(0, 1),
			_info[0].substr(1, 2),
			_info[0].substr(3, 1),
			_info[0].substr(4, 2),
			_info[1].substr(0, 1),
			_info[1].substr(1, 2),
			_info[1].substr(3, 1),
			_info[1].substr(4, 2),
			_info[2].substr(0, 1),
			_info[2].substr(1, 2),
			_info[2].substr(3, 1),
			_info[2].substr(4, 2),
			_info[3].substr(0, 1),
			_info[3].substr(1, 2),
			_info[3].substr(3, 1),
			_info[3].substr(4, 2),
			_info[4].substr(0, 1),
			_info[4].substr(1, 2),
			_info[4].substr(3, 1),
			_info[4].substr(4, 2),
			_info[5].substr(0, 1),
			_info[5].substr(1, 2),
			_info[5].substr(3, 1),
			_info[5].substr(4, 2),
		];

		return parseInt(_calday[index - 1]);
	}

	/**
	 * 传入农历数字月份返回汉语通俗表示法
	 * @param lunar month
	 * @return Cn string
	 * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
	 */
	function toChinaMonth(lunarMonth) {
		// 月 => \u6708

		if (lunarMonth > 12 || lunarMonth < 1) {
			return -1;
		} // 若参数错误 返回-1

		var s = lunarMonths[lunarMonth - 1];

		s += "\u6708"; // 加上月字

		return s;
	}

	/**
	 * 传入农历日期数字返回汉字表示法
	 * @param lunar day
	 * @return Cn string
	 * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
	 */
	function toChinaDay(lunarDay) {
		// 日 => \u65e5
		var s;
		switch (lunarDay) {
			case 10:
				s = "\u521d\u5341";
				break;
			case 20:
				s = "\u4e8c\u5341";
				break;
			case 30:
				s = "\u4e09\u5341";
				break;
			default:
				s = lunarTerms[Math.floor(lunarDay / 10)];
				s += chineseNums[lunarDay % 10];
		}
		return s;
	}

	/**
	 * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
	 * @param y year
	 * @return Cn string
	 * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
	 */
	function getAnimal(year) {
		return animals[(year - 4) % 12];
	}

	/**
	 * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
	 * @param y  solar year
	 * @param m  solar month
	 * @param d  solar day
	 * @return JSON object
	 * @eg:console.log(calendar.solar2lunar(1987,11,01));
	 */
	function solar2lunar(solarYear, solarMonth, solarDay, solarHours) {
		// 参数区间1900.1.31~2100.12.31

		// 年份限定、上限
		if (solarYear < 1900 || solarYear > 2100) {
			return -1; // undefined转换为数字变为NaN
		}

		// 公历传参最下限
		if (solarYear === 1900 && solarMonth === 1 && solarDay < 31) {
			return -1;
		}

		// 未传参  获得当天
		var currentDate = null;
		if (!solarYear) {
			currentDate = new Date();
		} else {
			currentDate = new Date(solarYear, parseInt(solarMonth) - 1, solarDay);
		}

		var lIndex;
		var leap = 0; // 闰月
		var ldays = 0; // 农历月份天数

		// 修正ymd参数
		solarYear = currentDate.getFullYear();
		solarMonth = currentDate.getMonth() + 1;
		solarDay = currentDate.getDate();
		var offset = (Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
		for (lIndex = 1900; lIndex < 2101 && offset > 0; lIndex++) {
			ldays = lYearDays(lIndex);
			offset -= ldays;
		}

		if (offset < 0) {
			offset += ldays;
			lIndex--;
		}

		// 是否今天
		var isToday = false;
		var todayDate = new Date();
		if (todayDate.getFullYear() === solarYear && todayDate.getMonth() + 1 === solarMonth && todayDate.getDate() === solarDay) {
			isToday = true;
		}

		// 星期几
		var nWeek = currentDate.getDay();
		var cWeek = chineseNums[nWeek];

		// 数字表示周几顺应天朝周一开始的惯例
		if (nWeek === 0) {
			nWeek = 7;
		}

		// 农历年
		var lunarYear = lIndex;

		var isLeap = false; // 是否闰月
		leap = leapMonth(lunarYear); // 闰哪个月

		// 效验闰月
		for (lIndex = 1; lIndex < 13 && offset > 0; lIndex++) {
			// 闰月
			if (leap > 0 && lIndex === leap + 1 && isLeap === false) {
				--lIndex;
				isLeap = true;
				ldays = leapDays(lunarYear); // 计算农历闰月天数
			} else {
				ldays = lMonthDays(lunarYear, lIndex); // 计算农历普通月天数
			}

			// 解除闰月
			if (isLeap === true && lIndex === leap + 1) {
				isLeap = false;
			}

			offset -= ldays;
		}

		// 闰月导致数组下标重叠取反
		if (offset === 0 && leap > 0 && lIndex === leap + 1) {
			if (isLeap) {
				isLeap = false;
			} else {
				isLeap = true;
				--lIndex;
			}
		}

		if (offset < 0) {
			offset += ldays;
			--lIndex;
		}

		// 农历月
		var lunarMonth = lIndex;

		// 农历日
		var lunarDay = offset + 1;

		// 天干地支处理[年]
		var gzYear = toGanZhiYear(lunarYear);

		// 当月的两个节气
		var firstNode = sTerm(solarYear, solarMonth * 2 - 1); // 返回当月「节」为几日开始
		var secondNode = sTerm(solarYear, solarMonth * 2); // 返回当月「节」为几日开始

		// 依据12节气修正干支月[月]
		var gzMonth = toGanZhi((solarYear - 1900) * 12 + solarMonth + 11);
		if (solarDay >= firstNode) {
			gzMonth = toGanZhi((solarYear - 1900) * 12 + solarMonth + 12);
		}

		// 传入的日期的节气与否
		var isTerm = false;
		var term = null;
		if (firstNode === solarDay) {
			isTerm = true;
			term = solarTerms[solarMonth * 2 - 2];
		}

		if (secondNode === solarDay) {
			isTerm = true;
			term = solarTerms[solarMonth * 2 - 1];
		}

		// 日柱 当月一日与 1900/1/1 相差天数
		var dayCyclical = Date.UTC(solarYear, solarMonth - 1, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;

		// 天干地支处理[日]
		var gzDay = toGanZhi(dayCyclical + solarDay - 1);
		var gzHour = toGanZhi((dayCyclical + solarDay - 1) * 12 + currentDate.getHours());

		// 该日期所属的星座
		var astro = toAstro(solarMonth, solarDay);

		// 节日
		const { calendar } = window.zhongjyuan.runtime.setting;
		var lunarFestival = calendar.lunarFestival[formatDay(lunarMonth, lunarDay)];
		var solarFestival = calendar.solarFestival[formatDay(solarMonth - 1, solarDay)];
		if (lunarMonth === 12 && lunarDay === ldays) {
			lunarFestival = calendar.lunarFestival["d0100"];
		}
		var isFestival = !!solarFestival || !!lunarFestival;

		// 闰月大小
		var leapMode = "";
		if (isLeap) {
			leapMode = leapDays(lunarYear) > 29 ? "\u5927" : "\u5c0f";
		}

		// 第几天/第几周
		var dayNumber = Math.ceil((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000));
		var weekNumber = Math.ceil((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));

		return {
			term: term,
			astro: astro,
			animal: getAnimal(lunarYear),
			dayNumber: dayNumber,
			dateTime: currentDate.format(),
			lunarYear: lunarYear,
			lunarMonth: lunarMonth,
			lunarDay: lunarDay,
			lunarMonthChina: (isLeap ? "\u95f0" : "") + toChinaMonth(lunarMonth),
			lunarDayChina: toChinaDay(lunarDay),
			week: nWeek,
			weekChina: "\u661f\u671f" + cWeek,
			weekNumber: weekNumber,
			solarYear: solarYear,
			solarMonth: solarMonth,
			solarDay: solarDay,
			gzYear: gzYear,
			gzMonth: gzMonth,
			gzDay: gzDay,
			gzHour: gzHour,
			isToday: isToday,
			isLeap: isLeap,
			isTerm: isTerm,
			isFestival: isFestival,
			leapMode: (isLeap ? "\u95f0" : "") + leapMode,
			lunarFestival: lunarFestival,
			solarFestival: solarFestival,
		};
	}

	/**
	 * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
	 * @param y  lunar year
	 * @param m  lunar month
	 * @param d  lunar day
	 * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
	 * @return JSON object
	 * @eg:console.log(calendar.lunar2solar(1987,9,10));
	 */
	function lunar2solar(lunarYear, lunarMonth, lunarDay, isLeap) {
		// 参数区间1900.1.31~2100.12.1

		isLeap = !!isLeap;

		if (isLeap && leapMonth !== lunarMonth) {
			return -1;
		} // 传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同

		if ((lunarYear === 2100 && lunarMonth === 12 && lunarDay > 1) || (lunarYear === 1900 && lunarMonth === 1 && lunarDay < 31)) {
			return -1;
		} // 超出了最大极限值

		var lDay = lMonthDays(lunarYear, lunarMonth);

		var _day = lDay;

		if (isLeap) {
			_day = leapDays(lunarYear, lunarMonth);
		}

		if (lunarYear < 1900 || lunarYear > 2100 || lunarDay > _day) {
			return -1;
		} // 参数合法性效验

		// 计算农历的时间差
		var offset = 0;

		for (var i = 1900; i < lunarYear; i++) {
			offset += lYearDays(i);
		}

		var leap = 0;

		var isAdd = false;

		for (i = 1; i < lunarMonth; i++) {
			leap = leapMonth(lunarYear);

			if (!isAdd) {
				// 处理闰月
				if (leap <= i && leap > 0) {
					offset += leapDays(lunarYear);
					isAdd = true;
				}
			}

			offset += lMonthDays(lunarYear, i);
		}

		// 转换闰月农历 需补充该年闰月的前一个月的时差
		if (isLeap) {
			offset += lDay;
		}

		// 1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
		var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);

		var calObj = new Date((offset + lunarDay - 31) * 86400000 + stmap);

		var cY = calObj.getUTCFullYear();

		var cM = calObj.getUTCMonth() + 1;

		var cD = calObj.getUTCDate();

		return solar2lunar(cY, cM, cD);
	}

	return {
		solar2lunar: logger.decorator(solar2lunar, "tool-calendar-solar2lunar"),
		lunar2solar: logger.decorator(lunar2solar, "tool-calendar-lunar2solar"),
	};
})();
