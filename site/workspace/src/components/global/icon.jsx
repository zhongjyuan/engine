// 引入React及其钩子函数
import React from "react";

// 引入react-redux中的useSelector和useDispatch钩子
import { useSelector, useDispatch } from "react-redux";

// 从@fortawesome/react-fontawesome中引入FontAwesomeIcon组件，用于展示Font Awesome图标
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 从@fortawesome/free-solid-svg-icons中引入所有的solid图标，用于使用Font Awesome的Solid风格图标
import * as FaSolidIcons from "@fortawesome/free-solid-svg-icons";

// 从@fortawesome/free-brands-svg-icons中引入所有的brands图标，用于使用Font Awesome的品牌图标
// import * as FaBrandsIcons from "@fortawesome/free-brands-svg-icons";

// 从@fortawesome/free-regular-svg-icons中引入所有的regular图标，用于使用Font Awesome的Regular风格图标
import * as FaRegularIcons from "@fortawesome/free-regular-svg-icons";

import * as CustomIcons from "@/components/icon";

import "./icon.scss";

/**
 * 图标组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} - 根据属性渲染不同类型图标的图标组件
 */
export const Icon = (props) => {
	// 获取 dispatch 方法用于向 Redux store 分发 action
	var dispatch = useDispatch();

	// 从 Redux store 中获取 侧边栏 状态
	var sidepane = useSelector((state) => state.sidepane);

	// 根据是否有 icon 属性来渲染自定义图标
	var isCustomIcon = props.icon != null;

	// 根据是否有 fafa 属性来渲染 FontAwesome 图标
	var isFontAwesomeIcon = props.fafa != null;

	// 根据 props 中的信息拼接图标的路径
	var src = `static/icon/${props.ui != null ? "ui/" : ""}${props.src}.png`;
	if (props.ext != null || (props.src && props.src.includes("http"))) {
		src = props.src;
	}

	// 根据是否有 onClick 或 pr 属性来设置 prtclk 样式
	var prtclk = "";
	if (props.src) {
		if (props.onClick != null || props.pr != null) {
			prtclk = "prtclk";
		}
	}

	/**
	 * 处理点击事件并触发相应的 action
	 * @param {Event} event - 点击事件对象
	 */
	const clickDispatch = (event) => {
		// 如果 sidepane 不允许隐藏，则触发 sidepane/bandHide action
		if (!sidepane.banhide) {
			dispatch({ type: "sidepane/bandHide" }); // 触发 sidepane/bandHide action
		}

		// 解构出事件目标的数据集中的 slice、action 和 payload
		var { slice, action, payload } = event.target.dataset;

		var type = action; // 将 action 设置为默认的 type
		if (slice) {
			// 如果存在 slice，则将 slice 和 action 拼接作为新的 type
			type = `${slice}/${action}`;
		}

		// 如果 type 存在，则调用 store.dispatch 发送包含 type 和 payload 的操作对象
		if (type) {
			dispatch({ type, payload }); // 调用 store.dispatch 发送操作对象
		}
	};

	/**
	 * 包含通用属性的 div 元素属性对象
	 * @type {Object}
	 * @property {string} "data-menu" - 菜单数据
	 * @property {string} "data-slice" - 切片数据
	 * @property {string} "data-action" - 点击动作数据
	 * @property {string} "data-payload" - 载荷数据
	 * @property {string} className - 类名
	 * @property {function} onClick - 点击事件处理函数
	 */
	const commonDivProps = {
		"data-menu": props.menu, // 菜单数据
		"data-slice": props.slice, // 切片数据
		"data-action": props.action, // 点击动作数据
		"data-payload": props.payload, // 载荷数据
		className: `uicon prtclk ${props.className || ""}`, // 类名
		onClick: props.onClick || (props.action && clickDispatch) || null, // 点击事件处理函数
	};

	/**
	 * 包含通用图标属性的对象
	 * @type {Object}
	 * @property {boolean} "data-flip" - 是否翻转
	 * @property {string} "data-invert" - 是否反转
	 * @property {string} "data-rounded" - 是否圆角
	 * @property {Object} style - 样式对象
	 * @property {string | number} style.width - 宽度
	 * @property {string | number} style.height - 高度
	 * @property {string} style.fill - 填充颜色
	 * @property {string} style.margin - 外边距
	 */
	const commonIconProps = {
		"data-flip": props.flip != null, // 是否翻转
		"data-invert": props.invert ? "true" : "false", // 是否反转
		"data-rounded": props.rounded ? "true" : "false", // 是否圆角
		style: {
			width: props.width, // 宽度
			height: props.height || props.width, // 高度，默认和宽度相同
			fill: props.color || null, // 填充颜色
			margin: props.margin || null, // 外边距
		},
	};

	/**
	 * 包含通用图片属性的对象
	 * @type {Object}
	 * @property {string} src - 图片地址
	 * @property {string} alt - 图片描述文本
	 * @property {number | string} width - 宽度
	 * @property {number | string} height - 高度
	 * @property {string} "data-slice" - 切片数据
	 * @property {string} "data-action" - 点击动作数据
	 * @property {string} "data-payload" - 载荷数据
	 * @property {boolean} "data-flip" - 是否翻转
	 * @property {boolean} "data-click" - 是否可点击
	 * @property {string} "data-invert" - 是否反转
	 * @property {string} "data-rounded" - 是否圆角
	 * @property {Object} style - 样式对象
	 * @property {string} style.margin - 外边距
	 */
	const commonImageProps = {
		src: src, // 图片地址
		alt: props.alt, // 图片描述文本
		width: props.width, // 宽度
		height: props.height, // 高度
		"data-slice": props.slice, // 切片数据
		"data-action": props.action, // 点击动作数据
		"data-payload": props.payload, // 载荷数据
		"data-flip": props.flip != null, // 是否翻转
		"data-click": props.action != null, // 是否可点击
		"data-invert": props.invert ? "true" : "false", // 是否反转
		"data-rounded": props.rounded ? "true" : "false", // 是否圆角
		style: { margin: props.margin || null }, // 外边距
	};

	/**
	 * 渲染FontAwesome图标组件
	 * @returns {JSX.Element} 返回FontAwesome图标组件
	 */
	const renderFontAwesomeIcon = () => (
		<div {...commonDivProps}>
			{/* 通用div属性 */}
			<FontAwesomeIcon
				{...commonIconProps} // 通用图标属性
				icon={props.reg ? FaRegularIcons[props.fafa] : FaSolidIcons[props.fafa]} // 图标
			/>
		</div>
	);

	/**
	 * 渲染自定义图标组件
	 * @returns {JSX.Element} 返回自定义图标组件
	 */
	const renderCustomIcon = () => {
		var CustomIcon = CustomIcons[props.icon]; // 获取自定义图标组件
		return (
			<div {...commonDivProps}>
				{/* 通用div属性 */}
				<CustomIcon {...commonIconProps} /> {/* 自定义图标 */}
			</div>
		);
	};

	/**
	 * 渲染图片图标组件
	 * @returns {JSX.Element} 返回图片图标组件
	 */
	const renderImageIcon = () => (
		<div
			data-pr={props.pr} // PR数据
			data-menu={props.menu} // 菜单数据
			data-open={props.open} // 是否打开
			data-slice={props.slice} // 切片数据
			data-action={props.action} // 点击动作数据
			data-active={props.active} // 是否激活
			data-payload={props.payload} // 载荷数据
			className={`uicon ${props.className || ""} ${prtclk}`} // 类名
			onClick={props.onClick || (props.pr && clickDispatch) || null} // 点击事件处理函数
		>
			{props.className === "tsIcon" ? ( // 如果类名为"tsIcon"
				<div
					data-slice={props.slice} // 切片数据
					data-action={props.action} // 点击动作数据
					data-payload={props.payload} // 载荷数据
					data-flip={props.flip != null} // 是否翻转
					data-click={props.action != null} // 是否可点击
					data-invert={props.invert ? "true" : "false"} // 是否反转
					data-rounded={props.rounded ? "true" : "false"} // 是否圆角
					style={{ width: props.width, height: props.width }} // 宽度和高度
					onClick={props.action != null ? clickDispatch : null} // 点击事件处理函数
				>
					<img {...commonImageProps} />
				</div>
			) : (
				<img
					{...commonImageProps}
					onClick={props.action ? clickDispatch : null} // 点击事件处理函数
				/>
			)}
		</div>
	);

	if (isFontAwesomeIcon) {
		return renderFontAwesomeIcon(); // 渲染 FontAwesome 图标, JSX 返回一个带有 FontAwesome 图标的 div 元素
	} else if (isCustomIcon) {
		return renderCustomIcon(); // 渲染自定义图标, JSX 返回一个带有自定义图标的 div 元素
	} else {
		return renderImageIcon(); // 渲染普通图片图标, JSX 返回一个带有普通图片图标的 div 元素
	}
};
