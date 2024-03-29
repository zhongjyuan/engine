import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Icon, Image, ToolBar } from "@/components/global";

import { clickDispatch, openFileFolder } from "@/actions";

import "./assets/fileexpo.scss";

/**
 * NavTitle组件，用于展示导航标题
 *
 * @param {object} props - 组件属性
 * @param {string} props.icon - 图标名称，默认为"folder"
 * @param {string} props.action - 点击操作
 * @param {string} props.payload - 相关数据
 * @param {number} props.isize - 图标尺寸，默认为16
 * @param {string} props.title - 标题文本
 * @returns {JSX.Element} 返回NavTitle组件的JSX元素
 */
const DropdownItemTitle = (props) => {
	// 确定图标来源
	var src = props.icon || "folder";

	return (
		<div className="explor-nav-title flex prtclk" data-action={props.action} data-payload={props.payload} onClick={clickDispatch}>
			{/* 图标和图标尺寸 */}
			<Icon className="mr-1" src={"win/" + src + "-sm"} width={props.isize || 16} />
			{/* 标题文本 */}
			<span>{props.title}</span>
		</div>
	);
};

/**
 * FolderDropdown组件，用于展示文件夹下拉菜单
 *
 * @param {object} props - 组件属性
 * @param {string} props.dir - 文件夹ID
 * @returns {JSX.Element} 返回FolderDropdown组件的JSX元素
 */
const FolderDropdown = (props) => {
	// 从状态中获取文件信息和文件夹数据
	const files = useSelector((state) => state.files);
	const folder = files.data.getId(props.dir);

	return (
		<>
			{/* 遍历文件夹数据 */}
			{folder.data &&
				folder.data.map((item, i) => {
					if (item.type === "folder") {
						// 如果是文件夹，则渲染下拉菜单项
						return (
							<NavigatePaneDropdown key={i} icon={item.info && item.info.icon} title={item.name} notoggle={item.data.length === 0} dir={item.id} />
						);
					}
				})}
		</>
	);
};

/**
 * 导航下拉组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isDropped - 指示下拉菜单是否展开的标志
 * @param {boolean} props.notoggle - 禁用切换功能的标志
 * @param {string} props.spid - 目录的特殊 ID
 * @param {string} props.dir - 目录路径
 * @param {string} props.icon - 下拉菜单的图标
 * @param {string} props.title - 下拉菜单标题
 * @param {number} props.isize - 图标大小
 * @param {string} props.action - 执行的操作
 * @param {boolean} props.pinned - 指示下拉菜单是否被固定的标志
 */
const NavigatePaneDropdown = (props) => {
	// 控制下拉菜单打开/关闭的状态
	const [open, setOpen] = useState(props.isDropped != null);

	// 从 Redux 状态中选择特殊数据
	const special = useSelector((state) => state.files.data.special);

	// 当前目录的状态
	const [dir, setDir] = useState(() => (props.spid ? special[props.spid] : props.dir));

	// 切换下拉菜单状态的函数
	const toggle = () => setOpen(!open);

	return (
		<div className="explor-dropdown-container">
			<div className="dropdown-title">
				{/* 下拉菜单的切换按钮 */}
				{!props.notoggle ? (
					<Icon className={`dropdown-toggle ${open ? "faChevronDown" : "faChevronRight"}`} width={10} onClick={toggle} pr />
				) : (
					<Icon className="dropdown-toggle opacity-0" fafa="faCircle" width={10} />
				)}

				{/* 下拉菜单项的标题和图标 */}
				<DropdownItemTitle
					icon={props.icon}
					title={props.title}
					isize={props.isize}
					action={props.action !== "" ? props.action || "FILEDIR" : null}
					payload={dir}
				/>
				{/* 如果适用，显示固定图标 */}
				{props.pinned != null ? <Icon className="dropdown-pinned" src="win/pinned" width={16} /> : null}
			</div>
			{/* 下拉菜单内容部分 */}
			{!props.notoggle && (
				<div className="dropdown-content">
					{/* 如果下拉菜单打开，则显示子元素 */}
					{open && props.children}
					{/* 如果目录可用，则显示文件夹下拉菜单 */}
					{open && dir != null && <FolderDropdown dir={dir} />}
				</div>
			)}
		</div>
	);
};

