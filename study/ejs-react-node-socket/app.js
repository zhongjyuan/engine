var path = require("path");
var logger = require("morgan");
var express = require("express");
var createError = require("http-errors");

/**主程序 */
var app = express();

/**替代cookie-parser和cookie-session */
const session = require("express-session");
/**log4js日志系统定义 */
const log4js = require("./src/tools/log4js/logger");

/**路由定义 */
var router = require("./src/router");

/**视图引擎设置 */
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

/**全局配置挂载 */
app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

/**日志系统挂载 */
log4js.configure();
app.use(log4js.useLog("access"));

/**静态资源挂载 */
app.use("/public", express.static(path.join(__dirname, "public")));

/**会话挂载[maxAge:80000ms,即80s后session和相应的cookie失效过期] */
app.use(
	session({
		resave: true,
		name: "zhongjyuan",
		secret: "zhongjyuan-secret",
		cookie: { maxAge: 800000 },
		saveUninitialized: true,
	})
);

/**全局错误处理 */
app.use(function (err, req, res, next) {
	var meta = "[" + new Date() + "] " + req.url + "\n";
	log4js.logger("error").error(meta + err.stack + "\n");

	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");

	next();
});

/**路由挂载 */
app.use(router);

module.exports = app;

/**
 * session 参数
	cookie: 默认为{ path: '/', httpOnly: true, secure: false, maxAge: null }
	{	
		maxAge: 设置给定过期时间的毫秒数（date）
		expires: 设定一个utc过期时间，默认不设置，http>=1.1的时代请使用maxAge代替之（string）
		path: cookie的路径（默认为/）（string）
		domain: 设置域名，默认为当前域（String）
		sameSite: 是否为同一站点的cookie（默认为false）（可以设置为['lax', 'none', 'none']或 true）
		secure: 是否以https的形式发送cookie（false以http的形式。true以https的形式）true 是默认选项。 但是，它需要启用 https 的网站。 如果通过 HTTP 访问您的站点，则不会设置 cookie。 如果使用的是 secure: true，则需要在 express 中设置“trust proxy”。
		httpOnly: 是否只以http(s)的形式发送cookie，对客户端js不可用（默认为true，也就是客户端不能以document.cookie查看cookie）
		signed: 是否对cookie包含签名（默认为true）
		overwrite: 是否可以覆盖先前的同名cookie（默认为true
	},    
	// 默认使用uid-safe这个库自动生成id
	genid: req => genuuid(),    
	// 设置会话的名字，默认为connect.sid
	name: 'value',  
	// 设置安全 cookies 时信任反向代理（通过在请求头中设置“X-Forwarded-Proto”）。默认未定义（boolean）
	proxy: undefined,    
	// 是否强制保存会话，即使未被修改也要保存。默认为true
	resave: true,    
	// 强制在每个响应上设置会话标识符 cookie。 到期重置为原来的maxAge，重置到期倒计时。默认值为false。
	rolling: false,    
	// 强制将“未初始化”的会话保存到存储中。 当会话是新的但未被修改时，它是未初始化的。 选择 false 对于实现登录会话、减少服务器存储使用或遵守在设置 cookie 之前需要许可的法律很有用。 选择 false 还有助于解决客户端在没有会话的情况下发出多个并行请求的竞争条件。默认值为 true。
	saveUninitialized: true,    
	// 用于生成会话签名的密钥,必须项  
	secret: 'secret',  
	// 会话存储实例，默认为new MemoryStore 实例。
	store: new MemoryStore(),  
	// 设置是否保存会话，默认为keep。如果选择不保存可以设置'destory'
	unset: 'keep'
 */
