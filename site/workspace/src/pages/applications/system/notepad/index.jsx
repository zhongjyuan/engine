import React from "react";
import { useSelector } from "react-redux";

import { ToolBar } from "@/components/global";

/**
 * Notepad 组件，用于展示记事本应用界面
 * @returns {JSX.Element}
 */
export const Notepad = () => {
	// 从 Redux 中获取 notepad 应用状态
	const app = useSelector((state) => state.apps.notepad);

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-notepad dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			{/* 应用工具栏组件 */}
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="无标题 - 记事本" />
			<div className="screen flex flex-col" data-dock="true">
				<div className="flex text-xs py-2 topBar">
					<div className="mx-2">文件</div>
					<div className="mx-4">编辑</div>
					<div className="mx-4">查看</div>
				</div>
				<div className="wind-rest h-full flex-grow">
					<div className="w-full h-full overflow-hidden">
						<textarea id="textpad" className="notepad-content scroll" />
					</div>
				</div>
			</div>
		</div>
	);
};
