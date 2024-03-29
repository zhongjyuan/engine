import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { installApp } from "@/actions";
import { Icon, Image } from "@/components/global";

import { generateStarRating, calculateEmap } from "./helper";

/**
 * 详情页面组件，用于显示应用程序详情并处理用户交互。
 * @param {object} props - 传递给组件的属性。
 * @param {object} props.app - 包含要显示的应用程序详细信息的应用程序对象。
 */
const DetailPage = (props) => {
	// 解构 props
	const { app } = props;

	// 从自定义 hook 中获取翻译函数
	const { t } = useTranslation();

	// 从 Redux store 中获取 dispatch 函数
	const dispatch = useDispatch();

	// 从 Redux store 中选择 'apps' 状态
	const apps = useSelector((state) => state.apps);

	// 管理下载状态的状态
	const [status, setStatus] = useState(0);

	// 生成用于显示的星级评分
	const stars = generateStarRating(app);
	const reviews = generateStarRating(app, 1);

	// 处理应用程序下载的函数
	const download = () => {
		setStatus(1); // 将下载状态设置为表示进行中
		setTimeout(() => {
			installApp(app); // 模拟应用安装
			setStatus(3); // 设置状态以指示安装完成
		}, 3000);
	};

	// 刷新页面的函数
	const refresh = () => window.location.reload();

	// 打开已安装应用的函数
	const openApp = () => {
		dispatch({ type: apps[app.icon].action, payload: "full" }); // 分发打开应用的动作
	};

	// 效果以检查应用是否已安装并相应地更新状态
	useEffect(() => {
		if (apps[app.icon] != null) setStatus(3); // 如果应用已安装，则将状态设置为准备打开
	}, [status]);

	// 渲染组件
	return (
		<div className="wind-store-page-detail w-full absolute top-0 flex">
			<div className="wind-store-detail">
				<Image className="rounded" ext w={100} h={100} src={app.icon} err="img/asset/mixdef.jpg" />
				<div className="flex flex-col items-center text-center relative">
					<div className="text-2xl font-semibold mt-6">{app.name}</div>
					<div className="text-xs text-blue-500">社区</div>
					{status == 0 ? ( // 根据下载状态进行条件渲染
						<div className="wind-store-button mt-12 mb-8 handcr" onClick={download}>
							获取
						</div>
					) : null}
					{status == 1 ? <div className="wind-store-download-bar mt-12 mb-8"></div> : null}
					{status == 2 ? ( // 根据下载状态进行条件渲染
						<div className="wind-store-button mt-12 mb-8 handcr" onClick={refresh}>
							刷新
						</div>
					) : null}
					{status == 3 ? ( // 根据下载状态进行条件渲染
						<div className="wind-store-button mt-12 mb-8 handcr" onClick={openApp}>
							打开
						</div>
					) : null}
					<div className="flex mt-4">
						<div>
							<div className="flex items-center text-sm font-semibold">
								{stars} {/* 显示星级评分 */}
								<Icon className="text-orange-600 ml-1" fafa="faStar" width={14} />
							</div>
							<span className="text-xss">平均</span>
						</div>
						<div className="w-px bg-gray-300 mx-4"></div>
						<div>
							<div className="text-sm font-semibold">{Math.round(reviews / 100) / 10}K</div>
							<div className="text-xss mt-px pt-1">评分</div>
						</div>
					</div>
					<div className="wind-store-detail-desc text-xs relative w-0">{app.data.desc}</div>
				</div>
			</div>
			<div className="wind-store-detail-grow flex flex-col">
				{app.data.gallery && app.data.gallery.length ? ( // 根据画廊数据的存在性进行条件渲染
					<div className="wind-store-brief py-2 pb-3">
						<div className="text-xs font-semibold">屏幕截图</div>
						<div className="overflow-x-scroll scroll mt-4">
							<div className="w-max flex">
								{app.data.gallery &&
									app.data.gallery.map((x, i) => <Image key={i} className="mr-2 rounded" h={250} src={x} ext err="img/asset/mixdef.jpg" />)}
							</div>
						</div>
					</div>
				) : null}
				<div className="wind-store-brief py-2 pb-3">
					<div className="text-xs font-semibold">{t("store.description")}</div>
					<div className="text-xs mt-4">
						<pre>{app.data.desc}</pre>
					</div>
				</div>
				<div className="wind-store-brief py-2 pb-3">
					<div className="text-xs font-semibold">{t("store.ratings")}</div>
					<div className="flex mt-4 items-center">
						<div className="flex flex-col items-center">
							<div className="text-5xl wind-store-brief-review font-bold">{stars}</div>
							<div className="text-xss">{Math.round(reviews / 100) / 10}K 评分</div>
						</div>
						<div className="text-xss ml-6">
							{"54321".split("").map((x, i) => {
								return (
									<div key={i} className="flex items-center">
										<div className="h-4">{x}</div>
										<Icon className="text-orange-500 ml-1" fafa="faStar" width={8} />
										<div className="w-48 ml-2 bg-orange-200 rounded-full">
											<div
												style={{
													width: calculateEmap(Math.abs(stars - x)) * 100 + "%",
													padding: "3px 0",
												}}
												className="rounded-full bg-orange-500"
											></div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="wind-store-brief py-2 pb-3">
					<div className="text-xs font-semibold">{t("store.features")}</div>
					<div className="text-xs mt-4">
						<pre>{app.data.feat}</pre>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailPage;
