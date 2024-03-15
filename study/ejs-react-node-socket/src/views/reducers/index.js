import { combineReducers } from "redux";

import mainReducer from "./main";
import userReducer from "./user";

/**状态容器合并 */
const reducer = combineReducers({
	main: mainReducer,
	account: userReducer,
});

export default reducer;
