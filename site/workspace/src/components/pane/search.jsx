import React, { useState } from "react";

import { Icon } from "@/components/global";

import { startMenuClick } from "@/actions";

import "./search.scss";

/**
 * 渲染默认搜索菜单结果
 * @param {Array} recentApps - 最近应用程序数组，用于显示
 * @param {Array} quickSearches - 快速搜索数组，用于显示
 * @returns {JSX.Element} - 带有默认搜索菜单结果的 JSX 元素
 */
const renderDefaultResults = (recentApps, quickSearches) => {
	// 渲染顶部最近应用程序部分
	return (
		<>
			<div className="search-menu-result-top-apps flex w-full justify-between">
				{recentApps.slice(1, 7).map((app, i) => (
					// 每个最近应用程序的展示
					<div
						key={i}
						className="search-menu-result-top-app pt-6 py-4 ltShad prtclk"
						data-slice={app.slice}
						data-action={app.action}
						data-payload={app.payload || "full"}
						onClick={startMenuClick}
					>
						<Icon src={app.icon} width={30} />
						<div className="text-xs mt-2">{app.name}</div>
					</div>
				))}
			</div>
			{/* 快速搜索部分 */}
			<div className="text-sm font-semibold mt-8">快速搜索</div>
			<div className="search-menu-result-quick-searches mt-2">
				{quickSearches.map((searchItem, i) => (
					// 每个快速搜索项的展示
					<div
						key={i}
						className="search-menu-result-quick-searche flex items-center p-3 my-1 handcr prtclk"
						data-slice="app"
						data-action="setBrowserLink"
						data-payload={searchItem[2]}
						onClick={startMenuClick}
					>
						<Icon fafa={searchItem[0]} reg={searchItem[1]} />
						<div className="ml-4 text-sm">{searchItem[2]}</div>
					</div>
				))}
			</div>
		</>
	);
};

/**
 * 渲染搜索结果
 * @param {string} query - 搜索查询字符串
 * @param {object} match - 匹配的搜索结果对象
 * @returns {JSX.Element} - 带有搜索结果的 JSX 元素
 */
const renderSearchResults = (query, match) => {
	// 返回包含搜索结果的 JSX 元素
	return (
		<div className="search-menu-result-text h-16">
			{/* 匹配的搜索结果展示 */}
			<div className="search-menu-result-smatch flex my-2 p-3 rounded">
				<Icon src={match.icon} width={24} />
				<div className="search-menu-result-match-info flex-col px-2">
					<div className="font-semibold text-xs">{match.name}</div>
					<div className="text-xss">应用</div>
				</div>
			</div>
			{/* 搜索网页的展示 */}
			<div
				className="search-menu-result-smatch flex my-2 p-3 rounded handcr prtclk"
				data-slice="app"
				data-action="setBrowserLink"
				data-payload={query}
				onClick={startMenuClick}
			>
				<Icon className="blueicon" src="search" ui width={20} />
				<div className="search-menu-result-match-info flex-col px-2">
					<div className="font-semibold text-xs">搜索网页</div>
					<div className="text-xss">网页</div>
				</div>
			</div>
		</div>
	);
};

/**
 * 渲染匹配详情
 * @param {object} match - 匹配的搜索结果详情对象
 * @returns {JSX.Element} - 带有匹配详情的 JSX 元素
 */
const renderMatchDetails = (match) => {
	// 返回包含匹配详情的 JSX 元素
	return (
		<div className="w-2/3 search-menu-right-side rounded">
			<Icon className="mt-6" src={match.icon} width={64} />
			<div className="">{match.name}</div> {/* 显示匹配结果名称 */}
			<div className="text-xss mt-2">App</div> {/* 显示类型为 App */}
			<div className="hline mt-8"></div> {/* 水平分割线 */}
			<div
				className="openlink w-4/5 flex prtclk handcr pt-3"
				data-slice={match.slice}
				data-action={match.action} // 设置动作
				data-payload={match.payload ? match.payload : "full"} // 设置载荷，如果没有则默认为 "full"
				onClick={startMenuClick} // 点击事件触发 startMenuClick 函数
			>
				<Icon className="blueicon" src="link" ui width={16} />
				<div className="text-xss ml-3">打开</div> {/* 显示“打开”文本 */}
			</div>
		</div>
	);
};

/**
 * 搜索菜单组件
 * @param {object} menu - 菜单对象
 * @param {string} query - 查询字符串
 * @param {function} setQuery - 设置查询字符串的函数
 * @param {object} match - 匹配项对象
 */
export const SearchPane = ({ menu, query, setQuery, match }) => {
	var [tab, setTab] = useState("All"); // 使用useState定义标签状态，默认为"All"

	// 定义选项的键值对对象
	var tabOptions = {
		All: "全部",
		Apps: "应用",
		Documents: "文档",
		Web: "网页",
		More: "更多",
	};

	/**
	 * 切换标签状态处理函数，根据传入的事件对象设置标签状态
	 * @param {Event} e - 事件对象
	 */
	const tabSwitch = (e) => {
		// 设置标签状态为事件目标元素的文本内容（去除首尾空格）
		setTab(e.target.innerText.trim());
	};

	return (
		// 搜索菜单内容
		<div className="search-menu-screen">
			<div className="search-menu-bar">
				<Icon className="searchIcon" src="search" width={16} />
				<input
					type="text"
					autoFocus
					defaultValue={query}
					placeholder="在此键入以搜索"
					onChange={(event) => {
						// 当输入内容变化时，调用setQuery函数设置查询字符串
						setQuery(event.target.value.trim());
					}}
				/>
			</div>
			<div className="flex py-4 px-1 text-xs">
				<div className="search-menu-opts w-1/2 flex justify-between">
					{/* 显示选项文本内容 */}
					{Object.keys(tabOptions).map((item) => (
						<div key={item} value={tab === item} onClick={tabSwitch}>
							{tabOptions[item]}
						</div>
					))}
				</div>
			</div>
			<div className="search-menu-result w-full flex justify-between">
				<div className="search-menu-left-side flex-col px-1" data-width={query.length != 0}>
					<div className="text-sm font-semibold mb-4">{query.length ? "最佳匹配" : "最近"}</div>
					{query.length ? renderSearchResults(query, match) : renderDefaultResults(menu.recentApps, menu.quickSearch)}
				</div>
				{query.length ? renderMatchDetails(match) : null}
			</div>
		</div>
	);
};
