import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

/**https://blog.csdn.net/qq_42198495/article/details/125156273 */

/**redux-logger会在dispatch改变仓库状态的时候打印出旧的仓库状态、当前触发的action以及新的仓库状态 */
const loggerMiddleware = createLogger();

//创建加入中间件的createStore函数
//它提供的是位于 action 被发起之后，到达 reducer 之前的扩展点
const configureStore = applyMiddleware(
	thunkMiddleware,
	loggerMiddleware //删除可以去掉action和state的日志打印
)(createStore);

//暴露store创建函数
export default configureStore;
