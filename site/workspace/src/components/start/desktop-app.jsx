import React from "react";
import { useSelector } from "react-redux";

import { Icon } from "@/components/global";

import { sortedAppsSelector } from "@/selectors/desktop";

import "./desktop-app.scss";

/**
 * 桌面应用程序组件
 * @returns {JSX.Element} - 返回桌面应用程序组件的 JSX 元素
 */
export const DesktopApp = () => {
	// 获取桌面应用程序数据
	var desktopApp = useSelector(sortedAppsSelector);

	// 返回JSX
	return (
		<div className="desktop-icons">
			{/* 遍历显示桌面应用程序图标 */}
			{!desktopApp.hide &&
				desktopApp.apps.map((app, i) => {
					return (
						<div key={i} className="desktop-app" tabIndex={0}>
							{/* 应用程序图标 */}
							<Icon
								pr
								className="desktop-icon prtclk"
								menu="app"
								src={app.icon} // 图标地址
								payload={app.payload || "full"} // 图标显示方式
								width={Math.round(desktopApp.size * 36)} // 图标宽度
								click={app.action} // 点击事件
							/>
							{/* 应用程序名称 */}
							<div className="app-name">{app.name}</div>
						</div>
					);
				})}
		</div>
	);
};