/**
 * DirContainer组件，展示文件路径的容器
 *
 * @param {object} props - 组件属性
 * @param {object} props.fileData - 文件数据对象
 * @param {function} props.click - 点击事件处理函数
 * @returns {JSX.Element} 返回DirContainer组件的JSX元素
 */
const NavigateDir = (props) => {
	// 初始化变量
	var index = 0,
		filePaths = [],
		fileData = props.fileData;

	// 遍历文件路径
	while (fileData) {
		filePaths.push(
			<div key={index++} className="dir-container flex items-center">
				{/* 文件夹内容 */}
				<div className="dir-content" tabIndex="-1" data-action="FILEDIR" data-payload={fileData.id} onClick={clickDispatch}>
					{fileData.name}
				</div>
				{/* 右侧箭头图标 */}
				<Icon className="dir-chevy" fafa="faChevronRight" width={8} />
			</div>
		);

		fileData = fileData.host;
	}

	// 添加"This PC"文件夹
	filePaths.push(
		<div key={index++} className="dir-container flex items-center">
			<div className="dir-content" tabIndex="-1">
				This PC
			</div>
			<Icon className="dir-chevy" fafa="faChevronRight" width={8} />
		</div>
	);

	// 添加系统图标文件夹
	filePaths.push(
		<div key={index++} className="dir-container flex items-center">
			<Icon className="pr-1 pb-px" src={"win/" + fileData.info.icon + "-sm"} width={16} />
			<Icon className="dir-chevy" fafa="faChevronRight" width={8} />
		</div>
	);

	// 返回文件路径容器
	return (
		<div key={index++} className="dir-box h-full flex">
			{filePaths.reverse()}
		</div>
	);
};

/**
 * Ribbon组件，展示操作按钮栏
 *
 * @param {object} props - 组件属性
 * @returns {JSX.Element} 返回Ribbon组件的JSX元素
 */
const Ribbon = (props) => {
	return (
		<div className="explorer-ribbon flex">
			{/* 新建操作 */}
			<div className="ribbon-sec">
				<div className="ribbon-drdw flex">
					<Icon src="new" ui width={18} margin="0 6px" />
					<span>新建</span>
				</div>
			</div>
			{/* 复制、剪切、粘贴、重命名、分享操作 */}
			<div className="ribbon-sec">
				<Icon src="cut" ui width={18} margin="0 6px" />
				<Icon src="copy" ui width={18} margin="0 6px" />
				<Icon src="paste" ui width={18} margin="0 6px" />
				<Icon src="rename" ui width={18} margin="0 6px" />
				<Icon src="share" ui width={18} margin="0 6px" />
			</div>
			{/* 排序和查看操作 */}
			<div className="ribbon-sec">
				<div className="ribbon-drdw flex">
					<Icon src="sort" ui width={18} margin="0 6px" />
					<span>排序</span>
				</div>
				<div className="ribbon-drdw flex">
					<Icon src="view" ui width={18} margin="0 6px" />
					<span>查看</span>
				</div>
			</div>
		</div>
	);
};

/**
 * Navigate组件，用于展示导航栏和搜索栏
 *
 * @param {object} props - 组件属性
 * @param {object} props.files - 文件信息对象
 * @param {string} props.inputValue - 输入框的数值
 * @param {function} props.inputChange - 输入框改变事件处理函数
 * @param {function} props.inputKeyDown - 输入框键盘按下事件处理函数
 * @param {object} props.data - 文件数据对象
 * @param {function} props.click - 点击事件处理函数
 * @param {string} props.searchValue - 搜索框的数值
 * @param {function} props.searchChange - 搜索框改变事件处理函数
 * @returns {JSX.Element} 返回Navigate组件的JSX元素
 */
