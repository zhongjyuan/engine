import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";

import { windowOnLoad, windowOnStart, windowOnClick, windowOnContextMenu, loadSettings } from "@/actions";

import Fallback from "@/components/error";
import { Taskbar } from "@/components/taskbar";
import { DesktopApp } from "@/components/desktop";
import { StartMenu, ContextMenu } from "@/components/menu";
import { Background, BootScreen, LockScreen } from "@/components/background";
import { BandPane, CalendarPane, TaskPane, WidgetPane } from "@/components/pane";

import * as Winds from "@/components/wind/wind";

import "./window.scss";

export default function Window() {
	var apps = useSelector((state) => state.apps);
	var wall = useSelector((state) => state.wallpaper);

	window.onload = windowOnLoad;
	window.onclick = windowOnClick;
	window.oncontextmenu = windowOnContextMenu;

	/**
	 * 在组件挂载后执行的副作用函数
	 */
	useEffect(() => {
		// 检查是否已经设置了 window.onstart
		if (!window.onstart) {
			// 载入设置信息
			loadSettings();

			// 设置定时器，在5秒后触发 wallpaper/boot 的 action
			window.onstart = windowOnStart;
		}
	});

	return (
		<div className="window">
			<ErrorBoundary FallbackComponent={Fallback}>
				{!wall.booted ? <BootScreen dir={wall.dir} /> : null}
				{wall.locked ? <LockScreen dir={wall.dir} /> : null}
				<div className="screen">
					<Background />
					<div className="desktop" data-menu="desk">
						<DesktopApp />
						{/* {Object.keys(Applications).map((key, idx) => {
							var WinApp = Applications[key];
							return <WinApp key={idx} />;
						})}

						{Object.keys(apps)
							.filter((x) => x != "hz")
							.map((key) => apps[key])
							.map((app, i) => {
								if (app.pwa) {
									var Wind = Winds[app.data.type];
									return <Wind key={i} icon={app.icon} {...app.data} />;
								}
							})} */}

						<StartMenu />
						<BandPane />
						<TaskPane />
						<WidgetPane />
						<CalendarPane />
					</div>
					<Taskbar />
					<ContextMenu />
				</div>
			</ErrorBoundary>
		</div>
	);
}
