let city = "宝安区";
let key = "62b71ed9b7cffdc2289e823f5001e4df";

refreshPage();

$("#weather_search span:nth-child(1) input").on("click", () => {
	$("#weather_search span:nth-child(1)").prop("border-color", "blue");
});

// 鼠标触发
$("#weather_search span:nth-child(2) input").on("click", () => {
	key = "62b71ed9b7cffdc2289e823f5001e4df";
	city = $("#weather_search span:nth-child(1) input").val();
	refreshPage();
});

//键盘触发
$("#weather_search span:nth-child(1) input").on("keyup", () => {
	key = "62b71ed9b7cffdc2289e823f5001e4df";
	city = $("#weather_search span:nth-child(1) input").val();
	refreshPage();
});

function refreshPage() {
	$.get("http://api.tianapi.com/tianqi/index", { key, city }, (result) => {
		let { newslist: data } = result;

		// //当天的天气
		if (data[0].weather.indexOf("雨") != -1) {
			$("#today_img").prop("src", "image/yu.png");
		} else if (data[0].weather.indexOf("云") != -1) {
			$("#today_img").prop("src", "image/duoyun.png");
		} else if (data[0].weather.indexOf("雪") != -1) {
			$("#today_img").prop("src", "image/xue.png");
		} else if (data[0].weather.indexOf("雾") != -1) {
			$("#today_img").prop("src", "image/wu.png");
		} else if (data[0].weather.indexOf("阴") != -1) {
			$("#today_img").prop("src", "image/yin.png");
		} else if (data[0].weather.indexOf("尘") != -1) {
			$("#today_img").prop("src", "image/shachen.png");
		} else if (data[0].weather.indexOf("雹") != -1) {
			$("#today_img").prop("src", "image/bingbao.png");
		} else {
			$("#today_img").prop("src", "image/qing.png");
		}

		$(".main_info #today_city").html(data[0].area); //城市

		$(".main_info #today_date").html(data[0].date); //日期

		$(".main_info #today_week").html(data[0].week); //星期几

		$(".main_info #today_other").html(`日出: ${data[0].sunrise}  日落: ${data[0].sunset}`); //日出日落

		$("#today_wd").html(`${data[0].lowest} ~ ${data[0].highest}`); //最低温度和最高温度

		$("#today_fl").html(`${data[0].windsc} 级 `); //风力

		$("#today_fx").html(data[0].wind); //风向

		$("#today_pm").html(`${data[0].pcpn} ml`); //降雨量

		$("#today_zwx").html(data[0].uv_index); //紫外线强度

		$("#today_xc").html(data[0].vis); //能见度

		$("#today_gm").html(`${data[0].humidity} %`); //相对湿度

		$("#today_cy").html(`${data[0].pop} %`); //降雨概率

		$("#tips").html(data[0].tips); //生活指数提示

		//未来6天的天气
		//我的思路是,将数据获取到之后,通过上面当前天气解构出来的data里面也包含了未来6天的天气
		//利用遍历,将每次拿到的(未来6天中的其中一天)中的时间、星期、最低温度、最高温度，解构出来，然后在
		//当前循环的时候，就把对应的数据放进标签中
		let newData = data.slice(1);
		newData.forEach((item, index) => {
			//每次的循环拿到的都是新的一天的天气对象，只拿其中有用的部分
			let { date, week, lowest, highest, weather } = item;
			if (weather.indexOf("雨") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/yu.png");
			} else if (weather.indexOf("云") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/duoyun.png");
			} else if (weather.indexOf("雪") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/xue.png");
			} else if (weather.indexOf("雾") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/wu.png");
			} else if (weather.indexOf("阴") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/yin.png");
			} else if (weather.indexOf("尘") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/shachen.png");
			} else if (weather.indexOf("雹") != -1) {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/bingbao.png");
			} else {
				$("#future_container img")
					.eq(index)
					.prop("src", "image/qing.png");
			}

			$("#future_container")
				.children("div")
				.eq(index)
				.children("span")
				.eq(0)
				.html(date);

			$("#future_container")
				.children("div")
				.eq(index)
				.children("span")
				.eq(1)
				.html(week);

			$("#future_container")
				.children("div")
				.eq(index)
				.children("span")
				.eq(2)
				.html(`${lowest} ~ ${highest}`);

			$("#future_container")
				.children("div")
				.eq(index)
				.children("span")
				.eq(3)
				.html(weather);
		});
	});
}
