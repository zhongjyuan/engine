/**
 * 渲染对象
 * @author zhongjyuan
 * @date   2023年5月18日16:45:53
 * @email  zhongjyuan@outlook.com
 */
ZHONGJYUAN.render = (function() {
	/**
	 * 开始渲染
	 * @author zhongjyuan
	 * @date   2023年6月6日16:57:15
	 * @email  zhongjyuan@outlook.com
	 * @param {*} data 数据对象
	 * @param {*} pre 前置函数[渲染之前]
	 * @param {*} post 后置函数[渲染之后]
	 */
	function start(data, pre, post) {
		ZHONGJYUAN.logger.trace("render.[start] data:${0}", JSON.stringify(data));

		ZHONGJYUAN.vue = new Vue({
			el: "#" + ZHONGJYUAN.static.custom.vueBeforeRootElement,
			data: data,
			template: ZHONGJYUAN.getVariable("vueTemplate"),
			created: function() {
				if (typeof pre === "function") pre();
				this.runtime_initialize(true);
				if (typeof post === "function") post();
				ZHONGJYUAN.logger.info(ZHONGJYUAN.static.info.welcome);
			},
			methods: {
				image_error: function(element) {
					element.src = "./assets/image/error/0.gif";
				},
				/**
				 * 运行配置初始化
				 * @author zhongjyuan
				 * @date   2023年6月1日19:24:46
				 * @email  zhongjyuan@outlook.com
				 * @param {*} first 是否第一次加载
				 */
				runtime_initialize: function(first) {
					ZHONGJYUAN.logger.trace("vue.[runtime_initialize]");
					var that = this;

					// 窗体尺寸变更
					that.on_resize();

					// IE浏览器处理
					that.on_ie();

					// 初始化壁纸
					that.wallpaper_initialize();

					// 修正壁纸比例
					that.wallpaper_update_scale();

					if (first) {
						// 窗体尺寸变更监听
						$(window).resize(that.on_resize);

						// 时钟轮询
						that.interval_calendar();

						// 自定义滚动条轮询
						that.interval_niceScroll();

						// 壁纸幻灯片轮询
						that.interval_wallpaper_slide();

						// 基础配置保存轮询
						that.interval_config_save();

						// 设置窗体F5刷新
						that.win_set_f5_strategy();

						// 设置窗体健康轮询
						that.interval_win_health();
					}

					that.ready = true;
					ZHONGJYUAN.logger.debug("vue.[runtime_initialize] ready:${0};runtime:${1}", that.ready, JSON.stringify(that.runtime));
				},

				/**
				 * IE浏览器处理函数
				 * @author zhongjyuan
				 * @date   2023年6月1日17:08:11
				 * @email  zhongjyuan@outlook.com
				 */
				on_ie: function() {
					ZHONGJYUAN.logger.trace("vue.[on_ie]");
					var runtime = this.runtime;

					if (ZHONGJYUAN.helper.check.isIE()) {
						runtime.isIE = true;

						if (ZHONGJYUAN.static.switch.remindPoorExperienceInIE) {
							setTimeout(function() {
								ZHONGJYUAN.api.message.win(ZHONGJYUAN.api.lang("WarningPerformanceInIETitle"), ZHONGJYUAN.api.lang("WarningPerformanceInIEContent"));
							}, 2000);
						}
					}
				},

				/**
				 * 重置处理函数
				 * @author zhongjyuan
				 * @date   2023年6月1日17:08:18
				 * @email  zhongjyuan@outlook.com
				 */
				on_reset: function() {
					ZHONGJYUAN.logger.trace("vue.[on_reset]");
					var that = this;
					that.$set(that, "apps", {});

					var data = ZHONGJYUAN.static.template.basic;
					for (var i in data) {
						if (i !== "apps") {
							that.$set(that, i, data[i]);
						}
					}
				},

				/**
				 * 大小变更处理函数
				 * @author zhongjyuan
				 * @date   2023年6月1日17:08:24
				 * @email  zhongjyuan@outlook.com
				 */
				on_resize: function() {
					ZHONGJYUAN.logger.trace("vue.[on_resize]");
					var that = this;

					var screenSize = ZHONGJYUAN.helper.browserResolution();

					that.runtime.screenSize.width = screenSize.width;
					that.runtime.screenSize.height = screenSize.height;

					that.runtime.desktopSize.width = screenSize.width;
					that.runtime.desktopSize.height = screenSize.height - 40;

					that.runtime.isSmallScreen = screenSize.width <= 768;
					that.runtime.isHorizontalScreen = screenSize.width > screenSize.height;

					that.runtime.startMenu.width =
						screenSize.width > that.startMenu.width && !that.runtime.isSmallScreen ? that.startMenu.width : screenSize.width;
					that.runtime.startMenu.height =
						that.runtime.desktopSize.height > that.startMenu.height && !that.runtime.isSmallScreen
							? that.startMenu.height
							: that.runtime.desktopSize.height;

					// 计算磁贴列数
					var groupNum = 1;

					// 计算磁贴尺寸
					var widthFixed = that.runtime.startMenu.width - (that.runtime.isSmallScreen ? 80 : 328);
					if (widthFixed <= 460) {
						groupNum = 1;
					} else if (widthFixed <= 769) {
						groupNum = 2;
					} else if (widthFixed <= 1024) {
						groupNum = 3;
					} else {
						groupNum = 4;
					}

					that.runtime.tilesGroupNum = groupNum;
					for (var size = 0; size < 1000; size++) {
						var width = (size + 4) * 6;
						if (width > (widthFixed - 12 * groupNum) / groupNum) {
							size--;
							break;
						}
					}
					that.runtime.tileSize = size;
					that.runtime.tilesWidth = (size + 4) * 6;

					// 计算桌面网格尺寸
					that.runtime.shortcutWidth = that.runtime.isSmallScreen ? 56 : 68;
					that.runtime.shortcutHeight = that.runtime.isSmallScreen ? 70 : 90;

					that.runtime.shortcutsGrid.x = parseInt(that.runtime.desktopSize.width / that.runtime.shortcutWidth);
					that.runtime.shortcutsGrid.y = parseInt(that.runtime.desktopSize.height / that.runtime.shortcutHeight);

					var dx = parseInt(that.runtime.winOpenCounter % 10) * that.runtime.screenSize.height * 0.01; //坐标偏移量
					for (var i in that.wins) {
						var win = that.wins[i];

						//如果是手机屏幕，最大化
						if (that.runtime.isSmallScreen && !win.plugin && win.resizable) {
							win.state = "max"; // 将窗体状态设为最大化

							win.oldStyle.position.x = win.style.position.x;
							win.oldStyle.position.y = win.style.position.y;

							win.oldStyle.size.width = win.style.size.width;
							win.oldStyle.size.height = win.style.size.height;

							win.style.position.y = win.addressBar ? 80 : 40; // 将窗体 y 轴位置设为固定值
							win.style.position.x = 0; // 将窗体 x 轴位置设为 0

							win.style.size.width = that.runtime.desktopSize.width; // 将窗体宽度设为桌面区域宽度
							win.style.size.height = that.runtime.desktopSize.height - (win.addressBar ? 80 : 40); // 将窗体高度设为桌面区域高度减去固定值
						} else {
							win = ZHONGJYUAN.helper.json.merge(
								win,
								{
									style: {
										position: {
											x: ZHONGJYUAN.api.evalNum(win.position.x) + (win.position.autoOffset ? dx : 0),
											y: ZHONGJYUAN.api.evalNum(win.position.y) + (win.position.autoOffset ? dx + 80 : 0),
											left: win.position.left,
											top: win.position.top,
										},
										size: {
											width: ZHONGJYUAN.api.evalNum(win.size.width),
											height: ZHONGJYUAN.api.evalNum(win.size.height),
										},
									},
								},
								true
							);
						}
						that.$set(that.wins, i, win);
					}

					// 给窗体发送resize事件
					that.send_event(0, ZHONGJYUAN.static.message.resizeEvent, {
						width: that.runtime.desktopSize.width,
						height: that.runtime.desktopSize.height,
					});

					ZHONGJYUAN.logger.debug("vue.[on_resize] width:${0};height:${1}", that.runtime.desktopSize.width, that.runtime.desktopSize.height);
				},

				/**
				 * 刷新处理函数
				 * @author zhongjyuan
				 * @date   2023年6月1日17:08:32
				 * @email  zhongjyuan@outlook.com
				 */
				on_refresh: function() {
					ZHONGJYUAN.logger.trace("vue.[on_refresh]");
					var that = this;

					// 图标闪烁
					that.runtime.shortcutsShow = false;
					setTimeout(function() {
						that.runtime.shortcutsShow = true;
					}, 200);

					// 刷新customTileToken
					that.runtime.customTileToken = ZHONGJYUAN.api.token();
					ZHONGJYUAN.logger.debug("vue.[on_refresh] runtime:${0}", JSON.stringify(that.runtime));
				},

				/**
				 * 增加日历轮询
				 * @author zhongjyuan
				 * @date   2023年6月1日17:08:40
				 * @email  zhongjyuan@outlook.com
				 */
				interval_calendar: function() {
					ZHONGJYUAN.logger.trace("vue.[interval_calendar]");
					var that = this;

					setInterval(function() {
						var myDate = new Date();
						var year = myDate.getFullYear();
						var month = myDate.getMonth() + 1;
						var date = myDate.getDate();
						var hours = myDate.getHours();
						var mins = myDate.getMinutes();
						if (mins < 10) {
							mins = "0" + mins;
						}
						that.runtime.time = hours + ":" + mins;
						that.runtime.date = myDate;
						that.runtime.yearStr = year;
						that.runtime.monthStr = month;
						that.runtime.dateStr = date;
						that.runtime.hourStr = hours;
						that.runtime.minsStr = mins;
					}, 1000);
				},

				/**
				 * 增加自定义滚动条轮询
				 * @author zhongjyuan
				 * @date 2023年6月1日15:51:35
				 * @email  zhongjyuan@outlook.com
				 */
				interval_niceScroll: function() {
					ZHONGJYUAN.logger.trace("vue.[interval_niceScroll]");
					var that = this;
					that.$nextTick(function() {
						//jq插件 滚动条
						var box = [
							"#" + ZHONGJYUAN.static.custom.vueRootElement + " .tiles-box",
							"#" + ZHONGJYUAN.static.custom.vueRootElement + " .startMenu .menu",
							"#" + ZHONGJYUAN.static.custom.vueRootElement + " .center .msgs",
						];

						for (var i = 0; i < box.length; i++) {
							var e = box[i];
							$(e).niceScroll({
								cursorcolor: "#ffffff30",
								cursorwidth: "4px", // 滚动条的宽度，单位：便素
								cursorborder: "none", // CSS方式定义滚动条边框
								grabcursorenabled: false,
							});
						}

						setInterval(function() {
							for (var i = 0; i < box.length; i++) {
								var e = box[i];
								try {
									$(e)
										.getNiceScroll()
										.resize();
								} catch (e) {}
							}
						}, 500);

						$("#" + ZHONGJYUAN.static.custom.vueRootElement).css({
							opacity: 1,
							display: "block",
						}); //显示
					});
				},

				/**
				 * 增加壁纸幻灯片轮询
				 * @author zhongjyuan
				 * @date 2023年6月1日15:52:34
				 * @email  zhongjyuan@outlook.com
				 */
				interval_wallpaper_slide: function() {
					ZHONGJYUAN.logger.trace("vue.[interval_wallpaper_slide]");
					var that = this;
					setInterval(function() {
						if (!that.configs.wallpaperSlide) return; //没开启则返回

						var itv = that.configs.wallpaperSlideInterval * 60 * 1000; //间隔（毫秒）
						var last = that.configs.wallpaperSlideTime; //记录最近一次切换壁纸的时刻
						var indexLast = that.configs.wallpaperSlideIndex; //记录最近一次切换壁纸的index

						var now = Date.now();
						if (now > itv + last) {
							that.configs.wallpaperSlideTime = now; //记录当前时间

							var wallpapers = that.configs.wallpapers;
							var len = wallpapers.length;

							var index = 0;
							if (that.configs.wallpaperSlideRandom) {
								index = ZHONGJYUAN.helper.random.int(0, len - 1); //随机取下标
							} else {
								index = indexLast + 1;
								if (index >= len) {
									index = 0;
								}
							}

							if (wallpapers[index]) {
								that.configs.wallpaper = wallpapers[index].image; //切换
								that.configs.wallpaperSlideIndex = index;
							}
						}
					}, 1000);
				},

				/**
				 * 增加基础配置保存轮询
				 * @author zhongjyuan
				 * @date 2023年6月1日15:53:43
				 * @email  zhongjyuan@outlook.com
				 */
				interval_config_save: function() {
					ZHONGJYUAN.logger.trace("vue.[interval_config_save]");
					var that = this;
					var lastData = "";
					setInterval(function() {
						try {
							var currentData = JSON.stringify(ZHONGJYUAN.api.export());
							if (currentData !== lastData) {
								lastData = currentData;
								localStorage.setItem(ZHONGJYUAN.static.storage.basic, currentData);
								that.send_event(0, ZHONGJYUAN.static.message.dataChangeEvent, lastData);
							}
						} catch (e) {
							ZHONGJYUAN.logger.error("vue.[interval_config_save] ${0}", e);
						}
					}, 1000);
				},

				/**
				 * 增加窗体健康轮询
				 * @author zhongjyuan
				 * @date 2023年6月1日17:10:24
				 * @email  zhongjyuan@outlook.com
				 */
				interval_win_health: function() {
					ZHONGJYUAN.logger.trace("vue.[interval_win_health]");
					var that = this;
					setInterval(function() {
						var now = Date.now();
						for (var i in that.wins) {
							var win = that.wins[i];
							win.childSupport = win.pong && now - win.pong < 500;
						}
					}, 300);
				},

				/**
				 * 角标文本
				 * @author zhongjyuan
				 * @date 2023年5月31日11:14:39
				 * @email  zhongjyuan@outlook.com
				 * @param {*} content 角标内容
				 */
				badge_text: function(content) {
					ZHONGJYUAN.logger.trace("vue.[badge_text] content:${0}", content);
					if (isNaN(content)) {
						return content;
					} else {
						return content > 99 ? "99+" : parseInt(content);
					}
				},

				/**
				 * 发送事件
				 * @author zhongjyuan
				 * @date 2023年6月1日17:10:31
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @param {*} event 事件名称
				 * @param {*} data 事件数据
				 */
				send_event: function(winId, event, data) {
					ZHONGJYUAN.logger.trace("vue.[send_event] winId:${0};event:${1};data:${2}", winId, JSON.stringify(event), JSON.stringify(data));
					var that = this;

					// 获取所有子窗体的 id
					var sendWins = [];
					for (var win in that.wins) {
						sendWins.push(win);
					}

					// 使用 $nextTick() 函数异步更新队列，等待 DOM 更新完成
					that.$nextTick(function() {
						// 遍历所有子窗体，向其发送消息
						sendWins.forEach(function(sendWinId) {
							if (!window.frames[sendWinId]) {
								ZHONGJYUAN.logger.warn("vue.[send_event] win not exist! ${0}", sendWinId);
								return;
							}

							if (!window.frames[sendWinId].postMessage) {
								ZHONGJYUAN.logger.warn("vue.[send_event] win postMessage undefined. ${0}", sendWinId);
								return;
							}

							var message = {
								type: ZHONGJYUAN.static.message.event, // 消息类型
								event: event, // 事件名称
								target: sendWins, // 目标窗体的 id 列表
								data: data, // 发送的数据
								session: null, // 会话信息（暂不使用）
								from: winId, // 来源窗体的 id
								sameOrigin: false, // 是否为同源消息
							};

							window.frames[sendWinId].postMessage(message, "*");
						});
					});
				},

				/**
				 * 壁纸初始化
				 * @author zhongjyuan
				 * @date 2023年6月1日19:23:40
				 * @email  zhongjyuan@outlook.com
				 */
				wallpaper_initialize: function() {
					ZHONGJYUAN.logger.trace("vue.[wallpaper_initialize]");
					var that = this;

					var img = new Image();
					var url = that.configs.wallpaper;
					img.src = url;
					img.onload = function() {
						that.runtime.wallpaper = url;
						if (that.configs.autoThemeColor) {
							ZHONGJYUAN.helper.io.image.toThemeColor(
								url,
								function(color) {
									that.configs.themeColor = color;
								},
								0.6
							);
						}
						ZHONGJYUAN.logger.debug("vue.[wallpaper_initialize] themeColor:${0};wallpaper:${1}", that.configs.themeColor, that.runtime.wallpaper);
					};
				},

				/**
				 * 壁纸更新比例
				 * @author zhongjyuan
				 * @date 2023年6月1日19:22:29
				 * @email  zhongjyuan@outlook.com
				 */
				wallpaper_update_scale: function() {
					ZHONGJYUAN.logger.trace("vue.[wallpaper_update_scale]");
					var that = this;

					ZHONGJYUAN.helper.io.image.toSize(that.configs.wallpaper, function(size) {
						var width = size.width || 1;
						var height = size.height || 1;
						that.runtime.wallpaperScale = width / height;

						ZHONGJYUAN.logger.debug("vue.[wallpaper_update_scale] wallpaperScale:${0}", that.runtime.wallpaperScale);
					});
				},

				/**
				 * 壁纸转主题色
				 * @author zhongjyuan
				 * @date 2023年6月15日20:14:43
				 * @email  zhongjyuan@outlook.com
				 */
				wallpaper_to_theme_color: function() {
					var that = this;

					ZHONGJYUAN.helper.io.image.toThemeColor(
						that.runtime.wallpaper,
						function(color) {
							that.configs.themeColor = color;
						},
						0.6
					);
				},

				/**
				 * 关闭打开项(抽屉菜单+开始菜单+消息中心+插件小图标+日历)
				 * @author zhongjyuan
				 * @date 2023年6月1日18:13:15
				 * @email  zhongjyuan@outlook.com
				 */
				close_opens: function() {
					ZHONGJYUAN.logger.trace("vue.[close_opens]");
					var that = this;

					that.drawer = null;
					that.close_start_menu();
					that.center.open = false;
					that.runtime.pluginIconsOpen = false;
					that.runtime.calendarOpen = false;
				},

				/**
				 * 关闭开始菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日18:14:32
				 * @email  zhongjyuan@outlook.com
				 */
				close_start_menu: function() {
					ZHONGJYUAN.logger.trace("vue.[close_start_menu]");
					var that = this;

					that.startMenu.open = false;
					that.close_start_menu_item();
				},

				/**
				 * 关闭开始菜单项
				 * @author zhongjyuan
				 * @date 2023年6月1日18:15:03
				 * @email  zhongjyuan@outlook.com
				 * @param {*} parent 父级菜单对象
				 */
				close_start_menu_item: function(parent) {
					ZHONGJYUAN.logger.trace("vue.[close_start_menu_item]");
					var that = this;

					var menu = parent ? parent : that.startMenu.menu;
					for (var i in menu) {
						var item = menu[i];
						if (item.children) {
							item.open = false;
							that.close_start_menu_item(item);
						}
					}
				},

				/**
				 * 菜单项寻找行动
				 * @author zhongjyuan
				 * @date 2023年6月1日19:13:19
				 * @email  zhongjyuan@outlook.com
				 * @param {*} menuId 菜单唯一标识
				 * @param {*} callback 回调函数
				 * @param {*} parentMenu 父级菜单
				 */
				menu_item_action: function(menuId, callback, parent) {
					ZHONGJYUAN.logger.trace("vue.[menu_item_action] menuId:${0};callback;parent:${1}", menuId, JSON.stringify(parent));
					var that = this;

					var menu = parent ? parent.children : that.startMenu.menu;
					for (var i in menu) {
						var item = menu[i];
						if (i === menuId) {
							ZHONGJYUAN.logger.debug("vue.[menu_item_action] item:${0};menu:${1}", JSON.stringify(item), JSON.stringify(menu));
							callback(item, menu);
						} else if (item.children) {
							that.menu_item_action(menuId, callback, item);
						}
					}
				},

				/**
				 * 菜单项样式
				 * @author zhongjyuan
				 * @date 2023年6月1日20:14:52
				 * @email  zhongjyuan@outlook.com
				 * @param {*} index 下标
				 */
				menu_item_style: function(index) {
					ZHONGJYUAN.logger.trace("vue.[menu_item_style]");
					return { "animation-duration": "0.3s", "animation-delay": index * 0.05 + "s" };
				},

				/**
				 * 右侧菜单 - 打开[构建]
				 * @author zhongjyuan
				 * @date 2023年6月1日19:15:55
				 * @email  zhongjyuan@outlook.com
				 * @param {*} obj 对象
				 * @returns
				 */
				context_menu_open: function(obj) {
					ZHONGJYUAN.logger.trace("vue.[context_menu_open] obj:${0}", JSON.stringify(obj));
					var that = this;

					return [
						ZHONGJYUAN.component.fontawesomeHtml("play-circle") + ZHONGJYUAN.api.lang("Open"),
						[
							[
								ZHONGJYUAN.component.fontawesomeHtml("window-restore") + ZHONGJYUAN.api.lang("Normal"),
								function(v) {
									that.app_open(obj.app, ZHONGJYUAN.helper.json.merge(obj, { openMode: "normal" }), obj);
								},
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("window-maximize") + ZHONGJYUAN.api.lang("Maximize"),
								function(v) {
									that.app_open(obj.app, ZHONGJYUAN.helper.json.merge(obj, { openMode: "max" }), obj);
								},
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("window-minimize") + ZHONGJYUAN.api.lang("Minimize"),
								function(v) {
									that.app_open(obj.app, ZHONGJYUAN.helper.json.merge(obj, { openMode: "min" }), obj);
								},
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("paper-plane") + ZHONGJYUAN.api.lang("Outer"),
								function(v) {
									that.app_open(obj.app, ZHONGJYUAN.helper.json.merge(obj, { openMode: "outer" }), obj);
								},
							],
						],
					];
				},

				/**
				 * 右侧菜单 - 添加至[磁贴、桌面、菜单、...][构建]
				 * @author zhongjyuan
				 * @date 2023年6月1日19:17:21
				 * @email  zhongjyuan@outlook.com
				 * @param {*} obj 对象
				 * @returns
				 */
				context_menu_add_to: function(obj) {
					ZHONGJYUAN.logger.trace("vue.[context_menu_add_to] obj:${0}", JSON.stringify(obj));
					var that = this;

					var objDeepCopy = ZHONGJYUAN.helper.json.deepCopy(obj);

					/**
					 * 简单消息
					 */
					var function_message = function() {
						ZHONGJYUAN.api.message.simple(ZHONGJYUAN.api.lang("Added"));
					};

					var menuAddToTile = [];
					that.tiles.forEach(function(group, n) {
						menuAddToTile.push([
							ZHONGJYUAN.component.fontawesomeHtml("square") + group.title,
							function() {
								ZHONGJYUAN.api.addTile(objDeepCopy, n);
								function_message();
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
					});

					return [
						ZHONGJYUAN.component.fontawesomeHtml("copy") + ZHONGJYUAN.api.lang("AddTo"),
						[
							[
								ZHONGJYUAN.component.fontawesomeHtml("desktop") + ZHONGJYUAN.api.lang("DesktopIcons"),
								function() {
									ZHONGJYUAN.api.addShortcut(objDeepCopy);
									function_message();
								},
								!ZHONGJYUAN.static.switch.storageChange,
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("list-ul") + ZHONGJYUAN.api.lang("MainMenu"),
								function() {
									ZHONGJYUAN.api.addStartMenu(objDeepCopy);
									function_message();
								},
								!ZHONGJYUAN.static.switch.storageChange,
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("sliders") + ZHONGJYUAN.api.lang("Sidebar"),
								function() {
									ZHONGJYUAN.api.addStartMenuSidebarButton(objDeepCopy);
									function_message();
								},
								!ZHONGJYUAN.static.switch.storageChange,
							],
							"|",
							"<span style='color: darkgray'>" + ZHONGJYUAN.component.fontawesomeHtml("square") + ZHONGJYUAN.api.lang("Tiles") + "</span>",
						].concat(menuAddToTile),
					];
				},

				/**
				 * 右侧菜单 - 卸载[构建]
				 * @author zhongjyuan
				 * @date 2023年6月1日19:20:13
				 * @email  zhongjyuan@outlook.com
				 * @param {*} appId 应用唯一标识
				 * @returns
				 */
				context_menu_uninstall: function(appId) {
					ZHONGJYUAN.logger.trace("vue.[context_menu_uninstall] appId:${0}", appId);
					var that = this;

					return [
						ZHONGJYUAN.component.fontawesomeHtml("trash") + ZHONGJYUAN.api.lang("Uninstall"),
						function(v) {
							ZHONGJYUAN.api.message.confirm(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("UninstallConfirm"), that.apps[appId].title), function() {
								if (ZHONGJYUAN.api.app.uninstall(appId)) {
									ZHONGJYUAN.api.message.simple(ZHONGJYUAN.api.lang("UninstallCompleted"));
								}
							});
						},
						!ZHONGJYUAN.static.switch.storageChange,
					];
				},

				/**
				 * 应用打开
				 * @author zhongjyuan
				 * @date 2023年6月1日18:11:41
				 * @email  zhongjyuan@outlook.com
				 * @param {*} appId 应用唯一标识(也可以是json)
				 * @param {*} options 可选配置
				 * @param {*} source
				 * @returns
				 */
				app_open: function(appId, options, source) {
					ZHONGJYUAN.logger.trace(
						"vue.[app_open] appId:${0};options:${1};source:${2}",
						JSON.stringify(appId),
						JSON.stringify(options),
						JSON.stringify(source)
					);

					//id也可以是json（动态app）
					var that = this;
					if (!options) {
						options = {};
					} //容错,

					//打开app
					var app = typeof appId === "string" ? that.apps[appId] : appId;
					app = ZHONGJYUAN.helper.json.merge(app, options);

					that.close_opens();

					//单例检测
					if (app.single) {
						for (var winId in that.wins) {
							var win = that.wins[winId];
							if (win.app === appId && win.single) {
								that.win_set_active(winId);
								that.win_show(winId);
								return;
							}
						}
					}

					//空url返回
					if (!app.url) {
						return;
					}

					// 打开窗体数量检测
					if (that.runtime.winOpened >= that.configs.openMax) {
						ZHONGJYUAN.api.message.simple(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("MaxWinsReached"), that.configs.openMax));
						return;
					}

					// 总计窗体数
					that.runtime.winOpenCounter++;
					var dx = parseInt(that.runtime.winOpenCounter % 10) * that.runtime.screenSize.height * 0.01; //坐标偏移量

					// 第一次覆盖，覆盖应用标识与源数据
					var win = ZHONGJYUAN.helper.json.merge(ZHONGJYUAN.static.template.win, { app: appId, source: source }, true);
					win = ZHONGJYUAN.helper.json.merge(win, app, true);
					win.style = ZHONGJYUAN.helper.json.deepCopy(win.style);
					win.style.index = ZHONGJYUAN.api.getWinMaxZIndex();
					win.url = ZHONGJYUAN.api.url.appendParams(win.url, win.params, win.hash);

					// 增加URL地址令牌参数
					if (win.urlRandomToken) {
						win.url = ZHONGJYUAN.api.url.appendParamToken(win.url);
					}

					// 外部打开
					if (win.openMode === ZHONGJYUAN.static.win.openMode.outer) {
						window.open(win.url);
						return;
					}

					// 解决外部打开应用定位与大小计算问题
					win = ZHONGJYUAN.helper.json.merge(
						win,
						{
							style: {
								position: {
									x: ZHONGJYUAN.api.evalNum(app.position.x) + (app.position.autoOffset ? dx : 0),
									y: ZHONGJYUAN.api.evalNum(app.position.y) + (app.position.autoOffset ? dx + 80 : 0),
									left: app.position.left,
									top: app.position.top,
								},
								size: {
									width: ZHONGJYUAN.api.evalNum(app.size.width),
									height: ZHONGJYUAN.api.evalNum(app.size.height),
								},
							},
						},
						true
					);

					// 设置原始地址与地址栏地址
					win.urlOrigin = win.url;
					win.urlBar = win.url;

					var winId = that.win_set_id(that.wins, win, ZHONGJYUAN.static.id.winPrefix, true);
					win.iframeId = winId + "-iframe";
					win.secrete = Math.random(); //身份密钥

					that.send_event(winId, ZHONGJYUAN.static.message.openEvent, null);

					switch (win.openMode) {
						case ZHONGJYUAN.static.win.openMode.max:
							that.win_maximize(winId);
							break;
						case ZHONGJYUAN.static.win.openMode.min:
							that.win_minimize(winId);
							break;
					}

					//记录激活的id
					if (!win.min) that.runtime.winActive = winId;

					//发送post消息,通知被分配的窗体id
					that.$nextTick(function() {
						//发送post消息,通知被分配的窗体id
						var health = setInterval(function() {
							if ($("#" + winId).length <= 0) {
								clearInterval(health);
								return;
							}

							(!window.frames[winId] && !window.frames[winId].postMessage) ||
								window.frames[winId].postMessage(
									{
										type: ZHONGJYUAN.static.message.ping,
										id: winId,
										secrete: win.secrete,
										itv: health,
										data: win.data,
									},
									"*"
								);
						}, ZHONGJYUAN.static.timeout.health);

						//监听iframe点击事件
						var iframeElement = $("#" + win.iframeId)[0];
						if (iframeElement) {
							ZHONGJYUAN.api.iframe.onClick.track(
								iframeElement,
								function() {
									if (Object.getOwnPropertyNames(ZHONGJYUAN.api.iframe._click_lock_children).length === 0) {
										that.win_set_active(winId); //激活窗体
										ContextMenu._removeContextMenu(); //关闭右键菜单
									}
								},
								winId
							);

							//激活刚打开的iframe
							if (!win.min) {
								iframeElement.focus();
							}

							// 加载完毕关闭封面
							var created = new Date().getTime();
							var closeInit = function() {
								var now = new Date().getTime();
								var delay = now - created > 1000 ? 0 : 1000;
								setTimeout(function() {
									win.init = false;
								}, delay);
							};
							if (iframeElement.attachEvent) {
								iframeElement.attachEvent("onload", closeInit);
							} else {
								iframeElement.onload = closeInit;
							}
						}
					});

					//如果是手机屏幕，最大化
					if (that.runtime.isSmallScreen && !win.plugin && win.resizable) {
						that.win_maximize(winId);
					}

					// 超时关闭封面
					setTimeout(function() {
						win.init = false;
					}, 10000);

					ZHONGJYUAN.logger.debug(
						"vue.[app_open] appId:${0};options:${1};source:${2};winId:${3}",
						JSON.stringify(appId),
						JSON.stringify(options),
						JSON.stringify(source),
						winId
					);
					return winId;
				},

				/**
				 * 应用关闭
				 * @author zhongjyuan
				 * @date 2023年6月1日18:11:45
				 * @email  zhongjyuan@outlook.com
				 * @param {*} appId 应用唯一标识
				 * @returns
				 */
				app_close: function(appId) {
					ZHONGJYUAN.logger.trace("vue.[app_close] appId:${0}", appId);
					var that = this;

					var win = that.wins[appId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[app_close] win not exist! ${0}", appId);
						return;
					}

					that.$delete(that.wins, appId);
					that.send_event(appId, ZHONGJYUAN.static.message.closeEvent, null);
					that.win_find_active();
					ZHONGJYUAN.logger.debug("vue.[app_close] appId:${0};win:${1}", appId, JSON.stringify(win));
				},

				/**
				 * 快捷方式抽屉按下
				 * @author zhongjyuan
				 * @date 2023年6月8日15:04:59
				 * @email  zhongjyuan@outlook.com
				 */
				drawer_mouse_down: function() {
					ZHONGJYUAN.logger.trace("vue.[drawer_mouse_down]");
					var that = this;

					if (Date.now() - that.runtime.shortcutOpenedAt > 500) that.drawer = null;
				},

				/**
				 * 桌面显示
				 * @author zhongjyuan
				 * @date 2023年6月1日18:19:40
				 * @email  zhongjyuan@outlook.com
				 */
				desktop_show: function() {
					ZHONGJYUAN.logger.trace("vue.[desktop_show]");
					var that = this;

					that.win_hide_all();
					that.close_opens();
				},

				/**
				 * 桌面点击
				 * @author zhongjyuan
				 * @date 2023年6月1日18:20:13
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				desktop_click: function(event) {
					ZHONGJYUAN.logger.trace("vue.[desktop_click] event:${0}", JSON.stringify(event));
					var that = this;

					that.close_opens();

					!event ||
						that.send_event(0, ZHONGJYUAN.static.message.desktopClickEvent, {
							x: event.x,
							y: event.y,
						});
				},

				/**
				/**
				 * 桌面鼠标按下
				 * @author zhongjyuan
				 * @date 2023年6月1日18:22:02
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				desktop_mouse_down: function(event) {
					ZHONGJYUAN.logger.trace("vue.[desktop_mouse_down] event:${0}", JSON.stringify(event));
					var that = this;

					that.close_opens();

					!event ||
						that.send_event(0, ZHONGJYUAN.static.message.desktopMouseDownEvent, {
							x: event.x,
							y: event.y,
						});
				},

				/**
				 * 桌面鼠标松开
				 * @author zhongjyuan
				 * @date 2023年6月1日18:21:15
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				desktop_mouse_up: function(event) {
					ZHONGJYUAN.logger.trace("vue.[desktop_mouse_up] event:${0}", JSON.stringify(event));
					var that = this;

					that.close_opens();

					!event ||
						that.send_event(0, ZHONGJYUAN.static.message.desktopMouseUpEvent, {
							x: event.x,
							y: event.y,
						});
				},

				/**
				 * 桌面鼠标移动
				 * @author zhongjyuan
				 * @date 2023年6月1日18:23:01
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				desktop_mouse_move: function(event) {
					ZHONGJYUAN.logger.trace("vue.[desktop_mouse_move] event:${0}", JSON.stringify(event));
					var that = this;

					!event ||
						that.send_event(0, ZHONGJYUAN.static.message.desktopMouseMoveEvent, {
							x: event.x,
							y: event.y,
						});
				},

				/**
				 * 桌面右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日18:23:35
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				desktop_context_menu: function(event) {
					ZHONGJYUAN.logger.trace("vue.[desktop_context_menu] event:${0}", JSON.stringify(event));
					var that = this;

					that.close_opens();

					var menu = [
						[
							ZHONGJYUAN.component.fontawesomeHtml("refresh") + ZHONGJYUAN.api.lang("Refresh"),
							function() {
								that.on_refresh();
							},
						],
						"|",
						[
							ZHONGJYUAN.component.fontawesomeHtml("desktop") + ZHONGJYUAN.api.lang("DisplayDesktop"),
							function() {
								that.desktop_show();
							},
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("credit-card") + ZHONGJYUAN.api.lang("Personalization"),
							[
								[
									ZHONGJYUAN.component.fontawesomeHtml("paint-brush") + ZHONGJYUAN.api.lang("ThemeColor"),
									function() {
										ZHONGJYUAN.api.app.openColors();
									},
									!ZHONGJYUAN.static.switch.storageChange,
								],
								[
									ZHONGJYUAN.component.fontawesomeHtml("picture-o") + ZHONGJYUAN.api.lang("Wallpaper"),
									function() {
										ZHONGJYUAN.api.app.openWallpaper();
									},
									!ZHONGJYUAN.static.switch.storageChange,
								],
							],
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("cog") + ZHONGJYUAN.api.lang("SystemOptions"),
							function() {
								ZHONGJYUAN.api.app.openSystem();
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						"|",
						[
							ZHONGJYUAN.component.fontawesomeHtml("object-group") + ZHONGJYUAN.api.lang("FullScreen"),
							function() {
								ZHONGJYUAN.helper.openFullscreen();
							},
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("object-ungroup") + ZHONGJYUAN.api.lang("NormalScreen"),
							function() {
								ZHONGJYUAN.helper.closeFullscreen();
							},
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("circle-o-notch") + ZHONGJYUAN.api.lang("Reload"),
							function() {
								ZHONGJYUAN.api.f5();
							},
						],
						"|",
						[
							ZHONGJYUAN.component.fontawesomeHtml("info-circle") + ZHONGJYUAN.api.lang("AboutUs"),
							function() {
								ZHONGJYUAN.api.app.openAboutUs();
							},
						],
					];

					ContextMenu.render(event, menu, that, "light");
				},

				/**
				 * 快捷方式打开
				 * @author zhongjyuan
				 * @date 2023年6月1日18:26:31
				 * @email  zhongjyuan@outlook.com
				 * @param {*} shortcut 快捷方式对象
				 * @param {*} shortcutId 快捷方式唯一标识
				 * @returns
				 */
				shortcut_open: function(shortcut, shortcutId) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_open] shortcut:${0};shortcutId:${1}", JSON.stringify(shortcut), shortcutId);
					var that = this;

					var now = Date.now();

					//忽略拖动产生的click和touch+click导致的短时间多次打开
					if (!shortcut || shortcut.drag.moved > 20 || now - that.runtime.shortcut_openedAt < 500) {
						ZHONGJYUAN.logger.warn("vue.[shortcut_open] frequent operations. ${0}", JSON.stringify(shortcut));
						return;
					}

					//打开抽屉
					if (shortcut.children) {
						that.drawer = shortcutId;
					}

					//普通图标
					else {
						that.app_open(shortcut.app, shortcut, shortcut);
					}

					that.runtime.shortcut_openedAt = Date.now();
				},

				/**
				 * 快捷方式鼠标按下
				 * @author zhongjyuan
				 * @date 2023年6月1日18:30:42
				 * @email  zhongjyuan@outlook.com
				 * @param {*} id 快捷方式唯一标识
				 * @param {*} pid 快捷方式父级唯一标识
				 * @param {*} event 事件对象
				 * @returns
				 */
				shortcut_mouse_down: function(id, pid, event) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_mouse_down] id:${0};pid:${1};event:${2}", id, pid, JSON.stringify(event));

					if (event.which && event.which !== 1) return; //只响应左键

					var that = this;
					var downTime = Date.now();
					var isMouse = !event.changedTouches; //是否是鼠标事件，false为触屏；

					var point = ZHONGJYUAN.helper.getPositionByEvent(event, isMouse);

					var fromDrawer = pid !== null;
					var shortcut = !fromDrawer ? that.shortcuts[id] : that.shortcuts[pid].children[id];

					shortcut.drag.mouseDown = true;
					shortcut.drag.x = point.x;
					shortcut.drag.y = point.y;
					shortcut.drag.moved = 0;

					/**
					 * 拖至
					 * @author zhongjyuan
					 * @date 2023年6月1日18:31:59
					 * @email  zhongjyuan@outlook.com
					 * @param {*} id 快捷方式唯一标识
					 * @returns
					 */
					var drag_on = function(id) {
						var p = that.shortcut_position(id, null); //得到图标目前的位置p

						var tid, // 目标图标的 id(如果与当前图标重叠)
							tby, // 目标图标与当前图标之间的纵向距离(如果与当前图标重叠)
							ton = false, // 目标图标是否与当前图标重叠
							tinsert = false, // 是否需要将当前图标插入目标图标之前（如果与当前图标重叠且 by 方向上小于 -30% 的高度）
							tover = false; // 是否需要将当前图标置于目标图标上方（如果与当前图标重叠且 by 方向上的绝对值小于 30% 的高度）

						that.shortcuts.forEach(function(t, i) {
							if (i === id) return; //忽略遍历自身

							var pt = that.shortcut_position(i, null);
							var bx = pt.x - p.x;
							var by = pt.y - p.y;
							if (Math.abs(bx) < that.runtime.shortcutWidth / 4 && Math.abs(by) < that.runtime.shortcutHeight / 2) {
								tid = i;
								tby = by;
								ton = true;
								tinsert = by < -that.runtime.shortcutHeight * 0.3;
								tover = Math.abs(by) < that.runtime.shortcutHeight * 0.3;
							}
						});

						return {
							on: ton,
							id: tid,
							by: tby,
							insert: tinsert,
							over: tover,
						};
					};

					/**
					 * 鼠标松开
					 * @author zhongjyuan
					 * @date 2023年6月1日18:33:50
					 * @email  zhongjyuan@outlook.com
					 * @param {*} e 事件对象
					 * @returns
					 */
					var mouse_up = function(e) {
						if (!shortcut.drag.mouseDown) return;

						shortcut.drag.mouseDown = false;

						if (!fromDrawer) {
							//处理拖动位置网格吸附
							var dragTo = drag_on(id);

							//拖动插入
							if (dragTo.insert) {
								if (dragTo.id > id) {
									for (var i = dragTo.id - id; i > 0; i--) {
										ZHONGJYUAN.helper.arrayDown(that.shortcuts, dragTo.id - i);
									}
								} else {
									for (var i = id - dragTo.id; i > 1; i--) {
										ZHONGJYUAN.helper.arrayDown(that.shortcuts, dragTo.id + i);
									}
								}
							}

							//拖动覆盖
							if (dragTo.over) {
								var sOn = that.shortcuts[dragTo.id];
								if (!shortcut.children && !sOn.children) {
									//1.图标vs图标 合并并生成组
									that.$set(that.shortcuts, dragTo.id, {
										title: ZHONGJYUAN.api.lang("IconGroup") + ZHONGJYUAN.api.id(),
										drag: {
											mouseDown: false,
											left: 0,
											top: 0,
											x: 0,
											y: 0,
										},
										children: [sOn, shortcut],
									});
									that.shortcuts.splice(id, 1);
								} else if (!shortcut.children && sOn.children) {
									//2.图标vs组 进组
									sOn.children.push(shortcut);
									that.shortcuts.splice(id, 1);
								} else if (shortcut.children && !sOn.children) {
									//2.组vs图标 进组
									shortcut.children.push(sOn);
									that.shortcuts[dragTo.id] = shortcut;
									that.shortcuts.splice(id, 1);
								} else if (shortcut.children && sOn.children) {
									//4.组vs组 合并组
									shortcut.children.forEach(function(t) {
										sOn.children.push(t);
									});
									that.shortcuts.splice(id, 1);
								}
							}
						} else {
							//抽屉内拖动(移动一定的距离就算是拖出去)
							if (that.shortcut_drawer_cutout(shortcut)) {
								that.shortcuts.push(s);
								that.shortcuts[pid].children.splice(id, 1);
							}
						}

						if (shortcut.drag.moved < 20 && Date.now() - downTime < 300) {
							that.shortcut_open(shortcut, id); //TODO 此处是否需要加延时操作
						}

						shortcut.drag.moved = 0;
						shortcut.drag.left = shortcut.drag.top = 0;
						that.runtime.shortcutInsert = that.runtime.shortcutOver = null;

						//事件解绑
						if (isMouse) {
							$(document).unbind("mousemove", mouse_move);
							$(document).unbind("mouseup", mouse_up);
						} else {
							$(document).unbind("touchmove", mouse_move);
							$(document).unbind("touchend", mouse_up);
						}
					};

					/**
					 * 鼠标移动
					 * @author zhongjyuan
					 * @date 2023年6月1日18:34:24
					 * @email  zhongjyuan@outlook.com
					 * @param {*} e 事件对象
					 * @returns
					 */
					var mouse_move = function(e) {
						if (!shortcut.drag.mouseDown) return;

						var p = ZHONGJYUAN.helper.getPositionByEvent(e, isMouse);
						var x = p.x;
						var y = p.y;
						var dx = x - shortcut.drag.x;
						var dy = y - shortcut.drag.y;

						shortcut.drag.left += dx;
						shortcut.drag.top += dy;
						shortcut.drag.x = x;
						shortcut.drag.y = y;
						shortcut.drag.moved += Math.abs(dx) + Math.abs(dy);

						var dragTo = drag_on(id);
						//拖动插入的视觉提示
						if (dragTo.insert) {
							that.runtime.shortcutInsert = dragTo.id;
						} else {
							that.runtime.shortcutInsert = null;
						}

						//拖动覆盖的视觉提示
						if (dragTo.over) {
							that.runtime.shortcutOver = dragTo.id;
						} else {
							that.runtime.shortcutOver = null;
						}
					};

					if (isMouse) {
						$(document).mouseup(mouse_up);
						$(document).mousemove(mouse_move);
					} else {
						$(document).on("touchend", mouse_up);
						$(document).on("touchmove", mouse_move);
					}
				},

				/**
				 * 快捷方式右键菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日18:35:17
				 * @email  zhongjyuan@outlook.com
				 * @param {*} id 快捷方式唯一标识
				 * @param {*} pid 快捷方式父级唯一标识
				 * @param {*} event 事件对象
				 * @param {*} fromDrawer 是否来自抽屉
				 */
				shortcut_context_menu: function(id, pid, event, fromDrawer) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_context_menu] id:${0};pid:${1};event:${2};drawer:${3}", id, pid, JSON.stringify(event), fromDrawer);
					var that = this;

					var shortcut = pid === null ? that.shortcuts[id] : that.shortcuts[pid].children[id];

					var menu = [];
					if (shortcut.children) {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("play-circle") + ZHONGJYUAN.api.lang("Open"),
							function(v) {
								that.shortcut_open(shortcut, id);
							},
						]);
					} else {
						menu.push(that.context_menu_open(shortcut));
					}

					menu.push("|");
					if (shortcut.children) {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename"),
							function() {
								that.shortSetting = shortcut;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);

						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("sitemap") + ZHONGJYUAN.api.lang("UnGroup"),
							function(v) {
								shortcut.children.forEach(function(t) {
									that.shortcuts.splice(id + 1, 0, t);
								});
								that.shortcuts.splice(id, 1);
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
					} else {
						var objCopy = ZHONGJYUAN.helper.json.deepCopy({
							title: shortcut.title,
							hash: shortcut.hash,
							params: shortcut.params,
							app: shortcut.app,
							style: shortcut.style,
						});
						menu.push(that.context_menu_add_to(objCopy));

						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename") + "/" + ZHONGJYUAN.api.lang("Options"),
							function(v) {
								that.shortSetting = shortcut;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
					}

					if (shortcut.app && that.apps[shortcut.app].badge) {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("map-pin") + ZHONGJYUAN.api.lang("ClearSuperscript"),
							function() {
								that.apps[shortcut.app].badge = 0;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
					}
					menu.push("|");

					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("remove") + ZHONGJYUAN.api.lang("Delete"),
						function(v) {
							ZHONGJYUAN.api.message.confirm(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("DeleteIconConfirm"), shortcut.title), function() {
								if (fromDrawer) {
									that.shortcuts[pid].children.splice(id, 1);
								} else {
									that.shortcuts.splice(id, 1);
								}
							});
						},
						!ZHONGJYUAN.static.switch.storageChange,
					]);

					if (shortcut.app) {
						menu.push(that.context_menu_uninstall(shortcut.app));
					}

					ContextMenu.render(event, menu, that, "light");
				},

				/**
				 * 快捷方式从抽屉剪切出去
				 * @author zhongjyuan
				 * @date 2023年6月1日18:44:10
				 * @email  zhongjyuan@outlook.com
				 * @param {*} shortcut 快捷方式对象
				 * @returns
				 */
				shortcut_drawer_cutout: function(shortcut) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_drawer_cutout] shortcut:${0}", JSON.stringify(shortcut));
					var that = this;

					return Math.abs(shortcut.drag.left) + Math.abs(shortcut.drag.top) > 1.5 * that.runtime.shortcutWidth;
				},

				/**
				 * 快捷方式从抽屉统计标记
				 * @author zhongjyuan
				 * @date 2023年6月1日18:45:15
				 * @email  zhongjyuan@outlook.com
				 * @param {*} shortcut 快捷方式对象
				 * @returns
				 */
				shortcut_drawer_stat_badge: function(shortcut) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_drawer_stat_badge] shortcut:${0}", JSON.stringify(shortcut));
					var that = this;

					var shortcut = that.shortcuts[shortcut];
					var childrens = shortcut.children;

					var count = 0;
					for (var i in childrens) {
						var children = childrens[i];
						var badge = parseInt(that.apps[children.app].badge);

						if (isNaN(badge)) {
							badge = 1;
						}

						count += badge;
					}

					ZHONGJYUAN.logger.debug("vue.[shortcut_drawer_stat_badge] shortcut:${0};result:${1}", JSON.stringify(shortcut), count);
					return count;
				},

				/**
				 * 快捷方式网格定位
				 * @author zhongjyuan
				 * @date 2023年6月1日18:37:45
				 * @email  zhongjyuan@outlook.com
				 * @param {*} id 快捷方式唯一标识
				 * @returns
				 */
				shortcut_grid: function(id) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_grid] id:${0}", id);
					var that = this;

					var x = parseInt(id / that.runtime.shortcutsGrid.y);
					var y = parseInt(id % that.runtime.shortcutsGrid.y);

					ZHONGJYUAN.logger.debug("vue.[shortcut_grid] id:${0};x:${1};y:${2}", id, x, y);
					return { x: x, y: y };
				},

				/**
				 * 快捷方式定位
				 * @author zhongjyuan
				 * @date 2023年6月1日18:38:42
				 * @email  zhongjyuan@outlook.com
				 * @param {*} id 快捷方式唯一标识
				 * @param {*} pid 快捷方式父级唯一标识
				 * @returns
				 */
				shortcut_position: function(id, pid) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_position] id:${0};pid:${1}", id, pid);
					var that = this;

					var g = that.shortcut_grid(id);
					var s = pid === null ? that.shortcuts[id] : that.shortcuts[pid].children[id];
					var x = g.x * that.runtime.shortcutWidth + s.drag.left;
					var y = g.y * that.runtime.shortcutHeight + s.drag.top;

					ZHONGJYUAN.logger.debug("vue.[shortcut_position] id:${0};pid:${1};x:${2};y:${3}", id, pid, x, y);
					return {
						x: x,
						y: y,
					};
				},

				/**
				 * 快捷方式样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日18:41:19
				 * @email  zhongjyuan@outlook.com
				 * @param {*} shortcutId 快捷方式唯一标识
				 * @param {*} shortcut 快捷方式对象
				 * @param {*} fromDrawer 是否来自抽屉
				 * @returns
				 */
				shortcut_class: function(shortcutId, shortcut, fromDrawer) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_class] shortcutId:${0};shortcut:${1};drawer:${2}", shortcutId, JSON.stringify(shortcut), fromDrawer);
					var that = this;
					return {
						move: shortcut.drag.mouseDown,
						insert: that.runtime.shortcutInsert === shortcutId && !fromDrawer,
						over: that.runtime.shortcutOver === shortcutId && !fromDrawer,
						cut: that.shortcut_drawer_cutout(shortcut),
					};
				},

				/**
				 * 快捷方式样式
				 * @author zhongjyuan
				 * @date 2023年6月1日18:41:24
				 * @email  zhongjyuan@outlook.com
				 * @param {*} id 快捷方式唯一标识
				 * @param {*} pid 快捷方式父级唯一标识
				 * @returns
				 */
				shortcut_style: function(id, pid) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_style] id:${0};pid:${1}", id, pid);
					var that = this;

					var p = that.shortcut_position(id, pid);

					return {
						left: p.x + "px",
						top: p.y + "px",
					};
				},

				/**
				 * 快捷方式抽屉样式
				 * @author zhongjyuan
				 * @date 2023年6月1日18:42:22
				 * @email  zhongjyuan@outlook.com
				 * @param {*} shortcut 快捷方式对象
				 * @returns
				 */
				shortcut_drawer_style: function(shortcut) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_drawer_style] shortcut:${0}", JSON.stringify(shortcut));
					return {
						left: shortcut.drag.left + "px",
						top: shortcut.drag.top + "px",
					};
				},

				/**
				 * 设置窗体F5刷新机制
				 * @author zhongjyuan
				 * @date 2023年6月1日17:10:47
				 * @email  zhongjyuan@outlook.com
				 */
				win_set_f5_strategy: function() {
					ZHONGJYUAN.logger.trace("vue.[win_set_f5_strategy]");
					var that = this;
					var f5_check = function(event) {
						event = event || window.event;

						// 强制刷新，清除缓存
						if (event.ctrlKey && (event.which || event.keyCode) === 116) {
							ZHONGJYUAN.static.switch.askBeforeClose = false;
							return;
						}

						if ((event.which || event.keyCode) === 116) {
							if (event.preventDefault) {
								event.preventDefault();
							} else {
								event.keyCode = 0;
								event.returnValue = false;
							}

							if (that.runtime.winActive) {
								that.win_refresh(that.runtime.winActive);
							} else {
								that.on_refresh();
							}
						}
					};

					if (document.addEventListener) {
						document.addEventListener("keydown", f5_check, false);
					} else {
						document.attachEvent("onkeydown", f5_check);
					}
				},

				/**
				 * 设置窗体唯一标识
				 * @author zhongjyuan
				 * @date 2023年6月1日17:15:31
				 * @email  zhongjyuan@outlook.com
				 * @param {*} object 目标对象
				 * @param {*} value 属性值
				 * @param {*} prefix 唯一标识前缀
				 * @param {*} random 是否随机生成唯一标识(默认为 false)
				 */
				win_set_id: function(object, value, prefix, random) {
					ZHONGJYUAN.logger.trace(
						"vue.[win_set_id] object:${0};value:${1};prefix:${2};random:${3}",
						JSON.stringify(object),
						JSON.stringify(value),
						prefix,
						random
					);
					var that = this;
					// 根据参数 random 决定是否采用随机数生成 ID 号
					do {
						var id =
							random === true
								? prefix + ZHONGJYUAN.helper.random.int(ZHONGJYUAN.static.id.min, ZHONGJYUAN.static.id.max)
								: prefix + ZHONGJYUAN.api.id();
					} while (object[id] !== undefined);

					// 使用 Vue.js 提供的 $set() 方法设置新属性值
					that.$set(object, id, value);

					ZHONGJYUAN.logger.debug("vue.[win_set_id] object:${0};value:${1};prefix:${2};random:${3};result:${4}", object, value, prefix, random, id);
					return id;
				},

				/**
				 * 设置活跃窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:18:32
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_set_active: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_set_active] winId:${0}", winId);
					var that = this;

					var now = Date.now();
					if (now - that.runtime.winActiveTime < 200) {
						return;
					}
					that.runtime.winActiveTime = now;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_set_active] win not exist! :${0}", winId);
						return;
					}
					win.style.index = ZHONGJYUAN.api.getWinMaxZIndex();

					that.runtime.winActive = winId;
					that.startMenu.open = false;
					that.drawer = null;
					that.center.open = false;
					ZHONGJYUAN.logger.debug("vue.[win_set_active] winId:${0}", winId);
				},

				/**
				 * 寻找处于活动状态窗体并标记为活跃窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:22:02
				 * @email  zhongjyuan@outlook.com
				 */
				win_find_active: function() {
					ZHONGJYUAN.logger.trace("vue.[win_find_active]");
					var that = this;

					var maxIndex = 0;
					var activeWinId = null;
					for (var winId in that.wins) {
						var win = that.wins[winId];
						if (!win.min && win.style.index > maxIndex) {
							maxIndex = win.style.index;
							activeWinId = winId;
						}
					}
					that.runtime.winActive = activeWinId;
					ZHONGJYUAN.logger.debug("vue.[win_find_active] activeWinId:${0}", activeWinId);
				},

				/**
				 * 隐藏窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:22:48
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_hide: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_hide] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_hide] win not exist! :${0}", winId);
						return;
					}
					win.min = true;
					ZHONGJYUAN.logger.debug("vue.[win_hide] win:${0}", JSON.stringify(win));
				},

				/**
				 * 隐藏所有窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:23:11
				 * @email  zhongjyuan@outlook.com
				 */
				win_hide_all: function() {
					ZHONGJYUAN.logger.trace("vue.[win_hide_all]");
					var that = this;
					for (var i in that.wins) {
						var win = that.wins[i];
						if (win.plugin) {
							continue;
						}
						win.min = true;
					}
					ZHONGJYUAN.logger.debug("vue.[win_hide_all]");
				},

				/**
				 * 展示窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:23:21
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_show: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_show] winId:${0}", winId);
					var that = this;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_show] win not exist! :${0}", winId);
						return;
					}
					win.min = false;
					ZHONGJYUAN.logger.debug("vue.[win_show] win:${0}", JSON.stringify(win));
				},

				/**
				 * 展示所有窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:23:30
				 * @email  zhongjyuan@outlook.com
				 */
				win_show_all: function() {
					ZHONGJYUAN.logger.trace("vue.[win_show_all]");
					var that = this;
					for (var i in that.wins) {
						var win = that.wins[i];
						if (win.plugin) {
							continue;
						}
						win.min = false;
					}
					ZHONGJYUAN.logger.debug("vue.[win_show_all]");
				},

				/**
				 * 窗体显示切换
				 * @author zhongjyuan
				 * @date 2023年6月1日17:55:52
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_show_switch: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_show_switch] winId:${0}", winId);
					var that = this;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_show_switch] win not exist! :${0}", winId);
						return;
					}
					win.min = !win.min;
					ZHONGJYUAN.logger.debug("vue.[win_show_switch] win:${0}", JSON.stringify(win));
				},

				/**
				 * 关闭窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:25:39
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_close: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_close] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_close] win not exist! :${0}", winId);
						return;
					}

					that.$delete(that.wins, winId);
					that.send_event(winId, ZHONGJYUAN.static.message.closeEvent, null);
					that.win_find_active();
					ZHONGJYUAN.logger.debug("vue.[win_close] win:${0}", JSON.stringify(win));
				},

				/**
				 * 关闭所有窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:26:21
				 * @email  zhongjyuan@outlook.com
				 */
				win_close_all: function() {
					ZHONGJYUAN.logger.trace("vue.[win_close_all]");
					var that = this;
					for (var i in that.wins) {
						var win = that.wins[i];
						if (win.plugin) {
							continue;
						}
						that.$delete(that.wins, i);
					}
					ZHONGJYUAN.logger.debug("vue.[win_close_all]");
				},

				/**
				 * 窗体首页
				 * @author zhongjyuan
				 * @date 22023年6月1日17:27:18
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_home: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_home] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_home] win not exist! :${0}", winId);
						return;
					}
					var target = win.urlOrigin;

					ZHONGJYUAN.logger.debug("vue.[win_home] win:${0}", JSON.stringify(win));
					that.win_jump(winId, win.urlRandomToken ? ZHONGJYUAN.api.url.appendParamToken(target) : target);
				},

				/**
				 * 跳转窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:27:56
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @param {*} url URL地址
				 */
				win_jump: function(winId, url) {
					ZHONGJYUAN.logger.trace("vue.[win_jump] winId:${0};url:${1}", winId, url);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_jump] win not exist! :${0}", winId);
						return;
					}
					win.url = win.urlBar = "about:blank";
					setTimeout(function() {
						win.url = win.urlBar = url;
					}, 200);
					ZHONGJYUAN.logger.debug("vue.[win_jump] win:${0}", JSON.stringify(win));
				},

				/**
				 * 刷新窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:29:44
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_refresh: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_refresh] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_refresh] win not exist! :${0}", winId);
						return;
					}
					var target = win.urlBar;

					ZHONGJYUAN.logger.debug("vue.[win_refresh] win:${0}", JSON.stringify(win));
					that.win_jump(winId, win.urlRandomToken ? ZHONGJYUAN.api.url.appendParamToken(target) : target);
				},

				/**
				 * 窗体最小化并重新寻找活跃窗体
				 * @author zhongjyuan
				 * @date 2023年6月1日17:29:44
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_minimize: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_minimize] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_minimize] win not exist! :${0}", winId);
						return;
					}
					win.min = true;

					ZHONGJYUAN.logger.debug("vue.[win_minimize] win:${0}", JSON.stringify(win));
					that.win_find_active();
				},

				/**
				 * 窗体最大化
				 * @author zhongjyuan
				 * @date 2023年6月1日17:31:25
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_maximize: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_maximize] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_maximize] win not exist! :${0}", winId);
						return;
					}

					if (!win.resizable) {
						ZHONGJYUAN.api.message.simple(ZHONGJYUAN.api.lang("AttentionNoResize"));
						return;
					}
					win.state = "max"; // 将窗体状态设为最大化

					win.oldStyle.position.x = win.style.position.x;
					win.oldStyle.position.y = win.style.position.y;

					win.oldStyle.size.width = win.style.size.width;
					win.oldStyle.size.height = win.style.size.height;

					win.style.position.y = win.addressBar ? 80 : 40; // 将窗体 y 轴位置设为固定值
					win.style.position.x = 0; // 将窗体 x 轴位置设为 0

					win.style.size.width = that.runtime.desktopSize.width; // 将窗体宽度设为桌面区域宽度
					win.style.size.height = that.runtime.desktopSize.height - (win.addressBar ? 80 : 40); // 将窗体高度设为桌面区域高度减去固定值
					ZHONGJYUAN.logger.debug("vue.[win_maximize] win:${0}", JSON.stringify(win));
				},

				/**
				 * 窗体居中
				 * @author zhongjyuan
				 * @date 2023年6月1日17:32:13
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_center: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_center] winId:${0}", winId);
					var that = this;

					that.win_show(winId);
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_center] win not exist! :${0}", winId);
						return;
					}

					if (!win.resizable) {
						ZHONGJYUAN.api.message.simple(ZHONGJYUAN.api.lang("AttentionNoResize"));
						return;
					}

					win.state = "normal";
					var w = that.runtime.desktopSize.width;
					var h = that.runtime.desktopSize.height;

					win.style.size.width = w * 0.8;
					win.style.size.height = h * 0.8 - 80;

					win.style.position.y = h * 0.1 + 80;
					win.style.position.x = w * 0.1;
					ZHONGJYUAN.logger.debug("vue.[win_center] win:${0}", JSON.stringify(win));
				},

				/**
				 * 窗体复原
				 * @author zhongjyuan
				 * @date 2023年6月1日17:33:03
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				win_restore: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_restore] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_restore] win not exist! :${0}", winId);
						return;
					}
					win.state = "normal";

					win.style.position.y = win.oldStyle.position.y;
					win.style.position.x = win.oldStyle.position.x;

					win.style.size.width = win.oldStyle.size.width;
					win.style.size.height = win.oldStyle.size.height;
					ZHONGJYUAN.logger.debug("vue.[win_restore] win:${0}", JSON.stringify(win));
				},

				/**
				 * 窗体是否最小化
				 * @author zhongjyuan
				 * @date 2023年6月1日17:38:01
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_is_minimize: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_is_minimize] winId:${0}", winId);
					var that = this;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_is_minimize] win not exist! :${0}", winId);
						return;
					}
					ZHONGJYUAN.logger.debug("vue.[win_is_minimize] win:${0}", JSON.stringify(win));
					return win.min;
				},

				/**
				 * 窗体地址栏后退
				 * @author zhongjyuan
				 * @date   2023年5月15日15:57:29
				 * @email  zhongjyuan@outlook.com
				 * @param {*} data 数据
				 * @param {*} winId 窗体唯一标识
				 */
				win_urlbar_back: function(data, winId) {
					ZHONGJYUAN.logger.trace("vue.[win_urlbar_back] data:${0};winId:${1}", JSON.stringify(data), winId);
					var that = this;

					winId = data || winId;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_urlbar_back] win not exist! :${0}", winId);
						return;
					}

					var history = win.history;
					if (that.win_urlbar_back_available(winId)) {
						win.url = win.urlBar = history.urls[--history.pos];
					}
					ZHONGJYUAN.logger.debug("vue.[win_urlbar_back] win:${0}", JSON.stringify(win));
				},

				/**
				 * 窗体地址栏后退是否可行
				 * @author zhongjyuan
				 * @date   2023年5月15日15:57:38
				 * @email  zhongjyuan@outlook.com
				 * @param {*} data 数据
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_urlbar_back_available: function(data, winId) {
					ZHONGJYUAN.logger.trace("vue.[win_urlbar_back_available] data:${0};winId:${1}", JSON.stringify(data), winId);
					var that = this;

					winId = data || winId;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_urlbar_back_available] win not exist! :${0}", winId);
						return;
					}

					var history = win.history;
					var result = history.pos > 0 && history.urls[history.pos - 1];

					ZHONGJYUAN.logger.debug("vue.[win_urlbar_back_available] win:${0};result:${1}", JSON.stringify(win), result);
					return result;
				},

				/**
				 * 窗体地址栏前进
				 * @author zhongjyuan
				 * @date   2023年5月15日15:58:32
				 * @email  zhongjyuan@outlook.com
				 * @param {*} data 数据
				 * @param {*} winId 窗体唯一标识
				 */
				win_urlbar_forward: function(data, winId) {
					ZHONGJYUAN.logger.trace("vue.[win_urlbar_forward] data:${0};winId:${1}", JSON.stringify(data), winId);
					var that = this;

					winId = data || winId;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_urlbar_forward] win not exist! :${0}", winId);
						return;
					}

					var history = win.history;
					if (that.win_urlbar_forward_available(winId)) {
						win.url = win.urlBar = history.urls[++history.pos];
					}
					ZHONGJYUAN.logger.debug("vue.[win_urlbar_forward] win:${0}", JSON.stringify(win));
				},

				/**
				 * 窗体地址栏前进是否可行
				 * @author zhongjyuan
				 * @date   2023年5月15日15:58:37
				 * @email  zhongjyuan@outlook.com
				 * @param {*} data 数据
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_urlbar_forward_available: function(data, winId) {
					ZHONGJYUAN.logger.trace("vue.[win_urlbar_forward_available] data:${0};winId:${1}", JSON.stringify(data), winId);
					var that = this;

					winId = data || winId;
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_urlbar_forward_available] win not exist! :${0}", winId);
						return;
					}

					var history = win.history;
					var posMax = history.urls.length - 1;
					var result = history.pos < posMax && history.urls[history.pos + 1];

					ZHONGJYUAN.logger.debug("vue.[win_urlbar_forward_available] win:${0};result:${1}", JSON.stringify(win), result);
					return result;
				},

				/**
				 * 窗体右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日17:39:13
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @param {*} event 事件对象
				 */
				win_context_menu: function(winId, event) {
					ZHONGJYUAN.logger.trace("vue.[win_context_menu] winId:${0};event:${1}", winId, JSON.stringify(event));
					var that = this;

					var win = this.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_context_menu] win not exist! :${0}", winId);
						return;
					}

					var menu = [
						[
							ZHONGJYUAN.component.fontawesomeHtml("refresh") + ZHONGJYUAN.api.lang("Refresh"),
							function() {
								that.win_refresh(winId);
							},
						],
					];

					if (!win.addressBar) {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("location-arrow") + ZHONGJYUAN.api.lang("DisplayAddressBar"),
							function() {
								win.addressBar = true;
							},
						]);
					} else {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("location-arrow") + ZHONGJYUAN.api.lang("HideAddressBar"),
							function() {
								win.addressBar = false;
							},
						]);
					}

					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("magic") + ZHONGJYUAN.api.lang("CollectAsApplication"),
						function() {
							layer.prompt(
								{
									title: ZHONGJYUAN.api.lang("AttentionEnterAppName"),
									formType: 0,
									value: ZHONGJYUAN.helper.url.parseObject(win.url).host,
									maxlength: 32,
									skin: "zhongjyuan",
									zIndex: 19930012,
								},
								function(input, index) {
									layer.close(index);
									var app = ZHONGJYUAN.static.template.app;
									app.url = ZHONGJYUAN.api.url.removeParamToken(win.url);
									app.title = input;
									app.icon.type = "str";
									app.icon.content = input;
									var appId = "app-" + ZHONGJYUAN.api.id();
									ZHONGJYUAN.api.app.install(appId, app);
									ZHONGJYUAN.api.addShortcut(appId); //自动添加到桌面
									ZHONGJYUAN.api.addStartMenu(appId); //自动添加到菜单
									ZHONGJYUAN.api.message.simple(ZHONGJYUAN.api.lang("Added"));
								}
							);
						},
						!ZHONGJYUAN.static.changeable,
					]);
					menu.push("|");

					var menuWin = [];
					menuWin.push(
						ZHONGJYUAN.component.fontawesomeHtml("arrows") +
							ZHONGJYUAN.helper.format("${0}px * ${1}px", parseInt(win.style.size.width), parseInt(win.style.size.height))
					);

					menuWin.push([
						ZHONGJYUAN.component.fontawesomeHtml("window-restore") + ZHONGJYUAN.api.lang("CentreAdjustment"),
						function() {
							that.win_center(winId);
							that.win_set_active(winId);
						},
					]);

					if (that.win_is_minimize(winId)) {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("clone") + ZHONGJYUAN.api.lang("DisplayWindow"),
							function() {
								that.win_show(winId);
							},
						]);
					} else {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("window-minimize") + ZHONGJYUAN.api.lang("Minimize"),
							function() {
								that.win_minimize(winId);
							},
						]);
					}

					if (!win.plugin && win.state === "normal" && win.resizable) {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("window-maximize") + ZHONGJYUAN.api.lang("Maximize"),
							function() {
								that.win_show(winId);
								that.win_maximize(winId);
							},
						]);
					}

					if (!win.plugin && win.state === "max") {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("window-restore") + ZHONGJYUAN.api.lang("Restore"),
							function() {
								that.win_restore(winId);
							},
						]);
					}
					menuWin.push("|");

					if (win.style.position.left) {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("angle-double-right") +
								ZHONGJYUAN.api.lang("AlignRight") +
								ZHONGJYUAN.helper.format(" (${0}px)", parseInt(win.style.position.x)),
							function() {
								win.style.position.left = !win.style.position.left;
							},
						]);
					} else {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("angle-double-left") +
								ZHONGJYUAN.api.lang("AlignLeft") +
								ZHONGJYUAN.helper.format(" (${0}px)", parseInt(win.style.position.x)),
							function() {
								win.style.position.left = !win.style.position.left;
							},
						]);
					}

					if (win.style.position.top) {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("angle-double-down") +
								ZHONGJYUAN.api.lang("AlignBottom") +
								ZHONGJYUAN.helper.format(" (${0}px)", parseInt(win.style.position.y)),
							function() {
								win.style.position.top = !win.style.position.top;
							},
						]);
					} else {
						menuWin.push([
							ZHONGJYUAN.component.fontawesomeHtml("angle-double-up") +
								ZHONGJYUAN.api.lang("AlignTop") +
								ZHONGJYUAN.helper.format(" (${0}px)", parseInt(win.style.position.y)),
							function() {
								win.style.position.top = !win.style.position.top;
							},
						]);
					}

					menu.push([ZHONGJYUAN.component.fontawesomeHtml("windows") + ZHONGJYUAN.api.lang("WindowPosition"), menuWin]);

					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("paper-plane") + ZHONGJYUAN.api.lang("OpenOuter"),
						function() {
							window.open(win.url);
						},
					]);

					//记住位置大小
					if (win.source) {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("crop") + ZHONGJYUAN.api.lang("RememberSizeAndPosition"),
							function() {
								win.source.style = {};
								win.source.style.position = {};
								win.source.style.size = {};
								win.source.style.position.x = win.style.position.x;
								win.source.style.position.y = win.style.position.y;
								win.source.style.position.left = win.style.position.left;
								win.source.style.position.top = win.style.position.top;
								win.source.style.position.autoOffset = false;
								win.source.style.size.height = win.style.size.height;
								win.source.style.size.width = win.style.size.width;
								ZHONGJYUAN.api.message.simple(ZHONGJYUAN.api.lang("Recorded"));
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);

						if (win.source.style) {
							menu.push([
								ZHONGJYUAN.component.fontawesomeHtml("crop") + ZHONGJYUAN.api.lang("ResetSizeAndPosition"),
								function() {
									delete win.source.style;
								},
								!ZHONGJYUAN.static.switch.storageChange,
							]);
						}
					}

					//可以置底作为背景
					if (win.plugin) {
						menu.push("|");
						if (win.background) {
							menu.push([
								ZHONGJYUAN.component.fontawesomeHtml("sort-up") + ZHONGJYUAN.api.lang("PutForeground"),
								function() {
									win.background = false;
								},
							]);
						} else {
							menu.push([
								ZHONGJYUAN.component.fontawesomeHtml("sort-down") + ZHONGJYUAN.api.lang("PutBackground"),
								function() {
									win.background = true;
								},
							]);
						}
					}
					menu.push("|");

					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("close") + ZHONGJYUAN.api.lang("Close"),
						function() {
							that.win_close(id);
						},
					]);

					ContextMenu.render(event, menu, that, "light");
				},

				/**
				 * 窗体标题双击
				 * @author zhongjyuan
				 * @date 2023年6月1日17:42:32
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_title_double_click: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_title_double_click] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_title_double_click] win not exist! :${0}", winId);
						return;
					}

					if (win.plugin) {
						ZHONGJYUAN.logger.warn("vue.[win_title_double_click] win is plugin! :${0}", winId);
						return;
					}

					if (win.state === "max") {
						that.win_restore(winId);
					} else {
						that.win_maximize(winId);
					}
					ZHONGJYUAN.logger.debug("vue.[win_title_double_click] win:${0}", JSON.stringify(win));
				},

				/**
				 * 窗体标题按下
				 * @author zhongjyuan
				 * @date 2023年6月1日17:44:33
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @param {*} event 事件对象
				 * @returns
				 */
				win_title_mouse_down: function(winId, event) {
					ZHONGJYUAN.logger.trace("vue.[win_title_mouse_down] winId:${0};event:${1}", winId, JSON.stringify(event));

					//忽略右键
					if (event.which === 3) return;

					var that = this;
					var isMouse = !event.changedTouches; //是否是鼠标事件，false为触屏；
					var point = ZHONGJYUAN.helper.getPositionByEvent(event, isMouse);

					//拖动逻辑
					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_title_mouse_down] win not exist! :${0}", winId);
						return;
					}
					win.drag.x = point.x;
					win.drag.y = point.y;
					win.drag.positionable = true;

					/**
					 * 鼠标松开
					 * @author zhongjyuan
					 * @date 2023年6月1日17:47:43
					 * @email  zhongjyuan@outlook.com
					 * @param {*} e 事件对象
					 * @returns
					 */
					var mouse_up = function(e) {
						if (!win.drag.positionable) return;

						win.drag.positionable = false;
						that.runtime.drag = false;

						//事件解绑
						if (isMouse) {
							$(document).unbind("mousemove", mouse_move);
							$(document).unbind("mouseup", mouse_up);
						} else {
							$(document).unbind("touchmove", mouse_move);
							$(document).unbind("touchend", mouse_up);
						}
					};

					/**
					 * 鼠标移动
					 * @author zhongjyuan
					 * @date 2023年6月1日17:48:23
					 * @email  zhongjyuan@outlook.com
					 * @param {*} e 事件对象
					 * @returns
					 */
					var mouse_move = function(e) {
						if (!win.drag.positionable) return;

						that.runtime.drag = true;
						var p = ZHONGJYUAN.helper.getPositionByEvent(e, isMouse);
						var x = p.x;
						var y = p.y;

						if (win.state === "max" && y - win.drag.y > 2) that.win_restore(winId); //在全屏状态拖动，自动还原

						win.style.position.x += win.style.position.left ? x - win.drag.x : win.drag.x - x;
						win.style.position.y += win.style.position.top ? y - win.drag.y : win.drag.y - y;

						win.drag.x = x;
						win.drag.y = y;
					};

					if (isMouse) {
						$(document).mouseup(mouse_up);
						$(document).mousemove(mouse_move);
					} else {
						$(document).on("touchend", mouse_up);
						$(document).on("touchmove", mouse_move);
					}
				},

				/**
				 * 窗体大小变化按下
				 * @author zhongjyuan
				 * @date 2023年6月1日17:51:51
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @param {*} event 事件对象
				 */
				win_resize_mouse_down: function(winId, event) {
					ZHONGJYUAN.logger.trace("vue.[win_resize_mouse_down] winId:${0};event:${1}", winId, JSON.stringify(event));
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_resize_mouse_down] win not exist! :${0}", winId);
						return;
					}
					win.drag.x = event.pageX;
					win.drag.y = event.pageY;
					win.drag.resizable = true;

					/**
					 * 鼠标松开
					 * @author zhongjyuan
					 * @date 2023年6月1日17:53:53
					 * @email  zhongjyuan@outlook.com
					 * @param {*} e 事件对象
					 * @returns
					 */
					var mouse_up = function(e) {
						if (!win.drag.resizable) return;

						win.drag.resizable = false;
						that.runtime.drag = false;

						$(document).unbind("mouseup", mouse_up);
						$(document).unbind("mousemove", mouse_move);
					};

					/**
					 * 鼠标移动
					 * @author zhongjyuan
					 * @date 2023年6月1日17:54:15
					 * @email  zhongjyuan@outlook.com
					 * @param {*} e 事件对象
					 * @returns
					 */
					var mouse_move = function(e) {
						if (!win.drag.resizable) return;

						var minWidth = 200;
						var minHeight = 84;

						that.runtime.drag = true;
						var x = e.pageX;
						var y = e.pageY;

						win.style.size.width += x - win.drag.x;
						win.style.size.width > minWidth || (win.style.size.width = minWidth);

						win.style.size.height += y - win.drag.y;
						win.style.size.height > minHeight || (win.style.size.height = minHeight);

						win.drag.x = x;
						win.drag.y = y;
					};

					$(document).mouseup(mouse_up);
					$(document).mousemove(mouse_move);
				},

				/**
				 * 窗体样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日17:36:42
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_class: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_class] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_class] win not exist! :${0}", winId);
						return;
					}

					return {
						active: winId === that.runtime.winActive && !that.win_is_minimize(winId),
						plugin: win.plugin,
						"addressBar-hidden": !win.addressBar,
					};
				},

				/**
				 * 窗体样式
				 * @author zhongjyuan
				 * @date 2023年6月1日17:34:32
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_style: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_style] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_style] win not exist! :${0}", winId);
						return;
					}

					return {
						width: win.style.size.width + "px",
						height: win.style.size.height + "px",
						top: win.style.position.top ? win.style.position.y + "px" : "auto",
						left: win.style.position.left ? win.style.position.x + "px" : "auto",
						bottom: !win.style.position.top ? win.style.position.y + "px" : "auto",
						right: !win.style.position.left ? win.style.position.x + "px" : "auto",
						"z-index": win.style.index + (win.background ? -500 : 0),
					};
				},

				/**
				 * 窗体横栏样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日17:57:47
				 * @email  zhongjyuan@outlook.com
				 * @param {*} win 窗体对象
				 * @returns
				 */
				win_bar_class: function(win) {
					ZHONGJYUAN.logger.trace("vue.[win_bar_class] win:${0}", JSON.stringify(win));
					return { "no-max": win.plugin || !win.resizable };
				},

				/**
				 * 窗体初始化样式
				 * @author zhongjyuan
				 * @date 2023年6月1日17:56:50
				 * @email  zhongjyuan@outlook.com
				 * @param {*} win 窗体对象
				 * @returns
				 */
				win_init_style: function(win) {
					ZHONGJYUAN.logger.trace("vue.[win_init_style] win:${0}", JSON.stringify(win));
					var configs = this.configs;

					return { "background-color": win.icon.background || configs.themeColor };
				},

				/**
				 * 窗体图标样式
				 * @author zhongjyuan
				 * @date 2023年6月1日17:35:35
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				win_icon_style: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[win_icon_style] winId:${0}", winId);
					var that = this;

					var win = that.wins[winId];
					if (!win) {
						ZHONGJYUAN.logger.warn("vue.[win_icon_style] win not exist! :${0}", winId);
						return;
					}
					var size = Math.min(win.style.size.width, win.style.size.height) / 4;

					return {
						"font-size": size + "px",
						"line-height": size + "px",
						width: size * 1.5 + "px",
					};
				},

				/**
				 * 窗体横栏罩样式
				 * @author zhongjyuan
				 * @date 2023年6月1日17:58:27
				 * @email  zhongjyuan@outlook.com
				 * @param {*} win 窗体对象
				 * @returns
				 */
				win_bar_mask_style: function(win) {
					ZHONGJYUAN.logger.trace("vue.[win_bar_mask_style] win:${0}", JSON.stringify(win));
					var configs = this.configs;

					return {
						background: win.init ? win.icon.background || configs.themeColor : configs.themeColor,
						opacity: win.init ? 1 : 0.9,
					};
				},

				/**
				 * 任务栏驱动文本
				 * @author zhongjyuan
				 * @date 2023年6月1日18:47:17
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_powered_text: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_powered_text]");
					return "Powered by zhongjyuan v" + ZHONGJYUAN.static.version;
				},

				/**
				 * 任务栏右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日18:47:58
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				bar_context_menu: function(event) {
					ZHONGJYUAN.logger.trace("vue.[bar_context_menu] event:${0}", JSON.stringify(event));
					var that = this;

					var menu = [
						[
							ZHONGJYUAN.component.fontawesomeHtml("window-minimize") + ZHONGJYUAN.api.lang("HideAll"),
							function() {
								that.win_hide_all();
							},
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("clone") + ZHONGJYUAN.api.lang("DisplayAll"),
							function() {
								that.win_show_all();
							},
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("window-close") + ZHONGJYUAN.api.lang("CloseAll"),
							function() {
								that.win_close_all();
							},
						],
						"|",
					];

					if (that.configs.topTaskBar) {
						menu.push(
							[
								ZHONGJYUAN.component.fontawesomeHtml("arrow-down") + ZHONGJYUAN.api.lang("BottomTaskBar"),
								function() {
									that.configs.topTaskBar = false;
								},
							],
							!ZHONGJYUAN.static.switch.storageChange
						);
					} else {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("arrow-up") + ZHONGJYUAN.api.lang("TopTaskBar"),
							function() {
								that.configs.topTaskBar = true;
							},
						]);
					}

					ContextMenu.render(event, menu, that);
				},

				/**
				 * 任务栏窗体任务点击
				 * @author zhongjyuan
				 * @date 2023年6月1日18:50:46
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				bar_win_task_button_click: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[bar_win_task_button_click] winId:${winId}", winId);
					var that = this;

					if (that.win_is_minimize(winId) || that.startMenu.open || that.drawer) {
						that.win_show(winId);
						that.win_set_active(winId);
					} else {
						if (that.runtime.winActive === winId) {
							that.win_minimize(winId);
							that.win_find_active();
						} else {
							that.win_set_active(winId);
						}
					}
					ZHONGJYUAN.logger.debug("vue.[bar_win_task_button_click] runtime:${0}", JSON.stringify(that.runtime));
				},

				/**
				 * 任务栏开始按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月1日18:51:39
				 * @email  zhongjyuan@outlook.com
				 */
				bar_start_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_start_button_click]");
					var that = this;

					if (that.startMenu.open) {
						that.close_opens();
					} else {
						that.close_opens();
						that.startMenu.open = !that.startMenu.open;
					}

					ZHONGJYUAN.logger.debug("vue.[bar_start_button_click] startMenu:${0}", JSON.stringify(that.startMenu));
				},

				/**
				 * 任务栏显示桌面按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月1日19:07:37
				 * @email  zhongjyuan@outlook.com
				 */
				bar_show_desktop_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_show_desktop_button_click]");
					var that = this;

					if (that.runtime.isSmallScreen && that.startMenu.open) {
						that.runtime.menuOnLeft = !that.runtime.menuOnLeft;
					} else {
						that.desktop_show();
					}
					ZHONGJYUAN.logger.debug("vue.[bar_show_desktop_button_click] runtime:${0}", JSON.stringify(that.runtime));
				},

				/**
				 * 任务栏消息中心按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月1日19:07:56
				 * @email  zhongjyuan@outlook.com
				 */
				bar_message_center_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_message_center_button_click]");
					var that = this;

					if (that.center.open) {
						that.close_opens();
					} else {
						that.close_opens();
						that.center.open = true;
						that.center.unreadCount = 0;
					}
					ZHONGJYUAN.logger.debug("vue.[bar_message_center_button_click] center:${0}", JSON.stringify(that.center));
				},

				/**
				 * 任务栏时间按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月1日19:08:36
				 * @email  zhongjyuan@outlook.com
				 */
				bar_datetime_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_datetime_button_click]");
					var runtime = this.runtime;

					runtime.calendarOpen = !runtime.calendarOpen;
					runtime.pluginIconsOpen = false;
					ZHONGJYUAN.logger.debug("vue.[bar_datetime_button_click] runtime:${0}", JSON.stringify(this.runtime));
				},

				/**
				 * 任务栏任务托盘按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月1日19:09:40
				 * @email  zhongjyuan@outlook.com
				 */
				bar_tasktray_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_tasktray_button_click]");
					var runtime = this.runtime;

					runtime.pluginIconsOpen = !runtime.pluginIconsOpen;
					runtime.calendarOpen = false;
					ZHONGJYUAN.logger.debug("vue.[bar_tasktray_button_click] runtime:${0}", JSON.stringify(runtime));
				},

				/**
				 * 任务栏窗体任务样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日18:49:52
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 */
				bar_win_task_button_class: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[bar_win_task_button_class] winId:${0}", winId);
					var that = this;

					return {
						active: winId === that.runtime.winActive && !that.win_is_minimize(winId),
						shadow: winId === that.runtime.winActive && !that.win_is_minimize(winId),
					};
				},

				/**
				 * 开始菜单盒子点击
				 * @author zhongjyuan
				 * @date 2023年6月1日18:53:26
				 * @email  zhongjyuan@outlook.com
				 */
				start_menu_transition_click: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_click]");
					var that = this;

					that.center.open = false;
					that.runtime.pluginIconsOpen = false;
					that.runtime.calendarOpen = false;
					ZHONGJYUAN.logger.debug("vue.[start_menu_transition_click] runtime:${0}", JSON.stringify(that.runtime));
				},

				/**
				 * 开始菜单盒子大小变化鼠标按下
				 * @author zhongjyuan
				 * @date 2023年6月1日18:54:21
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				start_menu_transition_resize_mouse_down: function(event) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_resize_mouse_down] event:${0}", JSON.stringify(event));
					var that = this;

					var startMenu = that.runtime.startMenu;
					startMenu.drag.x = event.pageX;
					startMenu.drag.y = event.pageY;
					startMenu.drag.mouseDown = true;

					/**
					 * 鼠标松开
					 * @author zhongjyuan
					 * @date 2023年6月1日18:54:45
					 * @email  zhongjyuan@outlook.com
					 * @param {*} event 事件对象
					 * @returns
					 */
					var mouse_up = function(event) {
						if (!startMenu.drag.mouseDown) return;

						startMenu.drag.mouseDown = false;

						$(document).unbind("mouseup", mouse_up);
						$(document).unbind("mousemove", mouse_move);
					};

					/**
					 * 鼠标移动
					 * @author zhongjyuan
					 * @date 2023年6月1日18:54:50
					 * @email  zhongjyuan@outlook.com
					 * @param {*} event 事件对象
					 * @returns
					 */
					var mouse_move = function(event) {
						if (!startMenu.drag.mouseDown) return;

						var minWidth = 320;
						var minHeight = 160;

						var x = event.pageX;
						var y = event.pageY;

						that.startMenu.width += x - startMenu.drag.x;

						that.startMenu.width > minWidth || (that.startMenu.width = minWidth);

						that.startMenu.height -= (that.configs.topTaskBar ? -1 : 1) * (y - startMenu.drag.y);

						that.startMenu.height > minHeight || (that.startMenu.height = minHeight);

						startMenu.drag.x = x;
						startMenu.drag.y = y;

						that.on_resize();
					};

					$(document).mouseup(mouse_up);
					$(document).mousemove(mouse_move);
				},

				/**
				 * 开始菜单盒子侧边栏鼠标离开
				 * @author zhongjyuan
				 * @date 2023年6月1日18:56:13
				 * @email  zhongjyuan@outlook.com
				 */
				start_menu_transition_sidebar_mouse_leave: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_sidebar_mouse_leave]");
					var that = this;

					that.startMenu.sidebar.open = false;
					ZHONGJYUAN.logger.debug("vue.[start_menu_transition_sidebar_mouse_leave] startMenu:${0}", JSON.stringify(that.startMenu));
				},

				/**
				 * 开始菜单盒子侧边栏按钮右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日18:57:47
				 * @email  zhongjyuan@outlook.com
				 * @param {*} buttonId 按钮唯一标识
				 * @param {*} event 事件对象
				 */
				start_menu_transition_sidebar_button_context_menu: function(buttonId, event) {
					ZHONGJYUAN.logger.trace(
						"vue.[start_menu_transition_sidebar_button_context_menu] buttonId:${0};event:${1}",
						buttonId,
						JSON.stringify(event)
					);
					var that = this;

					var button = that.startMenu.sidebar.buttons[buttonId];
					var buttonCopy = ZHONGJYUAN.helper.json.deepCopy({
						title: button.title,
						hash: button.hash,
						params: button.params,
						app: button.app,
						style: button.style,
					});

					var menu = [
						that.context_menu_open(button),
						that.context_menu_add_to(buttonCopy),
						[
							ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename") + "/" + ZHONGJYUAN.api.lang("Options"),
							function(v) {
								that.shortSetting = button;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						"|",
						[
							ZHONGJYUAN.component.fontawesomeHtml("arrow-up") + ZHONGJYUAN.api.lang("ShiftUp"),
							function() {
								ZHONGJYUAN.helper.arrayUp(that.startMenu.sidebar.buttons, buttonId);
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("arrow-down") + ZHONGJYUAN.api.lang("ShiftDown"),
							function() {
								ZHONGJYUAN.helper.arrayDown(that.startMenu.sidebar.buttons, buttonId);
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						"|",
						[
							ZHONGJYUAN.component.fontawesomeHtml("remove") + ZHONGJYUAN.api.lang("Delete"),
							function() {
								ZHONGJYUAN.api.message.confirm(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("DeleteBtnConfirm"), button.title), function() {
									that.startMenu.sidebar.buttons.splice(buttonId, 1);
								});
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						that.context_menu_uninstall(button.app),
					];

					ContextMenu.render(event, menu, that);
				},

				/**
				 * 开始菜单盒子侧边栏顶部按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月1日18:59:35
				 * @email  zhongjyuan@outlook.com
				 */
				start_menu_transition_sidebar_top_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_sidebar_button_context_menu]");
					var that = this;

					that.startMenu.sidebar.open = !that.startMenu.sidebar.open;
					ZHONGJYUAN.logger.debug("vue.[start_menu_transition_sidebar_button_context_menu] startMenu:${0}", JSON.stringify(that.startMenu));
				},

				/**
				 * 开始菜单盒子侧边栏顶部按钮标题
				 * @author zhongjyuan
				 * @date 2023年6月1日18:59:57
				 * @email  zhongjyuan@outlook.com
				 */
				start_menu_transition_sidebar_top_button_title: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_sidebar_top_button_title]");
					return ZHONGJYUAN.api.lang("Start");
				},

				/**
				 * 开始菜单盒子菜单右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日19:00:43
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				start_menu_transition_menu_context_menu: function(event) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_menu_context_menu] event:${0}", JSON.stringify(event));
					var that = this;

					var menu = [
						[
							ZHONGJYUAN.component.fontawesomeHtml("object-group") + ZHONGJYUAN.api.lang("NewSubgroup"),
							function() {
								var item = {
									title: ZHONGJYUAN.api.lang("Group"),
									children: {},
									open: true,
								};
								that.win_set_id(that.startMenu.menu, item, "menuGroup-");
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("paste") + ZHONGJYUAN.api.lang("Paste"),
							function() {
								var menuCut = that.runtime.menuItemCut;
								that.menu_item_action(menuCut, function(menu, parent) {
									if (parent.children) {
										that.$delete(parent.children, menuCut);
									} else {
										that.$delete(parent, menuCut);
									}
									that.$set(that.startMenu.menu, menuCut, menu);
								});
								that.runtime.menuItemCut = null;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
					];

					ContextMenu.render(event, menu, that);
				},

				/**
				 * 开始菜单盒子菜单项点击
				 * @author zhongjyuan
				 * @date 2023年6月1日19:02:06
				 * @email  zhongjyuan@outlook.com
				 * @param {*} menu 菜单对象
				 */
				start_menu_transition_menu_item_click: function(menu) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_menu_item_click] menu:${0}", JSON.stringify(menu));
					this.app_open(menu.app, menu, menu);
				},

				/**
				 * 开始菜单盒子菜单项右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日19:03:25
				 * @email  zhongjyuan@outlook.com
				 * @param {*} data 数据对象
				 */
				start_menu_transition_menu_item_context_menu: function(data) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_menu_item_context_menu] data:${0}", JSON.stringify(data));
					var that = this;

					var item = data.item;
					var itemCopy = ZHONGJYUAN.helper.json.deepCopy({
						title: item.title,
						hash: item.hash,
						params: item.params,
						app: item.app,
						style: item.style,
					});

					var itemId = data.id;
					var menu = [];

					if (item.app && !item.children) {
						menu = [
							that.context_menu_open(item),
							that.context_menu_add_to(itemCopy),
							[
								ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename") + "/" + ZHONGJYUAN.api.lang("Options"),
								function(v) {
									that.shortSetting = item;
								},
								!ZHONGJYUAN.static.switch.storageChange,
							],
						];
					} else {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("object-group") + ZHONGJYUAN.api.lang("NewSubgroup"),
							function() {
								var itemNew = {
									title: ZHONGJYUAN.api.lang("Group"),
									children: {},
									open: true,
								};
								that.win_set_id(item.children, itemNew, "menuGroup-");
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename"),
							function() {
								that.shortSetting = item;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
					}
					menu.push("|");

					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("cut") + ZHONGJYUAN.api.lang("CutAndExchange"),
						function() {
							that.runtime.menuItemCut = itemId;
							ZHONGJYUAN.api.message.simple(item.title + " " + ZHONGJYUAN.api.lang("Recorded"));
						},
						!ZHONGJYUAN.static.switch.storageChange,
					]);

					if (that.runtime.menuItemCut) {
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("paste") + ZHONGJYUAN.api.lang("Paste"),
							function() {
								var menuCut = that.runtime.menuItemCut;
								that.menu_item_action(menuCut, function(menu, parent) {
									if (parent.children) {
										that.$delete(parent.children, menuCut);
									} else {
										that.$delete(parent, menuCut);
									}
									that.$set(item.children, menuCut, menu);
								});
								that.runtime.menuItemCut = null;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
						menu.push([
							ZHONGJYUAN.component.fontawesomeHtml("exchange") + ZHONGJYUAN.api.lang("Exchange"),
							function() {
								var idA = itemId,
									childA,
									fatherA;
								var idB = that.runtime.menuItemCut,
									childB,
									fatherB;

								that.menu_item_action(idA, function(child, father) {
									childA = child;
									fatherA = father;
								});

								that.menu_item_action(idB, function(child, father) {
									childB = child;
									fatherB = father;
								});

								that.runtime.menuItemCut = null;
								try {
									fatherA[idA] = childB;
									fatherB[idB] = childA;
								} catch (e) {}
							},
							!ZHONGJYUAN.static.switch.storageChange,
						]);
					}
					menu.push("|");

					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("remove") + ZHONGJYUAN.api.lang("Delete"),
						function() {
							ZHONGJYUAN.api.message.confirm(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("DeleteMenuConfirm"), item.title), function() {
								that.menu_item_action(itemId, function(child, father) {
									if (father.children) {
										that.$delete(father.children, itemId);
									} else {
										that.$delete(father, itemId);
									}
								});
							});
						},
						!ZHONGJYUAN.static.switch.storageChange,
					]);

					if (item.app) {
						menu.push(that.context_menu_uninstall(item.app));
					}

					ContextMenu.render(data.event, menu, that);
				},

				/**
				 * 开始菜单盒子磁贴点击
				 * @author zhongjyuan
				 * @date 2023年6月2日18:51:44
				 * @email  zhongjyuan@outlook.com
				 * @param {*} tile 磁贴对象
				 */
				start_menu_transition_tile_click: function(tile) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_click] tile:${0}", tile);
					var that = this;
					if (!that.runtime.tileMoved) {
						that.app_open(tile.app, tile, tile);
					}
					that.runtime.tileMoved = false;
					ZHONGJYUAN.logger.debug("vue.[start_menu_transition_tile_click] runtime:${0}", JSON.stringify(that.runtime));
				},

				/**
				 * 开始菜单盒子磁贴移动
				 * @author zhongjyuan
				 * @date 2023年6月2日18:49:36
				 * @email  zhongjyuan@outlook.com
				 */
				start_menu_transition_tile_moved: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_moved]");
					var runtime = this.runtime;
					runtime.tileMoved = true;
					ZHONGJYUAN.logger.debug("vue.[start_menu_transition_tile_moved] runtime:${0}", JSON.stringify(that.runtime));
				},

				/**
				 * 开始菜单盒子磁贴鼠标按下
				 * @author zhongjyuan
				 * @date 2023年6月2日18:58:41
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				start_menu_transition_tile_mouse_down: function(event) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_mouse_down] event:${0}", JSON.stringify(event));
					var that = this;

					var x1 = event.pageX;
					var y1 = event.pageY;

					var mouse_up = function(e) {
						var x2 = e.pageX;
						var y2 = e.pageY;
						if (Math.abs(x2 - x1) + Math.abs(y2 - y1) > 5) {
							that.runtime.tileMoved = true;
						}
						$(document).unbind("mouseup", mouse_up);
					};

					$(document).on("mouseup", mouse_up);
				},

				/**
				 * 开始菜单盒子磁贴右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月2日19:05:07
				 * @email  zhongjyuan@outlook.com
				 * @param {*} groupIndex 磁贴分组下标
				 * @param {*} tileIndex 磁贴下标
				 * @param {*} event 事件对象
				 */
				start_menu_transition_tile_context_menu: function(groupIndex, tileIndex, event) {
					ZHONGJYUAN.logger.trace(
						"vue.[start_menu_transition_tile_context_menu] groupIndex:${0};tileIndex:${1};event:${2}",
						groupIndex,
						tileIndex,
						JSON.stringify(event)
					);
					var that = this;

					var tile = that.tiles[groupIndex].data[tileIndex];
					var objCopy = ZHONGJYUAN.helper.json.deepCopy({
						title: tile.title,
						hash: tile.hash,
						params: tile.params,
						app: tile.app,
						style: tile.style,
					});

					var menu = [
						that.context_menu_open(tile),
						that.context_menu_add_to(objCopy),
						[
							ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename") + "/" + ZHONGJYUAN.api.lang("Options"),
							function(v) {
								that.shortSetting = tile;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						"|",
						[
							ZHONGJYUAN.component.fontawesomeHtml("braille") + ZHONGJYUAN.api.lang("Small") + ZHONGJYUAN.api.lang("Size"),
							function() {
								tile.w = 1;
								tile.h = 1;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("braille") + ZHONGJYUAN.api.lang("Middle") + ZHONGJYUAN.api.lang("Size"),
							function() {
								tile.w = 2;
								tile.h = 2;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("braille") + ZHONGJYUAN.api.lang("Big") + ZHONGJYUAN.api.lang("Size"),
							function() {
								tile.w = 4;
								tile.h = 4;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
					];

					//处理磁贴转移到其他组的逻辑
					if (that.tiles.length > 1) {
						var moveMenu = [];
						that.tiles.forEach(function(t, n) {
							if (n === groupIndex) return;
							moveMenu.push([
								that.tiles[n].title,
								function() {
									that.tiles[groupIndex].data.splice(tileIndex, 1);
									var movedTile = ZHONGJYUAN.helper.json.deepCopy(tile);
									movedTile.y = 999;
									movedTile.x = 0;
									that.tiles[n].data.push(movedTile);
								},
								!ZHONGJYUAN.static.switch.storageChange,
							]);
						});
						menu.push([ZHONGJYUAN.component.fontawesomeHtml("cut") + ZHONGJYUAN.api.lang("MoveTo"), moveMenu]);
					}

					menu.push("|");
					menu.push([
						ZHONGJYUAN.component.fontawesomeHtml("remove") + ZHONGJYUAN.api.lang("Delete"),
						function() {
							ZHONGJYUAN.api.message.confirm(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("DeleteTileConfirm"), tile.title), function() {
								that.tiles[groupIndex].data.splice(tileIndex, 1);
							});
						},
						!ZHONGJYUAN.static.switch.storageChange,
					]);
					menu.push(that.context_menu_uninstall(tile.app));

					ContextMenu.render(event, menu, this);
				},

				/**
				 * 开始菜单盒子磁贴自定义
				 * @author zhongjyuan
				 * @date 2023年6月2日19:13:52
				 * @email  zhongjyuan@outlook.com
				 * @param {*} app 应用对象
				 * @returns
				 */
				start_menu_transition_tile_custom_iframe: function(app) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_custom_iframe] app:${0}", JSON.stringify(app));
					var that = this;
					return app.urlRandomToken ? ZHONGJYUAN.api.url.appendParamToken(app.tileUrl, "", that.runtime.customTileToken) : app.tileUrl;
				},

				/**
				 * 开始菜单盒子磁贴图标样式
				 * @author zhongjyuan
				 * @date 2023年6月2日19:16:34
				 * @email  zhongjyuan@outlook.com
				 * @param {*} tile 磁贴对象
				 * @returns
				 */
				start_menu_transition_tile_icon_style: function(tile) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_icon_style] tile:${0}", JSON.stringify(tile));
					var that = this;

					var sizePerBlock = that.runtime.tileSize;

					var sizeRel = function(size) {
						return size * (sizePerBlock + 4) - 4;
					};

					var w = tile.w;
					var h = tile.h;
					var min = Math.min(w, h) / 1.5;
					var size = sizeRel(min);

					return {
						width: size + "px",
						height: size + "px",
						top: (sizeRel(h) - size) / 2 + "px",
						left: (sizeRel(w) - size) / 2 + "px",
						"line-height": size + "px",
						"font-size": size / 2 + "px",
					};
				},

				/**
				 * 开始菜单盒子磁贴箱子右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月1日19:04:38
				 * @email  zhongjyuan@outlook.com
				 * @param {*} event 事件对象
				 */
				start_menu_transition_tile_box_context_menu: function(event) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_box_context_menu] event:${0}", JSON.stringify(event));
					var that = this;
					var menu = [
						[
							ZHONGJYUAN.component.fontawesomeHtml("object-group") + ZHONGJYUAN.api.lang("NewSubgroup"),
							function() {
								ZHONGJYUAN.api.addTileGroup();
							},
						],
						!ZHONGJYUAN.static.switch.storageChange,
					];
					ContextMenu.render(event, menu, that);
				},

				/**
				 * 开始菜单盒子磁贴分组标题右侧菜单
				 * @author zhongjyuan
				 * @date 2023年6月2日18:37:56
				 * @email  zhongjyuan@outlook.com
				 * @param {*} groupIndex 磁贴分组下标
				 * @param {*} event 事件对象
				 */
				start_menu_transition_tile_group_title_context_menu: function(groupIndex, event) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_group_title_context_menu] groupIndex:${0};event:${1}", groupIndex, event);
					var that = this;

					var group = that.tiles[groupIndex];
					var menu = [
						[
							ZHONGJYUAN.component.fontawesomeHtml("tags") + ZHONGJYUAN.api.lang("Rename"),
							function() {
								that.shortSetting = group;
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("arrow-up") + ZHONGJYUAN.api.lang("ShiftUp"),
							function() {
								ZHONGJYUAN.helper.arrayUp(that.tiles, groupIndex);
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("arrow-down") + ZHONGJYUAN.api.lang("ShiftDown"),
							function() {
								ZHONGJYUAN.helper.arrayDown(that.tiles, groupIndex);
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
						[
							ZHONGJYUAN.component.fontawesomeHtml("remove") + ZHONGJYUAN.api.lang("Delete"),
							function() {
								ZHONGJYUAN.api.message.confirm(ZHONGJYUAN.helper.format(ZHONGJYUAN.api.lang("DeleteGroupConfirm"), group.title), function() {
									that.tiles.splice(groupIndex, 1);
								});
							},
							!ZHONGJYUAN.static.switch.storageChange,
						],
					];

					ContextMenu.render(event, menu, this);
				},

				/**
				 * 开始菜单盒子磁贴分组标题tip点击
				 * @author zhongjyuan
				 * @date 2023年6月2日18:43:05
				 * @email  zhongjyuan@outlook.com
				 * @param {*} tileGroup 磁贴分组对象
				 */
				start_menu_transition_tile_group_title_tip_click: function(tileGroup) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_group_title_tip_click] tileGroup:${0}", JSON.stringify(tileGroup));
					var that = this;

					that.shortSetting = tileGroup;
					ZHONGJYUAN.logger.debug("vue.[start_menu_transition_tile_group_title_tip_click] shortSetting:${0}", JSON.stringify(that.shortSetting));
				},

				/**
				 * 任务托盘图标样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日19:11:13
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				tasktray_icon_class: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[tasktray_icon_class] winId:${0}", winId);
					var that = this;
					return {
						active: winId === that.runtime.winActive && !that.win_is_minimize(winId),
					};
				},

				/**
				 * 任务托盘图标样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日19:11:48
				 * @email  zhongjyuan@outlook.com
				 * @param {*} winId 窗体唯一标识
				 * @returns
				 */
				tasktray_icon_style: function(winId) {
					ZHONGJYUAN.logger.trace("vue.[tasktray_icon_style] winId:${0}", winId);
					var that = this;
					return { opacity: that.win_is_minimize(winId) ? 0.6 : 1 };
				},

				/**
				 * 操作中心Banner文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日11:24:49
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				operate_center_banner_text: function() {
					ZHONGJYUAN.logger.trace("vue.[operate_center_banner_text]");
					return ZHONGJYUAN.api.lang("NoticeCenter");
				},

				/**
				 * 操作中心Banner清除按钮文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日11:25:36
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				operate_center_banner_clean_button_text: function() {
					ZHONGJYUAN.logger.trace("vue.[operate_center_banner_clean_button_text]");
					return ZHONGJYUAN.api.lang("NoticeClearAll");
				},

				/**
				 * 操作中心Banner清除按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月5日11:28:02
				 * @email  zhongjyuan@outlook.com
				 */
				operate_center_banner_clean_button_click: function() {
					ZHONGJYUAN.logger.trace("vue.[operate_center_banner_clean_button_click]");
					var that = this;

					for (var i in that.center.message) {
						var message = that.center.message[i];
						message.hide = true;
					}

					that.$set(that.center, "message", {});
					setTimeout(function() {
						that.center.unreadCount = 0;
						that.center.messageNum = 0;
					}, 500);

					setTimeout(function() {
						that.center.open = false;
					}, 1500);
					ZHONGJYUAN.logger.debug("vue.[operate_center_banner_clean_button_click] center:${0}", JSON.stringify(that.center));
				},

				/**
				 * 操作中心没有消息文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日11:31:00
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				operate_center_message_no_text: function() {
					ZHONGJYUAN.logger.trace("vue.[operate_center_message_no_text]");
					return ZHONGJYUAN.api.lang("NoMoreNotice");
				},

				/**
				 * 操作中心消息关闭按钮点击
				 * @author zhongjyuan
				 * @date 2023年6月5日11:33:08
				 * @email  zhongjyuan@outlook.com
				 * @param {*} messageId 消息唯一标识
				 */
				operate_center_message_close_button_click: function(messageId) {
					ZHONGJYUAN.logger.trace("vue.[operate_center_message_close_button_click]");
					var that = this;

					this.center.message[messageId].hide = true;
					that.$delete(that.center.message, messageId);
					that.center.messageNum--;
					ZHONGJYUAN.logger.debug("vue.[operate_center_message_close_button_click] center:${0}", JSON.stringify(that.center));
				},

				/**
				 * 快捷方式设置点击
				 * @author zhongjyuan
				 * @date 2023年6月5日11:49:31
				 * @email  zhongjyuan@outlook.com
				 */
				shortcut_setting_click: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_click]");
					var that = this;

					that.shortSetting = null;
					that.runtime.shortcutNewParamName = "";
					that.runtime.shortcutNewParamValue = "";
					ZHONGJYUAN.logger.debug("vue.[shortcut_setting_click] shortSetting:${0}", JSON.stringify(that.shortSetting));
				},

				/**
				 * 快捷方式设置高级文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日11:56:38
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_advance_text: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_advance_text]");
					return ZHONGJYUAN.api.lang("Advance");
				},

				/**
				 * 快捷方式设置高级点击
				 * @author zhongjyuan
				 * @date 2023年6月5日11:54:55
				 * @email  zhongjyuan@outlook.com
				 * @param {*} appId 应用唯一标识
				 */
				shortcut_setting_advance_click: function(appId) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_advance_click] appId:${0}", appId);
					var that = this;

					that.shortSetting = null;
					ZHONGJYUAN.api.app.open("system", { data: { appSetting: appId } });
				},

				/**
				 * 快捷方式设置标题文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日11:59:58
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_title_text: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_title_text]");
					return ZHONGJYUAN.api.lang("Title");
				},

				/**
				 * 快捷方式设置参数Key文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日12:11:10
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_param_key_text: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_param_key_text]");
					return ZHONGJYUAN.api.lang("Key");
				},

				/**
				 * 快捷方式设置参数Value文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日12:11:13
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_param_value_text: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_param_value_text]");
					return ZHONGJYUAN.api.lang("Value");
				},

				/**
				 * 快捷方式设置Hash参数文本内容
				 * @author zhongjyuan
				 * @date 2023年6月5日12:01:18
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_param_hash_text: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_title_text]");
					return ZHONGJYUAN.api.lang("Hash");
				},

				/**
				 * 快捷方式设置参数增加点击
				 * @author zhongjyuan
				 * @date 2023年6月5日14:04:13
				 * @email  zhongjyuan@outlook.com
				 */
				shortcut_setting_param_add_click: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_param_add_click]");
					var that = this;

					if (that.runtime.shortcutNewParamName && that.runtime.shortcutNewParamValue) {
						if (!that.shortSetting.params) {
							that.$set(that.shortSetting, "params", {});
						}
						that.$set(that.shortSetting.params, that.runtime.shortcutNewParamName, that.runtime.shortcutNewParamValue);
						that.runtime.shortcutNewParamName = "";
						that.runtime.shortcutNewParamValue = "";
					}
					ZHONGJYUAN.logger.debug("vue.[shortcut_setting_param_add_click] shortSetting:${0}", JSON.stringify(that.shortSetting));
				},

				/**
				 * 快捷方式设置参数删除点击
				 * @author zhongjyuan
				 * @date 2023年6月5日12:13:23
				 * @email  zhongjyuan@outlook.com
				 * @param {*} name 参数名
				 */
				shortcut_setting_param_delete_click: function(name) {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_param_delete_click] name:${0}", name);
					var that = this;

					that.$delete(that.shortSetting.params, name);
					ZHONGJYUAN.logger.debug("vue.[shortcut_setting_param_delete_click] shortSetting:${0}", JSON.stringify(that.shortSetting));
				},

				/**
				 * 消息预览样式
				 * @author zhongjyuan
				 * @date 2023年6月5日12:24:54
				 * @email  zhongjyuan@outlook.com
				 * @param {*} message 消息对象
				 * @returns
				 */
				message_preview_style: function(message) {
					ZHONGJYUAN.logger.trace("vue.[message_preview_style] message:${0}", JSON.stringify(message));

					var result = { bottom: message.index * 180 + 40 + "px" };
					if (message.content.includes("<img")) {
						result.width = "250px";
						result.height = "440px";
					}

					return result;
				},

				/**
				 * 消息预览点击
				 * @author zhongjyuan
				 * @date 2023年6月5日12:25:17
				 * @email  zhongjyuan@outlook.com
				 */
				message_preview_click: function() {
					ZHONGJYUAN.logger.trace("vue.[message_preview_click]");
					var that = this;

					that.center.open = true;
					ZHONGJYUAN.logger.debug("vue.[message_preview_click] center:${0}", JSON.stringify(that.center));
				},

				/**
				 * 消息预览罩样式
				 * @author zhongjyuan
				 * @date 2023年6月5日12:27:43
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				message_preview_mask_style: function() {
					ZHONGJYUAN.logger.trace("vue.[message_preview_mask_style]");
					var that = this;

					return { background: "linear-gradient(to top," + that.configs.themeColor + "," + that.configs.themeColor + " 50%,transparent)" };
				},
			},
			computed: {
				/**
				 * 背景主题颜色
				 * @author zhongjyuan
				 * @date 2023年5月31日17:34:14
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				background_theme_color: function() {
					ZHONGJYUAN.logger.trace("vue.[background_theme_color]");
					var configs = this.configs;

					return { background: configs.themeColor };
				},

				/**
				 * 主样式类
				 * @author zhongjyuan
				 * @date 2023年6月2日17:45:40
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				main_class: function() {
					ZHONGJYUAN.logger.trace("vue.[main_class]");
					var runtime = this.runtime;

					return { "small-screen": runtime.isSmallScreen, "horizontal-screen": runtime.isHorizontalScreen };
				},

				/**
				 * 主样式
				 * @author zhongjyuan
				 * @date 2023年6月2日17:46:48
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				main_style: function() {
					ZHONGJYUAN.logger.trace("vue.[main_style]");

					return { display: "none", opacity: 0 };
				},

				/**
				 * 背景样式类
				 * @author zhongjyuan
				 * @date 2023年5月31日11:30:52
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				background_class: function() {
					ZHONGJYUAN.logger.trace("vue.[background_class]");
					var that = this;

					return {
						blur: that.configs.wallpaperBlur,
						cross: that.runtime.wallpaperScale < that.runtime.screenSize.width / that.runtime.screenSize.height,
					};
				},

				/**
				 * 背景样式
				 * @author zhongjyuan
				 * @date 2023年6月2日15:52:24
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				background_style: function() {
					ZHONGJYUAN.logger.trace("vue.[background_style]");
					var that = this;

					return { "background-image": "url(" + that.runtime.wallpaper + ")" };
				},

				/**
				 * 桌面样式
				 * @author zhongjyuan
				 * @date 2023年5月31日17:26:41
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				desktop_style: function() {
					ZHONGJYUAN.logger.trace("vue.[desktop_style]");
					var configs = this.configs;

					return { top: configs.topTaskBar ? 40 + "px" : 0 };
				},

				/**
				 * 任务栏样式类
				 * @author zhongjyuan
				 * @date 2023年5月31日18:05:50
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_class: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_class]");
					var configs = this.configs;

					return { top: configs.topTaskBar };
				},

				/**
				 * 任务栏样式
				 * @author zhongjyuan
				 * @date 2023年5月31日18:03:44
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_style]");
					var configs = this.configs;

					if (configs.topTaskBar) {
						return {
							top: 0,
							bottom: "none",
						};
					}
				},

				/**
				 * 任务栏驱动样式类
				 * @author zhongjyuan
				 * @date 2023年6月2日17:57:33
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_powered_class: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_powered_class]");
					var runtime = this.runtime;

					return { fade: runtime.winOpened };
				},

				/**
				 * 任务栏窗体任务样式
				 * @author zhongjyuan
				 * @date 2023年5月31日18:28:57
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_win_task_button_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_win_task_button_style]");
					var runtime = this.runtime;

					return {
						width: parseInt((runtime.screenSize.width - 210 + (runtime.isSmallScreen ? 80 : 0)) / runtime.winOpened) + "px",
					};
				},

				/**
				 * 任务栏显示桌面按钮样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日19:33:49
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_show_desktop_button_class: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_show_desktop_button_class]");

					return {
						"fa-exchange": this.runtime.isSmallScreen && this.startMenu.open,
					};
				},

				/**
				 * 任务栏显示桌面按钮样式
				 * @author zhongjyuan
				 * @date 2023年6月9日19:24:43
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_show_desktop_button_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_show_desktop_button_style]");

					if (this.runtime.isSmallScreen && this.startMenu.open)
						return {
							width: "30px",
						};
				},

				/**
				 * 任务栏开始按钮样式类
				 * @author zhongjyuan
				 * @date 2023年5月31日18:12:56
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_start_button_class: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_start_button_class]");
					var startMenu = this.startMenu;

					return ["fa-" + ZHONGJYUAN.static.icon.start, { btnStartOpen: startMenu.open }];
				},

				/**
				 * 任务栏开始按钮样式
				 * @author zhongjyuan
				 * @date 2023年5月31日18:14:15
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_start_button_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_start_button_style]");

					return { width: "36px" };
				},

				/**
				 * 任务栏消息中心按钮样式
				 * @author zhongjyuan
				 * @date 2023年6月1日19:35:14
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_message_center_button_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_message_center_button_style]");

					return {
						float: "right",
					};
				},

				/**
				 * 任务栏消息中心角标样式
				 * @author zhongjyuan
				 * @date 2023年6月1日19:35:48
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_message_center_badge_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_message_center_badge_style]");
					var configs = this.configs;

					return {
						bottom: configs.topTaskBar ? "-18px" : "none",
						top: configs.topTaskBar ? "auto" : "0",
					};
				},

				/**
				 * 任务栏时间按钮样式
				 * @author zhongjyuan
				 * @date 2023年6月1日19:36:21
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_datetime_button_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_datetime_button_style]");

					return { "font-size": "12px", float: "right" };
				},

				/**
				 * 任务栏任务托盘按钮样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日19:37:29
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_tasktray_button_class: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_tasktray_button_class]");
					var configs = this.configs;

					return {
						"fa-angle-up": !configs.topTaskBar,
						"fa-angle-down": configs.topTaskBar,
					};
				},

				/**
				 * 任务栏任务托盘按钮样式
				 * @author zhongjyuan
				 * @date 2023年6月1日19:37:51
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				bar_tasktray_button_style: function() {
					ZHONGJYUAN.logger.trace("vue.[bar_tasktray_button_style]");

					return { float: "right", padding: 0 };
				},

				/**
				 * 开始菜单盒子样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日11:04:21
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_class: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_class]");
					var configs = this.configs;

					return { topTaskBar: configs.topTaskBar };
				},

				/**
				 * 开始菜单盒子样式
				 * @author zhongjyuan
				 * @date 2023年6月1日10:59:12
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_style]");
					var runtime = this.runtime;

					return {
						width: runtime.startMenu.width + "px",
						height: runtime.startMenu.height + "px",
					};
				},

				/**
				 * 开始后菜单盒子侧边栏样式类
				 * @author zhongjyuan
				 * @date 2023年6月1日11:12:53
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_sidebar_class: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_sidebar_class]");
					var startMenu = this.startMenu;

					return {
						spread: startMenu.sidebar.open,
						"shadow-hover": startMenu.sidebar.open,
					};
				},

				/**
				 * 开始后菜单盒子侧边栏罩样式
				 * @author zhongjyuan
				 * @date 2023年6月1日11:30:27
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_sidebar_mask_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_sidebar_mask_style]");
					var startMenu = this.startMenu;

					return {
						"background-color": "white",
						opacity: startMenu.sidebar.open ? 0.04 : 0.02,
					};
				},

				/**
				 * 开始菜单盒子菜单样式
				 * @author zhongjyuan
				 * @date 2023年6月1日19:30:54
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_menu_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_menu_style]");
					var runtime = this.runtime;
					var width = runtime.screenSize.width;

					if (runtime.isSmallScreen) {
						return {
							left: 48 + (runtime.menuOnLeft ? 0 : -width) + "px",
						};
					}

					return {};
				},

				/**
				 * 开始菜单盒子磁贴箱子样式
				 * @author zhongjyuan
				 * @date 2023年6月1日19:30:54
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_tile_box_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_box_style]");
					var runtime = this.runtime;
					var width = runtime.screenSize.width;

					if (runtime.isSmallScreen) {
						var left;
						left = 48 + (runtime.menuOnLeft ? width : 0);
					}

					return {
						left: runtime.isSmallScreen ? left + "px" : "312px",
					};
				},

				/**
				 * 开始菜单盒子磁贴容器样式
				 * @author zhongjyuan
				 * @date 2023年6月2日18:29:11
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_tile_container_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_container_style]");
					var runtime = this.runtime;

					return { "column-count": runtime.tilesGroupNum };
				},

				/**
				 * 开始菜单盒子磁贴分组样式
				 * @author zhongjyuan
				 * @date 2023年6月2日18:30:47
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_tile_group_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_group_style]");
					var runtime = this.runtime;

					return { width: runtime.tilesWidth + "px" };
				},

				/**
				 * 开始菜单盒子磁贴样式
				 * @author zhongjyuan
				 * @date 2023年6月2日18:54:55
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				start_menu_transition_tile_style: function() {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_style]");

					return { "animation-duration": "0.3s", "animation-delay": Math.random() / 8 + "s" };
				},

				/**
				 * 开始菜单盒子磁贴罩样式
				 * @author zhongjyuan
				 * @date 2023年6月9日16:28:14
				 * @email  zhongjyuan@outlook.com
				 * @param {*} app 应用对象
				 * @returns
				 */
				start_menu_transition_tile_mask_style: function(app) {
					ZHONGJYUAN.logger.trace("vue.[start_menu_transition_tile_mask_style] title:${0}", app.title);
					var configs = this.configs;

					return {
						background: app.icon.background ? app.icon.background : configs.themeColor,
					};
				},

				/**
				 * 操作中心样式类
				 * @author zhongjyuan
				 * @date 2023年6月5日11:16:27
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				operate_center_class: function() {
					ZHONGJYUAN.logger.trace("vue.[operate_center_class]");
					var center = this.center;

					return { open: center.open };
				},

				/**
				 * 操作中心样式
				 * @author zhongjyuan
				 * @date 2023年6月5日11:18:32
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				operate_center_style: function() {
					ZHONGJYUAN.logger.trace("vue.[operate_center_style]");
					var configs = this.configs;

					if (configs.topTaskBar) {
						return {
							top: 40 + "px",
						};
					} else {
						return {
							bottom: 40 + "px",
						};
					}
				},

				/**
				 * 快捷方式设置样式
				 * @author zhongjyuan
				 * @date 2023年6月5日11:47:02
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_style: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_style]");

					return { "z-index": 19930005 };
				},

				/**
				 * 快捷方式设置标题样式
				 * @author zhongjyuan
				 * @date 2023年6月5日11:58:51
				 * @email  zhongjyuan@outlook.com
				 * @returns
				 */
				shortcut_setting_title_style: function() {
					ZHONGJYUAN.logger.trace("vue.[shortcut_setting_style]");

					var shortSetting = this.shortSetting;

					if (!shortSetting) {
						return { "margin-top": 0 };
					} else {
						return { "margin-top": "64px" };
					}
				},
			},
			watch: {
				shortSetting: {
					handler: function(newVal, oldVal) {
						ZHONGJYUAN.logger.trace("vue.[watch] shortSetting: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
						if (newVal) {
							this.drawer = null;
						}
					},
				},
				"configs.wallpaper": {
					handler: function(newVal, oldVal) {
						ZHONGJYUAN.logger.trace("vue.[watch] configs.wallpaper: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
						var that = this;
						var img = new Image();
						img.src = newVal;
						img.onload = function() {
							that.runtime.wallpaper = newVal;
							if (that.configs.autoThemeColor) {
								that.wallpaper_to_theme_color();
							}
						};
						that.wallpaper_update_scale();
					},
				},
				wins: {
					handler: function(newVal, oldVal) {
						ZHONGJYUAN.logger.trace("vue.[watch] wins: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
						var count = 0;
						for (var i in this.wins) {
							var win = this.wins[i];
							if (!win.plugin) {
								count++;
							}
						}
						this.runtime.winOpened = count;
					},
				},
				"startMenu.open": {
					handler: function(newVal, oldVal) {
						ZHONGJYUAN.logger.trace("vue.[watch] startMenu.open: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
						if (oldVal) {
							this.$nextTick(ZHONGJYUAN.api.event.resize);
						}
					},
				},
				"startMenu.menu": {
					handler: function(newVal, oldVal) {
						ZHONGJYUAN.logger.trace("vue.[watch] startMenu.open: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
						this.$nextTick(ZHONGJYUAN.api.event.resize);
					},
				},
			},
		});

		ZHONGJYUAN.logger.trace("render.[start]: end");
	}

	return { start: start };
})();
