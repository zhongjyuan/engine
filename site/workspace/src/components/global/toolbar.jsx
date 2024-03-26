// 引入React及其钩子函数
import React, { useState } from "react";

// 引入react-redux中的useSelector和useDispatch钩子
import { useDispatch } from "react-redux";

import { Icon, Snap } from ".";

import "./toolbar.scss";

/**
 * ToolBar组件(窗口上方工具栏)
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} ToolBar组件的JSX元素
 */
export const ToolBar = (props) => {
	// 使用React Hooks中的useState和useDispatch
	var dispatch = useDispatch();

	var [snap, setSnap] = useState(false);

	/**
	 * 打开快照
	 */
	const openSnap = () => {
		setSnap(true);
	};

	/**
	 * 关闭快照
	 */
	const closeSnap = () => {
		setSnap(false);
	};

	/**
	 * 工具点击处理
	 */
	const toolClick = () => {
		dispatch({
			type: props.app,
			payload: "front",
		});
	};

	// 定义变量
	var op = 0, // 操作类型
		vector = [0, 0], // 向量
		appWindow = {}, // 窗口应用
		positionMouse = [0, 0], // 鼠标位置
		positionPrevious = [0, 0], // 上一个位置
		dimensionPrevious = [0, 0]; // 上一个尺寸

	/**
	 * 设置元素的尺寸
	 * @param {number} height - 元素的高度
	 * @param {number} width - 元素的宽度
	 */
	const setElementSize = (height, width) => {
		appWindow.style.width = width + "px";
		appWindow.style.height = height + "px";
	};

	/**
	 * 设置元素的位置
	 * @param {number} topPos - 元素的top值
	 * @param {number} leftPos - 元素的left值
	 */
	const setElementPosition = (topPos, leftPos) => {
		appWindow.style.top = topPos + "px";
		appWindow.style.left = leftPos + "px";
	};

	/**
	 * 处理元素拖动事件
	 * @param {Event} event - 事件对象
	 */
	const handleElementDrag = (event) => {
		// 兼容处理事件对象
		event = event || window.event;
		// 阻止默认事件
		event.preventDefault();

		// 计算新的 Y 轴位置
		var newPositionY = positionPrevious[0] + event.clientY - positionMouse[0];
		// 计算新的 X 轴位置
		var newPositionX = positionPrevious[1] + event.clientX - positionMouse[1];

		// 计算新的宽度
		var newWidth = dimensionPrevious[1] + vector[1] * (event.clientX - positionMouse[1]);
		// 计算新的高度
		var newHeight = dimensionPrevious[0] + vector[0] * (event.clientY - positionMouse[0]);

		// 判断操作类型
		if (op === 0) {
			// 如果是移动操作，则设置新的位置
			setElementPosition(newPositionY, newPositionX);
		} else {
			// 如果是调整大小操作
			// 确保宽度和高度不小于 320
			newWidth = Math.max(newWidth, 320);
			newHeight = Math.max(newHeight, 320);

			// 根据向量方向调整位置
			newPositionY = positionPrevious[0] + Math.min(vector[0], 0) * (newHeight - dimensionPrevious[0]);
			newPositionX = positionPrevious[1] + Math.min(vector[1], 0) * (newWidth - dimensionPrevious[1]);

			// 设置新的大小和位置
			setElementSize(newHeight, newWidth);
			setElementPosition(newPositionY, newPositionX);
		}
	};

	/**
	 * 结束元素拖动操作
	 */
	const endElementDrag = () => {
		// 清除鼠标事件监听
		document.onmouseup = null;
		document.onmousemove = null;

		// 移除窗口样式类名
		appWindow.classList.remove("z9900");
		appWindow.classList.remove("notrans");

		// 构建 action 对象
		var action = {
			type: props.app, // 根据 props 中的应用类型确定操作类型
			payload: "resize", // 操作载荷为调整大小
			dimensions: {
				width: getComputedStyle(appWindow).width, // 获取窗口的实际宽度
				height: getComputedStyle(appWindow).height, // 获取窗口的实际高度
				top: getComputedStyle(appWindow).top, // 获取窗口的实际 top 值
				left: getComputedStyle(appWindow).left, // 获取窗口的实际 left 值
			},
		};

		// 分发 action
		dispatch(action);
	};

	/**
	 * 拖动工具函数，处理拖动事件并更新元素位置
	 * @param {Event} event - 事件对象
	 */
	const drag = (event) => {
		// 若未传入事件对象，则使用全局事件对象
		event = event || window.event;
		// 阻止默认事件行为
		event.preventDefault();

		// 记录鼠标当前位置
		positionMouse = [event.clientY, event.clientX];

		// 获取操作类型
		op = event.currentTarget.dataset.op;

		// 根据操作类型确定窗口应用的父级元素
		if (op == 0) {
			appWindow = event.currentTarget.parentElement && event.currentTarget.parentElement.parentElement;
		} else {
			// 解析移动向量
			vector = event.currentTarget.dataset.vector.split(",");
			appWindow =
				event.currentTarget.parentElement &&
				event.currentTarget.parentElement.parentElement &&
				event.currentTarget.parentElement.parentElement.parentElement;
		}

		// 如果存在窗口应用，则设置相关样式和位置信息
		if (appWindow) {
			appWindow.classList.add("z9900");
			appWindow.classList.add("notrans");
			// 记录窗口应用的位置
			positionPrevious = [appWindow.offsetTop, appWindow.offsetLeft];
			// 记录窗口应用的尺寸
			dimensionPrevious = [
				parseFloat(getComputedStyle(appWindow).height.replaceAll("px", "")),
				parseFloat(getComputedStyle(appWindow).width.replaceAll("px", "")),
			];
		}

		// 监听鼠标松开事件，调用关闭拖动函数
		document.onmouseup = endElementDrag;

		// 监听鼠标移动事件，调用元素拖动函数
		document.onmousemove = handleElementDrag;
	};

	// 返回JSX元素
	return (
		<>
			{/* 工具栏 */}
			<div className="tool-bar" data-float={props.float != null} data-noinvert={props.noinvert != null} style={{ background: props.bg }}>
				{/* 信息区域 */}
				<div
					className="tool-bar-info flex flex-grow items-center"
					data-float={props.float != null}
					onClick={toolClick}
					onMouseDown={drag}
					data-op="0"
				>
					<Icon src={props.icon} width={14} />
					<div className="tool-bar-info-name text-xss" data-white={props.invert != null}>
						{props.name}
					</div>
				</div>
				{/* 操作按钮区域 */}
				<div className="tool-bar-btns flex items-center">
					{/* 最小化 */}
					<Icon invert={props.invert} click={props.app} payload="mnmz" pr src="minimize" ui width={12} />
					{/* 最大化 */}
					<div className="tool-bar-snapbox h-full" data-hv={snap} onMouseOver={openSnap} onMouseLeave={closeSnap}>
						<Icon invert={props.invert} click={props.app} ui pr width={12} payload="mxmz" src={props.size == "full" ? "maximize" : "maxmin"} />
						<Snap invert={props.invert} app={props.app} snap={snap} closeSnap={closeSnap} />
					</div>
					{/* 关闭 */}
					<Icon className="tool-bar-close-btn" invert={props.invert} click={props.app} payload="close" pr src="close" ui width={14} />
				</div>
			</div>
			{/* 左上角调整大小 */}
			<div className="tool-bar-resize tool-bar-resize-top">
				<div className="flex">
					<div className="cursor-nw-resize tool-bar-resize-conrsz" data-op="1" onMouseDown={drag} data-vector="-1,-1"></div>
					<div className="cursor-n-resize tool-bar-resize-edgrsz tool-bar-resize-wdws" data-op="1" onMouseDown={drag} data-vector="-1,0"></div>
				</div>
			</div>
			{/* 左边调整大小 */}
			<div className="tool-bar-resize tool-bar-resize-left">
				<div className="h-full">
					<div className="cursor-w-resize tool-bar-resize-edgrsz tool-bar-resize-hdws" data-op="1" onMouseDown={drag} data-vector="0,-1"></div>
				</div>
			</div>
			{/* 右边调整大小 */}
			<div className="tool-bar-resize tool-bar-resize-right">
				<div className="h-full">
					<div className="cursor-w-resize tool-bar-resize-edgrsz tool-bar-resize-hdws" data-op="1" onMouseDown={drag} data-vector="0,1"></div>
				</div>
			</div>
			{/* 底部调整大小 */}
			<div className="tool-bar-resize tool-bar-resize-bottom">
				<div className="flex">
					<div className="cursor-ne-resize tool-bar-resize-conrsz" data-op="1" onMouseDown={drag} data-vector="1,-1"></div>
					<div className="cursor-n-resize tool-bar-resize-edgrsz tool-bar-resize-wdws" data-op="1" onMouseDown={drag} data-vector="1,0"></div>
					<div className="cursor-nw-resize tool-bar-resize-conrsz" data-op="1" onMouseDown={drag} data-vector="1,1"></div>
				</div>
			</div>
		</>
	);
};
