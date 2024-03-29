import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleTheme } from "@/actions";
import { Image, ToolBar, LanguageDropdown } from "@/components/global";

import data from "../Assets/setting.json";

export const SettingWind = () => {
	const dispatch = useDispatch();

	const app = useSelector((state) => state.apps.settings);
	const theme = useSelector((state) => state.setting.person.theme);
	const userName = useSelector((state) => state.setting.person.name);
	const wallpaper = useSelector((state) => state.wallpaper);

	const [nav, setNav] = useState("");
	const [page, setPage] = useState("系统"); // default System
	const [updating, setUpdating] = useState(false);
	const [upmodalOpen, setUpmodalOpen] = useState(false);

	const themechecker = {
		default: "light",
		dark: "dark",
		ThemeA: "dark",
		ThemeB: "dark",
		ThemeD: "light",
		ThemeC: "light",
	};

	const handleWallAndTheme = (event) => {
		var payload = event.target.dataset.payload;

		var src = payload,
			theme_nxt = themechecker[payload.split("/")[0]];

		if (theme_nxt != theme) {
			toggleTheme();
		}

		dispatch({
			type: "WALLSET",
			payload: src,
		});
	};

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-setting dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="设置" />
			<div className="screen flex flex-col" data-dock="true">
				<div className="wind-rest flex-grow flex flex-col">
					<nav className={nav}>
						<div className="setting-navigate-top">
							<div className="setting-account" onClick={() => setPage("Accounts")}>
								<img alt="" height={60} width={60} src="img/settings/defAccount.webp" />
								<div>
									<p>{userName}</p>
									<p>本地用户</p>
								</div>
							</div>
							<input type="text" className="setting-search" placeholder="查找设置 " name="search" />
						</div>
						<div className="setting-navigate-bottom scroll">
							{Object.keys(data).map((item) => {
								return (
									<div key={item} className={`setting-navigate-link ${item === page ? "selected" : ""}`} onClick={() => setPage(item)}>
										<img src={`img/settings/${item}.webp`} alt="" height={16} width={16} />
										{item}
									</div>
								);
							})}
							<div className="setting-navigate-marker"></div>
						</div>
					</nav>

					{Object.keys(data).map((item) => {
						return (
							page === item && (
								<main key={item}>
									<h1>{item}</h1>
									<div className="setting-tiles scroll">
										{data[item].map((item, i) => {
											switch (item.type) {
												case "sys-tile":
													return (
														<div key={i} className={`setting-${item.type}`}>
															<div className="setting-tile-left">
																<img className="sys-device-image" src={`img/wallpaper/${wallpaper.src}`} alt="" />
																<div className="sys-device">
																	<p className="device-name">Dell</p>
																	<p className="device-model">Precision 3640 Tower</p>
																	<p className="device-rename">重命名</p>
																</div>
															</div>
															<div className="setting-tile-right">
																<div className="sys-column">
																	<img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg" height={20} alt="" />
																	<p>
																		Microsoft 365
																		<br />
																		<span className="sys-column-lower">浏览优势</span>
																	</p>
																</div>
																<div className="sys-column" onClick={() => setPage("Windows 更新")}>
																	<img src="img/settings/Windows 更新.webp" alt="" height={20} />
																	<p>
																		Windows 更新
																		<br />
																		<span className="sys-column-lower">你使用的是最新版本</span>
																	</p>
																</div>
															</div>
														</div>
													);
												case "net-tile":
													return (
														<div key={i} className={`setting-${item.type}`}>
															<div>
																<img src="img/settings/wifi.png" alt="" height={100} />
																<div>
																	<h2 className="font-medium text-lg">WiFi</h2>
																	<p>已连接</p>
																</div>
															</div>
															<div className="net-tile-box">
																<span className="setting-icon"></span>
																<div>
																	<h3>属性</h3>
																	<p>专用网络</p>
																</div>
															</div>
															<div className="net-tile-box">
																<span className="setting-icon"></span>
																<div>
																	<h3>数据使用量</h3>
																	<p>{Math.round(Math.random() * 100)}GB, 过去30天</p>
																</div>
															</div>
														</div>
													);
												case "personalise-tile":
													return (
														<div key={i} className={`setting-${item.type}`}>
															<img className="personalise-tile-main-image" src={`img/wallpaper/${wallpaper.src}`} alt="" />
															<div>
																<h3>选择要应用的主题</h3>
																<div className="personalise-tile-background-box">
																	{wallpaper.themes.map((item, i) => {
																		return (
																			<Image
																				key={i}
																				className={wallpaper.src.includes(item) ? "selected" : ""}
																				src={`img/wallpaper/${item}/img0.jpg`}
																				ext
																				click="WALLSET"
																				payload={`${item}/img0.jpg`}
																				onClick={handleWallAndTheme}
																			/>
																		);
																	})}
																</div>
															</div>
														</div>
													);
												case "account-tile":
													return (
														<div key={i} className={`setting-${item.type}`}>
															<img alt="" width={90} src="img/settings/defAccount.webp" />
															<div>
																<p>{userName.toUpperCase()}</p>
																<p>本地用户</p>
																<p>Administrator</p>
															</div>
														</div>
													);
												case "time-tile":
													return (
														<div className={`setting-${item.type}`}>
															<h1>{new Date().toLocaleTimeString("zh-CN", { hour: "numeric", minute: "numeric", hour12: true })}</h1>
														</div>
													);
												case "language-tile":
													return (
														<div key={i} className={`setting-tile setting-${item.type}`}>
															<span className="setting-icon"></span>
															<div className="language-tile-content">
																<p>Windows 显示语言</p>
																<p className="language-tile-description">Windows的设置和文件资源管理器等功能将以这种语言出现</p>
															</div>
															<LanguageDropdown />
														</div>
													);
												case "update-tile":
													return (
														<div key={i} className={`setting-${item.type}`}>
															<div className="setting-tile-left">
																<img src="img/settings/update.png" width={90} alt="" />
																<div>
																	<h2>你使用的是最新版本</h2>
																	<p>上次检查时间: 今天</p>
																</div>
															</div>
															<div className="setting-tile-right">
																<div
																	className="update-tile-button"
																	onClick={() => {
																		setUpdating(true);
																		setTimeout(() => {
																			setUpdating(false);
																			setUpmodalOpen(true);
																		}, Math.random() * 2000);
																	}}
																>
																	{updating ? "检查更新..." : "检查更新"}
																</div>
															</div>
														</div>
													);

												case "sub-head":
												case "spacer":
													return (
														<div key={i} className={`setting-${item.type}`}>
															{item.name}
														</div>
													);
												case "tile":
												case "tile square":
												case "tile thin-blue":
													return (
														<div key={item.name} className={`setting-${item.type}`}>
															<span className="setting-icon">{item.icon}</span>
															<div>
																<p>{item.name}</p>
																<p className="language-tile-description">{item.desc}</p>
															</div>
														</div>
													);
												default:
													return console.log(`error - type ${item.type} not found`);
											}
										})}
									</div>
								</main>
							)
						);
					})}

					{upmodalOpen && (
						<>
							<div className="absolute z-30 bg-black bg-opacity-60 h-full w-full top-0 setting-tile-left-0"></div>

							<div
								className="absolute top-[50%] setting-tile-left-[50%] z-50 rounded"
								style={{ transform: `translateX(-50%) translateY(-50%)`, background: `var(--wintheme)`, padding: `1.5rem` }}
							>
								<h1 className="text-2xl font-semibold" style={{ marginBottom: `10px` }}>
									需要重新启动
								</h1>
								<p>有些更改直到重新启动设备才会生效。</p>

								<div className="flex" style={{ marginTop: `14px` }}>
									<button
										className="flex-1 rounded border-none hover:opacity-95"
										style={{ padding: "10px", backgroundColor: "var(--clrPrm)", color: "var(--alt-txt)", marginRight: "10px" }}
										onClick={() => (window.location = window.location.href + `?clearCache=${Math.random()}`)}
									>
										现在重启
									</button>
									<button
										className="flex-1 rounded border"
										style={{ padding: "10px", color: "var(--sat-txt)" }}
										onClick={() => setUpmodalOpen(false)}
									>
										稍后重启
									</button>
								</div>
							</div>
						</>
					)}

					<div className="setting-navigate-button" onClick={() => setNav(nav ? "" : "open")}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 48 48" width={24} height={24}>
							<path d="M5.5 9a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37zm0 13.5a1.5 1.5 0 1 0 0 3h37a1.5 1.5 0 1 0 0-3h-37z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};
