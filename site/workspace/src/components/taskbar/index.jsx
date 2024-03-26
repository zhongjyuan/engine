import { useEffect, useState } from "react"; // 引入 React 相关的 Hook
import { useSelector } from "react-redux"; // 引入 Redux 相关的 Hook

import { Icon } from "../global"; // 引入全局图标组件

import Battery from "@/components/battery"; // 引入电池组件

import { clickDispatch, showPreview, hidePreview } from "@/actions"; // 引入任务栏相关的 action

import "./index.scss";

// Taskbar 组件
const Taskbar = () => {
	var tasks = useSelector((state) => state.taskbar);
	var apps = useSelector((state) => state.apps);

	var [time, setTime] = useState(new Date()); // 定义时间 state

	// 使用 Effect Hook 更新时间
	useEffect(() => {
		var interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="tasks-bar">
			{/* 任务栏容器 */}
			<div className="task-screen">
				{/* 任务栏内容容器 */}
				<div className="task" data-menu="task" data-side={tasks.align}>
					{/* 任务栏任务内容 */}
					<div className="task-bar" onMouseOut={hidePreview}>
						{/* 任务栏操作区域 */}
						{/* 主页图标 */}
						<Icon className="task-icon" src="home" width={24} slice="start" action="toggle" />
						{/* 搜索图标 */}
						{tasks.search ? <Icon className="task-icon task-icon-search" icon="taskSearch" slice="start" action="showSearch" /> : null}
						{/* 小部件图标 */}
						{tasks.widgets ? <Icon className="task-icon task-icon-widget" src="widget" width={24} slice="widget" action="toggle" /> : null}
						{tasks.apps.map((app, i) => {
							// 遍历应用图标
							var isHidden = apps[app.icon].hide;
							var isActive = apps[app.icon].z == apps.hz;
							return (
								<div key={i} onMouseOver={(!isActive && !isHidden && showPreview) || null} value={app.icon}>
									<Icon
										className="task-icon"
										width={24}
										active={isActive}
										payload="togg"
										src={app.icon}
										open={isHidden ? null : true}
										slice={app.slice}
										action={app.action}
									/>
								</div>
							);
						})}
						{Object.keys(apps).map((key, i) => {
							if (key != "hz") {
								var isActive = apps[key].z == apps.hz;
							}
							return key != "hz" && key != "undefined" && !apps[key].task && !apps[key].hide ? (
								<div key={i} onMouseOver={(!isActive && showPreview) || null} value={apps[key].icon}>
									<Icon
										className="task-icon"
										width={24}
										active={isActive}
										payload="togg"
										open="true"
										src={apps[key].icon}
										slice={apps[key].slice}
										action={apps[key].action}
									/>
								</div>
							) : null;
						})}
					</div>
				</div>
				<div className="task-right">
					{/* 任务栏右侧区域 */}
					{/* 展开/隐藏任务栏 */}
					<div className="px-2 prtclk handcr hvlight flex" data-slice="pane" data-action="bandToggle" onClick={clickDispatch}>
						<Icon fafa="faChevronUp" width={10} />
					</div>
					{/* 网络、音频、电池信息 */}
					<div className="prtclk handcr my-1 px-1 hvlight flex rounded" data-slice="pane" data-action="sideToggle" onClick={clickDispatch}>
						<Icon className="task-right-icon" src="wifi" ui width={16} />
						<Icon className="task-right-icon" src={"audio" + tasks.audio} ui width={16} />
						<Battery />
					</div>
					{/* 当前日期时间 */}
					<div className="task-right-date m-1 handcr prtclk rounded hvlight" data-slice="pane" data-action="calendarToggle" onClick={clickDispatch}>
						<div>{time.toLocaleTimeString("zh-CN", { hour: "numeric", minute: "numeric" })}</div>
						<div>{time.toLocaleDateString("zh-CN", { year: "2-digit", month: "2-digit", day: "numeric" })}</div>
					</div>
					<Icon className="task-right-graybd my-4" ui width={6} slice="app" action="showDesktop" pr /> {/* 显示桌面图标 */}
				</div>
			</div>
		</div>
	);
};

export default Taskbar;
