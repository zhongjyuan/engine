import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";

/**请求路由定义 */
import routes from "./views/routes";
/**数据仓库定义 */
import stores from "./views/stores";
/**数据初始化与变更 */
import reducers from "./views/reducers";

/**创建仓库 */
const store = stores(reducers);

const rootElement = document.getElementById("root");

render(
	<Provider store={store}>
		<Router history={browserHistory}>{routes(store.getState())}</Router>
	</Provider>,
	rootElement
);
