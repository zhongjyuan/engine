// 引入marked库中的lexer和parser模块
const { lexer, parser } = require("marked");
// 引入sanitize-html库
const sanitizeHtml = require("sanitize-html");

// 定义一个将Markdown转换为HTML的函数
function md2html(markdown) {
	// 使用lexer将Markdown转换为tokens，再使用parser将tokens转换为HTML字符串
	// 最后使用sanitizeHtml对生成的HTML进行安全处理
	return sanitizeHtml(parser(lexer(markdown)));
}

// 导出md2html函数
module.exports = {
	md2html,
};
