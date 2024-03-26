import { createSlice } from "@reduxjs/toolkit";

import { Bin } from "@/models/global/bin";

const defaultData = {
	"C:": {
		name: "C:",
		type: "folder",
		info: {
			spid: "%ddrive%",
			size: "104000000000",
			used: "90000000000",
		},
		data: {
			AppData: {
				type: "folder",
				name: "AppData",
				data: {
					"Flash Player": {},
				},
			},
			Microsoft: {
				type: "folder",
				name: "appData",
				data: {
					Windows: {
						type: "folder",
						name: "Windows",
						data: {
							PowerShell: {
								type: "folder",
								name: "PowerShell",
							},
						},
					},
				},
			},
			"Program Files": {
				type: "folder",
				name: "Program Files",
				data: {
					ApiFox: {},
					ApiPost: {},
					Git: {},
					IIS: {},
					"IIS Express": {},
					"Internet Explorer": {},
					LibreOffice: {},
					"Microsoft SDKs": {},
					"Microsoft SQL Server": {},
					"Microsoft Sync Framework": {},
					"Microsoft Visual Studio": {},
					"Microsoft.NET": {},
					MongoDB: {},
					MSBuild: {},
					MySQL: {},
					Nodejs: {},
					OpenVPN: {},
					ZeroTier: {},
				},
			},
			"Program Files (x86)": {
				type: "folder",
				name: "Program Files (x86)",
				data: {
					Adobe: {
						type: "folder",
						name: "Adobe",
					},
					Microsoft: {
						type: "folder",
						name: "Microsoft",
					},
					"Microsoft ASP.NET": {
						type: "folder",
						name: "Microsoft ASP.NET",
					},
					"Microsoft Office": {
						type: "folder",
						name: "Microsoft Office",
					},
					"Microsoft Silverlight": {
						type: "folder",
						name: "Microsoft Silverlight",
					},
					"Microsoft Web Tools": {
						type: "folder",
						name: "Microsoft Web Tools",
					},
					MSBuild: {
						type: "folder",
						name: "MSBuild",
					},
					NuGet: {
						type: "folder",
						name: "NuGet",
					},
					"Windows Defender": {
						type: "folder",
						name: "Windows Defender",
					},
					"Windows Kits": {
						type: "folder",
						name: "Windows Kits",
					},
					"Windows Mail": {
						type: "folder",
						name: "Windows Mail",
					},
					ZeroTier: {
						type: "folder",
						name: "ZeroTier",
					},
				},
			},
			ProgramData: {},
			Windows: {},
			Users: {
				type: "folder",
				name: "Users",
				data: {
					Public: {
						data: {
							Documents: {},
							Downloads: {},
							Music: {},
							Pictures: {},
							Videos: {},
							Desktop: {},
						},
					},
					workspace: {},
					zhongjyuan: {
						type: "folder",
						name: "zhongjyuan",
						info: {
							spid: "%user%",
							icon: "user",
						},
						data: {
							AppData: {},
							Desktop: {
								info: {
									spid: "%desktop%",
									icon: "desk",
								},
							},
							Documents: {
								info: {
									spid: "%documents%",
									icon: "docs",
								},
								data: {
									Adobe: {},
									Attachments: {},
									Downloadable: {},
									FeedbackHub: {},
									Freelancing: {},
									"Visual Studio": {},
								},
							},
							Downloads: {
								info: {
									spid: "%downloads%",
									icon: "down",
								},
							},
							Music: {
								info: {
									spid: "%music%",
									icon: "music",
								},
							},
							Pictures: {
								info: {
									spid: "%pictures%",
									icon: "pics",
								},
							},
							Videos: {
								info: {
									spid: "%videos%",
									icon: "vid",
								},
							},
							OneDrive: {
								type: "folder",
								name: "OneDrive",
								info: {
									spid: "%onedrive%",
									icon: "onedrive",
								},
							},
						},
					},
				},
			},
		},
	},
	"D:": {
		name: "D:",
		info: {
			spid: "%ddrive%",
		},
		data: {
			node_cache: {},
			node_global: {},
			Programs: {},
		},
	},
	"E:": {
		name: "E:",
		info: {
			spid: "%ddrive%",
		},
		data: {
			develop: {},
			Download: {},
			stage: {},
			production: {},
		},
	},
	"F:": {
		name: "F:",
		info: {
			spid: "%ddrive%",
		},
		data: {
			".pnpm-store": {},
			HXProjects: {},
			KuGou: {},
			LayaProjects: {},
			leonardo: {},
		},
	},
	"Z:": {
		name: "Z:",
		info: {
			spid: "%ddrive%",
		},
		data: {
			cache: {},
			code: {
				data: {
					gitee: {},
					github: {},
					gitlab: {},
					local: {},
				},
			},
			Soft: {},
			workspace_chatgpt: {},
			workspace_golang: {},
			workspace_java: {},
			workspace_net: {},
			workspace_node: {},
			workspace_python: {},
			workspace_react: {},
			workspace_vue: {},
			workspace_wx: {},
		},
	},
};

