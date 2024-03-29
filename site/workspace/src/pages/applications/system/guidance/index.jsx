import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import { Icon, ToolBar, LanguageDropdown } from "@/components/global";

import countries from "../Assets/country.json";

/**
 * GuidanceWind 组件，用于引导用户完成初始设置
 */
export const GuidanceWind = () => {
	// 从 Redux 中获取 dispatch 函数
	const dispatch = useDispatch();

	// 国际化翻译函数
	const { t } = useTranslation();

	// 选择 'wind-guidance' 应用状态
	const app = useSelector((state) => state.apps.wind - guidance);

	// 从任务栏中选择任务
	const tasks = useSelector((state) => state.taskbar);

	// 本地状态，用于管理页面索引
	const [pageIndex, setPageIndex] = useState(1);

	// 跳转到下一页的函数
	const nextPage = () => (pageIndex !== 6 ? setPageIndex(pageIndex + 1) : null);

	// 处理更改用户名的函数
	const changUserName = (e) => {
		var newName = e.target.value;
		// 分发一个动作来更新用户名
		dispatch({
			type: "STNGSETV",
			payload: {
				path: "person.name",
				value: newName,
			},
		});
	};

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-guidance dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			{/* 应用工具栏组件 */}
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="入门" />
			<div className="screen flex flex-col" data-dock="true">
				<div className="wind-rest flex-grow flex flex-col">
					<div className="guidance-setup">
						{/* 根据 pageIndex 进行条件渲染 */}
						{pageIndex === 1 ? (
							// 显示国家选择
							<>
								<div className="guidance-left">
									<img id="guidance-left-image" alt="left image" src="img/oobe/window11_oobe_region.png" />
								</div>
								<div className="guidance-right">
									<div className="guidance-right-header">
										{t("oobe.country")}
										<br />
										<div className="guidance-right-text-small"></div>
									</div>
									<div className="guidance-right-dropdown mt-4 scroll">
										{/* 映射并渲染国家选项 */}
										{countries.map((e, i) => {
											return (
												<div key={i} className="guidance-right-content-item">
													{e}
												</div>
											);
										})}
									</div>
								</div>
							</>
						) : null}
						{pageIndex === 2 ? (
							// 显示键盘布局选择
							<>
								<div className="guidance-left">
									<img id="guidance-left-image" src="img/oobe/window11_oobe_keyb_layout.png" />
								</div>
								<div className="guidance-right">
									<div className="guidance-right-header">
										{t("oobe.keyboard")}
										<div className="guidance-right-text-small">{t("oobe.anotherkeyboard")}</div>
									</div>
									<div className="guidance-right-dropdown mt-4 scroll">
										{/* 语言下拉组件 */}
										<LanguageDropdown />
									</div>
								</div>
							</>
						) : null}
						{pageIndex === 3 ? (
							// 显示更新检查消息
							<>
								<div className="guidance-left">
									<img id="guidance-left-image" src="img/oobe/window11_oobe_update.png" />
								</div>
								<div className="guidance-right guidance-align">
									<img id="guidance-right-loader" src="img/oobe/window11_oobe_region.png" />
									正在检查更新。
								</div>
							</>
						) : null}
						{pageIndex === 4 ? (
							// 为计算机命名
							<>
								<div className="guidance-left">
									<img id="guidance-left-image" src="img/oobe/window11_oobe_name.png" />
								</div>
								<div className="guidance-right">
									<div className="guidance-right-header mb-2">来命名你的电脑吧！</div>
									<div className="guidance-right-text-small">
										给它起一个独特的名字，当从其他设备连接到它时 这样更容易识别。在你命名之后 你的电脑将重新启动。
									</div>
									<div className="guidance-right-input">
										{/* 输入计算机名的输入框 */}
										<input type="text" placeholder="name" id="guidance-right-input" onChange={changUserName} />
									</div>
									<div className="guidance-right-text">
										不超过15个字符 <br />
										没有空格或以下任何特殊字符:
										<br />
										&quot;/\ [ ] : | &lt; &gt;+ = ; , ?
									</div>
								</div>
							</>
						) : null}
						{pageIndex === 5 ? (
							// 连接到网络
							<>
								<div className="guidance-left">
									<img id="guidance-left-image" src="img/oobe/window11_oobe_wifi.png" />
								</div>
								<div className="guidance-right">
									<div className="guidance-right-header">
										连接到你的网络
										<div className="guidance-right-text-small">你需要连接到互联网来继续设置你的设备。 一旦连接，您将获得最新的功能和安全更新。</div>
										<div className="guidance-right-contents">
											<div className="guidance-right-content-wifi">
												<i id="connection" className="bx bx-desktop"></i>{" "}
												<div className="guidance-right-content-options">
													<div className="guidance-right-content-option">以太网 01</div>
													<div className="guidance-right-content-option-small">未连接</div>
												</div>
											</div>
											<div className="guidance-right-content-item"></div>
											<div className="guidance-right-content-item"></div>
										</div>
										<div className="guidance-right-text">连接遇到困难?</div>
										<div className="guidance-right-text-small">有关故障排除提示，请使用其他设备并访问 aka.ms/networksetup</div>
									</div>
								</div>
							</>
						) : null}
						{pageIndex === 6 ? (
							// 安装完成
							<>
								<div className="guidance-left">
									<img id="guidance-left-image" src="img/oobe/window11_oobe_update.png" />
								</div>
								<div className="guidance-right">
									<div className="guidance-right-header mb-8">安装已经完成。</div>
									<div>现在你可以关闭它了。</div>
								</div>
							</>
						) : null}

						{/* 跳转到下一页的按钮 */}
						<div className="guidance-button base" onClick={nextPage}>
							是的
						</div>
					</div>

					<div className="guidance-settings">
						<img className="guidance-acsblty mr-4" alt="accessibility" src="img/oobe/window11_oobe_accessibility.png" width={16} />
						<Icon className="task-icon" src={`audio${tasks.audio}`} ui width={16} />
					</div>
				</div>
			</div>
		</div>
	);
};
