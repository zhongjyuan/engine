var el_conter = document.getElementsByClassName("el-stars")[0];
var pa_conter = document.getElementsByClassName("int-panel")[0];
var can_conter = document.getElementsByClassName("canvas-box")[0];
var icon = document.getElementsByClassName("icon-box")[0];
var panel_A = document.getElementsByClassName("panel-a")[0];
var panel_X = document.getElementsByClassName("panel-x")[0];
var p1 = document.getElementsByClassName("panel-a-1")[0];
var p2 = document.getElementsByClassName("panel-a-2")[0];
var md = document.getElementsByClassName("mode")[0];
var m_box = document.getElementsByClassName("mode-box")[0];
var btn = document.getElementsByClassName("mode-button")[0];
var goal = 500;
var score = 0;
var g = 1;
var a = 0;
var stars = [];
var choose = [];
var flag = true;
var state = "";
var imgs = [
	"image/monster0.png",
	"image/monster1.png",
	"image/monster2.png",
	"image/monster3.png",
	"image/monster4.png",
];
var muisc = [
	"media/audio/monster0.mp3",
	"media/audio/monster1.mp3",
	"media/audio/monster2.mp3",
	"media/audio/monster3.mp3",
	"media/audio/monster4.mp3",
];
var ks = 0;
var fs = 0;
var gs = 0;

function start() {
	for (var h = 0; h < 10; h++) {
		stars[h] = [];
		for (var s = 0; s < 10; s++) {
			var y = parseInt(Math.random() * 5);
			var star = document.createElement("div");
			star.indexs = y;
			star.className = "dsplay-style";
			star.style.left = 10 * h + "%";
			star.style.bottom = 9.6 * s + "%";
			star.style.background = `url(${imgs[y]})`;
			star.style.backgroundSize = "cover";
			star.y = y;
			star.h = h;
			star.s = s;
			// p2.innerHTML = choose.length + "块" + "" + score1() + "分";

			star.onmousemove = function() {
				if (flag) {
					check(this);
					px();
					if (choose.length > 1) {
						ks = choose.length + "块" + score1() + "分";
					}
				}
			};

			star.onmouseout = function() {
				if (flag) {
					ks = "";
					goback();
					choose = [];
				}
			};

			star.onclick = function() {
				let audio = new Audio();
				if (flag) {
					if (choose.length > 1) {
						flag = false;
						score += score1();
						p2.innerHTML = score;

						for (var i = 0; i < choose.length; i++) {
							(function(i) {
								setTimeout(function() {
									audio.src = muisc[stars[choose[i].h][choose[i].s].indexs];
									let playPromise = audio.play();
									if (playPromise !== undefined) {
										playPromise.then((_) => {}).catch((error) => {});
									}

									icon.style.background = `url(${imgs[stars[choose[i].h][choose[i].s].indexs]}) no-repeat`;
									icon.style.backgroundSize = "170%";
									icon.style.backgroundPosition = "20px -3px";
									can_conter.removeChild(stars[choose[i].h][choose[i].s]);
									stars[choose[i].h].splice(choose[i].s, 1);
								}, 100 * i);
							})(i);
						}
						setTimeout(refresh, choose.length * 100);
						setTimeout(function() {
							choose = [];
							pd();
							choose = [];
							flag = true;
						}, choose.length * 105);
					}
				}
			};

			stars[h][s] = star;
			can_conter.appendChild(star);
		}
	}
}

start();
var n = 1;
function flicker() {
	var a = Math.pow(-1, n);
	if (choose.length > 1) {
		for (var i = 0; i < choose.length; i++) {
			choose[i].className = "dsplay-style scale";
		}
	}
	n++;
}

var time = setInterval(flicker, 300);

function goback() {
	if (choose.length > 1) {
		for (var i = 0; i < choose.length; i++) {
			choose[i].className = "dsplay-style";
		}
	}
}

