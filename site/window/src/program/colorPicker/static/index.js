ZHONGJYUANWIN.onReady(function() {
	var color = ZHONGJYUANWIN.data.color ? ZHONGJYUANWIN.data.color : "000000";

	color = color.replace(/^#/, "");
	if (!/^[\da-zA-Z]{6}$/.test(color)) {
		color = "000000";
	}

	$("#picker").colpick({
		submit: 0,
		flat: true,
		color: color,
		layout: "hex",
		onChange: function(hsb, hex, rgb, el) {
			if (ZHONGJYUANWIN.data.parent) {
				var color = "#" + hex;
				ZHONGJYUANWIN.emit("setColorFromColorPicker", color, ZHONGJYUANWIN.data.parent);
			}
		},
	});
});
