/**
 * 权限管理对象
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月15日17:45:18
 */
const permissionManagement = {
	/**下一个权限ID，默认为1 */
	nextPermissionId: 1,

	/**待处理的权限请求数组 */
	pendingPermissions: [],

	/**已经授予的权限数组 */
	grantedPermissions: [],

	/**
	 * 将权限发送到渲染器进程
	 */
	sendPermissionsToRenderers: function () {
		// 将所有请求发送到所有窗口 - 每个窗口的选项卡栏将决定要显示什么
		windowManagement.getOpenWins().forEach(function (win) {
			sendIPCToWindow(
				win,
				"updatePermissions",
				// 序列化权限对象并删除不能通过IPC序列化的属性
				permissionManagement.pendingPermissions.concat(permissionManagement.grantedPermissions).map((p) => {
					return {
						permissionId: p.permissionId,
						tabId: p.tabId,
						origin: p.origin,
						permission: p.permission,
						details: p.details,
						granted: p.granted,
					};
				})
			);
		});
	},

	/**
	 * 移除指定内容的权限
	 * @param {Electron.WebContents} contents WebContents对象
	 */
	removePermissionsForContents: function (contents) {
		// 过滤掉待处理和已授予的权限中与指定内容匹配的权限
		permissionManagement.pendingPermissions = permissionManagement.pendingPermissions.filter((perm) => perm.contents !== contents);

		permissionManagement.grantedPermissions = permissionManagement.grantedPermissions.filter((perm) => perm.contents !== contents);

		permissionManagement.sendPermissionsToRenderers();
	},

	/**
	 * 判断指定来源和权限是否已经授权
	 * @param {*} requestOrigin
	 * @param {*} requestPermission
	 * @param {*} requestDetails
	 * @returns
	 */
	isPermissionGrantedForOrigin: function (requestOrigin, requestPermission, requestDetails) {
		for (var i = 0; i < permissionManagement.grantedPermissions.length; i++) {
			if (requestOrigin === permissionManagement.grantedPermissions[i].origin) {
				if (requestPermission === "notifications" && permissionManagement.grantedPermissions[i].permission === "notifications") {
					return true;
				}

				if (requestPermission === "pointerLock" && permissionManagement.grantedPermissions[i].permission === "pointerLock") {
					return true;
				}

				if (requestPermission === "media" && permissionManagement.grantedPermissions[i].permission === "media") {
					// 类型 1：来自 permissionCheckHandler 的请求只有一个媒体类型
					if (requestDetails.mediaType && permissionManagement.grantedPermissions[i].details.mediaTypes.includes(requestDetails.mediaType)) {
						return true;
					}

					// 类型 2：来自 permissionRequestHandler 的请求有多个媒体类型
					// TODO：现有的授予的权限应该合并在一起（即如果存在音频的现有权限，并且视频的另一个权限，对音频+视频的新请求应该被批准，但目前不会被批准）
					if (
						requestDetails.mediaTypes &&
						requestDetails.mediaTypes.every((type) => permissionManagement.grantedPermissions[i].details.mediaTypes.includes(type))
					) {
						return true;
					}

					// 类型 3：没有特定类型的一般媒体权限，在授予更具体的权限类型后立即出现
					if (!requestDetails.mediaType && !requestDetails.mediaTypes && permissionManagement.grantedPermissions[i].permission === "media") {
						return true;
					}
				}
			}
		}
		return false;
	},

	/**
	 * 判断是否存在指定来源和权限的待处理请求
	 * @param {*} requestOrigin
	 * @param {*} permission
	 * @param {*} details
	 * @returns
	 */
	hasPendingRequestForOrigin: function (requestOrigin, permission, details) {
		for (var i = 0; i < permissionManagement.pendingPermissions.length; i++) {
			if (
				requestOrigin === permissionManagement.pendingPermissions[i].origin &&
				permission === permissionManagement.pendingPermissions[i].permission
			) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 页面权限请求处理程序
	 * @param {*} webContents
	 * @param {*} permission
	 * @param {*} callback
	 * @param {*} details
	 * @returns
	 */
	pagePermissionRequestHandler: function (webContents, permission, callback, details) {
		if (permission === "fullscreen") {
			callback(true);
			return;
		}

		if (!details.isMainFrame) {
			// 目前不支持以简化UI
			callback(false);
			return;
		}

		if (!details.requestingUrl) {
			callback(false);
			return;
		}

		if (permission === "clipboard-sanitized-write") {
			callback(true);
			return;
		}

		let requestOrigin;
		try {
			requestOrigin = new URL(details.requestingUrl).hostname;
		} catch (e) {
			// 无效的URL
			console.warn(e, details.requestingUrl);
			callback(false);
			return;
		}

		/*
		地理位置需要谷歌API密钥（https://www.electronjs.org/docs/api/environment-variables#google_api_key），因此已禁用。
		其他权限目前不支持以简化UI
		*/
		if (["media", "notifications", "pointerLock"].includes(permission)) {
			/*
			如果此来源在不同选项卡中先前获得了权限，新请求应该被允许
			*/
			if (permissionManagement.isPermissionGrantedForOrigin(requestOrigin, permission, details)) {
				callback(true);

				// 将新授予的权限添加到已授予权限数组中
				if (!permissionManagement.grantedPermissions.some((grant) => grant.contents === webContents && grant.permission === permission)) {
					permissionManagement.grantedPermissions.push({
						permissionId: permissionManagement.nextPermissionId,
						tabId: viewManagement.getViewIDFromWebContents(webContents),
						contents: webContents,
						origin: requestOrigin,
						permission: permission,
						details: details,
						granted: true,
					});

					permissionManagement.sendPermissionsToRenderers();
					permissionManagement.nextPermissionId++;
				}
			} else if (permission === "notifications" && permissionManagement.hasPendingRequestForOrigin(requestOrigin, permission, details)) {
				/*
				网站有时会为每个通知发出新请求，如果第一个请求未被批准，则可能生成多个请求。
				TODO：这不完全正确（某些请求将被拒绝，而应该是待处理的） - 正确的解决方案是在UI中显示一个按钮来批准所有请求。
				*/
				callback(false);
			} else {
				// 将待处理的权限请求添加到待处理权限数组中
				permissionManagement.pendingPermissions.push({
					permissionId: permissionManagement.nextPermissionId,
					tabId: viewManagement.getViewIDFromWebContents(webContents),
					contents: webContents,
					origin: requestOrigin,
					permission: permission,
					details: details,
					callback: callback,
				});

				permissionManagement.sendPermissionsToRenderers();
				permissionManagement.nextPermissionId++;
			}

			/*
			一旦此视图关闭或导航到新页面，这些权限应该被撤销
			*/
			webContents.on("did-start-navigation", function (e, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
				if (isMainFrame && !isInPlace) {
					permissionManagement.removePermissionsForContents(webContents);
				}
			});

			webContents.once("destroyed", function () {
				// 检查应用程序是否正在关闭以避免Electron崩溃（TODO 删除此项）
				if (windowManagement.getOpenWins().length > 0) {
					permissionManagement.removePermissionsForContents(webContents);
				}
			});
		} else {
			callback(false);
		}
	},

	/**
	 * 页面权限检查处理程序
	 * @param {*} webContents
	 * @param {*} permission
	 * @param {*} requestingOrigin
	 * @param {*} details
	 * @returns
	 */
	pagePermissionCheckHandler: function (webContents, permission, requestingOrigin, details) {
		if (!details.isMainFrame && requestingOrigin !== details.embeddingOrigin) {
			return false;
		}

		if (permission === "clipboard-sanitized-write") {
			return true;
		}

		let requestHostname;
		try {
			requestHostname = new URL(requestingOrigin).hostname;
		} catch (e) {
			// 无效的URL
			console.warn(e, requestingOrigin);
			return false;
		}

		return permissionManagement.isPermissionGrantedForOrigin(requestHostname, permission, details);
	},

	/**
	 * 初始化函数
	 */
	initialize: function () {
		// 应用程序准备就绪时，设置权限请求和权限检查处理程序
		app.once("ready", function () {
			session.defaultSession.setPermissionRequestHandler(permissionManagement.pagePermissionRequestHandler);
			session.defaultSession.setPermissionCheckHandler(permissionManagement.pagePermissionCheckHandler);
		});

		// 当会话创建时，为会话设置权限请求和权限检查处理程序
		app.on("session-created", function (session) {
			session.setPermissionRequestHandler(permissionManagement.pagePermissionRequestHandler);
			session.setPermissionCheckHandler(permissionManagement.pagePermissionCheckHandler);
		});

		ipc.on("permissionGranted", function (e, permissionId) {
			for (var i = 0; i < permissionManagement.pendingPermissions.length; i++) {
				if (permissionId && permissionManagement.pendingPermissions[i].permissionId === permissionId) {
					permissionManagement.pendingPermissions[i].granted = true;
					permissionManagement.pendingPermissions[i].callback(true);
					permissionManagement.grantedPermissions.push(permissionManagement.pendingPermissions[i]);
					permissionManagement.pendingPermissions.splice(i, 1);

					permissionManagement.sendPermissionsToRenderers();

					break;
				}
			}
		});
	},
};

permissionManagement.initialize();