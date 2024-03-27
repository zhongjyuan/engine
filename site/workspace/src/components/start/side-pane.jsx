import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { clickDispatch } from "@/actions";
import { getPropertyValue } from "@/utils";

import { Icon } from "@/components/global";
import Battery from "@/components/battery";

import "./side-pane.scss";

/**
 * 侧边栏面板组件(工具盒子)
 * @returns {JSX.Element} - 返回侧边栏面板组件的 JSX 元素
 */
export const SidePane = () => {
	var dispatch = useDispatch();

	var setting = useSelector((state) => state.setting);
	var taskbar = useSelector((state) => state.taskbar);
	var sidepane = useSelector((state) => state.sidepane);

	var [pnstates, setPnstate] = useState([]);

	// 获取亮度滑块元素
	var vSlider = document.querySelector(".vSlider");
	// 获取声音滑块元素
	var bSlider = document.querySelector(".bSlider");

	// 设置滑块背景
	const sliderBackground = (elem, e) => {
		elem.style.setProperty("--track-color", `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`);
	};

	// 设置亮度值
	const setBrightnessValue = (brgt) => {
		document.getElementById("bright-overlay").style.opacity = (100 - brgt) / 100;
		dispatch({
			type: "setting/set",
			payload: {
				path: "system.display.brightness",
				value: brgt,
			},
		});
		sliderBackground(bSlider, brgt);
	};

	// 设置音量
	const setVolume = (event) => {
		var aud = 3;

		if (event.target.value < 70) aud = 2;
		if (event.target.value < 30) aud = 1;
		if (event.target.value == 0) aud = 0;

		dispatch({ type: "taskbar/setAudio", payload: aud });

		sliderBackground(vSlider, event.target.value);
	};

	// 设置亮度
	const setBrightness = (event) => {
		var brgt = document.getElementById("brightness-slider").value;
		if (!event) {
			// 电池节省模式
			var state = setting.system.power.saver.state;
			var factor = !state ? 0.7 : 100 / 70;
			var newBrgt = brgt * factor;

			setBrightnessValue(newBrgt);

			document.getElementById("brightness-slider").value = newBrgt;
		} else {
			// 亮度滑块
			setBrightnessValue(brgt);
		}
	};

	// 侧边栏点击事件
	const sidePaneClick = (event) => {
		clickDispatch(
			event,
			null,
			(data) => {},
			(data) => {
				// 电池节省模式处理
				if (data.payload === "system.power.saver.state") setBrightness();
			}
		);
	};

	// 副作用钩子，处理页面加载完成后的操作
	useEffect(() => {
		sidepane.quicks.map((item, i) => {
			if (item.src == "nightlight") {
				if (pnstates[i]) {
					document.body.dataset.sepia = true;
				} else {
					document.body.dataset.sepia = false;
				}
			}
		});
	});

	// 副作用钩子，处理状态变化时的操作
	useEffect(() => {
		var tmp = [];
		for (var i = 0; i < sidepane.quicks.length; i++) {
			var val = getPropertyValue(setting, sidepane.quicks[i].state);
			if (sidepane.quicks[i].name == "Theme") {
				val = val == "dark";
			}
			tmp.push(val);
		}

		setPnstate(tmp);
	}, [setting, sidepane]);

	return (
		<div className="side-pane dpShad" data-hide={sidepane.hide} style={{ "--slice": "side" }}>
			<div className="quick-settings p-5 pb-8">
				<div className="quick-setting">
					{sidepane.quicks.map((qk, idx) => {
						return (
							<div key={idx} className="quick-setting-graph">
								<div
									className="quick-setting-btn handcr prtclk"
									onClick={sidePaneClick}
									data-slice={qk.slice}
									data-action={qk.action}
									data-payload={qk.payload || qk.state}
									data-state={pnstates[idx]}
								>
									<Icon className="quick-setting-icon" ui={qk.ui} src={qk.src} width={14} invert={pnstates[idx] ? true : null} />
								</div>
								<div className="quick-setting-text">{qk.name}</div>
							</div>
						);
					})}
				</div>
				<div className="slider-setting">
					<Icon className="mx-2" src="brightness" ui width={20} />
					<input id="brightness-slider" className="sliders bSlider" type="range" min="10" max="100" defaultValue="100" onChange={setBrightness} />
				</div>
				<div className="slider-setting">
					<Icon className="mx-2" src={"audio" + taskbar.audio} ui width={18} />
					<input id="audio-slider" className="sliders vSlider" type="range" min="0" max="100" defaultValue="100" onChange={setVolume} />
				</div>
			</div>
			<div className="p-1 bottom-bar">
				<div className="px-3 battery-pane">
					<Battery pct />
				</div>
			</div>
		</div>
	);
};
