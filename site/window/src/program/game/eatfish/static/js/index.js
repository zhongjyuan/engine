var fish_a_1 = 0,
	fish_a_2 = 0,
	score = 0,
	life = 20,
	level = 1,
	lifest = 0,
	lvst = 0,
	lvmax = 5,
	lvaccd = 1,
	gamestyle;
$(".gamestt").bind("mousemove", function(event) {
	var event = event || window.event;
	$(".fish")
		.css({ left: event.clientX + "px", top: event.clientY + "px" })
		.show();
	fish_a_1 = event.clientX;
	if (fish_a_1 > fish_a_2) {
		$(".fish").addClass("rightsty");
	} else {
		$(".fish").removeClass("rightsty");
	}
	fish_a_2 = event.clientX;
});
$(".title-head").bind("mouseover", function() {
	$(".fish").hide();
});
var dedeabc = 1;
function fishaa() {
	dedeabc++;
	var acbb = Math.floor(Math.random() * lvaccd) + 1;
	if (Math.random() > 0.5) {
		$(".gamestt").append(
			"<img src='image/fish" +
				acbb +
				".png' class='abccaae" +
				dedeabc +
				"' style='position:absolute;left:100%;top:" +
				(10 + Math.random() * 70) +
				"%' onmouseover='abcyu(this," +
				acbb +
				")'>"
		);
		$(".abccaae" + dedeabc).animate({ left: "-126px" }, Math.random() * 8000 + 2000, "linear", function() {
			$(this).remove();
		});
	} else {
		$(".gamestt").append(
			"<img src='image/fish" +
				acbb +
				".png' class='abccaae" +
				dedeabc +
				" rightsty' style='position:absolute;right:100%;top:" +
				(10 + Math.random() * 70) +
				"%' onmouseover='abcyu(this," +
				acbb +
				")'>"
		);
		$(".abccaae" + dedeabc).animate({ right: "-126px" }, Math.random() * 8000 + 2000, "linear", function() {
			$(this).remove();
		});
	}
}
function smjds(i) {
	lifest += i;
	if (lifest >= 500) {
		lifest = 0;
		life += 10;
		$(".Life").html(life);
	}
	$(".jdtsww1").css("width", (lifest / 500) * 100 + "%");

	lvst++;
	if (lvst >= lvmax) {
		lvst = 0;
		level += 1;
		lvmax += 5;
		$(".Level").html(level);
	}
	$(".jdtsww2").css("width", (lvst / lvmax) * 100 + "%");
}
function abcyu(i, j) {
	if (!(j == lvaccd && Math.random() > 0.9)) {
		$(i).remove();
		score += 10 * j * level;
		$(".Score").html(score);
		smjds(10);
	} else {
		life--;
		$(".Life").html(life);
		if (life == 0) {
			$(".gameover").show();
			$(".fish").css("visibility", "hidden");
			clearTimeout(gamestyle);
		}
	}
	if (level == 3) {
		lvaccd = 2;
	}
	if (level == 10) {
		lvaccd = 3;
	}
	if (level == 20) {
		lvaccd = 4;
	}
	if (level == 30) {
		lvaccd = 5;
	}
	if (level == 40) {
		lvaccd = 6;
	}
	if (level == 50) {
		lvaccd = 7;
	}
	if (level == 60) {
		lvaccd = 8;
	}
}
function awwae() {
	fishaa();
	gamestyle = setTimeout(awwae, Math.random() * 1000);
}
setInterval(function() {
	lifest--;
	if (lifest <= 0) {
		lifest = 0;
	}
	$(".jdtsww1").css("width", (lifest / 500) * 100 + "%");
}, 100);
function startgame() {
	score = 0;
	life = 20;
	level = 1;
	lifest = 0;
	lvst = 0;
	lvmax = 5;
	lvaccd = 1;
	gamestyle = setTimeout(awwae, Math.random() * 1000);
	$(".mainmenu,.gameover").hide();
	$(".fish").css("visibility", "");
	$(".title-head").animate({ top: "0px" });
	$(".Score").html(score);
	$(".Life").html(life);
	$(".Level").html(level);
	$(".jdtsww1").css("width", "0%");
	$(".jdtsww2").css("width", "0%");
}
