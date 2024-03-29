import React from "react";
import { useSelector } from "react-redux";

import { Icon, Lazy } from "@/components/global";

import "./widget.scss";

// WidPane组件定义
export const WidgetPane = () => {
	// 获取主题和小部件数据
	var widget = useSelector((state) => state.widgetpane);
	var theme = useSelector((state) => state.setting.person.theme);

	const randomThemeColor = (x = 0) => {
		if (theme == "light") return `hsl(${Math.floor(Math.random() * 360)}deg 36% 84%)`;
		if (theme == "dark") return `hsl(${Math.floor(Math.random() * 360)}deg 36% 16%)`;
	};

	// 返回WidPane组件的JSX
	return (
		<div className="widget-screen" data-hide={widget.hide} style={{ "--slice": "widget" }}>
			<Lazy show={!widget.hide}>
				<div className="widget-pane scroll">
					<div className="widget-pane-top">
						<Icon fafa="faEllipsisH" width={12} />
					</div>
					<div className="widget-pane-time">{new Date().toLocaleTimeString("zh-CN", { hour: "numeric", minute: "2-digit" })}</div>
					<div className="widgets">
						<div className="widget-top">
							{/* 天气部分 */}
							<div className="widget-weather ltShad">
								<div className="widget-weather-top">
									<Icon src="weather" width={18} /> <span>Weather</span>
								</div>
								<div className="widget-weather-city">
									<Icon fafa="faMapMarkerAlt" width={8} />
									{widget.data.weather.city}, {widget.data.weather.country}
								</div>
								<div className="widget-weather-info">
									<div className="widget-weather-temp">
										<Icon src={`https://www.metaweather.com/static/img/weather/png/64/${widget.data.weather.icon}.png`} ext width={32} />
										<div className="widget-weather-deg">{widget.data.weather.temp}</div>
										<div className="widget-weather-unit">ºC</div>
									</div>
									<div className="widget-weather-more">
										<div className="widget-weather-content">{widget.data.weather.wstate}</div>
										<div className="widget-weather-rain">
											<div className="widget-weather-chance">
												<Icon fafa="faTint" width={10} />
												{widget.data.weather.rain}%
											</div>
											<div className="widget-weather-chance">
												<Icon fafa="faWind" width={10} />
												{widget.data.weather.wind}
											</div>
										</div>
									</div>
								</div>
								<div className="widget-weather-week">
									{widget.data.weather.days.map((item, i) => {
										return (
											<div key={i} className="widget-weather-week-day">
												<div>{i == 0 ? "Today" : item.day}</div>
												<Icon src={`https://www.metaweather.com/static/img/weather/png/64/${item.icon}.png`} ext width={24} />
												<div className="widget-weather-week-temp">{item.min}º</div>
												<div className="widget-weather-week-temp">{item.max}º</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* 股票和事件部分 */}
							<div className="widget-shorts">
								<div className="widget-short-0 ltShad">
									<div className="widget-short-name">MONEY | MARKET</div>
									<div className="widget-short-entry">
										<div className="widget-short-stock-name">
											<Icon src="google" ui width={12} />
											<div className="widget-short-stock-name-text">GOOGL</div>
										</div>
										<div className="widget-short-stock-value">
											<div>{widget.data.stock[0][0]}</div>
											<div className="widget-short-stock-res" data-pos={widget.data.stock[0][2] == 1}>
												{widget.data.stock[0][2] ? "+" : "-"}
												{widget.data.stock[0][1]}%
											</div>
										</div>
									</div>
									<div className="widget-short-entry">
										<div className="widget-short-stock-name">
											<Icon src="tesla" ui width={12} />
											<div className="widget-short-stock-name-text">TSLA</div>
										</div>
										<div className="widget-short-stock-value">
											<div>{widget.data.stock[1][0]}</div>
											<div className="widget-short-stock-res" data-pos={widget.data.stock[1][2] == 1}>
												{widget.data.stock[1][2] ? "+" : "-"}
												{widget.data.stock[1][1]}%
											</div>
										</div>
									</div>
								</div>
								<div
									className="widget-short-1 ltShad"
									style={{
										"--afterBack": `url(${widget.data.event.pages[0].thumbnail && widget.data.event.pages[0].thumbnail.source})`,
										backgroundImage: `url(${widget.data.event.pages[0].thumbnail && widget.data.event.pages[0].thumbnail.source})`,
									}}
								>
									<div className="widget-short-name">
										<div className="flex">
											<Icon fafa="faLandmark" width={8} />
											&nbsp;ON THIS DAY
										</div>
										<div>{widget.data.date}</div>
									</div>
									<div className="widget-short-info">
										<div className="widget-short-info-day">{widget.data.event.text}</div>
										<a
											href={widget.data.event.pages[0].content_urls.desktop.page}
											rel="noopener noreferrer"
											target="_blank"
											className="widget-short-info-wikiref"
										>
											more on wiki
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* 新闻部分 */}
						<div className="widget-news">
							<div className="top-stories ltShad">
								<div className="top-news-title">TOP STORIES</div>
								<div className="top-news">
									{[...widget.data.news].splice(0, 4).map((article, i) => {
										return (
											<div className="news" key={i}>
												<div className="news-source">{article.source.name}</div>
												<div className="news-article">{article.title}</div>
											</div>
										);
									})}
								</div>
							</div>
							<div className="all-news">
								{[...widget.data.news].splice(4, widget.data.news.length).map((article, i) => {
									return (
										<a
											key={i}
											rel="noopener noreferrer"
											className="all-news-article ltShad"
											style={{
												"--backgrad": randomThemeColor(2),
												backgroundImage: `url(${article.urlToImage})`,
											}}
											target="_blank"
											href={article.url}
											loading="lazy"
										>
											<div className="news">
												<div className="news-source">{article.source.name}</div>
												<div className="news-article">{article.title}</div>
												{i % 5 == 4 ? <div className="news-desc">{article.content}</div> : null}
											</div>
										</a>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</Lazy>
		</div>
	);
};
