var express = require("express");

/**客户端路由容器(/) */
var router = express.Router();

import React from "react";
import { Provider } from "react-redux";
import log4js from "../tools/log4js/logger";
import { renderToString } from "react-dom/server";
import { RouterContext, match, browserHistory } from "react-router";

const path = "[views/router.js] >> ";
var logger = log4js.logger("framework");

/**请求路由定义 */
import routes from "./routes";
/**数据仓库定义 */
import stores from "./stores";
/**数据初始化与变更 */
import reducers from "./reducers";

/**所有路由 */
router.get("/*", function (req, res, next) {
	/**创建仓库 */
	const store = stores(reducers);
	logger.debug(path + "store: " + store);
	logger.debug(path + "req.session: " + req.session);

	/**是否登录 */
	function isLogin() {
		if (req.session.account) {
				store.dispatch({
					isLogin: true,
					type: LOGIN_SUCCESS,
					user: req.session.account,
				});
		}
	}

	/**
	 * 使用 match在渲染之前根据 location 匹配 route
	 * 使用 RoutingContext同步渲染 route 组件
	 */
	match(
		{ location: req.url, routes: routes(store.getState()) },
		(err, redirectLocation, renderProps) => {
			logger.debug(path + "renderProps: " + renderProps);
			logger.debug(path + "redirectLocation: " + redirectLocation);

			if (err) {
				res.status(500).end(`Internal Server Error ${err}`);
			} else if (redirectLocation) {
				res.redirect(redirectLocation.pathname + redirectLocation.search);
			} else if (req.url != "/") {
				res.redirect("/");
			} else if (renderProps) {
				Promise.all([isLogin()]).then(() => {
					const html = renderToString(
						<Provider store={store}>
							<RouterContext {...renderProps} />
						</Provider>
					);

					res.render("index", {
						_title_: "zhongjyuan",
						__html__: html,
						__state__: JSON.stringify(store.getState()),
					});
				});
			} else {
				res.status(404).end("404 not found");
			}
		}
	);
});

module.exports = router;

/**
    error：如果报错时会出现一个 Javascript 的 Error对象，否则是 undefined
    redirectLocation：如果 route 重定向时会有一个 Location 对象，否则是 undefined
    renderProps：当匹配到 route 时 props 应该通过路由的 context，否则是 undefined
    如果这三个参数都是 undefined，这就意味着在给定的 location 中没有 route 被匹配到。
 */

/**
    一、Promise是什么？

    1、从用途上来说：
        (1)promise主要用于异步计算。
        (2)可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果。
        (3)可以在对象之间传递和操作promise，帮助我们处理队列。
    2、从语法上说：
        (1)Promise 是一个对象，从它可以获取异步操作的消息。
        (2)Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理
    
    二、Promise对象的特点？

    1、对象的状态不受外界影响。
        Promise对象代表一个异步操作，有三种状态：pending（进行中）fulfilled（已成功）rejected（已失败）
        只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

    2、一旦状态改变，就不会再变，任何时候都可以得到这个结果。
        Promise对象的状态变化只有如下2种：
        pending->fulfilled
        pending->rejected
        只要这两种情况发生，状态就凝固，不会再变，会一直保持这个结果。

    说明：如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

    三、Promise的缺点？

        无法取消Promise，一旦新建它就会立即执行，无法中途取消。
        如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
        当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）
 */
