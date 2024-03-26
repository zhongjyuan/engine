import React from "react";
import { useSelector } from "react-redux";

import { lock as LockIcon, power as PowerIcon, restart as RestartIcon, shutdown as ShutdownIcon } from "@/components/icon";

import { Icon } from "@/components/global";

import { startMenuClick } from "@/actions";

import "./start-menu-screen.scss";

/**
 * 渲染固定应用组件
 * @param {object} props - 固定应用组件的属性
 * @param {number} props.index - 应用的索引
 * @param {object} props.app - 包含应用详情的对象
 * @param {function} props.onClick - 处理点击事件的函数
 * @returns {JSX.Element} - 固定应用组件
 */
const PinnedApp = ({ index, app, onClick }) => {
	// 检查应用是否为空
	if (app.empty) {
		// 返回一个空的固定应用 div
		return <div key={index} className="pinned-app pinned-empty" />;
	} else {
		// 返回一个带有应用详情的固定应用 div
		return (
			<div
				id={app.name}
				key={index} // 设置 key 值为索引
				className="pinned-app prtclk" // 添加样式类名
				value={app.action != null} // 根据条件设置值
				data-slice={app.slice}
				data-action={app.action} // 设置数据属性 action
				data-payload={app.payload || "full"} // 设置数据属性 payload
				onClick={onClick} // 点击事件处理函数
			>
				{/* 显示应用图标 */}
				<Icon className="pinned-app-icon" src={app.icon} width={32} />
				{/* 显示应用名称 */}
				<div className="pinned-app-name">{app.name}</div>
			</div>
		);
	}
};

/**
 * 最近应用程序组件
 * @param {Object} props - 组件属性对象
 * @param {number} props.index - 应用程序索引
 * @param {Object} props.app - 应用程序对象，包含应用程序信息
 * @param {Function} props.onClick - 点击事件处理函数
 * @returns {JSX.Element} React 元素
 */
const RecentApp = ({ index, app, onClick }) => {
	// 如果应用程序名称存在，则渲染应用程序信息
	if (app.name) {
		return (
			<div
				id={app.name}
				key={index} // 设置 React 中的唯一 key 属性
				className="recent-app" // 添加 CSS 类名
				value={app.action != null} // 根据条件设置 value 属性
				data-slice={app.slice}
				data-action={app.action} // 设置自定义 data-action 属性
				data-payload={app.payload || "full"} // 设置自定义 data-payload 属性，如果不存在则默认为 "full"
				onClick={onClick} // 设置点击事件处理函数
			>
				{/* 渲染应用程序图标 */}
				<Icon className="recent-app-icon" src={app.icon} width={32} />
				{/* 应用程序信息容器 */}
				<div className="recent-app-info">
					{/* 显示应用程序名称 */}
					<div className="recent-app-name">{app.name}</div>
					{/* 显示最近使用时间 */}
					<div className="recent-app-time-used">{app.lastUsed}</div>
				</div>
			</div>
		);
	} else {
		return null; // 应用程序名称不存在时返回 null
	}
};

/**
 * 渲染 Alpha 应用组件
 * @param {object} props - Alpha 应用组件的属性
 * @param {number} props.index - 应用的索引
 * @param {array} props.apps - 包含应用详情的数组
 * @param {function} props.onClick - 处理点击事件的函数
 * @returns {JSX.Element} - Alpha 应用组件
 */
const AlphaApp = ({ index, apps, onClick }) => {
	// 根据索引判断名称
	var name = index === 0 ? "#" : String.fromCharCode(index + 64);
	return (
		<div
			id={`char${name}`} // 设置 id 为索引
			key={index} // 设置 key 值为字符名
			className={apps.length === 0 ? "all-app dull-app" : "all-app prtclk"} // 根据条件设置样式类名
			data-slice="start"
			data-action="setAlpha" // 设置数据属性 action
			data-payload={name} // 设置数据属性 payload
			onClick={apps.length === 0 ? null : onClick} // 根据条件设置点击事件处理函数
		>
			<div className="app-name">{name}</div> {/* 显示应用名称 */}
		</div>
	);
};

/**
 * 渲染所有应用组件
 * @param {object} props - 包含index、apps和onClick的属性对象
 * @param {number} props.index - 应用的索引
 * @param {array} props.apps - 包含应用详情的数组
 * @param {function} props.onClick - 处理点击事件的函数
 * @returns {JSX.Element|null} - 所有应用组件或 null
 */
