import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Icon, ToolBar, Lazy } from "@/components/global";

import DownloadPage from "./download";
import DetailPage from "./detail";
import FrontPage from "./font";

import axios from "axios";

import storedata from "../Assets/store.json";

/**
 * StoreWind组件用于展示商店界面，并处理商店相关的逻辑。
 */
export const StoreWind = () => {
	// 从当前 URL 中获取查询参数
	const queryParams = new URLSearchParams(window.location.search);

	// 从 Redux store 中获取 app 和 hide 状态
	const app = useSelector((state) => state.apps.store);

	const [page, setPage] = useState(0);
	const [tab, setTab] = useState("home");

	const [selectedApp, setSelectedApp] = useState(storedata[0]);
	const [availableApps, setAvailableApps] = useState(storedata);

	const [fetchStatus, setFetchStatus] = useState(0);

	/**
	 * 执行动作并更新页面状态
	 * @param {Event} event 触发事件的对象
	 */
	const clickDispatch = (event) => {
		// 从事件对象中获取 action 和 payload 数据
		var { action, payload } = event.target.dataset;

		// 根据不同的 action 执行相应的操作
		switch (action) {
			case "page1":
				// 如果 action 是 page1，则设置页面为 act 的第五个字符（假设这里应该是数字）
				setPage(Number(action[4]));
				break;
			case "page2":
				// 如果 action 是 page2，则找到匹配 payload 的 app 并更新选中的 app 和页面为 2
				const selectedApp = availableApps.find((app) => app.data.url === payload);
				if (selectedApp) {
					setSelectedApp(selectedApp);
					setPage(2);
				}
				break;
			default:
				// 默认情况下什么也不做
				break;
		}
	};

	/**
	 * 切换到指定标签并滚动页面
	 * @param {Event} event - 触发事件的对象
	 */
	const switchTab = (event) => {
		const tabId = event.target && event.target.dataset.action;
		if (tabId) {
			setPage(0);
			setTimeout(() => {
				const targetTab = document.getElementById(tabId);
				if (targetTab) {
					const parentScrollTop = targetTab.parentNode.parentNode.scrollTop;
					const tabOffsetTop = targetTab.offsetTop;

					if (Math.abs(parentScrollTop - tabOffsetTop) > window.innerHeight * 0.1) {
						targetTab.parentNode.parentNode.scrollTop = targetTab.offsetTop;
					}
				}
			}, 200);
		}
	};

	/**
	 * 根据滚动位置设置当前标签
	 * @param {Event} e - 滚动事件对象
	 */
	const frontScroll = (e) => {
		if (page === 0) {
			const tabs = ["home", "apprib", "gamerib", "movrib"];
			let nearestTab = "home";
			let minDistance = window.innerHeight;

			tabs.forEach((tabId) => {
				const targetTab = document.getElementById(tabId);
				if (targetTab) {
					const parentScrollTop = targetTab.parentNode.parentNode.scrollTop;
					const tabOffsetTop = targetTab.offsetTop;

					const distance = Math.abs(parentScrollTop - tabOffsetTop);
					if (distance < minDistance) {
						nearestTab = tabId;
						minDistance = distance;
					}
				}
			});

			setTab(nearestTab);
		}
	};

	useEffect(() => {
		// 当 app 不隐藏且 fetchStatus 为 0 时执行
		if (!app.hide && fetchStatus === 0) {
			// 获取查询参数中的 customstore，若不存在则使用默认 url
			let url = queryParams.get("customstore");
			if (!url) {
				url = "https://cdn.jsdelivr.net/gh/inwinter04/store/store/index.json";
			}

			// 发起网络请求获取数据
			axios
				.get(url)
				.then((res) => res.data)
				.then((data) => {
					// 如果获取到数据，则更新 availableApps 状态
					if (data) {
						setAvailableApps(data);
					}
				})
				.catch((err) => {
					console.log(err);
				});

			// 更新 fetchStatus 状态为 1
			setFetchStatus(1);
		}
	}, [app.hide, fetchStatus, setAvailableApps, setFetchStatus, queryParams]);

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-store dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="Microsoft Store" />
			<div className="screen flex">
				<Lazy show={!app.hide}>
					<div className="wind-store-navigate h-full w-20 flex flex-col">
						<Icon fafa="faHome" width={20} payload={page == 0 && tab == "home"} click="home" onClick={switchTab} />
						<Icon fafa="faThLarge" width={18} payload={page == 0 && tab == "apprib"} click="apprib" onClick={switchTab} />
						<Icon fafa="faGamepad" width={20} payload={page == 0 && tab == "gamerib"} click="gamerib" onClick={switchTab} />
						<Icon fafa="faFilm" width={20} payload={page == 0 && tab == "movrib"} click="movrib" onClick={switchTab} />
						<Icon fafa="faDownload" width={20} payload={page == 1} click="page1" onClick={clickDispatch} />
					</div>
					<div className="scroll wind-rest wind-store-pages" onScroll={frontScroll}>
						{page == 0 ? <FrontPage /> : null}
						{page == 1 ? <DownloadPage apps={(availableApps.length && availableApps) || storedata} clickDispatch={clickDispatch} /> : null}
						{page == 2 ? <DetailPage app={selectedApp} /> : null}
					</div>
				</Lazy>
			</div>
		</div>
	);
};
