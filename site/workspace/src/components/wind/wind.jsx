import React from "react";
import { useSelector } from "react-redux";

import { ToolBar } from "@/components/global";

export const Wind = (props) => {
	const app = useSelector((state) => state.apps[props.icon]);
	if (!app) return null;

	var data = app.data;

	return app.hide ? null : (
		<div
			id={app.icon + "App"}
			className={"wind dpShad " + (data.invert != true ? "wind-light" : "wind-dark")}
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-hide={app.hide}
			data-size={app.size}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name={app.name} invert={data.invert == true ? true : null} noinvert />
			<div className="wind-screen flex flex-col" data-dock="true">
				<div className="wind-rest flex-grow flex flex-col">
					<div className="flex-grow overflow-hidden">
						<iframe src={data.url} allow="camera;microphone" className="w-full h-full" frameborder="0"></iframe>
					</div>
				</div>
			</div>
		</div>
	);
};