const Navigate = (props) => {
	return (
		<>
			{/* 左箭头图标 */}
			<Icon
				className={"nav-icon nav-icon-theme" + (props.files.hid == 0 ? " nav-icon-disable" : "")}
				fafa="faArrowLeft"
				width={14}
				click="FILEPREV"
				pr
			/>
			{/* 右箭头图标 */}
			<Icon
				className={"nav-icon nav-icon-theme" + (props.files.hid + 1 == props.files.hist.length ? " nav-icon-disable" : "")}
				width={14}
				fafa="faArrowRight"
				click="FILENEXT"
				pr
			/>
			{/* 上箭头图标 */}
			<Icon className="nav-icon nav-icon-theme" fafa="faArrowUp" width={14} click="FILEBACK" pr />
			<div className="path-bar noscroll" tabIndex="-1">
				{/* 路径输入框 */}
				<input className="path-field" type="text" value={props.inputValue} onChange={props.inputChange} onKeyDown={props.inputKeyDown} />
				{/* 文件路径容器 */}
				<NavigateDir fileData={props.data} click={props.click} />
			</div>
			<div className="search-bar">
				{/* 搜索图标 */}
				<Icon className="search-icon" src="search" width={12} />
				{/* 搜索输入框 */}
				<input type="text" placeholder="搜索" value={props.searchValue} onChange={props.searchChange} />
			</div>
		</>
	);
};

/**
 * NavigatePane组件，用于展示导航面板内容
 *
 * @param {object} props - 组件属性
 * @returns {JSX.Element} 返回NavigatePane组件的JSX元素
 */
const NavigatePane = (props) => {
	// 从状态中获取文件信息和特殊文件数据
	const files = useSelector((state) => state.files);
	const special = useSelector((state) => state.files.data.special);

	return (
		<div className="navigate-pane scroll">
			<div className="navigate-container">
				{/* 快速访问下拉菜单 */}
				<NavigatePaneDropdown icon="star" title="快速访问" action="" isDropped>
					{/* 下载选项 */}
					<NavigatePaneDropdown icon="down" title="下载" spid="%downloads%" notoggle pinned />
					{/* 此电脑选项 */}
					<NavigatePaneDropdown icon="user" title="此电脑" spid="%user%" notoggle pinned />
					{/* 文档选项 */}
					<NavigatePaneDropdown icon="docs" title="文档" spid="%documents%" notoggle pinned />
					{/* Github选项 */}
					<NavigatePaneDropdown title="Github" spid="%github%" notoggle />
					{/* 图片选项 */}
					<NavigatePaneDropdown icon="pics" title="图片" spid="%pictures%" notoggle />
				</NavigatePaneDropdown>
				{/* OneDrive选项 */}
				<NavigatePaneDropdown icon="onedrive" title="OneDrive" spid="%onedrive%" />
				{/* 此电脑下拉菜单 */}
				<NavigatePaneDropdown icon="thispc" title="此电脑" action="" isDropped>
					{/* 桌面选项 */}
					<NavigatePaneDropdown icon="desk" title="桌面" spid="%desktop%" />
					{/* 文档选项 */}
					<NavigatePaneDropdown icon="docs" title="文档" spid="%documents%" />
					{/* 下载选项 */}
					<NavigatePaneDropdown icon="down" title="下载" spid="%downloads%" />
					{/* 音乐选项 */}
					<NavigatePaneDropdown icon="music" title="音乐" spid="%music%" />
					{/* 图片选项 */}
					<NavigatePaneDropdown icon="pics" title="图片" spid="%pictures%" />
					{/* 视频选项 */}
					<NavigatePaneDropdown icon="vid" title="视频" spid="%videos%" />
					{/* C盘系统选项 */}
					<NavigatePaneDropdown icon="disc" title="系统 (C:)" spid="%cdrive%" />
					{/* D盘软件选项 */}
					<NavigatePaneDropdown icon="disk" title="软件 (D:)" spid="%ddrive%" />
				</NavigatePaneDropdown>
			</div>
		</div>
	);
};

/**
 * 内容面板组件
 * @param {Object} props - 组件属性
 * @param {string} props.searchValue - 搜索值
 */
