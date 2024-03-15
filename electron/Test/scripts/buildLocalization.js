/**文件流模块 */
const fs = require("fs");

/**路径模块 */
const path = require("path");

/**去除注释模块 */
const decomment = require("decomment");

/**输出目录 */
const outputDir = path.join(__dirname, "../dist");

/**输出文件 */
const outputFile = path.join(outputDir, "language.js");

/**语言源文件目录 */
const languageFileDir = path.join(__dirname, "../localization/languages");

/**
 * 构建多语言 JavaScript 文件
 */
function buildLocalization() {
	/**多语言对象 */
	const languages = {};

	/**所有语言文件 */
	const languageFiles = fs.readdirSync(languageFileDir);

	// 循环遍历每个语言的路径，读取每个语言文件的内容，并将其赋值到 languages 对象中
	languageFiles.forEach(function (file) {
		const data = fs.readFileSync(path.join(languageFileDir, file), "utf-8");

		let language;
		let decommentData = null;

		try {
			decommentData = decomment(data);
			language = JSON.parse(decommentData);
		} catch (e) {
			console.error('parsing language file "' + file + '" failed.');
			console.error(e.toString());

			if (decommentData !== null) {
				const msg = e.message;
				const match = msg.match(/at position (\d+)/);

				if (match !== null) {
					const loc = parseInt(match[1]);
					console.info('"' + decommentData.substring(loc - 40, loc + 40) + '"');
				}
			}

			process.exit();
		}

		languages[language.identifier] = language;
	});

	/**多语言文件正文 */
	let fileContents = "var languages = " + JSON.stringify(languages) + ";\n\n";

	// 添加 localizationHelpers.js 文件的内容（包括帮助函数等）
	fileContents += fs.readFileSync(path.join(__dirname, "../localization/localizationHelpers.js"));

	// 如果输出目录不存在，则创建目录
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	// 写入输出文件
	fs.writeFileSync(outputFile, fileContents);
}

// 如果该模块被作为其他模块的引用使用，则导出 buildLocalization 函数
if (module.parent) {
	module.exports = buildLocalization;
}

// 否则直接执行 buildLocalization 函数
else {
	buildLocalization();
}
