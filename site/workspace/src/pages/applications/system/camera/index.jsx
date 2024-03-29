import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Icon, ToolBar } from "@/components/global";
/**
 * 相机风格组件，用于展示相机界面并实现拍照功能
 */
export const CameraWind = () => {
	// 使用国际化翻译钩子
	const { t } = useTranslation();

	// 定义状态
	const [stream, setStream] = useState(null);

	// 从 Redux store 中获取相机应用的状态
	const app = useSelector((state) => state.apps.camera);
	const hide = useSelector((state) => state.apps.camera.hide);

	// 拍照函数
	const capture = () => {
		var video = document.querySelector("video");
		var canvas = document.querySelector("canvas");

		canvas.width = video.videoWidth; // 设置画布宽度为视频宽度
		canvas.height = video.videoHeight; // 设置画布高度为视频高度

		var df = video.videoWidth - video.videoHeight; // 计算宽高差

		// 在画布上绘制图像
		canvas.getContext("2d").drawImage(video, -df / 2, 0, video.videoWidth + df, video.videoHeight);
	};

	// 组件挂载时处理相机流
	useEffect(() => {
		if (!app.hide) {
			var video = document.getElementById("camera-video");

			video.setAttribute("playsinline", "");
			video.setAttribute("autoplay", "");
			video.setAttribute("muted", "");

			var constraints = {
				audio: false,
				video: true,
			};

			// 获取用户媒体流
			navigator.mediaDevices.getUserMedia(constraints).then((dstream) => {
				setStream(dstream); // 设置媒体流
				console.log(dstream);
				video.srcObject = dstream; // 将媒体流赋给视频元素
			});
		} else {
			if (stream != null) stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
	}, [hide]);

	// 渲染相机组件
	return (
		<div
			id={app.icon + "App"}
			className="wind wind-camera dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			{/* 工具栏 */}
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="相机" invert bg="#060606" />
			<div className="scroll flex flex-col" data-dock="true">
				<div className="wind-rest flex-grow flex flex-col">
					<div className="camera-container">
						<div className="camera-ctrl">
							{/* 拍照按钮 */}
							<div className="camera-icon" title={t("camera.take-photo")} onClick={capture}>
								<Icon icon="camera" />
							</div>
							<canvas id="camera-canvas"></canvas>
						</div>
						<div className="video-container">
							<div className="video-wrapper">
								<video id="camera-video"></video>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