const AllApp = ({ index, apps, onClick }) => {
	// 如果应用列表为空，则返回 null
	if (apps.length == 0) return null;

	// 根据索引确定名称
	var name = index == 0 ? "#" : String.fromCharCode(index + 64);

	// 保存所有应用组件的数组
	var tpApps = [];

	// 添加索引对应的组件
	tpApps.push(
		<div id={`char${name}`} key={index} className="all-app prtclk" data-slice="start" data-action="setAlpha" onClick={onClick}>
			<div className="all-app-name">{name}</div>
		</div>
	);

	// 遍历每个应用，生成对应的组件
	apps.forEach((app, j) => {
		tpApps.push(
			<div
				id={app.name}
				key={j}
				className="all-app prtclk"
				data-slice={app.slice}
				data-action={app.action}
				data-payload={app.payload || "full"}
				onClick={onClick}
			>
				<Icon className="app-icon" src={app.icon} width={24} />
				<div className="app-name">{app.name}</div>
			</div>
		);
	});

	return tpApps;
};

/**
 * StartMenuScreen 组件，用于显示开始菜单界面
 * @param {Object} props - 传入的参数对象
 * @param {Object} props.menu - 包含菜单信息的对象
 */
export const StartMenuScreen = ({ menu }) => {
	var person = useSelector((state) => state.setting.person); // 从 Redux 中获取用户姓名

	return (
		<>
			{/* React Fragment，包裹多个子元素 */}
			<div className="start-menu-screen" data-showall={menu.showAll}>
				<div className="menu-up">
					{/* 已固定的应用 */}
					<div className="menu-pinned-screen">
						<div className="menu-bar">
							<div className="bar-name">已固定</div>
							<div className="bar-btn prtclk" data-slice="start" data-action="showAll" onClick={startMenuClick}>
								<div>所有应用</div>
								<Icon className="bar-btn-right" fafa="faChevronRight" width={8} />
							</div>
						</div>
						<div className="menu-pinned-apps">
							{menu.pnApps.map((app, index) => (
								<PinnedApp key={index} app={app} onClick={startMenuClick} />
							))}
						</div>
					</div>
					{/* 推荐的项目 */}
					<div className="menu-recent-screen scroll">
						<div className="menu-bar">
							<div className="bar-name">推荐的项目</div>
							<div className="bar-btn none">
								<div>More</div>
								<Icon fafa="faChevronRight" width={8} />
							</div>
						</div>
						<div className="menu-recent-apps">
							{menu.rcApps.slice(0, 6).map((app, index) => (
								<RecentApp key={index} app={app} onClick={startMenuClick} />
							))}
						</div>
					</div>
				</div>
			</div>
			{/* 所有应用内容 */}
			<div className="start-menu-all-screen" data-showall={menu.showAll}>
				<div className="menu-all-screen">
					<div className="menu-bar">
						<div className="bar-name">所有应用</div>
						<div className="bar-btn prtclk" data-slice="start" data-action="showAll" onClick={startMenuClick}>
							<Icon className="bar-btn-left" fafa="faChevronLeft" width={8} />
							<div>返回</div>
						</div>
					</div>
					<div className="menu-all-apps scroll" data-alpha={menu.alpha}>
						{menu.contApps.map((ldx, index) => (
							<AllApp index={index} apps={ldx} onClick={startMenuClick} />
						))}
					</div>
					{/* 字母索引部分 */}
					<div className="menu-alpha-apps" data-alpha={menu.alpha}>
						<div className="alpha-app-screen">
							<div className="all-app dull-app">
								<div className="alpha-app-name">&</div>
							</div>
							{menu.contApps.map((ldx, index) => (
								<AlphaApp index={index} apps={ldx} onClick={startMenuClick} />
							))}
						</div>
					</div>
				</div>
			</div>
			{/* 菜单栏 */}
			<div className="start-menu-bar-screen">
				<div className="profile handcr">
					<Icon src="avatar" ui rounded width={26} click="app/external" payload="htpp://tab.zhongjyuan.club" />
					<div className="name">{person.name}</div>
				</div>
				<div className="bar-power-menu relative">
					<div className="power-menu-screen" data-vis={menu.pwctrl}>
						{/* 锁定按钮 */}
						<div className="flex prtclk items-center gap-2" data-slice="wallpaper" data-action="lock" onClick={startMenuClick}>
							<LockIcon width="18" height="18" fill="none" />
							<span>锁定</span>
						</div>
						{/* 关机按钮 */}
						<div className="flex prtclk items-center gap-2" data-slice="wallpaper" data-action="shutdown" onClick={startMenuClick}>
							<ShutdownIcon width="18" height="18" fill="none" />
							<span>关机</span>
						</div>
						{/* 重启按钮 */}
						<div className="flex prtclk items-center gap-2" data-slice="wallpaper" data-action="restart" onClick={startMenuClick}>
							<RestartIcon width="18" height="18" fill="none" />
							<span>重启</span>
						</div>
					</div>
					<PowerIcon width="20" height="20" fill="none" />
				</div>
			</div>
		</>
	);
};

export default StartMenuScreen;
