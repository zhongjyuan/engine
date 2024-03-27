import store from "@/stores";

/**
 * 处理文件打开操作的函数，用于处理文件资源管理器中的文件打开操作。
 * @param {string} id - 文件或文件夹的唯一标识符
 */
export const openFileFolder = (context) => {
	var { payload: id } = context;

	// 获取文件或文件夹信息
	var selectedItem = store.getState().fileexplorer.data.getId(id);

	// 如果存在选定项目
	if (selectedItem) {
		// 如果是文件夹，则设置其为当前目录
		if (selectedItem.type === "folder") {
			store.dispatch({ type: "file-explorer/setDir", payload: selectedItem.id });
		}
	}
};
