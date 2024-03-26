// 引入React及其钩子函数
import React from "react";

// 引入react-lazy-load-image-component中的LazyLoadImage组件，用于实现延迟加载图片
import { LazyLoadImage } from "react-lazy-load-image-component";

import { clickDispatch } from "@/actions";

import "./image.scss";

/**
 * 图片组件，用于显示图片
 * @param {object} props - 组件属性
 * @returns {JSX.Element} - 返回包含图片的 JSX 元素
 */
export const Image = (props) => {
	// 根据 props 设置图片路径
	var src = `static/image/${(props.dir ? props.dir + "/" : "") + props.src}.png`;
	if (props.ext != null) {
		src = props.src;
	}

	/**
	 * 错误处理函数
	 * @param {Event} event - 事件对象
	 */
	const errorHandler = (event) => {
		if (props.err) {
			// 如果存在错误属性
			event.currentTarget.src = props.err; // 将当前元素的src属性设置为错误图片的路径
		}
	};

	/**
	 * 创建图片公共属性对象
	 * @param {string} src - 图片路径
	 * @param {object} props - 包含各种属性的对象
	 * @returns {object} 返回包含图片公共属性的对象
	 */
	const commonProps = {
		src: src, // 图片路径
		alt: props.alt, // 图片的alt属性
		width: props.w || props.h, // 图片宽度（优先取props.w，若不存在则取props.h）
		height: props.h || props.w, // 图片高度（优先取props.h，若不存在则取props.w）
		"data-var": props.var, // 变量数据
		"data-free": !!props.free, // 是否免费的布尔值转换
		loading: props.lazy ? "lazy" : null, // 根据props.lazy决定加载方式，懒加载或null
		onError: errorHandler, // 错误处理函数
	};

	/**
	 * 渲染图片组件
	 * @returns {JSX.Element|null} 返回图片组件或null
	 */
	const renderImage = () => {
		// 如果不是背景图片
		if (!props.back) {
			// 根据props.lazy决定返回懒加载图片组件或普通图片组件
			return props.lazy ? <LazyLoadImage {...commonProps} /> : <img {...commonProps} />;
		}

		return null; // 是背景图片则返回null
	};

	/**
	 * 渲染图片容器组件
	 * @returns {JSX.Element} 返回图片容器组件
	 */
	return (
		<div
			id={props.id} // 设置id属性
			className={`uimage prtclk ${props.className || ""}`} // 设置class属性，包括uimage和prtclk，以及props.className
			style={{ backgroundImage: props.back ? `url(${src})` : undefined }} // 根据props.back决定是否设置背景图片样式
			data-var={props.var} // 变量数据
			data-back={!!props.back} // 是否背景图片的布尔值转换
			data-slice={props.slice} // 切片数据
			data-action={props.click} // 点击动作
			data-payload={props.payload} // 数据负载
			onClick={props.onClick || (props.click && clickDispatch)} // 点击事件处理
		>
			{renderImage()} {/* 渲染图片组件 */}
		</div>
	);
};
