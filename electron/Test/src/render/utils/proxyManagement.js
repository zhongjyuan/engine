/**
 * 代理管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:28:45
 */
const proxyManagement = {
	/**代理配置对象 */
	config: {},

	/**
	 * 初始化
	 */
	initialize: function () {
		// 监听代理设置更改事件
		settings.listen("proxy", (proxy = {}) => {
			// 根据代理类型进行不同的处理
			switch (proxy.type) {
				case 1: // 使用代理规则
					proxyManagement.config = {
						pacScript: "",
						proxyRules: proxy.proxyRules,
						proxyBypassRules: proxy.proxyBypassRules,
					};
					break;
				case 2: // 使用 PAC 脚本
					proxyManagement.config.pacScript = proxy.pacScript;
					break;
				default: // 不使用代理
					proxyManagement.config = {};
			}

			// 遍历所有的 WebContents，设置代理配置
			webContents.getAllWebContents().forEach((wc) => wc.session && wc.session.setProxy(proxyManagement.config));
		});

		// 当会话创建时，设置代理配置
		app.on("session-created", (session) => session.setProxy(proxyManagement.config));
	},
};

proxyManagement.initialize();

module.exports = proxyManagement;