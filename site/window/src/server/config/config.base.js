export default function getBaseConfig(currentConfig) {
	const serverHost = currentConfig.serverHost || "http://zhongjyuan.net";
	const serverVersion = currentConfig.serverVersion || "v2.0";

	/**
	 * 服务配置对象
	 * @author zhongjyuan
	 * @date   2023年6月30日16:17:49
	 * @email  zhongjyuan@outlook.com
	 */
	const serverConfig = {
		/**服务主机 */
		host: `${serverHost}`,
		/**服务版本 */
		version: `${serverVersion}`,
		/**启用单点 */
		useSSO: false,
		/**启用WebSocket */
		useSocket: false,
		/**启用租户 */
		useTenant: false,
		/**启用上传 */
		useUpload: false,
		/**启用预览 */
		usePreview: false,
		/**启用下载 */
		useDownload: false,
		/**启用多标签 */
		useMultipleTab: true,
		/**启用二维码登录 */
		useQRCodeLogin: false,
		/**显示反馈入口 */
		ShowFeedback: false,
		/**显示多语言 */
		ShowLanguage: false,
		/**显示应用下载 */
		showAppDownload: false,
		/**上传超时(-1标识不限时) */
		uploadTimeout: -1,
		/**请求超时(三分钟) */
		requestTimeout: 1000 * 60 * 3,
		/**Header授权信息 */
		authorization: "Basic V2ViQXBwOnNhcGlAMTIzNA==",
		/**版本信息 */
		copyright: "Copyright @" + new Date().getFullYear() + " ZHONGJYUAN版权所有",
		/**平台服务 */
		platServer: { url: `${serverHost}/plat`, version: `${serverVersion}` },
		/**WebSocket服务 */
		socketServer: { url: `${serverHost}/socket`, version: `${serverVersion}` },
		/**公共服务 */
		commonServer: { url: `${serverHost}/common`, version: `${serverVersion}` },
		/**反馈服务 */
		feedbackServer: { url: `${serverHost}/feedback`, version: `${serverVersion}` },
		/**文件服务 */
		fileServer: { url: `${serverHost}/file`, version: `${serverVersion}` },
		/**预览服务 */
		previewServer: { url: `${serverHost}/preview`, version: `${serverVersion}` },
		/**流程服务 */
		flowServer: { url: `${serverHost}/flow`, version: `${serverVersion}` },
		/**表单服务 */
		formServer: { url: `${serverHost}/form`, version: `${serverVersion}` },
		/**报表服务 */
		reportServer: { url: `${serverHost}/report`, version: `${serverVersion}` },
		/**内容服务 */
		contentServer: { url: `${serverHost}/content`, version: `${serverVersion}` },
		/**集成服务 */
		integrateServer: { url: `${serverHost}/integrate`, version: `${serverVersion}` },
	};

	return serverConfig;
}
