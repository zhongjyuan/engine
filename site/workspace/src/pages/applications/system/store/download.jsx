import React, { useState } from "react";

import { Icon, Image } from "@/components/global";

import { generateStarRating } from "./helper";

/**
 * DownloadPage 组件用于显示基于所选选项卡的应用程序
 * @param {Object} props - 组件属性
 * @param {Array} props.apps - 要显示的应用程序列表
 * @param {Function} props.clickDispatch - 点击分发函数
 */
const DownloadPage = (props) => {
	// 解构 props
	const { apps, clickDispatch } = props;

	// 当前选项卡选择的状态
	const [tab, setTab] = useState("all");

	return (
		// DownloadPage 组件的主要容器
		<div className="wind-store-page w-full absolute top-0 box-border p-12">
			<div className="flex">
				{/* 用于过滤应用程序的选项卡按钮 */}
				<div className="wind-store-page-tab-button handcr" value={tab == "all"} onClick={() => setTab("all")}>
					全部
				</div>
				<div className="wind-store-page-tab-button handcr" value={tab == "app"} onClick={() => setTab("app")}>
					应用
				</div>
				<div className="wind-store-page-tab-button handcr" value={tab == "game"} onClick={() => setTab("game")}>
					游戏
				</div>
				<div className="absolute right-0 mr-4 text-sm">
					{/* 链接以添加自己的应用程序 */}
					<a href="https://win11react-docs.andrewstech.me/docs/Store/add-app" className="wind-store-page-tab-button" target="_blank" rel="noreferrer">
						添加自己的应用程序
					</a>
				</div>
			</div>
			<div className="wind-store-page-apps mt-8">
				{apps.map((item, i) => {
					// 根据选项卡选择过滤应用程序
					if (item.type != tab && tab != "all") return;

					// 生成星级评分和评论
					var stars = generateStarRating(item);
					var reviews = Math.round(generateStarRating(item, 1) / 100) / 10;

					return (
						<div
							key={i}
							className="wind-store-page-app p-4 pt-8 ltShad prtclk"
							data-action="page2"
							data-payload={item.data.url}
							onClick={clickDispatch}
						>
							<Image className="mx-4 mb-6 rounded" w={100} h={100} src={item.icon} ext />
							<div className="capitalize text-xs font-semibold">{item.name}</div>
							<div className="capitalize text-xss text-gray-600">{item.type}</div>
							<div className="flex items-center">
								<Icon className={stars > 1 ? "bluestar" : ""} fafa="faStar" width={6} />
								<Icon className={stars > 1.5 ? "bluestar" : ""} fafa="faStar" width={6} />
								<Icon className={stars > 2.5 ? "bluestar" : ""} fafa="faStar" width={6} />
								<Icon className={stars > 3.5 ? "bluestar" : ""} fafa="faStar" width={6} />
								<Icon className={stars > 4.5 ? "bluestar" : ""} fafa="faStar" width={6} />
								<div className="text-xss">{reviews}k</div>
							</div>
							<div className="text-xss mt-8">{"Free"}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DownloadPage;
