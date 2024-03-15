ZHONGJYUANWIN.onReady(function() {
	var ZHONGJYUAN = parent.ZHONGJYUAN;

	ZHONGJYUANWIN.eval(ZHONGJYUAN.static.win.method.GET_APP_VERSION, "", function(response) {
		ZHONGJYUAN.logger.info(response);
	});

	ZHONGJYUANWIN.onEvent(function(eventData) {
		switch (eventData.event) {
			case ZHONGJYUAN.static.message.dataChangeEvent:
				if (eventData.from === 0) {
					storeVue.data_change();
				}
		}
	});

	var storeVue = new Vue({
		el: "#store",
		template: ZHONGJYUAN.getVariable("storeTemplate"),
		data: {
			apps: [],
			labels: [],
			search: "",
		},
		created: function() {
			var that = this;

			ZHONGJYUAN.helper.io.request("./config/store.json", "GET", function(error, responseText) {
				if (!error) {
					var data = JSON.parse(responseText);
					var apps = data.apps;
					var labels = data.labels;
					var labelsLoaded = [];
					labels.forEach(function(label) {
						labelsLoaded.push({
							code: label.code,
							name: label.name,
							active: label.code === "popular" ? true : false,
							color: ZHONGJYUAN.helper.random.color(),
						});
					});
					that.$set(that, "apps", apps);
					that.$set(that, "labels", labelsLoaded);
				} else {
				}

				if (ZHONGJYUANWIN.data.search) {
					that.search = ZHONGJYUANWIN.data.search;
				}
			});
		},
		methods: {
			data_change: function() {},
			lang: function(key) {
				return ZHONGJYUAN.api.lang(key);
			},
			banner_text: function() {
				return "应用商店";
			},
			footer_text: function() {
				return "©2023 zhongjyuan.club";
			},
			url_error: function(element) {
				element.src = "../../assets/image/error/0.gif";
			},
			label_click: function(label) {
				label.active = !label.active;
			},
			app_open: function(app) {
				if (app.open) {
					ZHONGJYUANWIN.eval(ZHONGJYUAN.static.win.method.OPEN_APP, app.open);
				}
			},
			app_setup: function(app) {
				if (app.setup) {
					ZHONGJYUANWIN.eval(ZHONGJYUAN.static.win.method.INSTALL_APP, app.setup);
				}
			},
			app_is_active: function(app) {
				var that = this;

				var result = false;

				var hash = {};
				var labels = app.labels;
				labels.forEach(function(label) {
					hash[label] = true;
				});

				this.active_labels.forEach(function(label) {
					var checkList = [app.title, app.url];
					checkList = checkList.concat(app.labels);

					var inSearch = false;
					checkList.forEach(function(t2) {
						if (typeof t2 === "string" && t2.indexOf(that.search) !== -1) {
							inSearch = true;
						}
					});

					if (hash[label] && inSearch) {
						result = true;
					}
				});

				return result;
			},
			label_style: function(label) {
				return {
					color: label.active ? "white" : label.color,
					"border-color": label.active ? "white" : label.color,
					"background-color": !label.active ? "white" : label.color,
				};
			},
		},
		computed: {
			active_labels: function() {
				var activeLabels = [];
				this.labels.forEach(function(label) {
					if (label.active) activeLabels.push(label.code);
				});
				return activeLabels;
			},
			container_style: function() {
				return { width: "100%", height: "80%" };
			},
			row_style: function() {
				return { height: "100%" };
			},
			box_style: function() {
				return { height: "100%", overflow: "auto" };
			},
			col1_style: function() {
				return { width: "80%", height: "100%" };
			},
			col2_style: function() {
				return { width: "25%" };
			},
			col3_style: function() {
				return { width: "20%", height: "100%" };
			},
		},
	});
});
