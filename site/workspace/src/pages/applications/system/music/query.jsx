import React from "react";

import { Icon, Image } from "@/components/global";

import jiosaavn from "./assets/jiosaavn";

/**
 * Queue组件，展示播放队列内容
 * @param {Object} props - 组件属性对象
 * @param {Array} props.playQueue - 播放队列数组
 * @param {number} props.currentTrackIndex - 当前播放曲目索引
 * @param {function} props.clickDispatch - 点击事件处理函数
 * @param {boolean} props.paused - 是否暂停状态
 */
const Queue = (props) => {
	const { playQueue, currentTrackIndex, clickDispatch, paused } = props;

	return (
		<div className="mt-12">
			{/* 标题 */}
			<div className="text-5xl text-gray-100 font-bold">Play Queue</div>
			{/* 当前播放 */}
			<div className="text-gray-400 font-semibold my-4">Now playing</div>
			<div className="music-query-container prtclk acol py-2 pr-12">
				{/* 播放状态 */}
				<div className="w-10 text-center music-green-color">{paused ? "1" : <Icon src="./img/asset/equaliser.gif" ext width={16} />}</div>
				{/* 专辑封面 */}
				<Image src={playQueue[currentTrackIndex].albumArt.to150()} w={40} ext lazy />
				<div className="flex flex-col">
					{/* 歌曲名称 */}
					<div
						className="capitalize music-search-ellipsis music-green-color font-semibold"
						dangerouslySetInnerHTML={{ __html: playQueue[currentTrackIndex].name }}
					></div>
					{/* 艺术家名称 */}
					<div
						className="capitalize music-search-ellipsis font-semibold text-sm mt-1"
						dangerouslySetInnerHTML={{ __html: playQueue[currentTrackIndex].artist }}
					></div>
				</div>
				{/* 专辑名称 */}
				<div className="text-sm music-search-ellipsis font-semibold" dangerouslySetInnerHTML={{ __html: playQueue[currentTrackIndex].album }}></div>
				{/* 播放时长 */}
				<div className="text-sm font-semibold">{jiosaavn.formatTime(playQueue[currentTrackIndex].duration)}</div>
			</div>
			{/* 下一首播放 */}
			<div className="text-gray-400 font-semibold mt-12 mb-6">Next up</div>
			{/* 遍历下一首播放列表 */}
			{jiosaavn.sliceArr(playQueue, currentTrackIndex).map((qs, i) => {
				return (
					<div
						key={i}
						className="music-query-container handcr prtclk acol pr-12 py-2"
						onClick={() => clickDispatch("play", (currentTrackIndex + i + 1) % playQueue.length)}
					>
						{/* 序号 */}
						<div className="w-10 text-center font-semibold">{i + 2}</div>
						{/* 专辑封面 */}
						<Image src={qs.albumArt.to150()} w={40} ext lazy />
						<div className="flex flex-col">
							{/* 歌曲名称 */}
							<div className="capitalize music-search-ellipsis font-semibold text-gray-100" dangerouslySetInnerHTML={{ __html: qs.name }}></div>
							{/* 艺术家名称 */}
							<div className="capitalize music-search-ellipsis font-semibold text-sm mt-1" dangerouslySetInnerHTML={{ __html: qs.artist }}></div>
						</div>
						{/* 专辑名称 */}
						<div className="text-sm music-search-ellipsis font-semibold" dangerouslySetInnerHTML={{ __html: qs.album }}></div>
						{/* 播放时长 */}
						<div className="text-sm font-semibold">{jiosaavn.formatTime(qs.duration)}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Queue;
