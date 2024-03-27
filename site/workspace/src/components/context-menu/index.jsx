import React from "react";
import { useSelector } from "react-redux";

import { Icon } from "@/components/global";

import { contextMenuClickDispatch } from "@/actions";

import { contextMenuOptionsSelector } from "@/selectors/context-menu";

import "./index.scss";

/**
 * 活动菜单组件
 * @returns {JSX.Element} - 返回活动菜单组件的 JSX 元素
 */
export const ContextMenu = () => {
	var menu = useSelector((state) => state.contextmenu);
	var menuData = menu.data[menu.opts]; // 获取菜单数据

	var { abpos, isLeft } = useSelector(contextMenuOptionsSelector); // 计算菜单位置信息和布局方向

	/**
	 * 递归生成菜单项组件的函数
	 * @param {Array} data - 包含菜单项信息的数组
	 * @returns {Array} - 生成的菜单项组件数组
	 */
	const renderContextMenu = (data) => {
		return data.reduce((menus, option, index) => {
			if (option.type === "hr") {
				menus.push(<div key={index} className="context-menu-hr"></div>); // 分隔线
			} else {
				var { icon, type, name, opts, dot, check } = option;
				var menuItem = (
					<div
						key={index}
						className="context-menu-option"
						data-dsb={option.dsb}
						data-slice={option.slice}
						data-action={option.action}
						data-payload={option.payload}
						onClick={(event) => contextMenuClickDispatch(event, menu)}
					>
						{/* 菜单项内容 */}
						{menuData.ispace !== false && (
							<div className="option-icon">
								{icon && !type && <Icon src={icon} width={16} />} {/* 普通图片图标 */}
								{icon && type === "svg" && <Icon icon={icon} width={16} />} {/* SVG 图标 */}
								{icon && type === "fa" && <Icon fafa={icon} width={16} />} {/* Font Awesome 图标 */}
							</div>
						)}

						{/* 菜单项名称 */}
						<div className="option-name">{name}</div>

						{/* 右侧箭头图标 */}
						{opts && <Icon className="option-micon option-micon-right" fafa="faChevronRight" width={10} color="#999" />}

						{/* 圆点图标 */}
						{dot && <Icon className="option-micon option-micon-do" fafa="faCircle" width={4} height={4} />}

						{/* 勾选图标 */}
						{check && <Icon className="option-micon option-micon-check" fafa="faCheck" width={8} height={8} />}

						{/* 递归调用生成子菜单项 */}
						{opts && (
							<div className="context-menu-option-sub" style={{ minWidth: menuData.secwid }}>
								{renderContextMenu(opts)}
							</div>
						)}
					</div>
				);
				menus.push(menuItem);
			}
			return menus;
		}, []);
	};

	return (
		<div
			id="context-menu" /* 菜单容器的ID */
			className="context-menu" /* CSS类名 */
			data-left={isLeft} /* 左侧显示标志位 */
			data-hide={menu.hide} /* 菜单隐藏标志位 */
			style={{
				...abpos /* 绝对定位样式 */,
				"--slice": "context-menu" /* 前缀设置 */,
				width: menuData.width /* 菜单宽度 */,
			}}
		>
			{renderContextMenu(menu.menus[menu.opts])} {/* 渲染菜单项 */}
		</div>
	);
};

export default ContextMenu;
