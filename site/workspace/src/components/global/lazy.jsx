// 引入React及其钩子函数
import React, { useState, useEffect } from "react";

import "./lazy.scss";

/**
 * Lazy组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.show - 控制是否显示子元素的布尔值
 * @param {JSX.Element} props.children - 子元素
 * @returns {JSX.Element} LazyComponent组件的JSX元素
 */
export const Lazy = ({ show, children }) => {
	// 定义状态变量loaded和对应的状态更新函数setLoad
	var [loaded, setLoad] = useState(false);

	// 当show发生变化时触发effect
	useEffect(() => {
		// 当show为true且loaded为false时，设置loaded为true
		if (show && !loaded) setLoad(true);
	}, [show]);

	// 根据show和loaded的状态决定是否渲染children
	return show || loaded ? <>{children}</> : null;
};
