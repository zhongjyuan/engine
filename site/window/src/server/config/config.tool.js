import getBaseConfig from "./config.base.js";

/**
 * 创建配置对象
 * @author zhongjyuan
 * @date   2023年7月7日09:53:09
 * @email  zhongjyuan@outlook.com
 * @param {*} currentConfig 当前配置对象
 * @returns
 */
export default function create(currentConfig) {
	const defaultConfig = getBaseConfig(currentConfig);

	Object.assign(defaultConfig, currentConfig);

	if (defaultConfig.hasOwnProperty("host")) {
		delete defaultConfig.host;
	}

	return defaultConfig;
}
