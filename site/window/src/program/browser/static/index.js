ZHONGJYUANWIN.onReady(function() {
	var ZHONGJYUAN = parent.ZHONGJYUAN;
	ZHONGJYUANWIN.onEvent(function(eventData) {
		switch (eventData.event) {
			case ZHONGJYUAN.static.message.dataChangeEvent:
				if (eventData.from === 0) {
					browserVue.data_change();
				}
		}
	});

	var browserVue = new Vue({
		el: "#browser",
		template: ZHONGJYUAN.getVariable("browserTemplate"),
		data: {
			url: "",
			historys: [
				{
					url: "https://cn.bing.com/",
					date: Date.now(),
				},
				{
					url: "https://www.so.com/",
					date: Date.now(),
				},
				{
					url: "https://www.sogou.com/",
					date: Date.now(),
				},
			],
		},
		created: function() {
			Date.prototype.format = function(fmt) {
				if (!fmt) {
					fmt = "yyyy-MM-dd hh:mm:ss";
				}

				var o = {
					"M+": this.getMonth() + 1, //月份
					"d+": this.getDate(), //日
					"h+": this.getHours(), //小时
					"m+": this.getMinutes(), //分
					"s+": this.getSeconds(), //秒
					"q+": Math.floor((this.getMonth() + 3) / 3), //季度
					S: this.getMilliseconds(), //毫秒
				};

				if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

				for (var k in o)
					if (new RegExp("(" + k + ")").test(fmt))
						fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));

				return fmt;
			};

			if (ZHONGJYUANWIN.data.url) {
				that.url = ZHONGJYUANWIN.data.url;
			}

			if (localStorage[ZHONGJYUAN.static.storage.browser]) {
				this.historys = JSON.parse(localStorage[ZHONGJYUAN.static.storage.browser]);
			}

			this.$nextTick(function() {
				$("#history-box").niceScroll({
					cursorcolor: "#ffffff30",
					cursorwidth: "4px", // 滚动条的宽度，单位：便素
					cursorborder: "none", // CSS方式定义滚动条边框
					grabcursorenabled: false,
				});
			});
		},
		methods: {
			data_change: function() {},

			save: function() {
				localStorage[ZHONGJYUAN.static.storage.browser] = JSON.stringify(this.historys);
			},

			visit: function(url) {
				url || (url = this.url);

				if (!url) return;

				url = ZHONGJYUAN.helper.url.format(url);

				//查找是否已存在于列表
				if (this.historys.length > 0) {
					var found = false,
						foundIndex = null;

					this.historys.forEach(function(history, index) {
						if (found) {
							return;
						}

						if (history.url === url) {
							found = true;
							foundIndex = index;
						}
					});

					if (found) {
						this.historys.splice(foundIndex, 1);
					}
				}

				this.historys.unshift({
					url: url,
					date: Date.now(),
				});

				if (this.historys.length > 50) {
					this.historys.pop();
				}

				this.save();

				ZHONGJYUANWIN.jump(url);
			},
		},
	});
});
