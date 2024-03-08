const fs = require("fs");
const glob = require("glob");

/**
 * 合并JSON文件插件
 * @author zhongjyuan
 * @date   2023年5月17日14:09:49
 * @email  zhongjyuan@outlook.com
 */
class MergeJsonFilePlugin {
	/**
	 * 合并JSON文件插件
	 * @param {*} options 自定义配置对象
	 */
	constructor(options) {
		this.options = options;
	}

	/**
	 * 
	 * @param {*} compiler 
	 */
	apply(compiler) {
		compiler.hooks.emit.tapAsync("MergeJsonFilePlugin", (compilation, callback) => {
			const mergedJson = {};

			// 读取所有 JSON 文件并合并它们到一个新的对象中
			const files = glob.sync(this.options.pattern);
			files.forEach((file) => {
				const data = fs.readFileSync(file);
				const obj = JSON.parse(data);

				Object.entries(obj).forEach(([key, value]) => {
					if (!mergedJson[key]) {
						mergedJson[key] = value;
					} else if (Array.isArray(mergedJson[key]) && Array.isArray(value)) {
						mergedJson[key].push(...value);
					} else if (typeof mergedJson[key] === "object" && typeof value === "object") {
						Object.assign(mergedJson[key], value);
					} // 如果属性值不是数组或对象，则覆盖之前的值
					else {
						mergedJson[key] = value;
					}
				});
			});

			// 将合并后的 JSON 对象转换为字符串，然后写入文件系统中
			const output = JSON.stringify(mergedJson, null, 2);
			const filename = this.options.filename;
			const outputDir = this.options.outputPath;

			if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
			fs.writeFileSync(`${outputDir}/${filename}`, output);

			callback();
		});
	}
}

module.exports = MergeJsonFilePlugin;
