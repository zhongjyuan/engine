import React from "react";
import { Route } from "react-router";

/**程序入口 */
import main from "../containers/main";
/**用户管理入口 */
import userMain from "../containers/users";

/**无状态（stateless）组件，一个简单的容器，react-router会根据route规则匹配到的组件作为`props.children` 传入 */
const Container = (props) => {
	return <div>{props.children}</div>;
};

/**
 * 路由渲染
 * @param {*} state 状态
 * @returns 
 */
const routes = (state) => {
	if (typeof require.ensure !== "function") {
		require.ensure = function (dependencies, callback) {
			callback(require);
		};
	}

  /**
   * 用户列表路由(按需加载)
   * @param {*} location 
   * @param {*} cb 
   */
	const userListRouter = (location, cb) => {
		require.ensure(
			[],
			(require) => {
				cb(null, require("../containers/users/userList").default);
				if (typeof myEventEmit !== "undefined")
					myEventEmit.trigger("USERMANAGE");
			},
			"user"
		);
	};

	return (
		<Route path="/" component={main}>
			{/* <Route path="users" component={userMain}>
				<Route path="/list" getComponent={userListRouter} />
			</Route> */}
		</Route>
	);
};

export default routes;