const ContentPane = (props) => {
	const dispatch = useDispatch(); // 获取 dispatch 函数

	const [selected, setSelect] = useState(null); // 选中项状态

	const files = useSelector((state) => state.files); // 从 Redux 状态中选择文件数据
	const special = useSelector((state) => state.files.data.special); // 从 Redux 状态中选择特殊数据

	const fdata = files.data.getId(files.cdir); // 获取当前目录的文件数据

	/**
	 * 处理单击事件
	 * @param {Event} event - 事件对象
	 */
	const handleClick = (event) => {
		event.stopPropagation(); // 阻止事件冒泡
		setSelect(e.target.dataset.id); // 设置选中项
	};

	/**
	 * 处理双击事件
	 * @param {Event} event - 事件对象
	 */
	const handleDouble = (event) => {
		event.stopPropagation(); // 阻止事件冒泡
		openFileFolder(event.target.dataset.id); // 打开文件夹或文件
	};

	/**
	 * 处理空白区域点击事件
	 * @param {Event} event - 事件对象
	 */
	const emptyClick = (event) => {
		setSelect(null); // 清空选中项
	};

	/**
	 * 处理键盘事件
	 * @param {Event} event - 事件对象
	 */
	const handleKey = (event) => {
		if (event.key == "Backspace") {
			dispatch({ type: "FILEPREV" }); // 处理按下 Backspace 键的事件，触发返回上一级目录操作
		}
	};

	return (
		<div className="content-pane" tabIndex="-1" onClick={emptyClick} onKeyDown={handleKey}>
			<div className="content-wrapper scroll">
				<div className="content-grid" data-size="lg">
					{fdata.data.map((item, i) => {
						return (
							item.name.includes(props.searchValue) && ( // 如果文件名包含搜索值，则渲染该文件项
								<div
									key={i}
									className="content-item nav-icon-theme flex flex-col items-center prtclk"
									data-id={item.id}
									data-focus={selected == item.id}
									onClick={handleClick}
									onDoubleClick={handleDouble}
								>
									<Image src={`icon/win/${item.info.icon}`} /> {/* 文件图标 */}
									<span>{item.name}</span> {/* 文件名 */}
								</div>
							)
						);
					})}
				</div>
				{fdata.data.length == 0 ? <span className="text-xs mx-auto">This folder is empty.</span> : null} {/* 如果文件夹为空，则显示提示信息 */}
			</div>
		</div>
	);
};

/**
 * Explorer组件用于展示文件资源管理器界面
 * @returns {JSX.Element} 返回文件资源管理器的React元素
 */
export const ExplorerWind = () => {
	const dispatch = useDispatch(); // 获取dispatch方法

	const app = useSelector((state) => state.apps.explorer); // 获取应用程序状态
	const files = useSelector((state) => state.files); // 获取文件状态

	const fdata = files.data.getId(files.cdir); // 获取当前目录的文件数据

	const [searchValue, setSearchValue] = useState(""); // 搜索框的值
	const [currentPath, setCurrentPath] = useState(files.cpath); // 当前路径

	const inputChange = (event) => setCurrentPath(event.target.value); // 当输入变化时更新当前路径
	const searchChange = (event) => setSearchValue(event.target.value); // 当搜索框变化时更新搜索值

	const inputKeyDown = (event) => {
		if (event.key === "Enter") {
			dispatch({ type: "FILEPATH", payload: currentPath }); // 如果按下回车键，则发送文件路径的action
		}
	};

	useEffect(() => {
		setCurrentPath(files.cpath); // 当路径变化时更新当前路径
		setSearchValue(""); // 清空搜索框的值
	}, [files.cpath]);

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-explorer dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="文件资源管理器" /> {/* 工具栏组件 */}
			<div className="scroll flex flex-col">
				<Ribbon /> {/* 顶部功能条 */}
				<div className="wind-rest flex-grow flex flex-col">
					<div className="explorer-top">
						<Navigate
							data={fdata} // 导航组件的数据
							files={files} // 文件状态
							click={clickDispatch} // 点击事件
							inputValue={currentPath} // 输入框的值
							inputChange={inputChange} // 输入框变化时的处理函数
							inputKeyDown={inputKeyDown} // 按键事件处理函数
							searchValue={searchValue} // 搜索框的值
							searchChange={searchChange} // 搜索框变化时的处理函数
						/>
					</div>
					<div className="explorer-middle">
						<NavigatePane /> {/* 导航面板组件 */}
						<ContentPane searchValue={searchValue} /> {/* 内容面板组件 */}
					</div>
					<div className="explorer-bottom">
						<div className="item-count text-xs">{fdata.data.length} 个项目</div> {/* 显示项目数量 */}
						<div className="view-options flex">
							<Icon className="view-option nav-icon-theme p-1" click="FILEVIEW" payload="5" open={files.view == 5} src="win/viewinfo" width={16} />{" "}
							{/* 图标组件，用于切换文件视图 */}
							<Icon
								className="view-option nav-icon-theme p-1"
								click="FILEVIEW"
								payload="1"
								open={files.view == 1}
								src="win/viewlarge"
								width={16}
							/>{" "}
							{/* 图标组件，用于切换文件视图 */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
