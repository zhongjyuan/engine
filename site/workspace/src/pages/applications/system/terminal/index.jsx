import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import i18next from "i18next";

import { ToolBar } from "@/components/global";

import login from "./login";
import dirs from "../Assets/dir.json";

import { fetchIPDetails, getColorCode } from "./helper";

export const TerminalWind = () => {
	const dispatch = useDispatch();

	const app = useSelector((state) => state.apps.terminal);

	const [stack, setStack] = useState(["Microsoft Windows [版本 10.0.22000.51]", ""]);

	const [lastCmd, setLsc] = useState(0);
	const [wntitle, setWntitle] = useState("命令提示符");
	const [pwd, setPwd] = useState("C:\\Users\\ZHONGJYUAN");

	let IpDetails = [];

	const dirFolders = (fileName = "") => {
		var targetDir = { ...dirs },
			currentPath = pwd == "C:\\" ? [] : pwd.replace("C:\\", "").split("\\");

		if (pwd != "C:\\") {
			for (var i = 0; i < currentPath.length; i++) {
				targetDir = targetDir[currentPath[i]];
			}
		}

		if (fileName) {
			return targetDir[fileName] || {};
		} else {
			return Object.keys(targetDir);
		}
	};

	const commands = {
		echo: async (args, stacks, {}) => {
			args.length ? stacks.push(args) : stacks.push("ECHO 处于打开状态。");
		},
		eval: async (args, stacks, {}) => {
			args.length ? stacks.push(eval(args).toString()) : null;
		},
		python: async (args, stacks, {}) => {
			if (args.length) {
				if (window.pythonRunner) {
					await window.pythonRunner.runCode(args);
					if (window.pythonResult) {
						window.pythonResult.split("\n").forEach((result) => {
							if (result.trim().length) stacks.push(result);
						});
					}
				}
			}
		},
		cd: async (args, stacks, { pwd, setPwd, dirFolders }) => {
			if (args.length) {
				var errorFound = true;
				var currentPathSegments = pwd == "C:\\" ? [] : pwd.replace("C:\\", "").split("\\");

				if (args == ".") {
					errorFound = false;
				} else if (args == "..") {
					errorFound = false;
					currentPathSegments.pop();
					setPwd("C:\\" + currentPathSegments.join("\\"));
				} else if (!args.includes(".")) {
					var allFolders = dirFolders();

					for (var i = 0; i < allFolders.length; i++) {
						if (args.toLowerCase() == allFolders[i].toLowerCase() && errp) {
							errorFound = false;
							currentPathSegments.push(allFolders[i]);
							setPwd("C:\\" + currentPathSegments.join("\\"));
							break;
						}
					}
				} else {
					errorFound = false;
					stacks.push("目录名称无效。");
				}

				if (errorFound) {
					stacks.push("系统找不到指定的路径。");
				}
			} else {
				stacks.push(pwd);
			}
		},
		dir: async (args, stacks, { pwd, dirFolders }) => {
			stacks.push(" Directory of " + pwd);
			stacks.push("");
			stacks.push("<DIR>    .");
			stacks.push("<DIR>    ..");

			var allFolders = dirFolders();
			for (var i = 0; i < allFolders.length; i++) {
				if (!allFolders[i].includes(".")) {
					stacks.push("<DIR>..." + allFolders[i]);
				} else {
					stacks.push("FILE...." + allFolders[i]);
				}
			}
		},
		cls: async (args, stacks, {}) => {
			stacks = [];
		},
		color: async (args, stacks, { elementId, getColorCode }) => {
			let color = "#FFFFFF";
			let background = "#000000";
			let re = /^[A-Fa-f0-9]+$/g;

			if (!args || (args.length < 3 && re.test(args))) {
				if (args.length == 2) {
					color = getColorCode(args[1]);
					background = getColorCode(args[0]);
				} else if (args.length == 1) {
					color = getColorCode(args[0]);
				}

				//set background color of the element id cmdCont
				var cmd = document.getElementById(elementId);
				cmd.style.backgroundColor = background;

				//set color of text of .cmd-line class
				cmd.style.color = color;
			} else {
				stacks.push("设置默认的控制台前景和背景颜色。");
				stacks.push("COLOR [arg]");
				stacks.push("arg\t\t指定控制台输出的颜色属性。");
				stacks.push("颜色属性由两个十六进制数字指定 -- 第一个", "对应于背景，第二个对应于前景。每个数字", "可以为以下任何值:");
				stacks.push("0\t\t黑色");
				stacks.push("1\t\t蓝色");
				stacks.push("2\t\t绿色");
				stacks.push("3\t\t浅绿色");
				stacks.push("4\t\t红色");
				stacks.push("5\t\t洋红色");
				stacks.push("6\t\t灰色");
				stacks.push("7\t\t亮灰色");
				stacks.push("8\t\t灰色");
				stacks.push("9\t\t淡蓝色");
				stacks.push("A\t\t淡绿色");
				stacks.push("B\t\t淡浅绿色");
				stacks.push("C\t\t淡红色");
				stacks.push("D\t\t浅洋红");
				stacks.push("E\t\t淡黄色");
				stacks.push("F\t\t亮白色");
				stacks.push(
					"如果没有给定任何参数，此命令会将颜色还原到 CMD.EXE 启动时",
					"的颜色。这个值来自当前控制台",
					"窗口、/T 命令行开关或 DefaultColor 注册表",
					"值。",
					"",
					"如果尝试使用相同的",
					"前景和背景颜色来执行",
					"COLOR 命令，COLOR 命令会将 ERRORLEVEL 设置为 1。",
					"",
					'示例: /"COLOR fc" 在亮白色上产生淡红色'
				);
			}
		},
		type: async (args, stacks, { dirFolders }) => {
			var errorFound = true;

			if (args.includes(".")) {
				var allFolders = dirFolders();

				for (var i = 0; i < allFolders.length; i++) {
					if (args.toLowerCase() == allFolders[i].toLowerCase() && errp) {
						errorFound = false;

						var file = dirFolders(allFolders[i]);

						var content = file.content || "";
						content = content.split("\n");
						for (var i = 0; i < content.length; i++) {
							stacks.push(content[i]);
						}
						break;
					}
				}
			}

			if (errorFound) {
				stacks.push("系统找不到指定的文件。");
			}
		},
		start: async (args, stacks, { dispatch }) => {
			dispatch({ type: "EDGELINK", payload: args });
		},
		date: async (args, stacks, {}) => {
			stacks.push("The current date is: " + new Date().toLocaleDateString());
		},
		time: async (args, stacks, {}) => {
			const currentTime = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/:/g, "."); // 使用正则表达式替换所有冒号为点号
			const randomNum = Math.floor(Math.random() * 100);
			stacks.push("The current time is: " + currentTime + "." + randomNum);
		},
		exit: async (args, stacks, { dispatch, app }) => {
			stacks = ["Microsoft Windows [版本 10.0.22000.51]", ""];
			dispatch({ type: app.action, payload: "close" });
		},
		title: async (args, stacks, { setWntitle }) => {
			setWntitle(args.length ? args : "命令提示符");
		},
		hostname: async (args, stacks, {}) => {
			stacks.push("zhongjyuan");
		},
		login: async (args, stacks, {}) => {
			stacks.push("started login");
		},
		lang: async (args, stacks, { i18next }) => {
			i18next.changeLanguage(args);
			stacks.push("change language");
		},
		ver: async (args, stacks, {}) => {
			stacks.push("Microsoft Windows [版本 10.0.22000.51]");
		},
		systeminfo: async (args, stacks, {}) => {
			var dvInfo = [
				"主机名:               ZHONGJYUAN",
				"OS 名称:              Microsoft Windows 11 专业版",
				"OS 版本:              10.0.22621 暂缺 Build 22621",
				"OS 制造商:            Microsoft Corporation",
				"OS 配置:              独立工作站",
				"OS 构建类型:           Multiprocessor Free",
				"注册的所有人:          zhongjyuan",
				"注册的组织:            暂缺",
				"产品 ID:              7H1S1-5AP1R-473DV-3R5I0N",
			];

			for (var i = 0; i < dvInfo.length; i++) {
				stacks.push(dvInfo[i]);
			}
		},
		help: async (args, stacks, {}) => {
			var helpArr = [
				"有关某个命令的详细信息，请键入 HELP 命令名",
				"CD             显示当前目录的名称或将其更改。",
				"CLS            清除屏幕。",
				"COLOR		  设置默认控制台前景和背景颜色。",
				"DATE           显示或设置日期。",
				"DIR            显示一个目录中的文件和子目录。",
				"ECHO           显示消息，或将命令回显打开或关闭。",
				"EXIT           退出 CMD.EXE 程序(命令解释程序)。",
				"HELP           提供 Windows 命令的帮助信息。",
				"START          启动单独的窗口以运行指定的程序或命令。",
				"SYSTEMINFO     显示计算机的特定属性和配置。",
				"TIME           显示或设置系统时间。",
				"TITLE          设置 CMD.EXE 会话的窗口标题。",
				"TYPE           显示文本文件的内容。",
				"VER            显示 Windows 的版本。",
				"PYTHON         执行 PYTHON 编程。",
				"EVAL           运行 JavaScript 语句",
				"",
				"有关工具的详细信息，请参阅联机帮助中的命令行参考。",
			];

			for (var i = 0; i < helpArr.length; i++) {
				stacks.push(helpArr[i]);
			}
		},
		ipconfig: async (args, stacks, { IpDetails }) => {
			for (var i = 0; i < IpDetails.length; i++) {
				tmpStack.push("Windows IP 配置");
				tmpStack.push("");
				tmpStack.push("IPv6: " + IpDetails[i].ip);
				tmpStack.push("网络: " + IpDetails[i].network);
				tmpStack.push("城市: " + IpDetails[i].city);
				tmpStack.push("ISP: " + IpDetails[i].org);
				tmpStack.push("区域: " + IpDetails[i].region);
			}
		},
		default: async (args, stacks, {}) => {
			stacks.push(`'${type}' 不是内部或外部命令，也不是可运行的程序`);
			stacks.push("或批处理文件。");
			stacks.push("");
			stacks.push('输入 "help" 以获取可用命令');
		},
	};

	const cmdTool = async (cmd) => {
		var tmpStack = [...stack];
		tmpStack.push(`${pwd}>${cmd}`);

		var [type, ...args] = cmd.trim().toLowerCase().split(" ");
		var arg = args.join(" ").trim();

		var command = commands[type] || commands["default"];
		if (command) {
			await command(arg, tmpStack, { elementId: "cmd", dispatch, i18next, app, pwd, setPwd, setWntitle, dirFolders, getColorCode, IpDetails });
		}

		if (type.length > 0) tmpStack.push("");
		setStack(tmpStack);
	};

	const actions = {
		hover: (event, stacks, { cmdElement, lineElement }) => {
			var crlineElement = lineElement.parentNode;
			if (crlineElement && cmdElement) {
				cmdElement.scrollTop = crlineElement.offsetTop;
			}
			lineElement.focus();
		},
		enter: (event, stacks, { lineElement, lastCmd, setLsc, cmdTool, dirFolders }) => {
			if (event.key == "Enter") {
				event.preventDefault();

				var cmd = event.target.innerText.trim();
				event.target.innerText = "";

				setLsc(stacks.length + 1);

				cmdTool(cmd);
			} else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
				event.preventDefault();

				let step = Number(event.key === "ArrowUp") ? -1 : 1;
				let i = lastCmd + step;

				while (i >= 0 && i < stacks.length) {
					if (stacks[i].startsWith("C:\\") && stacks[i].includes(">")) {
						const [_, currentCmd] = stacks[i].split(">");
						event.target.innerText = currentCmd || "";
						setLsc(i);
						break;
					}

					i += [1, -1][Number(event.key == "ArrowUp")];
				}

				lineElement.focus();
			} else if (event.key == "Tab") {
				event.preventDefault();

				const cmd = event.target.innerText.trim();
				const [command, ...args] = cmd.split(" ");
				const arg = args.join(" ");

				const allFolders = dirFolders();
				for (let folder of allFolders) {
					if (arg.length && folder.toLowerCase().startsWith(arg.toLowerCase())) {
						event.target.innerText = `${command} ${folder}`;
						break;
					}
				}
			}
		},
	};

	const clickDispatch = (event) => {
		var cmdElement = document.getElementById("cmd");
		var lineElement = document.getElementById("cmd-input");
		var type = event.target.dataset.action;

		if (lineElement) {
			var action = actions[type];
			if (action) {
				action(event, stack, { cmdElement, lineElement, lastCmd, setLsc, cmdTool, dirFolders });
			}
			lineElement.focus();
		}
	};

	useEffect(() => {
		IpDetails = fetchIPDetails();

		if (app.dir && app.dir != pwd) {
			setPwd(app.dir);
			dispatch({ type: "OPENTERM", payload: null });
		}
	});

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-terminal dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-hide={app.hide}
			data-size={app.size}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name={wntitle} invert bg="#060606" />
			<div className="screen flex" data-dock="true">
				<div className="wind-rest h-full flex-grow text-gray-100">
					<div
						id="cmd"
						className="terminal-cmd w-full box-border overflow-y-scroll scroll prtclk"
						data-action="hover"
						onClick={clickDispatch}
						onMouseOver={clickDispatch}
					>
						<div className="w-full h-max pb-12">
							{stack.map((x, i) => (
								<pre key={i} className="terminal-cmd-line">
									{x}
								</pre>
							))}
							<div className="terminal-cmd-line terminal-cmd-action">
								{pwd}&gt;
								<div
									id="cmd-input"
									className="terminal-cmd-input"
									contentEditable
									data-action="enter"
									onKeyDown={clickDispatch}
									spellCheck="false"
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
