import React, { useState } from "react";
import { useSelector } from "react-redux";

import { mark as Mark } from "@/components/icon";
import { Image, ToolBar } from "@/components/global";

import CanvasDraw from "@win11react/react-canvas-draw";

export const WhiteBoardWind = () => {
	const app = useSelector((state) => state.apps.board);

	const [color, setColor] = useState("#222222"); // 使用useState定义颜色state
	const [radius, setRadius] = useState(4); // 使用useState定义圆角半径state
	const [eraser, setEraser] = useState(false); // 使用useState定义橡皮擦状态state
	const [reset, setReset] = useState(false); // 使用useState定义重置状态state
	const [tools, setTools] = useState(["#222222", "#e92a2a", "#2a52e9", "#12c629", "#e9a21e", "#911ee9", "erazer", "reset"]); // 使用useState定义工具数组state，包括颜色选项、橡皮擦和重置功能

	const action = (event) => {
		var act = event.target.getAttribute("value");
		if (act == "erz") {
			setEraser(true);
		} else if (act == "rst") {
			setEraser(false);
			setColor("#222");
			setReset(true);
			setTimeout(() => {
				setReset(false);
			}, 50);
		} else {
			setEraser(false);
			setColor(act);
		}
	};

	return (
		<div
			id={app.icon + "App"}
			className=" wind wind-whiteboard dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-hide={app.hide}
			data-size={app.size}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="Whiteboard" bg="#f9f9f9" noinvert />
			<div className="screen flex flex-col" data-dock="true">
				<div className="wind-rest flex-grow flex flex-col">
					<div className="whiteboard-action-container">
						<div className="whiteboard-tool-container">
							{tools.map((tool, ind) => {
								if (tool == "erazer") {
									return (
										<div className="whiteboard-paint prtclk" key={ind} onClick={action} value="erz" data-active={eraser}>
											<Image src="icon/ui/marker" />
										</div>
									);
								} else if (tool == "reset") {
									return (
										<div className="whiteboard-paint prtclk" key={ind} onClick={action} value="rst">
											<Image src="icon/ui/dustbin" />
										</div>
									);
								} else {
									return (
										<div className="whiteboard-paint prtclk" key={ind} onClick={action} data-active={color == tool && !eraser} value={tool}>
											<Mark color={tool} />
										</div>
									);
								}
							})}
						</div>
					</div>
					<div className="whiteboard-canva-container">
						{!app.hide && !reset ? (
							<CanvasDraw
								id="drawingArea"
								brushColor={eraser ? "#fff" : color}
								hideInterface={!eraser}
								hideGrid={true}
								lazyRadius={0}
								catenaryColor="#aaa"
								brushRadius={eraser ? 48 : radius}
								canvasWidth={"100%"}
								canvasHeight={"100%"}
							/>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};
