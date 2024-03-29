import React, { useState } from "react";
import { useSelector } from "react-redux";

import { allApps } from "@/stores/modules/app";
import { Icon, ToolBar } from "@/components/global";

let appNames = [];

allApps.map((app) => {
	appNames.push(app.name);
});

/**
 * TaskmanageWind 组件用于任务管理窗口
 * @returns {JSX.Element} JSX 元素
 */
export const TaskmanageWind = () => {
	// 从 Redux store 获取应用程序状态
	const app = useSelector((state) => state.allApps.taskmanager);

	// 初始化选项卡和导航状态
	const [tab, setTab] = useState("进程"); // 当前活动选项卡
	const [nav, setNav] = useState("open"); // 导航菜单状态

	// 选项卡名称和图标
	const tabNames = [
		{ title: "进程", icon: "faTableCellsLarge" },
		{ title: "性能", icon: "faWaveSquare" },
		{ title: "应用历史记录", icon: "faClockRotateLeft" },
		{ title: "启动", icon: "faGaugeHigh" },
		{ title: "用户", icon: "faUser" },
		{ title: "详细信息", icon: "faList" },
		{ title: "服务", icon: "faPuzzlePiece" },
	];

	// 电源使用级别
	const powerUsage = ["非常低", "低", "中", "高", "非常高"];

	return (
		// 任务管理窗口容器
		<div
			id={app.icon + "App"}
			className="wind wind-task-manage dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-hide={app.hide}
			data-size={app.size}
		>
			{/* 工具栏组件 */}
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="任务管理器" />
			{/* 主容器 */}
			<div className="screen flex flex-col" data-dock="true">
				{/* 子容器 */}
				<div className="wind-rest flex-grow flex flex-col">
					{/* 导航 */}
					<nav className={nav}>
						{tabNames.map((t, i) => {
							return (
								// 选项卡导航项
								<div key={i} className={`task-navigate ${t.title === tab ? "selected" : ""}`} onClick={() => setTab(t.title)}>
									<Icon className="mx-2" fafa={t.icon} />
									<span className="task-navigate-title">{t.title}</span>
								</div>
							);
						})}
						<div className="task-marker"></div>
					</nav>
					{/* 主内容区域 */}
					<main className="scroll">
						<h3>{tab}</h3>
						{(() => {
							switch (tab) {
								// 根据活动选项卡渲染不同的内容
								case "进程":
									return (
										// 进程表
										<div className="进程">
											<table>
												<thead>
													<tr>
														<th>名称</th>
														<th>CPU</th>
														<th>内存</th>
														<th>磁盘</th>
														<th>网络</th>
														<th>GPU</th>
														<th>电源使用情况</th>
													</tr>
												</thead>
												<tbody>
													{appNames.map((e, i) => {
														return (
															<tr key={i}>
																<td className="name">{e}</td>
																<td>{(Math.random() * 10).toFixed(2)}%</td>
																<td>{(Math.random() * 100).toFixed(2)} MB</td>
																<td>{(Math.random() * 50).toFixed(2)} MB/s</td>
																<td>{(Math.random() * 50).toFixed(2)} MBps</td>
																<td>{(Math.random() * 10).toFixed(2)}%</td>
																<td>{powerUsage[Math.floor(Math.random() * powerUsage.length)]}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									);
								default:
									return;
							}
						})()}
					</main>
					{/* 切换导航按钮 */}
					<div className="wind-task-button" onClick={() => setNav(nav ? "" : "open")}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 48 48" width={24} height={24}>
							<path d="M5.5 9a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};