function check(tg) {
	if (choose.indexOf(tg) == -1) {
		choose.push(tg);
	}

	if (stars[tg.h][tg.s + 1] && stars[tg.h][tg.s + 1].y == tg.y && choose.indexOf(stars[tg.h][tg.s + 1]) == -1) {
		check(stars[tg.h][tg.s + 1]);
	}

	if (stars[tg.h][tg.s - 1] && stars[tg.h][tg.s - 1].y == tg.y && choose.indexOf(stars[tg.h][tg.s - 1]) == -1) {
		check(stars[tg.h][tg.s - 1]);
	}

	if (stars[tg.h - 1] && stars[tg.h - 1][tg.s] && stars[tg.h - 1][tg.s].y == tg.y && choose.indexOf(stars[tg.h - 1][tg.s]) == -1) {
		check(stars[tg.h - 1][tg.s]);
	}

	if (stars[tg.h + 1] && stars[tg.h + 1][tg.s] && stars[tg.h + 1][tg.s].y == tg.y && choose.indexOf(stars[tg.h + 1][tg.s]) == -1) {
		check(stars[tg.h + 1][tg.s]);
	}
}

function px() {
	if (choose.length > 1) {
		var ch = [];
		for (var i = stars.length - 1; i >= 0; i--) {
			for (var j = stars[i].length - 1; j >= 0; j--) {
				if (choose.indexOf(stars[i][j]) != -1) {
					ch.push(stars[i][j]);
				}
			}
		}
		choose = ch;
	}
}

function refresh() {
	for (var i = stars.length - 1; i >= 0; i--) {
		if (stars[i].length == 0) {
			stars.splice(i, 1);
		}
	}

	for (var i = 0; i < stars.length; i++) {
		for (var j = 0; j < stars[i].length; j++) {
			stars[i][j].style.left = i * 10 + "%";
			stars[i][j].style.bottom = j * 9.6 + "%";
			stars[i][j].h = i;
			stars[i][j].s = j;
			stars[i][j].style.transition = "left 0.3s, bottom 0.3s";
		}
	}
}

function score1() {
	var a = 0;
	if (choose.length > 1) {
		a = 5 * choose.length * choose.length;
	}
	return a;
}

function pd() {
	a = 0;
	choose = [];
	for (var i = 0; i < stars.length; i++) {
		for (var j = 0; j < stars[i].length; j++) {
			check(stars[i][j]);
			if (choose.length > 1) {
				a++;
			}
			choose = [];
		}
	}
	if (a == 0) {
		if (score < goal) {
			setTimeout(function() {
				state = "f";
				md.style.display = "block";
				m_box.className = "mode-box fail";
				aimation();
			}, 1000);
		} else {
			setTimeout(function() {
				goal += 100 * g;
				g++;
				p1.innerHTML = "目标" + goal;
				panel_X.innerHTML = "L" + g;
				if (g >= 10) {
					g = 0;
				}
				gc();
				stars = [];
				choose = [];
				score = 0;
				start();
				state = "p";
				md.style.display = "block";
				m_box.className = "mode-box pass";
				aimation();
				// console.log(state)
			}, 500);
		}
	}
}

function gc() {
	for (var i = stars.length - 1; i >= 0; i--) {
		for (var j = stars[i].length - 1; j >= 0; j--) {
			can_conter.removeChild(stars[i][j]);
		}
	}
}

function aimation() {
	let time;
	let ps = [
		"-280px 0px",
		"-560px 0px",
		"-840px 0px",
		"0px -360px",
		"-280px -360px",
		"-560px -360px",
		"-840px -360px",
		"0px -720px",
		"-280px -720px",
		"-560px -720px",
		"-840px -720px",
		"0px 0px",
	];
	let fa = [
		"-166px 0px",
		"-333px 0px",
		"-498px 0px",
		"0px -255px",
		"166px -255px",
		"-333px -255px",
		"-498px -255px",
		"0px -506px",
		"-166px -506px",
		"-333px -506px",
		"-498px -506px",
		"0px 0px",
	];
	let i = 0;
	clearInterval(time);

	time = setInterval(function() {
		if (state === "p") {
			m_box.style.backgroundPosition = ps[i % 12];
		}
		if (state === "f") {
			m_box.style.backgroundPosition = fa[i % 12];
		}
		i++;
		if (i == 100) {
			clearInterval(time);
		}
	}, 90);
}

btn.addEventListener("click", restart);
function restart() {
	md.style.display = "none";
	m_box.className = "mode-box";
	state === "p" ? "f" : location.reload();
	state = "";
}
