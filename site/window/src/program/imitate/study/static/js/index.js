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
	(function(g, b) {
		var a, d, f, i, k, e, h, c, j;
		a = g;
		d = g.document;
		f = d.body;
		i = a.devicePixelRatio;
		k = 1 / i;
		e = function(l) {
			return d.getElementById(l);
		};
		$$$ = function(l) {
			return d.querySelectorAll(l);
		};
		h =
			'<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=' +
			k +
			",maximum-scale=" +
			k +
			",minimum-scale=" +
			k +
			', user-scalable=no" />';
		c = function() {
			var l = $$$("head")[0];
			l.innerHTML = l.innerHTML + h;
		};
		j = function(l) {
			var m, n;
			m = l || a.innerWidth;
			f.style.width = m + "px";
			f.style.fontSize = 62.5 * i + "%";
		};
	})(window, undefined);
});