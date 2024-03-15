/**
 * 版本管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:38:47
 */
const versionManagement = {
	/**
	 * 比较两个版本号的大小。
	 * @param {string} v1 - 第一个版本号。
	 * @param {string} v2 - 第二个版本号。
	 * @returns {number} - 比较结果：
	 *   1: v2 比 v1 新。
	 *  -1: v1 比 v2 新。
	 *   0: 两个版本号相等。
	 */
	compare: function (v1, v2) {
		// 将版本号字符串转换为整数数组
		v1 = v1.split(".").map((i) => parseInt(i));
		v2 = v2.split(".").map((i) => parseInt(i));

		// 比较每个位置上的版本号
		for (var i = 0; i < v1.length; i++) {
			if (v2[i] > v1[i]) {
				return 1; // v2 比 v1 新
			}

			if (v1[i] > v2[i]) {
				return -1; // v1 比 v2 新
			}
		}

		return 0; // 两个版本号相等
	},
};

module.exports = versionManagement;
