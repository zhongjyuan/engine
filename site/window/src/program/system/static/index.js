ZHONGJYUANWIN.onReady(function() {
	var ZHONGJYUAN = parent.ZHONGJYUAN;
	ZHONGJYUANWIN.onEvent(function(eventData) {
		switch (eventData.event) {
			case ZHONGJYUAN.static.message.dataChangeEvent:
				if (eventData.from === 0) {
					systemVue.data_change();
				}
				break;
			case "setColorFromColorPicker":
				var color = eventData.data;
				if ("theme-color" === systemVue.navActive) {
					systemVue.chooseColor = color;
				}
				if ("app-manage" === systemVue.navActive) {
					systemVue.appSetting.icon.bg = color;
				}
				break;
		}
	});

	var systemVue = new Vue({
		el: "#system",
		template: ZHONGJYUAN.getVariable("systemTemplate"),
		data: {
			isSmallScreen: false,
			navActive: "app-manage",
			navs: {
				"app-manage": {
					icon: "puzzle-piece",
					text: ZHONGJYUAN.api.lang("AppManager"),
					disable: !ZHONGJYUAN.static.switch.storageChange,
				},
				"theme-color": {
					icon: "paint-brush",
					text: ZHONGJYUAN.api.lang("Color"),
					disable: !ZHONGJYUAN.static.switch.storageChange,
				},
				"wallpaper-manage": {
					icon: "image",
					text: ZHONGJYUAN.api.lang("Wallpaper"),
					disable: !ZHONGJYUAN.static.switch.storageChange,
				},
				"data-manage": {
					icon: "database",
					text: ZHONGJYUAN.api.lang("DataManager"),
					disable: !(ZHONGJYUAN.static.switch.storageChange && ZHONGJYUAN.static.switch.showDatacenter),
				},
				"other-manage": {
					icon: "tasks",
					text: ZHONGJYUAN.api.lang("Others"),
					disable: !ZHONGJYUAN.static.switch.storageChange,
				},
				"about-us": {
					icon: "info-circle",
					text: ZHONGJYUAN.api.lang("AboutUs"),
				},
			},
			apps: {},
			searchWords: "",
			appSetting: null,
			appSettingForm: {},
			colors: [
				"#FFB900",
				"#FF8C00",
				"#F7630C",
				"#CA5010",
				"#DA3B01",
				"#EF6950",
				"#D13438",
				"#D13438",
				"#E74856",
				"#E81123",
				"#EA005E",
				"#C30052",
				"#E3008C",
				"#BF0077",
				"#C239B3",
				"#9A0089",
				"#0078D7",
				"#0063B1",
				"#8E8CD8",
				"#6B69D6",
				"#8764B8",
				"#744DA9",
				"#B146C2",
				"#881798",
				"#0099BC",
				"#2D7D9A",
				"#00B7C3",
				"#038387",
				"#00B294",
				"#018574",
				"#00CC6A",
				"#10893E",
				"#7A7574",
				"#5D5A58",
				"#68768A",
				"#515C6B",
				"#567C73",
				"#486860",
				"#498205",
				"#107C10",
				"#767676",
				"#4C4A48",
				"#69797E",
				"#4A5459",
				"#647C64",
				"#525E54",
				"#847545",
				"#7E735F",
			],
			themeColor: "",
			chooseColor: "",
			autoThemeColor: false,
			wallpaper: "",
			wallpapers: [],
			wallpaperAddUrl: "",
			wallpaperBlur: false,
			wallpaperSlide: false,
			wallpaperSlideRandom: false,
			wallpaperSlideInterval: 5,
			textData: "",
			dataChange: false,
			effectLoading: false,
			openMax: 9,
			topTaskBar: false,
			information: {},
		},
		created: function() {
			document.body.focus();

			var that = this;
			if (ZHONGJYUAN.static.switch.storageChange && ZHONGJYUAN.static.switch.showDatacenter) {
				that.load_app();

				if (ZHONGJYUANWIN.data.nav) {
					that.navActive = ZHONGJYUANWIN.data.nav;
				}

				if (ZHONGJYUANWIN.data.appSetting) {
					that.appSetting = that.apps[ZHONGJYUANWIN.data.appSetting];
				}
				that.data_sync();
				that.date_refresh();
			} else {
				that.navActive = "about-us";
			}

			that.information_initiate();

			var fnResize = function() {
				var screenSize = ZHONGJYUAN.helper.browserResolution();
				that.isSmallScreen = screenSize.width <= 768;
			};

			fnResize();
			$(window).resize(fnResize);
			$("body").css("opacity", 1);
		},
		watch: {
			appSetting: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.$set(ZHONGJYUAN.vue, "apps", ZHONGJYUAN.helper.json.deepCopy(this.apps));
						layer.msg("已保存");
					}
				},
			},
			chooseColor: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						if (!this.autoThemeColor) {
							ZHONGJYUAN.vue.configs.themeColor = newVal;
						}
					}
				},
			},
			autoThemeColor: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.autoThemeColor = newVal;
						if (newVal) ZHONGJYUAN.vue.wallpaper_to_theme_color();
						else ZHONGJYUAN.vue.configs.themeColor = this.chooseColor;
					}
				},
			},
			wallpaper: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.wallpaper = this.wallpaper;
					}
				},
			},
			wallpapers: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.wallpapers = this.wallpapers;
					}
				},
			},
			wallpaperBlur: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.wallpaperBlur = this.wallpaperBlur;
					}
				},
			},
			wallpaperSlide: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.wallpaperSlide = this.wallpaperSlide;
					}
				},
			},
			wallpaperSlideRandom: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.wallpaperSlideRandom = this.wallpaperSlideRandom;
					}
				},
			},
			wallpaperSlideInterval: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.wallpaperSlideInterval = this.wallpaperSlideInterval;
					}
				},
			},
			topTaskBar: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.topTaskBar = this.topTaskBar;
					}
				},
			},
			openMax: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) {
						ZHONGJYUAN.vue.configs.openMax = this.openMax;
					}
				},
			},
		},
		methods: {
			lang: function(key) {
				return ZHONGJYUAN.api.lang(key);
			},
			url_fix: function(url) {
				return url[0] === "." ? "../../" + url : url;
			},
			url_error: function(element) {
				element.src = "../../assets/image/error/0.gif";
			},
			badge_text: function(content) {
				if (isNaN(content)) {
					return content;
				} else {
					return content > 99 ? "99+" : parseInt(content);
				}
			},
			information_initiate: function() {
				this.information = {
					name: ZHONGJYUAN.static.name,
					version: ZHONGJYUAN.static.version,
					author: ZHONGJYUAN.static.author,
					email: ZHONGJYUAN.static.email,
					website: ZHONGJYUAN.static.website,
					authorization: ZHONGJYUAN.static.authorization,
					serialNumber: ZHONGJYUAN.static.serialNumber,
					copyright: ZHONGJYUAN.static.info.copyright,
					statement: ZHONGJYUAN.static.info.statement,
					showStatement: ZHONGJYUAN.static.info.showStatement,
				};
			},
			system_nav_class: function(nav, id) {
				ZHONGJYUAN.logger.trace("vue.system.[system_nav_class]");
				var that = this;

				return { active: id === that.navActive, disable: nav.disable };
			},
			system_nav_style: function(id) {
				ZHONGJYUAN.logger.trace("vue.system.[system_nav_style]");
				var that = this;

				var color = that.themeColor;
				return id === that.navActive ? { color: color, "border-left": "5px solid " + color } : {};
			},
			system_nav_click: function(nav, id) {
				ZHONGJYUAN.logger.trace("vue.system.[system_nav_click]");
				var that = this;
				if (!nav.disable) that.navActive = id;
			},
			system_nav_icon_class: function(nav, id) {
				ZHONGJYUAN.logger.trace("vue.system.[system_nav_icon_class]");
				var that = this;

				return ["fa-" + nav.icon];
			},
			load_app: function() {
				this.apps = ZHONGJYUAN.api.vueData("apps");
			},
			date_refresh: function() {
				this.textData = ZHONGJYUAN.helper.json.format(ZHONGJYUAN.api.export());
				this.dataChange = false;
			},
			data_change: function() {
				this.dataChange = true;
				this.data_sync();
			},
			data_sync: function() {
				var that = this;
				try {
					var configs = ZHONGJYUAN.api.vueData("configs");
					that.themeColor = configs.themeColor;
					that.autoThemeColor = configs.autoThemeColor;

					that.wallpaper = configs.wallpaper;
					that.wallpapers = configs.wallpapers;
					that.wallpaperBlur = configs.wallpaperBlur;
					that.wallpaperSlide = configs.wallpaperSlide;
					that.wallpaperSlideRandom = configs.wallpaperSlideRandom;
					that.wallpaperSlideInterval = configs.wallpaperSlideInterval;

					that.openMax = configs.openMax;
					that.topTaskBar = configs.topTaskBar;
					that.chooseColor = configs.themeColor;
				} catch (e) {
					ZHONGJYUAN.logger.error(e);
				}
			},
			render_auto_run: function(autoRun) {
				try {
					if (autoRun > 0) {
						return "Lv" + Math.floor(autoRun);
					} else {
						return ZHONGJYUAN.api.lang("Disabled");
					}
				} catch (e) {
					return ZHONGJYUAN.api.lang("ConfigurationError");
				}
			},
			check_auto_run_level: function(app) {
				if (isNaN(app.autoRun) || app.autoRun < 0) {
					app.autoRun = 0;
				}
			},
			reduce_auto_run_level: function(app) {
				var that = this;

				that.check_auto_run_level(app);
				app.autoRun--;
				that.check_auto_run_level(app);
			},
			increase_auto_run_level: function(app) {
				var that = this;

				that._checkAutoRunLevel(app);
				app.autoRun++;
				that._checkAutoRunLevel(app);
			},
			opacity_click: function() {
				this.appSetting = null;
			},
			app_create: function(title) {
				var that = this;

				var id = "";
				if (/^[\w-.]+$/.test(title) && !that.apps[title]) {
					id = title;
				} else {
					do {
						id = "app-" + ZHONGJYUAN.api.id();
					} while (that.apps[id]);
				}

				var app = ZHONGJYUAN.staticc.template.app;
				app.title = title;
				app.icon.type = "str";
				app.icon.content = title;
				that.$set(that.apps, id, app);
			},
			app_uninstall: function(id) {
				var that = this;

				var app = that.apps[id];
				var confirm = layer.confirm(Helper.template(ZHONGJYUAN.lang("UninstallConfirm"), app.title), { skin: "zhongjyuan" }, function() {
					layer.close(confirm);
					if (ZHONGJYUAN.api.app.uninstall(id)) systemVue.$delete(systemVue.apps, id);
				});
			},
			app_show: function(id) {
				var that = this;

				var words = that.searchWords;
				if (!words) return true;

				var app = that.apps[id];
				if (!app) return false;

				var checkList = [id, app.title, app.description, app.developer, that.render_auto_run(app.autoRun)];
				for (var i in checkList) {
					var item = checkList[i];
					if (typeof item === "string" && item.indexOf(words) !== -1) {
						return true;
					}
				}

				return false;
			},
			app_add_to_shortcut: function(id) {
				ZHONGJYUAN.api.addShortcut(id);
				layer.msg(ZHONGJYUAN.lang("Added"));
			},
			app_add_to_start_menu: function(id) {
				ZHONGJYUAN.api.addStartMenu(id);
				layer.msg(ZHONGJYUAN.lang("Added"));
			},
			app_add_to_start_menu_sidebar: function(id) {
				ZHONGJYUAN.api.addStartMenuSidebarButton(id);
				layer.msg(ZHONGJYUAN.lang("Added"));
			},
			app_add_to_tile: function(id) {
				ZHONGJYUAN.api.addTile(id);
				layer.msg(ZHONGJYUAN.lang("Added"));
			},
			app_context_menu: function(id, event) {
				var that = this;

				var app = that.apps[id];
				var menu = [
					"<span style='color: darkgray'>" + ZHONGJYUAN.component.fontawesomeHtml("pencil") + app.title + "</span>",
					"|",
					[
						ZHONGJYUAN.component.fontawesomeHtml("play-circle") + ZHONGJYUAN.api.lang("Open"),
						function() {
							ZHONGJYUAN.api.app.open(id);
						},
					],
					[
						ZHONGJYUAN.component.fontawesomeHtml("copy") + ZHONGJYUAN.api.lang("AddTo"),
						[
							[
								ZHONGJYUAN.component.fontawesomeHtml("desktop") + ZHONGJYUAN.api.lang("DesktopIcons"),
								function() {
									that.app_add_to_shortcut(id);
								},
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("list-ul") + ZHONGJYUAN.api.lang("MainMenu"),
								function() {
									that.app_add_to_start_menu(id);
								},
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("sliders") + ZHONGJYUAN.api.lang("Sidebar"),
								function() {
									that.app_add_to_start_menu_sidebar(id);
								},
							],
							[
								ZHONGJYUAN.component.fontawesomeHtml("square") + ZHONGJYUAN.api.lang("Tiles"),
								function() {
									that.app_add_to_tile(id);
								},
							],
						],
					],
					[
						ZHONGJYUAN.component.fontawesomeHtml("cogs") + ZHONGJYUAN.api.lang("Advance"),
						function() {
							that.appSetting = app;
						},
					],
					"|",
					[
						ZHONGJYUAN.component.fontawesomeHtml("trash") + ZHONGJYUAN.api.lang("Uninstall"),
						function() {
							that.app_uninstall(id);
						},
					],
				];

				ContextMenu.render(event, menu, this);
			},
			app_double_click: function(app) {
				var that = this;

				that.appSetting = app;
			},
			open_font_awesome: function() {
				ZHONGJYUAN.api.app.open("font-awesome");
			},
			open_image_host: function() {
				ZHONGJYUAN.api.app.open("image-host");
			},
			icon_bg_click: function() {
				ZHONGJYUAN.api.app.open("color-picker", { data: { color: this.appSetting.icon.bg, parent: ZHONGJYUANWIN.id } });
			},
			color_style: function(color) {
				return { "background-color": color };
			},
			color_choose_click: function(color) {
				this.chooseColor = color;
			},
			color_picker_click: function() {
				ZHONGJYUAN.api.app.open("color-picker", { data: { color: this.chooseColor, parent: ZHONGJYUANWIN.id } });
			},
			color_choose_change: function(event) {
				this.chooseColor = event.target.value;
			},
			auto_theme_color_change: function(value) {
				this.autoThemeColor = value;
			},
			wallpaper_fixed: function(wallpaper) {
				if (!wallpaper) {
					return this.url_fix(this.wallpaper);
				}

				return this.url_fix(wallpaper.preview ? wallpaper.preview : wallpaper.image);
			},
			wallpaper_blur_change: function(value) {
				this.wallpaperBlur = value;
			},
			wallpaper_slide_change: function(value) {
				this.wallpaperSlide = value;
			},
			wallpaper_slide_random_change: function(value) {
				this.wallpaperSlideRandom = value;
			},
			wallpaper_slide_interval_change: function(value) {
				this.wallpaperSlideInterval = value;
			},
			wallpaper_image_add_click: function() {
				var url = this.wallpaperAddUrl;
				if (!url) {
					return;
				}
				this.wallpapers.push({ image: url, preview: url });
				this.wallpaperAddUrl = "";
			},
			wallpaper_image_preview_click: function(wallpaper) {
				this.wallpaper = wallpaper.image;
			},
			wallpaper_image_context_menu: function(wallpaper, event) {
				var that = this;

				var menu = [
					[
						ZHONGJYUAN.component.fontawesomeHtml("play") + ZHONGJYUAN.api.lang("Enabled"),
						function() {
							ZHONGJYUAN.vue.configs.wallpaper = wallpaper.image;
						},
					],
					[
						ZHONGJYUAN.component.fontawesomeHtml("remove") + ZHONGJYUAN.api.lang("Delete"),
						function() {
							var wallpapers = ZHONGJYUAN.vue.configs.wallpapers;
							for (var i = 0; i < wallpapers.length; i++) {
								if (wallpapers[i].image === wallpaper.image) {
									wallpapers.splice(i, 1);
									return;
								}
							}
						},
					],
				];
				ContextMenu.render(event, menu, this);
			},
			top_taskbar_change: function(value) {
				this.topTaskBar = value;
			},
			open_max_change: function(value) {
				this.openMax = value;
			},
			data_refresh_click: function() {
				layer.msg(ZHONGJYUAN.api.lang("DataHasBeenRefreshed"), { icon: 1 });

				this.date_refresh();
			},
			data_effect_click: function() {
				var that = this;

				that.effectLoading = true;
				setTimeout(function() {
					try {
						var json = JSON.parse(that.textData);
						ZHONGJYUAN.api.import(json);
					} catch (e) {
						layer.msg(ZHONGJYUAN.api.lang("FormatError"));
						that.effectLoading = false;
					}
				}, 500);
			},
			data_copy_click: function() {
				var dt = new clipboard.DT();
				dt.setData("text/plain", this.textData);
				clipboard.write(dt);
				layer.msg(ZHONGJYUAN.api.lang("CopiedToShearPlate"));
			},
			data_import_click: function() {
				$("#ipt-json-file").click();
			},
			data_import_change: function() {
				var that = this;

				var element = $("#ipt-json-file");

				var reader = new FileReader();
				reader.readAsText(element[0].files[0], "utf8");
				reader.onload = function(event) {
					that.textData = event.target.result;
				};
			},
			data_export_click: function() {
				var blob = new Blob([this.textData], {
					type: "text/plain;charset=utf-8",
				});
				ZHONGJYUAN.helper.io.file.save(blob, "export-data.json");
			},
			website_click: function() {
				ZHONGJYUANWIN.open(ZHONGJYUAN.static.website);
			},
		},
		computed: {
			wallpaper_current_fixed: function() {
				return this.url_fix(this.wallpaper);
			},
			system_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_class]");
				var that = this;

				return { "small-screen": that.isSmallScreen };
			},
			system_app_manage_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_app_manage_class]");
				var that = this;

				return { active: "app-manage" === that.navActive };
			},
			system_theme_color_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_theme_color_class]");
				var that = this;

				return { active: "theme-color" === that.navActive };
			},
			system_wallpaper_manage_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_wallpaper_manage_class]");
				var that = this;

				return { active: "wallpaper-manage" === that.navActive };
			},
			system_other_manage_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_other_manage_class]");
				var that = this;

				return { active: "other-manage" === that.navActive };
			},
			system_data_manage_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_data_manage_class]");
				var that = this;

				return { active: "data-manage" === that.navActive };
			},
			system_about_us_class: function() {
				ZHONGJYUAN.logger.trace("vue.system.[system_about_us_class]");
				var that = this;

				return { active: "about-us" === that.navActive };
			},
			software_name_icon_class: function() {
				return ["fa-" + ZHONGJYUAN.static.icon.start];
			},
		},
	});
});
