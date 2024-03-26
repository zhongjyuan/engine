import React from "react";
import { useSelector } from "react-redux";

import { isAbsolutePath } from "@/utils";

import "./background.scss";

/**
 * Background 组件负责渲染壁纸背景。
 */
export const Background = () => {
	// 使用 useSelector 获取 wallpaper 状态
	var wallpaper = useSelector((state) => state.wallpaper);

	/**
	 * 根据文件扩展名确定媒体类型。
	 * @param {string} src - 媒体文件的源 URL。
	 * @returns {string} - 媒体类型（image、video、unknown）。
	 */
	const mediaType = (src) => {
		var extension = src.split(".").pop();
		if (wallpaper.images.includes(extension)) {
			return "image";
		} else if (wallpaper.videos.includes(extension)) {
			return "video";
		} else {
			return "unknown";
		}
	};

	/**
	 * 根据媒体类型和路径渲染元素。
	 * @param {string} src - 资源路径。
	 * @param {string} defaultSrc - 默认资源路径。
	 */
	const render = (src, defaultSrc) => {
		// 确定媒体类型
		var fileType = mediaType(src);
		// 检查路径是否为绝对路径
		var isAbsolute = isAbsolutePath(src);

		// 默认源路径为壁纸源
		var srcPath = src;
		if (!isAbsolute) {
			// 根据媒体类型设置源路径
			srcPath = fileType === "video" ? `/static/video/wallpaper/${src}` : `/static/image/wallpaper/${src}`;
		}

		switch (fileType) {
			case "image":
				// 返回包含图片背景的 div 元素
				return <div className="background-screen" style={{ backgroundImage: `url(${srcPath})` }}></div>;
			case "video":
				// 返回包含视频播放器的 div 元素
				return (
					<div className="background-screen">
						<video autoPlay loop muted>
							<source src={`${srcPath}`} type="video/mp4" />
						</video>
					</div>
				);
			default:
				// 如果媒体类型不匹配且路径不是默认路径，则通过递归调用渲染默认路径
				if (src !== defaultSrc) {
					render(defaultSrc, defaultSrc);
				}
		}
	};

	// 返回渲染后的内容
	return render(wallpaper.src, wallpaper.default);
};
