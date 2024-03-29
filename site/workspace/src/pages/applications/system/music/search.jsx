import React, { useState } from "react";

import { Icon, Image } from "@/components/global";

import jiosaavn from "./assets/jiosaavn";

const { round, max } = Math;

/**
 * 搜索组件
 * @param {Object} props - 组件属性对象
 * @param {string} props.sid - 歌曲 ID
 * @param {function} props.clickDispatch - 点击事件分发函数
 */
const Search = (props) => {
	const { sid, clickDispatch } = props;

	const [query, setQuery] = useState(""); // 搜索关键词
	const [newQuery, setNewQuery] = useState(false); // 是否有新的搜索查询
	const [songResults, setSongResults] = useState([]); // 歌曲搜索结果
	const [albumResults, setAlbumResults] = useState([]); // 专辑搜索结果
	const [recentSearches, setRecentSearches] = useState(["Perfect", "Agar tum sath ho", "One Republic", "Cheap thrills"]); // 最近的搜索记录

	/**
	 * 处理搜索查询变化的函数
	 * @param {Event} event - 触发搜索查询变化的事件对象
	 */
	const handleQuery = (event) => {
		// 设置为有新的搜索查询
		setNewQuery(true);
		// 更新搜索查询内容
		setQuery(event.target.value);
	};

	/**
	 * 搜索 Spotify 平台的函数
	 */
	const searchSpotify = () => {
		// 如果有新的搜索查询且搜索关键词长度大于1
		if (newQuery && query.length > 1) {
			// 将新搜索查询标记设为 false
			setNewQuery(false);

			// 调用 JioSaavn API 进行搜索
			jiosaavn
				.searchQuery(searchQuery)
				.then((res) => {
					// 设置歌曲搜索结果
					setSongResults(res.songs.data);
					// 设置专辑搜索结果
					setAlbumResults(res.albums.data);
				})
				.catch((err) => console.log(err));
		}
	};

	/**
	 * 执行滚动操作的函数
	 * @param {Event} event - 触发滚动操作的事件对象
	 */
	const performScroll = (event) => {
		// 获取按钮文本内容
		const buttonText = event.target.innerText;
		// 获取滚动容器元素
		const scrollContainer = event.target.parentElement.parentElement.children[3];
		// 计算滚动数值
		const scrollValue = round(scrollContainer.scrollLeft / 224);

		// 根据按钮文本内容执行不同的滚动操作
		if (buttonText === "<") {
			// 向左滚动
			scrollContainer.scrollLeft = max(0, 224 * (scrollValue - 4));
		} else {
			// 向右滚动
			const containerWidth = parseFloat(getComputedStyle(scrollContainer).getPropertyValue("width").replace("px", ""));
			scrollContainer.scrollLeft = 224 * (scrollValue + 4) + (224 - (containerWidth % 224));
		}
	};

	return (
		<div className="mt-12">
			<div className="absolute w-full flex top-0 -mt-8">
				<div className="flex bg-gray-100 px-4 w-max rounded-full overflow-hidden">
					<input
						className="w-64 ml-2 bg-transparent py-3 rounded-full text-base"
						type="text"
						value={query}
						placeholder="Artist, song or album"
						onChange={handleQuery}
					/>
					<Icon className="handcr" icon="search" onClick={searchSpotify} />
				</div>
			</div>
			<div className="flex">
				<div className="flex flex-col text-gray-100 min-w-1/3 max-w-2/5">
					<span className="text-xl font-black">{songResults.length ? "Top result" : "Recent searches"}</span>
					{songResults.length == 0 ? (
						<div className="mt-2">
							{recentSearches.map((recent, i) => (
								<div key={i} className="acol p-2">
									{recent}
								</div>
							))}
						</div>
					) : null}
					{songResults.length ? (
						<div className="music-result-card mt-4 p-5" data-action="song" data-payload={`"` + songResults[0].id + `"`} onClick={clickDispatch}>
							<Image src={songResults[0].image.to150()} ext w={92} err="/img/asset/mixdef.jpg" lazy />
							<div className="card-play">
								<div className="card-tria"></div>
							</div>
							<div
								className="music-search-ellipsis music-search-thiker text-gray-100 mt-6 text-3xl"
								dangerouslySetInnerHTML={{ __html: songResults[0].title }}
							></div>
							<div className="acol mt-1 text-sm font-semibold" dangerouslySetInnerHTML={{ __html: songResults[0].description }}></div>
						</div>
					) : null}
				</div>
				{songResults && songResults.length ? (
					<div className="flex flex-col text-gray-100 ml-8 flex-grow">
						<span className="flex justify-between">
							<span className="text-xl font-black">Songs</span>
							<span className="acol font-semibold handcr">see all</span>
						</span>
						<div className="mt-4">
							{[...songResults].splice(1, 4).map((song, i) => (
								<div
									key={i}
									className="music-song-container flex p-2 items-center prtclk"
									data-action="song"
									data-payload={`"` + song.id + `"`}
									onClick={clickDispatch}
								>
									<Image src={song.image.to150()} w={40} ext lazy />
									<div className="acol ml-4 flex-grow">
										<div
											className={"music-search-ellipsis capitalize text-gray-100 font-semibold" + (sid == song.id ? " music-green-color" : "")}
											dangerouslySetInnerHTML={{ __html: song.title }}
										></div>
										<div
											className="music-search-ellipsis capitalize text-sm mt-1 font-semibold"
											dangerouslySetInnerHTML={{ __html: song.description }}
										></div>
									</div>
									<div className="acol text-sm font-semibold">{jiosaavn.formatTime(song.song_duration)}</div>
								</div>
							))}
						</div>
					</div>
				) : null}
			</div>
			{albumResults.length ? (
				<div className="music-card w-full my-12">
					<div className="music-action-container">
						<div className="mx-2" onClick={performScroll}>
							{"<"}
						</div>
						<div className="mx-2" onClick={performScroll}>
							{">"}
						</div>
					</div>
					<div className="text-xl text-gray-100 font-bold">Albums</div>
					<div className="card-background w-full mt-2"></div>
					<div className="w-full overflow-x-scroll smoothsc noscroll -ml-3">
						<div className="w-max flex">
							{albumResults.map((card, idx) => (
								<div key={idx} className="music-song-card pt-3 px-3 acol">
									<Image
										w={200}
										src={card.image.to250()}
										err="/img/asset/mixdef.jpg"
										ext
										lazy
										click="album"
										payload={card.id}
										onClick={clickDispatch}
									/>
									<div className="mt-4 mb-1 text-gray-100 text-sm font-semibold" dangerouslySetInnerHTML={{ __html: card.title }}></div>
									<div
										className="my-1 leading-5 text-xs font-semibold tracking-wider"
										dangerouslySetInnerHTML={{ __html: card.music || card.description }}
									></div>
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Search;
