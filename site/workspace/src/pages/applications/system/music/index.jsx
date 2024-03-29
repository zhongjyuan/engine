import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

import { Icon, Image, ToolBar, Lazy } from "@/components/global";

import jiosaavn from "./assets/jiosaavn";
import data from "../Assets/music.json";

import Home from "./home";
import Queue from "./query";
import Search from "./search";
import Playlist from "./play";

String.prototype.to150 = function () {
	return this.replace("500x500", "150x150").replace("50x50", "150x150");
};

String.prototype.to250 = function () {
	return this.replace("500x500", "250x250").replace("150x150", "250x250").replace("50x50", "250x250");
};

const { floor, ceil } = Math;

/**
 * MusicWind 组件用于展示音乐播放器界面和控制逻辑
 */
export const MusicWind = () => {
	const app = useSelector((state) => state.apps.spotify);

	const [tabIndex, setTabIndex] = useState(0); // 当前标签页索引
	const [paused, setPause] = useState(true); // 播放状态，true 为暂停
	const [shuffleMode, setShuffleMode] = useState(0); // 播放模式，0 为顺序播放
	const [maxQueue, setMaxQueue] = useState([]); // 最大播放队列
	const [repeatMode, setRepeatMode] = useState(1); // 循环模式，1 为单曲循环
	const [progress, setProgress] = useState(0); // 播放进度
	const [percentageProgress, setPercentageProgress] = useState(0); // 播放进度百分比
	const [volume, setVolume] = useState(50); // 音量级别
	const [playQueue, setPlayQueue] = useState([{}]); // 播放队列
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // 当前播放曲目索引
	const [currentTrack, setCurrentTrack] = useState({}); // 当前播放曲目信息
	const [savedData, setSavedData] = useState({}); // 已保存的数据

	// 歌曲库分类
	const categories = ["Made For You", "Recently Played", "Favorite Songs", "Albums", "Artist"];

	const actions = {
		/**
		 * 切换到特定的标签页
		 * @param {*} payload 标签页索引
		 * @returns
		 */
		discv: (payload) => setTabIndex(payload),

		/**
		 * 播放音乐
		 * @returns
		 */
		play: () => setPause(false),

		/**
		 * 暂停音乐
		 * @returns
		 */
		pause: () => setPause(true),

		/**
		 * 切换随机播放模式
		 */
		shuffle: () => {
			const n = playQueue.length; // 获取播放队列长度
			if (shuffleMode) {
				setShuffleMode(0); // 关闭随机播放模式
			} else {
				setShuffleMode(1); // 开启随机播放模式
				setMaxQueue(jiosaavn.mixQueue(n)); // 重新排序播放队列
			}
		},

		/**
		 * 切换循环模式
		 * @returns
		 */
		repeat: () => setRepeatMode((repeatMode + 1) % 3),

		/**
		 * 调整音量
		 * @param {*} value 音量值
		 * @returns
		 */
		volume: (value) => setVolume(value),

		/**
		 * 静音/取消静音
		 * @returns
		 */
		mute: () => setVolume(volume !== 0 ? 0 : 100),

		/**
		 * 播放下一首音乐
		 * @returns
		 */
		next: () => goToNextTrack(),

		/**
		 * 播放上一首音乐
		 * @returns
		 */
		prev: () => goToPrevTrack(),

		/**
		 * 处理专辑数据
		 * @param {*} payload 专辑数据
		 * @returns
		 */
		album: (payload) => handleAlbumAction(payload),

		/**
		 * 处理单曲数据
		 * @param {*} payload 单曲 ID
		 * @returns
		 */
		song: (payload) => handleSongAction(payload),

		/**
		 * 处理复杂数据
		 * @param {*} payload 混合数据
		 * @returns
		 */
		mix: (payload) => handleMixAction(payload),

		/**
		 * 处理播放列表数据
		 * @param {*} payload 播放列表数据
		 * @returns
		 */
		playlist: (payload) => handlePlaylistAction(payload),

		/**
		 * 播放指定歌曲列表，并更新相关状态
		 * @param {Array} payload - 包含歌曲信息的数组
		 */
		playall: (payload) => {
			// 设置播放队列为包含指定歌曲信息的数组
			setPlayQueue(payload.map((item) => jiosaavn.mapToSong(item)));
			// 取消暂停状态
			setPause(false);
			// 重置播放进度为0
			setProgress(0);
			// 重置播放进度百分比为0
			setPercentageProgress(0);
			// 设置当前播放的歌曲索引为0
			setCurrentTrackIndex(0);
			// 设置最大队列长度为根据歌曲数量混合生成的值
			setMaxQueue(jiosaavn.mixQueue(payload.length));
		},

		/**
		 * 点击播放队列中的特定歌曲，并更新相关状态
		 * @param {number} payload - 歌曲索引
		 */
		play: (payload) => {
			// 重置播放进度为0
			setProgress(0);
			// 重置播放进度百分比为0
			setPercentageProgress(0);
			// 取消暂停状态
			setPause(false);
			// 设置当前播放的歌曲索引为指定值
			setCurrentTrackIndex(payload);
		},
	};

	/**
	 * 获取位置信息和对应数据
	 * @param {string} payload - 输入的位置信息字符串，可能包含逗号分隔
	 * @returns {Object} 包含位置信息和对应数据的对象
	 */
	const getPosAndAlData = (payload) => {
		// 将 payload 转换为数组格式，pos 存储位置信息，aldata 存储对应的数据
		const pos = payload.includes(",") ? JSON.parse(payload) : JSON.parse(payload); // 解析位置信息字符串为数组

		// 根据位置信息获取对应的数据
		const aldata = pos.length === 2 ? data.home[pos[0]].cards[pos[1]].data : data.home[pos[0]].cards[pos[1]];

		return { pos, aldata }; // 返回位置信息和对应数据对象
	};

	/**
	 * 获取下一首歌曲的索引
	 * @returns {number} 下一首歌曲的索引值
	 */
	const getNextTrackIndex = () => {
		// 计算下一首歌曲的索引
		let nextIndex = (currentTrackIndex + 1) % playQueue.length; // 默认顺序播放下一首歌曲的索引

		if (shuffleMode) {
			// 如果是随机播放模式，则根据 maxQueue 获取下一首歌曲的索引
			nextIndex = maxQueue[currentTrackIndex];
		}

		return nextIndex;
	};

	/**
	 * 播放下一首歌曲，并更新播放状态和进度
	 */
	const goToNextTrack = () => {
		// 播放下一首歌曲
		setPause(false); // 继续播放
		setProgress(0); // 重置进度条
		setPercentageProgress(0); // 重置百分比进度

		// 获取下一首歌曲的索引
		const nextTrackIndex = getNextTrackIndex();

		// 设置当前播放歌曲索引为下一首歌曲
		setCurrentTrackIndex(nextTrackIndex);
	};

	/**
	 * 获取上一首歌曲的索引
	 * @returns {number} 上一首歌曲的索引值
	 */
	const getPrevTrackIndex = () => {
		// 计算上一首歌曲的索引
		let prevIndex = (currentTrackIndex - 1 + playQueue.length) % playQueue.length; // 默认顺序播放上一首歌曲的索引

		if (shuffleMode) {
			// 如果是随机播放模式，则根据 maxQueue 获取上一首歌曲的索引
			prevIndex = maxQueue[currentTrackIndex];
		}

		return prevIndex;
	};

	/**
	 * 播放上一首歌曲，并更新播放状态和进度
	 */
	const goToPrevTrack = () => {
		setPause(false); // 继续播放
		setProgress(0); // 重置进度条
		setPercentageProgress(0); // 重置百分比进度

		// 获取上一首歌曲的索引
		let prevTrackIndex = getPrevTrackIndex();

		// 设置当前播放歌曲索引为上一首歌曲
		setCurrentTrackIndex(prevTrackIndex);
	};

	/**
	 * 处理专辑操作，并更新相关状态
	 * @param {string} payload - 专辑数据的 JSON 字符串
	 */
	const handleAlbumAction = (payload) => {
		// 将 payload 转换为 JSON 对象
		const aldata = payload.includes(",") ? JSON.parse(payload) : JSON.parse(payload);

		// 设置选项卡索引为 39
		setTabIndex(39);

		// 设置当前播放的歌曲信息为专辑类型，并传入专辑数据
		setCurrentTrack({
			type: "album",
			tdata: aldata,
		});
	};

	/**
	 * 处理歌曲操作，并更新相关状态
	 * @param {string} payload - 歌曲数据的 JSON 字符串
	 */
	const handleSongAction = (payload) => {
		// 将 payload 转换为歌曲 ID
		const songid = payload.includes(",") ? JSON.parse(payload) : JSON.parse(payload);

		if (songid !== playQueue[currentTrackIndex].id) {
			// 如果选择的歌曲不在播放队列中
			jiosaavn
				.fetchSong(songid)
				.then((res) => {
					// 获取歌曲信息并设置为新的播放队列
					setPlayQueue([jiosaavn.mapToSong(res)]);

					setPause(false); // 继续播放

					setProgress(0); // 重置进度条

					setPercentageProgress(0); // 重置百分比进度

					setCurrentTrackIndex(0); // 设置当前播放歌曲索引为 0

					setMaxQueue([0]); // 设置最大队列为只包含索引 0
				})
				.catch((err) => console.log(err));
		} else {
			// 如果选择的歌曲已在播放队列中，则暂停/继续播放
			setPause(!paused);
		}
	};

	/**
	 * 处理混合操作并更新相关状态
	 * @param {string} payload - 包含位置信息和专辑数据的 JSON 字符串
	 */
	const handleMixAction = (payload) => {
		// 从 payload 中获取位置信息和专辑数据
		const { pos, aldata } = getPosAndAlData(payload);

		let songArr = [];
		const key = aldata.name; // 专辑名称作为保存数据的键值
		const tdata = {
			album_name: aldata.name, // 专辑名称
			album_image: aldata.img, // 专辑图片
			year: 2021, // 发行年份
			album_artist: aldata.desc, // 专辑艺术家
		};

		if (savedData[key] != null) {
			// 如果已经保存了相同专辑的歌曲列表，则直接使用保存的歌曲列表
			songArr = savedData[key];

			// 设置当前播放的曲目类型为“混合”，并传入专辑信息和歌曲列表
			setCurrentTrack({ type: "mix", tdata: { ...tdata, songs: songArr } });

			setTabIndex(39); // 设置选项卡索引为 39
		} else {
			// 如果未保存相同专辑的歌曲列表，则从 jiosaavn 中获取歌曲信息
			setTabIndex(39); // 设置选项卡索引为 39

			const arr = aldata.data; // 获取专辑数据中的歌曲数组

			jiosaavn.fetchSongs(arr).then((res) => {
				songArr = res;

				savedData[key] = songArr; // 将获取到的歌曲列表保存起来

				setSavedData(savedData); // 更新保存的数据

				// 设置当前播放的曲目类型为“混合”，并传入专辑信息和新获取的歌曲列表
				setCurrentTrack({ type: "mix", tdata: { ...tdata, songs: songArr } });
			});
		}
	};

	/**
	 * 处理播放列表操作并更新相关状态
	 * @param {string} payload - 播放列表标识符
	 */
	const handlePlaylistAction = (payload) => {
		// 从数据中获取指定标识符对应的播放列表数据
		const aldata = data.playlist[payload];

		let songArr = [];

		const key = "play_" + aldata.name; // 使用播放列表名称构建保存数据的键值

		const tdata = {
			album_name: aldata.name, // 播放列表名称
			album_image: aldata.img, // 播放列表图片
			year: 2020 + (aldata.name === "Community"), // 计算年份，如果播放列表名称为"Community"，年份为 2021，否则为 2020
			album_artist: aldata.desc, // 播放列表描述
		};

		if (savedData[key] != null) {
			// 如果已经保存了相同播放列表的歌曲列表，则直接使用保存的歌曲列表
			songArr = savedData[key];

			// 设置当前播放的曲目类型为“播放列表”，并传入播放列表信息和歌曲列表
			setCurrentTrack({ type: "playlist", tdata: { ...tdata, songs: songArr } });

			setTabIndex(39); // 设置选项卡索引为 39
		} else {
			// 如果未保存相同播放列表的歌曲列表，则从 jiosaavn 中获取歌曲信息
			setTabIndex(39); // 设置选项卡索引为 39

			const arr = aldata.data; // 获取播放列表数据中的歌曲数组

			jiosaavn.fetchSongs(arr).then((res) => {
				songArr = res;

				savedData[key] = songArr; // 将获取到的歌曲列表保存起来

				setSavedData(savedData); // 更新保存的数据

				// 设置当前播放的曲目类型为“播放列表”，并传入播放列表信息和新获取的歌曲列表
				setCurrentTrack({ type: "playlist", tdata: { ...tdata, songs: songArr } });
			});
		}
	};

	/**
	 * 处理点击事件的分发函数
	 * @param {Event} event - 事件对象
	 */
	const clickDispatch = (event) => {
		// 从事件目标的数据集中获取操作和载荷
		const { act, payload } = event.target.dataset;

		if (actions[act]) {
			// 如果存在对应的操作，则执行该操作并传入载荷
			actions[act](payload);
		}
	};

	/**
	 * 处理音频播放进度更新的函数
	 * @param {Event} event - 包含播放进度信息的事件对象
	 */
	const progressUpdate = (event) => {
		// 设置播放进度为播放秒数的整数部分
		setProgress(floor(event.playedSeconds));
		// 设置播放进度百分比为事件中的播放进度值
		setPercentageProgress(event.played);
	};

	/**
	 * 处理音频播放进度调整的函数
	 * @param {Event} event - 事件对象
	 */
	const progressChange = (event) => {
		// 获取音频元素
		var audiosrc = document.getElementById("audiosrc");
		// 获取用户输入的播放时间
		var time = event.target.value;
		// 设置音频当前播放时间为用户输入的值
		audiosrc.currentTime = time;
		// 设置播放进度百分比为用户输入时间与当前歌曲总时长的比例
		setPercentageProgress(time / playQueue[currentTrackIndex].duration);
		// 设置播放进度为用户输入时间的整数部分
		setProgress(floor(time));
	};

	/**
	 * 暂停音频播放的处理函数
	 */
	const handlePause = () => setPause(true);

	/**
	 * 恢复音频播放的处理函数
	 */
	const handlePlay = () => setPause(false);

	/**
	 * 处理音频播放结束的函数
	 */
	const handleFinish = () => {
		// 暂停音频播放
		setPause(true);
		// 如果不是单曲循环模式，自动播放下一首歌曲
		if (repeatMode === 1) {
			clickDispatch({ target: { dataset: { action: "next" } } });
		}
	};

	/**
	 * 使用 Effect Hook 处理播放队列和当前歌曲索引的变化
	 */
	useEffect(() => {
		// 如果当前歌曲名为 null，则从 JioSaavn 获取默认歌曲列表
		if (playQueue[currentTrackIndex].name === null) {
			jiosaavn
				.getDefault()
				.then((data) => setPlayQueue(data))
				.catch((err) => console.log(err));
		}
	}, [playQueue, currentTrackIndex]);

	/**
	 * 使用 Effect Hook 处理程序隐藏和未暂停时的操作
	 */
	useEffect(() => {
		// 如果应用程序被隐藏并且音频未暂停，则暂停音频播放
		if (app.hide && !paused) {
			setPause(true);
		}
	});

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-music dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			<div className="music-navigate-cover w-50 h-16 absolute"></div>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="Spotify Music" invert />
			<div className="screen flex flex-col">
				<Lazy show={!app.hide}>
					<div className="wind-rest flex-grow flex">
						<div className="music-navigate-pane w-50">
							<div className="mx-6">
								<div className="mt-16"></div>
								<div
									className="music-navigate my-4 handcr font-semibold"
									data-act={tabIndex == 0}
									data-action="discv"
									data-payload="0"
									onClick={clickDispatch}
								>
									<Icon icon="home" width={24} />
									<div className="ml-4 text-sm">Home</div>
								</div>
								<div
									className="music-navigate my-4 handcr font-semibold"
									data-act={tabIndex == 1}
									data-action="discv"
									data-payload="1"
									onClick={clickDispatch}
								>
									<Icon fafa="faCompactDisc" width={24} />
									<div className="ml-4 text-sm">Browse</div>
								</div>
								<div className="text-gray-500 text-xs font-semibold tracking-widest mt-10 mb-4">YOUR LIBRARY</div>
								<div className="music-navigate-container scroll overflow-y-scroll">
									<div className="w-full h-max">
										{categories.map((category, i) => (
											<div
												key={i}
												className="music-navigate mb-4 handcr text-sm font-semibold"
												data-act={tabIndex == i + 2}
												data-action="discv"
												data-payload={i + 2}
												onClick={clickDispatch}
											>
												{category}
											</div>
										))}
										<div className="text-gray-500 font-semibold text-xs tracking-widest mt-12 mb-4">PLAYLISTS</div>
										{data.playlist.map((play, i) => (
											<div
												key={i}
												className="music-navigate mb-4 handcr text-sm font-semibold"
												data-act={tabIndex == i + 2 + categories.length}
												data-action="playlist"
												data-payload={i}
												onClick={clickDispatch}
											>
												{play.name}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<div id="music-content-pane" className="music-content-pane scroll">
							<div className="h-max relative">
								<div className="absolute w-full pb-8">
									{tabIndex == 41 ? <Queue {...{ playQueue, currentTrackIndex, paused, clickDispatch }} /> : null}
									{tabIndex == 0 ? (
										<Home
											tabIndex={tabIndex}
											action={clickDispatch}
											paused={paused}
											sid={playQueue[currentTrackIndex] && playQueue[currentTrackIndex].id}
										/>
									) : null}
									{tabIndex > 1 && tabIndex < 2 + categories.length ? (
										<Home
											tabIndex={tabIndex}
											action={clickDispatch}
											paused={paused}
											sid={playQueue[currentTrackIndex] && playQueue[currentTrackIndex].id}
										/>
									) : null}
									{tabIndex == 39 || (tabIndex > 6 && tabIndex < 10) ? (
										<Playlist
											{...{ paused, clickDispatch }}
											sid={playQueue[currentTrackIndex] && playQueue[currentTrackIndex].id}
											{...currentTrack}
										/>
									) : null}
									<div className={tabIndex == 1 ? null : "hidden prtclk"}>
										<Search {...{ paused, clickDispatch }} sid={playQueue[currentTrackIndex] && playQueue[currentTrackIndex].id} />
									</div>
								</div>
							</div>
						</div>
						<div className="music-player-pane">
							<div className="music-player-info flex items-center">
								{playQueue[currentTrackIndex].albumArt ? (
									<Image src={playQueue[currentTrackIndex].albumArt.to150()} w={56} ext lazy />
								) : (
									<Icon src="./img/asset/album.png" ext width={56} />
								)}
								<div className="music-player-info-name ml-3">
									<div
										className="text-sm mb-2 text-gray-100 font-semibold"
										dangerouslySetInnerHTML={{
											__html: playQueue[currentTrackIndex].name || "Album",
										}}
									></div>
									<div
										className="text-xs tracking-wider text-gray-400"
										dangerouslySetInnerHTML={{
											__html: playQueue[currentTrackIndex].artist || "Artist",
										}}
									></div>
								</div>
							</div>
							<div className="music-player-action" data-prtclk={!playQueue[currentTrackIndex].name}>
								<div className="flex items-center">
									<Icon
										className="action-icon music-player-action-ficon"
										icon="shuffle"
										click="shuffle"
										payload={(shuffleMode != 0) | 0}
										onClick={clickDispatch}
									/>
									<Icon className="action-icon" icon="previous" click="prev" onClick={clickDispatch} />
									<div className="action-border handcr">
										{paused ? (
											<Icon className="play" icon="play" width={18} height={28} invert click="play" onClick={clickDispatch} />
										) : (
											<Icon className="pause" icon="pause" width={18} height={28} invert click="pause" onClick={clickDispatch} />
										)}
									</div>
									<Icon className="action-icon" icon="next" onClick={clickDispatch} click="next" />
									<Icon className="action-icon action-picon" icon="repeat" click="repeat" payload={repeatMode} onClick={clickDispatch} />
								</div>
								<div className="w-full flex items-center mt-2 justify-center">
									<div className="music-player-progress-time">{jiosaavn.formatTime(progress)}</div>
									<div className="music-player-divider">
										<ReactPlayer
											className="divider-body"
											url={playQueue[currentTrackIndex].src}
											config={{
												file: {
													forceAudio: true,
													attributes: { id: "audiosrc" },
												},
											}}
											loop={repeatMode == 2}
											playing={!paused}
											volume={volume / 100}
											onPlay={handlePlay}
											onProgress={progressUpdate}
											onEnded={handleFinish}
											onPause={handlePause}
										/>
										<input
											className="music-input"
											type="range"
											min={0}
											max={playQueue[currentTrackIndex].duration}
											value={progress}
											onChange={progressChange}
										/>
										<div className="music-progress" style={{ width: percentageProgress * 100 + "%" }}></div>
									</div>
									<div className="music-player-progress-time">{jiosaavn.formatTime(playQueue[currentTrackIndex].duration)}</div>
								</div>
							</div>
							<div className="music-player-ctrl flex items-center justify-between">
								<div className="prtclk handcr mr-6" data-action="discv" data-payload="41" onClick={clickDispatch}>
									<Icon className="music-player-action-ficon" fafa="faListUl" width={14} payload={tabIndex == 41 ? 1 : 0} />
								</div>
								<div className="music-player-rctrl flex items-center">
									<Icon
										className="music-player-action-ficon mr-2"
										width={16}
										fafa={["faVolumeMute", "faVolumeDown", "faVolumeUp"][ceil(volume / 50)]}
										click="mute"
										onClick={clickDispatch}
									></Icon>
									<div className="relative flex items-center">
										<input
											className="music-input music-input-volume"
											type="range"
											min={0}
											max={100}
											value={volume}
											onChange={clickDispatch}
											data-action="volume"
										/>
										<div className="music-progress" style={{ width: floor(0.8 * volume) }}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Lazy>
			</div>
		</div>
	);
};
