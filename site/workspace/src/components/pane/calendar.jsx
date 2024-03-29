import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Icon } from "@/components/global";

import "./calendar.scss";

/**
 * 日历组件
 * @returns {JSX.Element} - 返回日历组件的 JSX 元素
 */
export const CalendarPane = () => {
	// 获取侧边栏对象
	var sidepane = useSelector((state) => state.sidepane);

	// 状态钩子：是否已加载
	var [loaded, setLoad] = useState(false);
	// 状态钩子：折叠状态
	var [collapse, setCollapse] = useState("");

	// 折叠切换函数
	var collapseToggler = () => {
		collapse === "" ? setCollapse("collapse") : setCollapse("");
	};

	// 副作用钩子：页面加载完成时初始化日历
	useEffect(() => {
		if (!loaded) {
			setLoad(true);
			window.dycalendar.draw({
				target: "#dycalendar",
				type: "month",
				dayformat: "zd",
				monthformat: "zfull",
				prevnextbutton: "show",
				highlighttoday: true,
			});
		}
	});

	// 返回渲染的 JSX
	return (
		<div className={`calnpane ${collapse} dpShad`} data-hide={sidepane.calhide} style={{ "--slice": "calendar" }}>
			{/* 顶部栏 */}
			<div className="topBar pl-4 text-sm" onClick={collapse ? collapseToggler : null}>
				{/* 当前日期 */}
				<div className="date">{new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" })}</div>
				{/* 折叠按钮 */}
				<div className="collapser p-2 m-4 rounded" onClick={collapseToggler}>
					{collapse === "" ? <Icon fafa="faChevronDown" /> : <Icon fafa="faChevronUp" />}
				</div>
			</div>
			{/* 日历内容容器 */}
			<div id="dycalendar"></div>
		</div>
	);
};