export const initialState = () => {
	const defState = {
		cdir: "%user%",
		hist: [],
		hid: 0,
		view: 1,
	};

	defState.hist.push(defState.cdir);
	defState.data = new Bin();
	defState.data.parse(defaultData);

	return defState;
};

/**
 * 处理文件资源管理函数
 *
 * @param {Object} tmpState - 包含临时状态的对象
 * @param {Boolean} navHist - 导航历史记录数组
 * @returns {Object} - 更新后的状态对象
 */
const handle = (tmpState, navHist) => {
	// 如果没有导航历史记录并且当前目录不等于历史记录中的目录
	if (!navHist && tmpState.cdir != tmpState.hist[tmpState.hid]) {
		// 删除当前目录之后的历史记录
		tmpState.hist.splice(tmpState.hid + 1);

		// 将当前目录添加到历史记录中
		tmpState.hist.push(tmpState.cdir);

		// 更新历史记录索引
		tmpState.hid = tmpState.hist.length - 1;
	}

	// 更新当前目录为历史记录中对应索引的目录
	tmpState.cdir = tmpState.hist[tmpState.hid];

	// 检查当前目录是否包含特殊字符"%"
	if (tmpState.cdir.includes("%")) {
		// 如果当前目录在特殊数据中有对应值，则更新当前目录为特殊数据中的对应值
		if (tmpState.data.special[tmpState.cdir] != null) {
			tmpState.cdir = tmpState.data.special[tmpState.cdir];
			tmpState[tmpState.hid] = tmpState.cdir;
		}
	}

	// 根据当前目录获取路径并更新到状态对象中
	tmpState.cpath = tmpState.data.getPath(tmpState.cdir);

	return tmpState; // 返回更新后的状态对象
};

/**
 * 文件资源管理切片
 */
export const fileExplorerSlice = createSlice({
	name: "file-explorer", // 切片名称
	initialState: initialState(), // 初始化状态

	reducers: {
		/**
		 * 返回上级目录
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		back: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			let item = tmpState.data.getId(tmpState.cdir); // 获取当前目录项

			if (item.host) tmpState.cdir = item.host.id; // 如果存在父级目录，则返回父级目录

			return handle(tmpState, false); // 调用处理函数更新状态
		},

		/**
		 * 查看下一个文件
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		next: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState.hid++; // 增加历史记录索引

			if (tmpState.hid > tmpState.hist.length - 1) tmpState.hid = tmpState.hist.length - 1; // 确保历史记录索引不超过历史记录长度

			return handle(tmpState, true); // 调用处理函数更新状态
		},

		/**
		 * 查看前一个文件
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		prev: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState.hid--; // 减少历史记录索引

			if (tmpState.hid < 0) tmpState.hid = 0; // 确保历史记录索引不小于0

			return handle(tmpState, true); // 调用处理函数更新状态
		},

		/**
		 * 设置文件目录
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		setDir: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState.cdir = action.payload; // 设置当前目录

			return handle(tmpState, false); // 调用处理函数更新状态
		},

		/**
		 * 设置文件路径
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		setPath: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			let pathid = tmpState.data.parsePath(action.payload); // 解析文件路径

			if (pathid) tmpState.cdir = pathid; // 设置当前目录为解析后的路径

			return handle(tmpState, false); // 调用处理函数更新状态
		},

		/**
		 * 设置文件查看视图
		 *
		 * @param {Object} state - 当前状态对象
		 * @param {Object} action - 包含payload的动作对象
		 * @returns {Object} - 更新后的状态对象
		 */
		setView: (state, action) => {
			// 复制原始状态对象以避免直接修改
			let tmpState = { ...state };

			tmpState.view = action.payload; // 设置文件查看视图

			return handle(tmpState, false); // 调用处理函数更新状态
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => handle(state, false));
	},
});

// 每个 case reducer 函数会生成对应的 Action creators
export const actions = fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;
