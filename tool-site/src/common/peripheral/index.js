import ClavierManager from "./ClavierManager";
import CursorManager from "./CursorManager";
import MouseManager from "./MouseManager";
import TouchManager from "./TouchManager";

export default {
	clavier: new ClavierManager(), // 键盘管理对象
	cursor: new CursorManager(), // 光标管理对象
	mouse: new MouseManager(), // 鼠标管理对象
	touch: new TouchManager(), // 触屏管理对象
};
