import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Icon, Image } from "@/components/global";

/**
 * FrontPage组件，用于显示商店首页内容
 * @param {object} props - 组件props
 */
const FrontPage = (props) => {
	// 导入必要的hooks和函数
	const { t } = useTranslation();

	// 使用useSelector从Redux存储中检索数据
	const ribbon = useSelector((state) => state.globals.ribbon);
	const apprib = useSelector((state) => state.globals.apprib);
	const gamerib = useSelector((state) => state.globals.gamerib);
	const movrib = useSelector((state) => state.globals.movrib);

	return (
		<div className="wind-store-page w-full absolute top-0">
			<Image id="home" className="wind-store-page-image w-full" src="img/store/lucacover.jpg" ext />
			<div className="wind-store-page-title absolute m-6 text-xl top-0">主页</div>
			<div className="w-full overflow-x-scroll noscroll overflow-y-hidden -mt-16">
				<div className="wind-store-page-ribbon">
					{ribbon &&
						// 遍历ribbon项目
						ribbon.map((x, i) => {
							return x == "unescape" ? (
								// 如果项目是'unescape'，则渲染一个链接
								<a key={i} href="https://blueedge.me/unescape" target="_blank" rel="noreferrer">
									<Image className="mx-1 dpShad rounded" var={x} h={100} dir="store/float" src={x} />
								</a>
							) : (
								// 对于其他项目，渲染图片
								<Image key={i} className="mx-1 dpShad rounded" var={x} h={100} dir="store/float" src={x} />
							);
						})}
				</div>
			</div>
			<div
				id="apprib"
				className="wind-store-page-front all-apps my-8 py-20 w-auto mx-8 flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
			>
				<div className="flex w-64 flex-col text-gray-100 h-full px-8  ">
					<div className="text-xl">{t("store.featured-app")}</div>
					<div className="text-xs mt-2">{t("store.featured-app.info")}</div>
				</div>
				<div className="flex w-max pr-8">
					{apprib &&
						// 遍历apprib项目
						apprib.map((x, i) => {
							var stars = 3 + ((x.charCodeAt(0) + x.charCodeAt(1)) % 3);
							return (
								<div key={i} className="wind-store-page-app rounded my-auto p-2 pb-2">
									<Image className="mx-1 py-1 mb-2 rounded" w={120} dir="store/apps" src={x} />
									<div className="capitalize text-xs font-semibold">{x}</div>
									<div className="flex mt-2 items-center">
										{/* 根据计算渲染星星图标 */}
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className={stars > 3 ? "bluestar" : ""} fafa="faStar" width={6} />
										<Icon className={stars > 4 ? "bluestar" : ""} fafa="faStar" width={6} />
										<div className="text-xss">{1 + (x.charCodeAt(3) % 5)}k</div>
									</div>
									<div className="text-xss mt-8">{x.charCodeAt(4) % 2 ? <>{t("store.free")}</> : <>{t("store.owned")}</>}</div>
								</div>
							);
						})}
				</div>
			</div>

			<div
				id="gamerib"
				className="wind-store-page-front game-apps my-8 py-20 w-auto mx-8 flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
			>
				<div className="flex w-64 flex-col text-gray-100 h-full px-8">
					<div className="text-xl">{t("store.featured-game")}</div>
					<div className="text-xs mt-2">{t("store.featured-game.info")}</div>
				</div>
				<div className="flex w-max pr-8">
					{gamerib &&
						// 遍历gamerib项目
						gamerib.map((x, i) => {
							var stars = 3 + ((x.charCodeAt(0) + x.charCodeAt(1)) % 3);
							return (
								<div key={i} className="wind-store-page-app rounded my-auto p-2 pb-2">
									<Image className="mx-1 py-1 mb-2 rounded" w={120} dir="store/games" src={x} />
									<div className="capitalize text-xs font-semibold">{x}</div>
									<div className="flex mt-2 items-center">
										{/* 根据计算渲染星星图标 */}
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className={stars > 3 ? "bluestar" : ""} fafa="faStar" width={6} />
										<Icon className={stars > 4 ? "bluestar" : ""} fafa="faStar" width={6} />
										<div className="text-xss">{1 + (x.charCodeAt(3) % 5)}k</div>
									</div>
									<div className="text-xss mt-8">{x.charCodeAt(4) % 2 ? <>{t("store.free")}</> : <>{t("store.owned")}</>}</div>
								</div>
							);
						})}
				</div>
			</div>

			<div
				id="movrib"
				className="wind-store-page-front movie-apps my-8 py-20 w-auto mx-8 flex justify-between noscroll overflow-x-scroll overflow-y-hidden"
			>
				<div className="flex w-64 flex-col text-gray-100 h-full px-8">
					<div className="text-xl">{t("store.featured-film")}</div>
					<div className="text-xs mt-2">{t("store.featured-film.info")}</div>
				</div>
				<div className="flex w-max pr-8">
					{movrib &&
						// 遍历movrib项目
						movrib.map((x, i) => {
							var stars = 3 + ((x.charCodeAt(0) + x.charCodeAt(1)) % 3);
							return (
								<div key={i} className="wind-store-page-app rounded my-auto p-2 pb-2">
									<Image className="mx-1 py-1 mb-2 rounded" w={120} dir="store/movies" src={x} />
									<div className="capitalize text-xs font-semibold">{x}</div>
									<div className="flex mt-2 items-center">
										{/* 根据计算渲染星星图标 */}
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className="bluestar" fafa="faStar" width={6} />
										<Icon className={stars > 3 ? "bluestar" : ""} fafa="faStar" width={6} />
										<Icon className={stars > 4 ? "bluestar" : ""} fafa="faStar" width={6} />
										<div className="text-xss">{1 + (x.charCodeAt(3) % 5)}k</div>
									</div>
									<div className="text-xss mt-8">{x.charCodeAt(4) % 2 ? <>{t("store.rent")}</> : <>{t("store.owned")}</>}</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default FrontPage;
