import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { isValidURL } from "@/utils";

import { Icon, ToolBar, Lazy } from "@/components/global";

export const BrowserWind = () => {
	const dispatch = useDispatch();

	const [isError, setIsError] = useState(true);
	const [isTyping, setIsTyping] = useState(false);
	const [currentUrl, setCurrentUrl] = useState("https://cn.bing.com/");
	const [historyUrls, setHistoryUrls] = useState(["https://cn.bing.com/", "https://cn.bing.com/"]);

	const app = useSelector((state) => state.apps.edge);

	const bookbars = {
		"https://cn.bing.com/": "必应",
		"https://blueedge.me": "blueedge",
		"https://www.iamdt.cn/": "冬天的小窝",
		"https://github.com/inwinter04": "Github",
		"https://blueedge.me/unescape": "Unescape",
		"https://win11.iamdt.eu.org/": "Windows11",
	};

	const favicons = {
		"https://andrewstech.me": "https://avatars.githubusercontent.com/u/45342431",
	};

	/**
	 * 重置错误状态，将 isError 状态设置为 false。
	 *
	 * @param {void} 该函数无需参数。
	 * @returns {void} 无返回值。
	 */
	const failed = () => {
		// 将 isError 状态设置为 false
		setIsError(false);
	};

	/**
	 * 当用户输入时处理函数，更新当前输入状态和历史URL。
	 *
	 * @param {Event} event - 输入事件对象
	 * @returns {void} 无返回值
	 */
	const typing = (event) => {
		// 如果当前没有正在输入
		if (!isTyping) {
			// 设置正在输入状态为 true
			setIsTyping(true);
			// 更新历史URL为当前URL
			setHistoryUrls([currentUrl, currentUrl]);
		}
		// 设置当前URL为输入框的值
		setCurrentUrl(event.target.value);
	};

	/**
	 * 处理用户操作事件，根据不同操作类型执行相应操作。
	 *
	 * @param {Event} event - 事件对象
	 * @returns {void} 无返回值
	 */
	const action = (event) => {
		// 获取iframe元素
		const iframeElement = document.getElementById("site-iframe");
		// 获取操作类型
		const actionType = event.target && event.target.dataset.payload;

		if (iframeElement) {
			// 根据操作类型执行相应操作
			switch (actionType) {
				case 0:
					// 刷新iframe
					iframeElement.src = iframeElement.src;
					break;
				case 1:
				case 2:
					// 更新并跳转至指定URL
					updateAndNavigate("https://cn.bing.com/");
					break;
				case 3:
					// 处理回车键事件
					handleEnterKey(event);
					break;
				case 4:
					// 更新并跳转至历史URL1
					updateAndNavigate(historyUrls[0]);
					break;
				case 5:
					// 更新并跳转至历史URL2
					updateAndNavigate(historyUrls[1]);
					break;
				case 6:
					// 获取新URL并更新跳转
					const newUrl = event.target.dataset.currentUrl;
					updateAndNavigate(newUrl);
					break;
				default:
					break;
			}
		}
	};

	/**
	 * 处理回车键事件，根据输入执行相应操作。
	 *
	 * @param {Event} event - 事件对象
	 * @returns {void} 无返回值
	 */
	const handleEnterKey = (event) => {
		// 如果按下的是回车键
		if (event.key === "Enter") {
			// 获取查询词
			let query = event.target.value;

			// 如果是有效的URL
			if (isValidURL(query)) {
				// 如果不是以"http"开头，则添加"https://"
				if (!query.startsWith("http")) {
					query = "https://" + query;
				}
			} else {
				// 如果不是有效URL，则使用Bing搜索引擎进行搜索
				query = "https://cn.bing.com//search?q=" + query;
			}

			// 将输入框的值设置为处理后的查询词
			event.target.value = query;

			// 更新并跳转至新URL
			updateAndNavigate(query);
		}
	};

	/**
	 * 更新URL并进行页面跳转。
	 *
	 * @param {string} newUrl - 新的URL
	 * @returns {void} 无返回值
	 */
	const updateAndNavigate = (newUrl) => {
		// 设置历史URL数组，包括当前URL和新URL
		setHistoryUrls([currentUrl, newUrl]);
		// 设置当前URL为新URL
		setCurrentUrl(newUrl);
		// 停止输入状态
		setIsTyping(false);
	};

	useEffect(() => {
		// 如果当前应用有设置当前URL
		if (app.currentUrl) {
			// 停止输入状态
			setIsTyping(false);
			// 设置当前URL为应用的当前URL
			setCurrentUrl(app.currentUrl);
			// 触发 app/setBrowserLink 动作
			dispatch({ type: "app/setBrowserLink" });
		}
	});

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-browser dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="Browser" float />
			<div className="scroll flex flex-col">
				<div className="over-tool flex">
					<Icon src={app.icon} width={14} margin="0 6px" />
					<div className="tab">
						<div>新建标签页</div>
						<Icon fafa="faTimes" payload="close" width={10} click={app.action} />
					</div>
				</div>
				<div className="wind-rest flex-grow flex flex-col">
					<div className="address-bar w-full h-10 flex items-center">
						<Icon className="address-navigate" src="left" payload={4} width={14} ui margin="0 8px" onClick={action} />
						<Icon className="address-navigate" src="right" payload={5} width={14} ui margin="0 8px" onClick={action} />
						<Icon fafa="faRedo" payload={0} width={14} margin="0 8px" onClick={action} />
						<Icon fafa="faHome" payload={1} width={18} margin="0 16px" onClick={action} />
						<div className="address-container relative flex items-center">
							<input
								className="w-full h-6 px-4"
								type="text"
								placeholder="搜索或输入 Web 地址"
								value={currentUrl}
								data-payload={3}
								onChange={typing}
								onKeyDown={action}
							/>
							<Icon className="z-1 handcr" src="bing" ui payload={2} width={14} margin="0 10px" onClick={action} />
						</div>
					</div>
					<div className="bookbar-bar w-full py-2">
						<div className="flex">
							{Object.keys(bookbars).map((mark, i) => {
								return (
									<div key={i} className="flex handcr items-center ml-2 mr-1 prtclk" data-payload={6} data-currentUrl={mark} onClick={action}>
										<Icon className="mr-1" ext width={16} src={bookbars[mark][0] != "\n" ? new URL(mark).origin + "/favicon.ico" : favicons[mark]} />
										<div className="text-xs">{bookbars[mark].trim()}</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className="site-container flex-grow overflow-hidden">
						<Lazy show={!app.hide}>
							<iframe id="site-iframe" src={!isTyping ? currentUrl : historyUrls[0]} frameborder="0" className="w-full h-full" title="site"></iframe>
						</Lazy>

						<div
							className={`bg-blue-100 w-64 rounded dpShad p-2 absolute bottom-0 right-0 my-4 mx-12 transition-all ${
								isError ? "opacity-100" : "opacity-0 pointer-events-none"
							}`}
						>
							<div
								className="absolute bg-red-400 m-1 text-red-900 text-xs px-1 font-bold handcr top-0 right-0 rounded hover:bg-red-500"
								onClick={failed}
							>
								x
							</div>
							<div className="text-gray-800 text-xs font-medium">
								如果它显示 <b>“拒绝连接”</b>，或者 <b>那个网站不允许 </b>
								其他网站显示他们的内容。 <b>我无法修复它</b>.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
