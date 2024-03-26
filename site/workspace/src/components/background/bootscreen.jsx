import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Image } from "@/components/global";

import "./bootscreen.scss";

/**
 * BootScreen组件用于显示启动屏幕
 *
 * @param {Object} props - 组件属性
 * @param {number} props.dir - 方向值
 */
export const BootScreen = (props) => {
	var dispatch = useDispatch();

	// 从Redux状态中获取setting和wallpaper信息
	var setting = useSelector((state) => state.setting);
	var wallpaper = useSelector((state) => state.wallpaper);

	// 控制黑屏状态的状态值
	var [blackout, setBlackOut] = useState(false);

	/**
	 * 监听props.dir变化的副作用函数
	 * 当props.dir小于0时，延迟一段时间后设置黑屏状态
	 */
	useEffect(() => {
		// 检查props.dir是否小于0
		if (props.dir < 0) {
			setTimeout(() => {
				setBlackOut(true); // 设置黑屏状态为true
			}, 4000); // 延迟4秒
		}
	}, [props.dir]); // 仅在props.dir发生改变时触发

	/**
	 * 监听blackout变化和wallpaper.act的副作用函数
	 * 当blackout为true且wallpaper.act为"restart"时，延迟一段时间后设置黑屏状态为false，并发送WALLBOOTED action
	 */
	useEffect(() => {
		// 检查props.dir是否小于0
		if (props.dir < 0) {
			// 检查blackout状态
			if (blackout) {
				// 检查wallpaper.act是否为"restart"
				if (wallpaper.act === "restart") {
					setTimeout(() => {
						setBlackOut(false); // 设置黑屏状态为false

						// 延迟一段时间后发送WALLBOOTED action
						setTimeout(() => {
							dispatch({ type: "wallpaper/boot" }); // 触发WALLBOOTED action
						}, 4000); // 延迟4秒
					}, 2000); // 延迟2秒
				}
			}
		}
	}, [blackout, wallpaper.act]); // 仅在blackout或wallpaper.act发生改变时触发

	return (
		<div className="boot-screen">
			<div className={blackout ? "hidden" : ""}>
				<Image src={setting.bootlogo} dir="/" w={180} />
				<div className="mt-48" id="loader">
					<svg className="progress" height={48} width={48} viewBox="0 0 16 16">
						<circle cx="8px" cy="8px" r="7px"></circle>
					</svg>
				</div>
			</div>
		</div>
	);
};
