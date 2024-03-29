import React, { useState, useEffect } from "react";

import { Icon, Image } from "@/components/global";

import jiosaavn from "./assets/jiosaavn";

/**
 * Playlist组件用于展示音乐播放列表信息
 * @param {Object} props - 组件的属性对象
 * @param {string} props.type - 播放列表类型，可以是 "album", "mix" 或 "playlist"
 * @param {string} props.sid - 当前播放歌曲的ID
 * @param {Object} props.trackData - 包含音乐数据的对象
 * @param {boolean} props.paused - 表示当前是否暂停播放
 * @param {function} props.clickDispatch - 处理播放点击事件的回调函数
 */
const Playlist = (props) => {
	// 解构props中的属性
	const { type, sid, trackData, paused, clickDispatch } = props;

	// 初始化state
	const [data, setData] = useState({ fake: true });
	const [playType, setPlayType] = useState(true);
	const [totalTime, setTotalTime] = useState(0);

	useEffect(() => {
		// 在组件挂载或 props 中 trackData 改变时执行
		var parentElement = document.getElementById("music-content-pane");
		if (parentElement) {
			// 滚动到顶部
			parentElement.scrollTop = 0;
		}

		// 根据不同的类型进行处理
		if (type == "album") {
			// 如果是专辑类型
			setPlayType(false);
			jiosaavn
				.getAlbum(trackData.toString())
				.then((res) => {
					// 获取专辑数据并设置state
					setData(res);
					var totalDuration = 0;
					for (var i = 0; i < res.songs.length; i++) {
						totalDuration += parseInt(res.songs[i].song_duration);
					}
					// 计算总时长
					setTotalTime(totalDuration);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (type == "mix" || type == "playlist") {
			// 如果是混合或播放列表类型
			setPlayType(true);
			setData(trackData);
			var totalDuration = 0;
			for (var i = 0; i < trackData.songs.length; i++) {
				totalDuration += parseInt(trackData.songs[i].song_duration);
			}
			// 计算总时长
			setTotalTime(totalDuration);
		}
	}, [trackData]);

	return (
		<div className="relative">
			{/* 音乐播放信息展示 */}
			<div className="music-play-info">
				<Image className="dpShad" src={data.album_image || "/img/asset/mixdef.jpg"} ext w={232} h={232} lazy />
				<div className="music-play-det ml-6 text-gray-100 flex flex-col justify-end">
					<div className="text-xs font-bold uppercase">{type}</div>
					<div className="music-play-title" dangerouslySetInnerHTML={{ __html: data.album_name || (trackData && trackData.album_name) }}></div>
					<div className="text-sm font-semibold">
						{(data.album_artist && data.album_artist.split(", ").join(" • ")) || ""}{" "}
						<span className="text-gray-400 text-xs">
							• {data.year || "2020"} • {(data.songs && data.songs.length) || "0"} song
							{data.songs && data.songs.length > 1 ? "s" : null}, {jiosaavn.formatPeriod(totalTime)}
						</span>
					</div>
					<div className="music-play-button" onClick={() => clickDispatch("playall", data.songs)}>
						PLAY
					</div>
				</div>
			</div>
			<div className="music-play-infph"></div>
			<div className="music-play-songs">
				<div className="music-play-row">
					<div className="font-bold text-right">#</div>
					<div className="music-play-col1 text-xs">TITLE</div>
					<div className="text-xs">{playType ? "ALBUM" : null}</div>
					<div className="text-xs">{playType ? "YEAR" : null}</div>
					<div className="flex justify-end">
						<Icon fafa="faClock" width={16} reg />
					</div>
				</div>
				<div className="song-hr"></div>
				{/* 遍历歌曲列表 */}
				{data.songs &&
					data.songs.map((song, i) => (
						<div className="music-play-row handcr prtclk" data-action="song" key={i} data-payload={`"` + song.song_id + `"`} onClick={clickDispatch}>
							{sid != song.song_id ? <div className="music-play-index font-semibold">{i + 1}</div> : null}
							{sid == song.song_id && paused ? <div className="music-play-index font-semibold music-green-color">{i + 1}</div> : null}
							{sid == song.song_id && !paused ? <Icon src="./img/asset/equaliser.gif" ext width={14} /> : null}

							<div className="music-play-col1">
								{playType ? <Image src={song.song_image.to150()} w={40} h={40} ext err="/img/asset/mixdef.jpg" lazy /> : null}
								<div className="col-song flex flex-col" data-play={playType}>
									<div
										className={"font-semibold capitalize text-gray-100" + (sid == song.song_id ? " music-green-color" : "")}
										dangerouslySetInnerHTML={{ __html: song.song_name }}
									></div>
									<div className="font-semibold capitalize text-xs mt-1" dangerouslySetInnerHTML={{ __html: song.song_artist }}></div>
								</div>
							</div>
							<div className="music-play-col2 font-semibold" dangerouslySetInnerHTML={{ __html: playType ? song.album_name : null }}></div>
							<div className="music-play-col3 font-semibold">{playType ? song.year : null}</div>
							<div className="font-semibold flex justify-end">{jiosaavn.formatTime(song.song_duration)}</div>
						</div>
					))}
			</div>
			{type != "play" ? (
				<div className="text-xss font-semibold acol mt-6">{type == "album" && data.songs && data.songs[0] && data.songs[0].copyright}</div>
			) : null}
		</div>
	);
};

export default Playlist;
