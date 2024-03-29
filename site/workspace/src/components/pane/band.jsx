import React from "react";
import { useSelector } from "react-redux";

import { Icon } from "@/components/global";

import "./band.scss";

/**
 * 侧边栏面板组件(任务盒子)
 * @returns {JSX.Element} - 返回侧边栏面板组件的 JSX 元素
 */
export const BandPane = () => {
	// 获取侧边栏数据
	var sidepane = useSelector((state) => state.sidepane);

	// 返回JSX
	return (
		<div className="bandpane dpShad" data-hide={sidepane.banhide} style={{ "--slice": "band" }}>
			<div className="bandContainer">
				{/* 计算器图标 */}
				<Icon className="hvlight" src="calculator" width={17} click="CALCUAPP" payload="togg" open="true" />
				{/* Spotify 图标 */}
				<Icon className="hvlight" src="spotify" width={17} click="SPOTIFY" payload="togg" open="true" />
				{/* 记事本图标 */}
				<Icon className="hvlight" src="notepad" width={17} click="NOTEPAD" payload="togg" />
			</div>
		</div>
	);
};
