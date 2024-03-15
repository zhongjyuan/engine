ZHONGJYUANWIN.onReady(function() {
	var ZHONGJYUAN = parent.ZHONGJYUAN;
	ZHONGJYUANWIN.onEvent(function(eventData) {
		switch (eventData.event) {
			case ZHONGJYUAN.static.message.dataChangeEvent:
				if (eventData.from === 0) {
					//
				}
		}
	});
	$(function() {
		function unScroll() {
			var top = $(document).scrollTop();
			$(document).on("scroll.unable", function(e) {
				$(document).scrollTop(top);
			});
		}
		unScroll();

		var random = Math.floor(Math.random() * (7 - 0 + 1) + 0);
		switch (random) {
			case 0:
				bouncingBalls();
				break;
			case 1:
				starfield();
				break;
			case 2:
				vortex();
				break;
			case 3:
				shootingLines();
				break;
			default:
				simpleGradient();
				break;
		}
		function bouncingBalls(argument) {
			$("body").quietflow({
				theme: "bouncingBalls",
				specificColors: ["rgba(255, 10, 50, .5)", "rgba(10, 255, 50, .5)", "rgba(10, 50, 255, .5)", "rgba(0, 0, 0, .5)"],
			});
		}

		function simpleGradient(argument) {
			$("body").quietflow({
				theme: "simpleGradient",
				primary: "#B066FE",
				accent: "#63E2FF",
			});
		}

		function starfield() {
			$("body").quietflow({
				theme: "starfield",
			});
		}

		function vortex() {
			$("body").quietflow({
				theme: "vortex",
				miniRadii: 40,
			});
		}

		function shootingLines() {
			$("body").quietflow({
				theme: "shootingLines",
				backgroundCol: "#141C26",
				lineColor: "#05E0E0",
				lineGlow: "#00ff00",
			});
		}
	});
});
