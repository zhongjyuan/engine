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
	layui.use("carousel", function() {
		var carousel = layui.carousel;
		//建造实例
		carousel.render({
			elem: "#test1",
			width: "100%", //设置容器宽度
			height: "100px",
			arrow: "none",
			//,anim: 'updown' //切换动画方式
		});
	});
});
