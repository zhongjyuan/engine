import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Battery from "@/components/battery";
import { Icon, Image } from "@/components/global";

import "./locksreen.scss";

/**
 * 锁屏组件
 * @param {Object} props - 组件属性
 * @param {number} props.dir - 方向参数，-1表示淡出
 */
export const LockScreen = (props) => {
	// 获取 dispatch 方法
	var dispatch = useDispatch();

	// 获取全局状态中的 wallpaper 和 person 数据
	var wallpaper = useSelector((state) => state.wallpaper);
	var person = useSelector((state) => state.setting.person);

	// 定义状态变量
	var [lock, setLock] = useState(false); // 锁定状态
	var [unlocked, setUnLock] = useState(false); // 解锁状态

	var [password, setPassword] = useState(""); // 密码
	var [passwordType, setPasswordType] = useState(1); // 密码类型，0表示PIN，1表示密码
	var [forgotPassword, setForgotPassword] = useState(false); // 是否忘记密码

	/**
	 * 处理屏幕点击事件
	 * @param {Event} event - 点击事件对象
	 */
	const clickDispatch = (event) => {
		// 获取点击事件的 action 和 payload
		var slice = event.target.dataset.slice;
		var action = event.target.dataset.action;
		var payload = event.target.dataset.payload;

		// 根据不同的 action 进行相应处理
		switch (action) {
			case "inpassword":
				// 如果是输入密码
				var val = event.target.value;
				if (!passwordType) {
					// 如果是 PIN 类型密码，则限制密码长度为4
					setPassword(val.substring(0, 4));
				} else {
					// 如果是普通密码类型，则直接设置密码
					setPassword(val);
				}
				break;
			case "forgotPassword":
				// 如果是忘记密码
				setForgotPassword(true);
				break;
			case "splash":
				// 如果是闪屏
				setLock(true);
				break;
			case "pinlock":
				// 如果是选择 PIN 锁
				setPasswordType(0);
				setPassword(""); // 重置密码
				break;
			case "passkey":
				// 如果是选择密码锁
				setPasswordType(1);
				setPassword(""); // 重置密码
				break;
			default:
				break;
		}
	};

	/**
	 * 处理登录按钮点击事件
	 */
	const loginClick = () => {
		setUnLock(true);
		setTimeout(() => {
			dispatch({ type: "wallpaper/unlock" });
		}, 1000);
	};

	/**
	 * 处理密码输入框按键事件
	 * @param {Event} event - 键盘事件对象
	 */
	const passwordKeyDown = (event) => {
		if (event.key == "Enter") loginClick();
	};

	return (
		<div
			className={"lock-screen " + (props.dir == -1 ? "slow-fadein" : "")}
			style={{ backgroundImage: `url(${wallpaper.locksrc})` }}
			data-blur={lock}
			data-slice="background"
			data-action="splash"
			data-unlock={unlocked}
			onClick={clickDispatch}
		>
			<div className="splash-screen mt-40" data-faded={lock}>
				<div className="text-6xl font-semibold text-gray-100">
					{new Date().toLocaleTimeString("zh-CN", { hour: "numeric", minute: "numeric", hour12: true })}
				</div>
				<div className="text-lg font-medium text-gray-200">
					{new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" })}
				</div>
			</div>
			<div className="fadein-screen" data-faded={!lock} data-unlock={unlocked}>
				<Image className="rounded-full overflow-hidden" src={person.avatar} w={200} dir="/" />
				<div className="mt-2 text-2xl font-medium text-gray-200">{person.name}</div>
				<div className="login-btn flex items-center mt-6" onClick={loginClick}>
					登录
				</div>
				{/* <div>
					<input
						type={passwordType ? "text" : "password"}
						placeholder={passwordType ? "Password" : "PIN"}
						value={password}
						data-slice="background"
						data-action="inpassword"
						onChange={clickDispatch}
						onKeyDown={passwordKeyDown}
					/>
					<Icon className="-ml-6 handcr" fafa="faArrowRight" width={14} color="rgba(170, 170, 170, 0.6)" onClick={loginClick} />
				</div>
				<div className="text-xs text-gray-400 mt-4 handcr" onClick={loginClick}>
					{!forgotPassword ? `I forgot my ${passwordType ? "password" : "pin"}` : "Not my problem"}
				</div>
				<div className="text-xs text-gray-400 mt-6">Sign-in options</div>
				<div className="sign-option flex">
					<Icon src="pinlock" ui width={36} payload={passwordType == 0} click="pinlock" onClick={clickDispatch} />
					<Icon src="passkey" ui width={36} payload={passwordType == 1} click="passkey" onClick={clickDispatch} />
				</div> */}
			</div>
			<div className="bottom-screen flex">
				<Icon className="mx-2" src="wifi" ui width={16} invert />
				<Battery invert />
			</div>
		</div>
	);
};
