var mebtnopenurl = "http://zhongjyuan.club";
var tit = "";
var DFW = {
	appId: "",
	TLImg: "zhongjyuan.jpg",
	url: "http://zhongjyuan.club",
	title: "开心消消乐",
	desc: "我消，我消，我消...！",
};

var onBridgeReady = function() {
	WeixinJSBridge.on("menu:share:appmessage", function(argv) {
		WeixinJSBridge.invoke("sendAppMessage", {
			appid: DFW.appId,
			img_url: DFW.TLImg,
			img_width: "120",
			img_height: "120",
			link: DFW.url,
			title: DFW.title + tit,
			desc: DFW.desc,
		});
	});

	WeixinJSBridge.on("menu:share:timeline", function(argv) {
		WeixinJSBridge.invoke("shareTimeline", {
			appid: DFW.appId,
			img_url: DFW.TLImg,
			img_width: "120",
			img_height: "120",
			link: DFW.url,
			title: DFW.title + tit,
			desc: DFW.desc,
		});
	});
};

if (document.addEventListener) {
	document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
} else if (document.attachEvent) {
	document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
	document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
}

function do_share(score) {
	document.title = "我获得了" + score + "分，一起来消星星吧！";
	document.getElementById("share").style.display = "";
	window.DFW.title = document.title;
}

function dp_submitScore(level, score) {
	if (score > 5000) {
		if (confirm("你获得了" + score + " 要不要通知下小伙伴们呢？")) {
			do_share(score);
		}
	}
}
