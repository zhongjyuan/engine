import defaultConst from "./default"; // 默认常量对象
import eventConst from "./event"; // 事件常量对象
import httpConst from "./http"; // HTTP常量对象
import languageConst from "./language"; // 语言常量对象
import peripheralConst from "./peripheral"; // 键鼠常量对象
import regularConst from "./regular"; // 规则常量对象
import typeConst from "./type"; // 类型常量对象
import weatherConst from "./weather"; // 天气常量对象

export default {
	...defaultConst,
	event: eventConst,
	http: httpConst,
	language: languageConst,
	peripheral: peripheralConst,
	regular: regularConst,
	type: typeConst,
	weather: weatherConst,
};
