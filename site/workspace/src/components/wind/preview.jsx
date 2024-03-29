import React from "react";
import { useSelector } from "react-redux";

/**
 * 预览窗口组件
 */
export const WindPreview = () => {
	// 从 Redux store 中获取任务栏状态
	const tasks = useSelector((state) => state.taskbar);

	return (
		// 预览窗口容器
		<div className="preview" style={{ left: tasks.prevPos + "%" }}>
			{/* 预览应用程序界面 */}
			<div id="prevApp" className="preview-screen" data-show={tasks.prev && false}>
				{/* 预览屏幕内容 */}
				<div id="prevsc"></div>
			</div>
		</div>
	);
};
