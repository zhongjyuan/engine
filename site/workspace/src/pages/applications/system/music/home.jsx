import React, { useState, useEffect } from "react";

import { Image } from "@/components/global";

import data from "../Assets/music.json";

const { round, floor, max } = Math;

/**
 * Home组件，展示音乐主页内容
 * @param {Object} props - 组件属性对象
 * @param {number} props.tabIndex - 当前选项卡索引
 * @param {function} props.clickDispatch - 点击事件处理函数
 * @param {string} props.sid - 歌曲id
 * @param {boolean} props.paused - 是否暂停状态
 */
const Home = (props) => {
	const { tabIndex, clickDispatch, sid, paused } = props;

	const [tab, setTab] = useState(0);

	/**
	 * 计算随机色调值
	 * @param {number} index - 用于计算的索引值
	 * @returns {number} - 返回计算得到的随机色调值
	 */
	const calculateRandomHue = (index) => {
		// 获取当前日期
		var currentDate = new Date();
		// 获取当前小时数
		var hours = currentDate.getHours();
		// 对小时数进行加权处理
		var modifiedValue = hours ** (currentDate.getDay() + 2);
		// 计算并返回随机色调值
		return floor(((modifiedValue * (index + 2)) % 360) / 1.6);
	};

	/**
	 * 执行滚动操作
	 * @param {Event} event - 事件对象
	 */
	const performScroll = (event) => {
		// 获取按钮文本内容
		var buttonInnerText = event.target.innerText;
		// 获取滚动容器
		var scrollContainer = event.target.parentElement.parentElement.children[4];
		// 计算滚动索引
		var scrollIndex = round(scrollContainer.scrollLeft / 224);

		// 根据按钮文本内容执行不同的滚动操作
		if (buttonInnerText === "<") {
			// 向左滚动
			scrollContainer.scrollLeft = max(0, 224 * (scrollIndex - 4));
		} else {
			// 向右滚动
			var containerWidth = parseFloat(getComputedStyle(scrollContainer).getPropertyValue("width").replace("px", ""));
			scrollContainer.scrollLeft = 224 * (scrollIndex + 4) + (224 - (containerWidth % 224));
		}
	};

	/**
	 * 使用 useEffect 监听 tab 变化并执行相应的滚动操作
	 * @param {Array} tab - 依赖的 tab 状态数组
	 */
	useEffect(() => {
		// 获取父元素
		var parentElement = document.getElementById("music-content-pane");
		if (parentElement) {
			// 计算滚动数值
			var scrollValue = (80 + max(0, tabIndex - 2) * 360) * (tabIndex !== 0);
			// 设置滚动位置
			parentElement.scrollTop = scrollValue;
		}
	}, [tab]);

	/**
	 * 使用 useEffect 监听并设置 tab 状态为指定的tabIndex值
	 */
	useEffect(() => {
		// 设置 tab 状态为当前的tabIndex值
		setTab(tabIndex);
	});

	return (
		<div className="music-home mt-12">
			<div className="absolute right-0 -mt-8 text-xs font-medium acol">
				Powered by{" "}
				<a href="https://github.com/sumitkolhe/jiosaavn-api" className="text-gray-400 underline" target="_blank" rel="noreferrer">
					sumitkolhe/jiosaavn-api
				</a>
			</div>
			{data.home.map((bar, ix) => (
				<div key={ix} className="music-card w-full mb-8" id={"tabIndex" + (ix + 2)}>
					<div className="music-action-container" data-var={!bar.desc}>
						<div className="mx-2" onClick={performScroll}>
							{"<"}
						</div>
						<div className="mx-2" onClick={performScroll}>
							{">"}
						</div>
					</div>
					<div className="text-gray-100 font-bold">{bar.name}</div>
					<div className="text-xs font-semibold tracking-wider">{bar.desc}</div>
					<div className="card-background w-full mt-2"></div>
					<div className="w-full pt-1 overflow-x-scroll smoothsc noscroll -ml-3">
						<div className="w-max flex">
							{bar.cards.map((card, idx) => (
								<div
									key={idx}
									className={"music-song-card pt-3 px-3" + (card.type == "artist" ? " text-center" : "")}
									style={{ "--rot1": calculateRandomHue(idx) + "deg" }}
								>
									<Image
										lazy
										className={(card.type == "mix" ? "music-cover-image" : " ") + (card.type == "artist" ? "card-image-art" : " ")}
										src={card.img}
										ext
										w={200}
										err="/img/asset/mixdef.jpg"
										click={card.type}
										payload={"[" + ix + "," + idx + "]"}
										onClick={clickDispatch}
									/>
									<div className="card-sover p-4 nopt">{card.type == "mix" ? card.name : null}</div>
									{card.type == "song" && sid != card.data ? (
										<div className="card-play">
											<div className="card-tria"></div>
										</div>
									) : null}
									{card.type == "song" && sid == card.data ? (
										<div className="card-pause">
											<div className={paused ? "card-tria" : "card-bar"}></div>
										</div>
									) : null}
									<div className="mt-4 mb-1 text-gray-100 text-sm font-semibold">{card.name}</div>
									<div className="my-1 leading-5 text-xs font-semibold tracking-wider">{card.desc}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Home;
