import { useEffect } from "react";
import { useSelector } from "react-redux";

import { toggleBattery } from "@/actions";

import "./index.scss";

/**
 * 电池组件
 * @param {object} props - 组件属性
 * @param {number} props.pct - 是否显示电量百分比
 * @param {boolean} props.invert - 是否反转图标颜色
 * @returns {JSX.Element} - 返回电池组件的 JSX 元素
 */
const Battery = ({ pct, invert }) => {
	// 获取电池电量
	var btLevel = useSelector((state) => state.setting.system.power.battery);

	// 使用 useEffect 处理副作用
	useEffect(() => {
		// 检查浏览器是否支持 BatteryManager
		if (window.BatteryManager) {
			// 异步函数，获取电池信息并更新状态
			(async () => {
				let bt = await navigator.getBattery();

				toggleBattery(bt);

				// 监听电量变化事件并更新状态
				bt.onlevelchange = () => toggleBattery(bt);

				// 监听充电状态变化事件并更新状态
				bt.onchargingchange = () => toggleBattery(bt);
			})();
		}
	}, []);

	// 返回 JSX 元素
	return (
		<>
			{/* 电池图标 */}
			<div className={`uicon taskIcon ${invert ? "invert" : ""}`}>
				<span className="battery">
					{/* 如果电量小于0，显示充电图标 */}
					{btLevel < 0 ? (
						<div className="battery-charger">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
								<path
									fill="#000"
									stroke="#f3f3f3"
									strokeWidth="2"
									d="m8.294 14-1.767 7.068c-.187.746.736 1.256 1.269.701L19.79 9.27A.75.75 0 0 0 19.25 8h-4.46l1.672-5.013A.75.75 0 0 0 15.75 2h-7a.75.75 0 0 0-.721.544l-3 10.5A.75.75 0 0 0 5.75 14h2.544Z"
								/>
							</svg>
						</div>
					) : null}
					{/* 电池电量图标 */}
					<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24">
						<path
							xmlns="http://www.w3.org/2000/svg"
							fill="#000"
							d="M17 6a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h12Zm-.002 1.5H5a1.5 1.5 0 0 0-1.493 1.356L3.5 9v6a1.5 1.5 0 0 0 1.355 1.493L5 16.5h11.998a1.5 1.5 0 0 0 1.493-1.355l.007-.145V9a1.5 1.5 0 0 0-1.355-1.493l-.145-.007Z"
						/>
					</svg>
					{/* 电池电量填充 */}
					<div className="battery-full" style={{ width: `${Math.round(Math.abs(btLevel))}%` }}>
						<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24">
							<path
								fill="#000"
								d="M17 6a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v1a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h12Zm-.002 1.5H5a1.5 1.5 0 0 0-1.494 1.356L3.5 9v6a1.5 1.5 0 0 0 1.355 1.493L5 16.5h11.998a1.5 1.5 0 0 0 1.493-1.355l.007-.145V9a1.5 1.5 0 0 0-1.355-1.493l-.145-.007ZM6 9h10a1 1 0 0 1 .993.883L17 10v4a1 1 0 0 1-.883.993L16 15H6a1 1 0 0 1-.993-.883L5 14v-4a1 1 0 0 1 .883-.993L6 9h10H6Z"
							/>
						</svg>
					</div>
				</span>
			</div>
			{/* 如果需要显示电量百分比，则显示 */}
			{pct ? <div className="text-xs">{Math.round(Math.abs(btLevel))}%</div> : null}
		</>
	);
};

export default Battery;
