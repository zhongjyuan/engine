/**
 * 进度条对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月20日12:37:08
 */
const progressBar = {
	/**
	 * 创建进度条容器
	 * @returns {HTMLElement} 进度条容器元素
	 */
	create: function () {
		// 创建一个 div 元素作为进度条容器
		var pbContainer = document.createElement("div");
		pbContainer.className = "progress-bar-container";

		// 创建一个 div 元素作为进度条，并初始化为隐藏状态
		var pb = document.createElement("div");
		pb.className = "progress-bar p0";
		pb.hidden = true;

		// 将进度条添加到进度条容器中
		pbContainer.appendChild(pb);

		// 返回进度条容器
		return pbContainer;
	},

	/**
	 * 更新进度条状态
	 * @param {HTMLElement} bar 进度条元素
	 * @param {string} status 状态 ("start": 开始加载, 其他: 完成加载)
	 */
	update: function (bar, status) {
		if (status === "start") {
			// 为确保加载完成时更新正确的进度条，使用唯一的ID标识当前加载状态
			var loadId = Date.now().toString();
			bar.setAttribute("loading", loadId);

			// 4秒后开始加载动画
			setTimeout(function () {
				if (bar.getAttribute("loading") === loadId) {
					bar.hidden = false;
					// 使用 requestAnimationFrame 来触发 CSS 动画
					requestAnimationFrame(function () {
						bar.className = "progress-bar p25";
					});
				}
			}, 4000);
		} else {
			bar.setAttribute("loading", "false");
			if (bar.classList.contains("p25")) {
				// 加载完成时显示为100%，然后在500毫秒后重置为0%并隐藏
				bar.className = "progress-bar p100";
				setTimeout(function () {
					bar.className = "progress-bar p0";
					bar.hidden = true;
				}, 500);
			}
		}
	},
};

module.exports = progressBar;
