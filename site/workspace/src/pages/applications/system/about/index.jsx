import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { setLocalStorage, getLocalStorageOrDefault } from "@/utils";

/**
 * AboutWind组件，显示关于信息
 */
export const AboutWind = () => {
	const dispatch = useDispatch(); // 获取dispatch函数
	const { t } = useTranslation(); // 获取i18n翻译函数

	const { aboutOpen } = useSelector((state) => state.desktop); // 从desktop状态中获取aboutOpen数据
	const { locked, booted } = useSelector((state) => state.wallpaper); // 从wallpaper状态中获取locked和booted数据
	const [open, setOpen] = useState(true && import.meta.env.MODE != "development"); // 定义open状态，默认为true，并根据开发模式判断是否打开
	const [timer, setTimer] = useState(getLocalStorageOrDefault("aboutOpen") == "true" ? 0 : 5); // 根据本地存储的aboutOpen值设置定时器初始值

	/**
	 * 处理点击事件
	 */
	const action = () => {
		setOpen(false); // 关闭弹窗
		setLocalStorage("aboutOpen", true); // 将aboutOpen存储到本地
		dispatch({ type: "desktop/aboutToggle", payload: false }); // 触发desktop/aboutToggle动作，关闭关于弹窗
	};

	useEffect(() => {
		// 如果定时器大于0且未锁定且已启动
		if (timer > 0 && !locked && booted) {
			setTimeout(() => {
				setTimer(timer - 1); // 定时器递减
			}, 1000);
		}
	}, [timer, locked, booted]);

	// 如果open为真或者aboutOpen为真则显示内容，否则返回null
	return open || aboutOpen ? (
		<div className="wind wind-about dpShad">
			<div className="content p-6">
				<div className="text-xl font-semibold">{t("about.title")}</div> // 显示关于标题
				<p>{t("about.opensource")}</p> // 显示开源信息
				<p>
					{t("about.licensed")}&nbsp;
					<a target="_blank" href="https://github.com/blueedgetechno/win11React/blob/master/LICENSE" rel="noreferrer">
						{t("about.Creative-Commons")}
					</a>
					.
				</p>
				<p className="pl-4">
					{t("about.contact")} :&nbsp;
					<a target="_blank" href="mailto:blue@win11react.com" rel="noreferrer">
						blue@win11react.com
					</a>
				</p>
				<p>{t("about.notmicrosoft")}</p>
				<p>
					{t("about.alsonot")}&nbsp;
					<a target="_blank" href="https://www.microsoft.com/en-in/windows-365" rel="noreferrer">
						Windows 365 cloud PC
					</a>
					.
				</p>
				<p>{t("about.microsoftcopywrite")}.</p>
			</div>
			<div className="submit-button px-6 py-4">
				<div data-allow={timer == 0} onClick={timer == 0 && action}>
					{t("about.understand")} {timer > 0 ? <span>{`( ${timer} )`}</span> : null}
				</div>
			</div>
		</div>
	) : null;
};
