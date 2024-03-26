// 引入React及其钩子函数
import React, { useState, useEffect } from "react";

// 引入react-redux中的useSelector和useDispatch钩子
import { useSelector, useDispatch } from "react-redux";

import "./snap.scss";

/**
 * Snap 组件用于展示快照屏幕(窗口最大化鼠标悬停展示)
 * @param {Object} props - 组件属性对象
 */
export const Snap = (props) => {
	var lays = useSelector((state) => state.global.lays); // 从Redux store中获取lays数据

	var dispatch = useDispatch(); // 获取Redux中的dispatch方法
	var [delay, setDelay] = useState(false); // 延迟状态，控制延迟显示

	/**
	 * 处理点击事件的函数
	 * @param {Event} event - 点击事件对象
	 */
	const clickDispatch = (event) => {
		// 解构出事件目标的数据集中的 slice、action 和 payload
		var { slice, action, payload, dim } = event.target.dataset;

		var type = action; // 将 action 设置为默认的 type
		if (slice) {
			// 如果存在 slice，则将 slice 和 action 拼接作为新的 type
			type = `${slice}/${action}`;
		}

		// 如果 type 存在，则调用 store.dispatch 发送包含 type 和 payload 的操作对象
		if (dim && type) {
			dispatch({ type, payload, dim: JSON.parse(dim) });

			props.closeSnap(); // 调用关闭快照函数
		}
	};

	// useEffect处理延迟逻辑
	useEffect(() => {
		var handleDelay = () => setDelay(props.snap);
		var timeout = setTimeout(handleDelay, delay ? 500 : 0);
		return () => clearTimeout(timeout);
	}, [delay, props.snap]);

	/**
	 * 渲染快照屏幕组件
	 * @returns {JSX.Element|null} 返回快照屏幕组件或null
	 */
	return props.snap || delay ? ( // 如果props.snap为真或delay存在，则渲染快照屏幕组件，否则返回null
		<div className="snap-screen mdShad" data-dark={props.invert != null}>
			{lays.map((x, i) => (
				<div key={i} className="snap-lay">
					{x.map((y, j) => (
						<div
							key={j}
							className="snap-per"
							style={{
								// 根据y.br设置圆角半径样式
								borderTopLeftRadius: (y.br % 2 === 0) * 4,
								borderTopRightRadius: (y.br % 3 === 0) * 4,
								borderBottomRightRadius: (y.br % 5 === 0) * 4,
								borderBottomLeftRadius: (y.br % 7 === 0) * 4,
							}}
							onClick={clickDispatch} // 点击事件处理
							data-dim={JSON.stringify(y.dim)} // 维度数据
							data-slice={props.slice} // 切片数据
							data-action={props.app} // 动作
							data-payload="resize" // 负载
						></div>
					))}
				</div>
			))}
		</div>
	) : null; // 结束渲染，返回null
};
