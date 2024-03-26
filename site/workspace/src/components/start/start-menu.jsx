import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import StartMenuScreen from "@/components/start/start-menu-screen";
import SearchMenuScreen from "@/components/start/search-menu-screen";

import { processStartMenuSelector } from "@/selectors/start-menu";

import "./start-menu.scss";

/**
 * 开始菜单组件
 */
export const StartMenu = () => {
	var [query, setQuery] = useState(""); // 定义查询字符串和设置查询字符串的状态变量
	var [match, setMatch] = useState({}); // 定义匹配项和设置匹配项的状态变量

	var { align } = useSelector((state) => state.taskbar); // 从 Redux 中获取任务栏对齐方式
	var startMenu = useSelector(processStartMenuSelector);

	/**
	 * useEffect钩子函数，根据查询内容设置匹配项
	 * @param {string} query - 查询字符串
	 */
	useEffect(() => {
		// 当查询内容非空时
		if (query.length) {
			// 遍历所有应用数据
			for (var i = 0; i < startMenu.allApps.length; i++) {
				// 判断是否应用名称包含查询内容（不区分大小写）
				if (startMenu.allApps[i].name.toLowerCase().includes(query.toLowerCase())) {
					// 设置匹配项并跳出循环
					setMatch(startMenu.allApps[i]);
					break;
				}
			}
		}
	}, [query]);

	return (
		<div className="start-menu dpShad" data-align={align} data-hide={startMenu.hide} style={{ "--slice": "start" }}>
			{startMenu.menu ? <StartMenuScreen menu={startMenu} /> : <SearchMenuScreen menu={startMenu} query={query} setQuery={setQuery} match={match} />}
		</div>
	);
};
