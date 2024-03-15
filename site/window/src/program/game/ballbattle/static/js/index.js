ZHONGJYUANWIN.onReady(function() {
	var ZHONGJYUAN = parent.ZHONGJYUAN;
	ZHONGJYUANWIN.onEvent(function(eventData) {
		switch (eventData.event) {
			case ZHONGJYUAN.static.message.dataChangeEvent:
				if (eventData.from === 0) {
					// 主体数据变更后相关处理
				}
		}
	});
	var obj = document.getElementById("canvas"),
		w = window.innerWidth, //屏幕可视区的宽高
		h = window.innerHeight,
		s = w + h, //控制随机球球的数量
		footArr = [], //存放食物对象的数组
		nowX = 0, //鼠标所在的点
		nowY = 0,
		huabu = {
			//画布对象
			ax: w * 3, //画布对象X轴 乘以6
			ay: h * 3, //画布对象Y轴 乘以6
		};

	My = {
		//玩家小球的对象
		x: w / 2,
		y: h / 2,
		r: 7,
		next_x: w / 2,
		next_y: h / 2,
		tiji: 0,
		posX: w / 2,
		posY: h / 2,
	};
	var Scolor = ["#468966", "#FFF0A5", "#FFB03B", "#B64926", "#8E2800", "white", "blue", "green", "red", "yellow"]; //老师colors
	var context = obj.getContext("2d");

	function canvasN() {
		obj.width = w;
		obj.height = h;
		obj.style.background = "#000";
		//初始化创建食物
		creatfoot();
		//创建玩家
		MyMove();
	}

	//获取XY坐标以后 画出小圆
	function foot(_l, _t, _cc) {
		this.left = _l; //相当于X坐标
		this.top = _t; //相当于Y坐标
		this.color = _cc; //数组颜色添加进去
		role(this.left, this.top, 2, this.color, 0);

		/* arc(x,y,r,sAngle,eAngle,counterclockwise);	创建弧/曲线（用于创建圆形或部分圆）。
                 x 	圆的中心的 x 坐标。
                 y 	圆的中心的 y 坐标。
                 r 	圆的半径。
                 sAngle 	起始角，以弧度计（弧的圆形的三点钟位置是 0 度）。
                 eAngle 	结束角，以弧度计。
                 counterclockwise  可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
 
                 */
	}

	//初始化创建食物   创建小球
	function creatfoot() {
		for (var i = 0; i < s; i++) {
			var posLeft = Math.random() * w * 3; //随机宽度
			var posTop = Math.random() * h * 3; //随机的高度
			var length = Scolor.length;
			var _S = Scolor[Math.floor(Math.random() * length)]; //随机颜色的长度   ys
			footArr[i] = new foot(posLeft, posTop, _S); //posLeft,posTop,_S   _l,_t,_cc  foot函数传入的参数
		}
		footArr.push(""); //把食物填充进去  方便下面获取到食物判断是否被吃掉
	}

	//创建玩家  角色自己球    role 角色
	function role(x, y, r, ys, yy) {
		context.beginPath(); //开始画
		context.arc(x, y, r, 0, Math.PI * 2, false); //画圆
		context.closePath(); //闭合路径
		context.fillStyle = ys; //颜色添加进去
		context.shadowBlur = yy; //模糊程度
		context.shadowColor = ys; //模糊度的随机颜色
		context.fill();
	}

	/*function creatFoot_move() { //遍历所有食物，并重新绘画到画布上
 
}*/

	document.addEventListener("mousemove", move, false);

	function move(e) {
		var e = e || window.event;
		My.next_x = e.clientX; //赋值给鼠标 确定鼠标所在点
		My.next_y = e.clientY;
	}
	var timer = setInterval(function() {
		context.clearRect(0, 0, w, h); //清除画布
		MyMove();
	}, 10);

	function MyMove() {
		//创建玩家与控制玩家移动
		var move_x = (My.next_x - My.x) / 200, //move_x速度 = 鼠标所在的点 - 目标所在的点 /200 速度
			move_y = (My.next_y - My.y) / 200,
			len_x = Math.max(Math.min(move_x, 2), -2), //先从最里面的看  求出最大最小   相当于判断他的速度如何执行
			len_y = Math.max(Math.min(move_y, 2), -2);

		My.posX += len_x; //食物X轴
		My.posY += len_y;
		if (My.posX <= huabu.ax / 6 && My.posX > My.r) {
			My.x += len_x;
			len_x = 0;
		} else if (My.posX >= huabu.ax - w / 2 && My.posX > My.r) {
			My.x += len_x;
			len_x = 0;
		} else {
			if (My.x <= My.r + 1) {
				My.x = My.r;
			} else {
				My.x = w / 2;
			}
		}
		if (My.posY < huabu.ay / 6 && My.posY > My.r) {
			My.y += len_y;
			len_y = 0;
		} else if (My.posY > huabu.ay - w / 2 && My.posY > My.r) {
			My.y += len_y;
			len_y = 0;
		} else {
			if (My.y <= My.r + 1) {
				My.y = My.r;
			} else {
				My.y = h / 2;
			}
		}

		for (var i = 0; i < footArr.length - 1; i++) {
			footArr[i].left -= len_x; //移动食物
			footArr[i].top -= len_y;

			if (
				footArr[i].left - 2 >= My.x - My.r &&
				footArr[i].left + 2 <= My.x + My.r &&
				footArr[i].top - 2 >= My.y - My.r &&
				footArr[i].top + 2 <= My.y + My.r
			) {
				//判断玩家上下左右与食物的重合
				footArr.splice(i, 1); //如果重合就删掉
				My.tiji += 1; //每次食物消失的时候  玩家体积加一个
			} else {
				role(footArr[i].left, footArr[i].top, 2, footArr[i].color, 0);
				//食物
			}
		}
		//判断球球变大的
		if (My.tiji >= 0 && My.tiji < 15) {
			My.r = 9;
		} else if (My.tiji >= 5 && My.tiji < 20) {
			My.r = 10;
		} else if (My.tiji >= 10 && My.tiji < 25) {
			My.r = 11;
		} else if (My.tiji >= 15 && My.tiji < 30) {
			My.r = 12;
		} else if (My.tiji >= 20 && My.tiji < 35) {
			My.r = 13;
		} else if (My.tiji >= 25 && My.tiji < 40) {
			My.r = 14;
		} else if (My.tiji >= 30 && My.tiji < 45) {
			My.r = 15;
		} else if (My.tiji >= 35 && My.tiji < 50) {
			My.r = 16;
		} else if (My.tiji >= 40 && My.tiji < 55) {
			My.r = 17;
		} else if (My.tiji >= 45 && My.tiji < 60) {
			My.r = 18;
		} else if (My.tiji >= 50 && My.tiji < 65) {
			My.r = 19;
		} else if (My.tiji >= 55 && My.tiji < 70) {
			My.r = 20;
		} else if (My.tiji >= 60 && My.tiji < 75) {
			My.r = 21;
		} else if (My.tiji >= 65 && My.tiji < 80) {
			My.r = 22;
		} else if (My.tiji >= 70 && My.tiji < 85) {
			My.r = 23;
		} else if (My.tiji >= 75 && My.tiji < 90) {
			My.r = 24;
		} else if (My.tiji >= 80 && My.tiji < 95) {
			My.r = 25;
		} else if (My.tiji >= 85 && My.tiji < 100) {
			My.r = 26;
		} else if (My.tiji >= 90 && My.tiji < 105) {
			My.r = 27;
		} else if (My.tiji >= 95 && My.tiji < 110) {
			My.r = 28;
		} else if (My.tiji >= 100 && My.tiji < 115) {
			My.r = 29;
		} else if (My.tiji >= 105 && My.tiji < 120) {
			My.r = 30;
		} else if (My.tiji >= 110 && My.tiji < 125) {
			My.r = 31;
		} else if (My.tiji >= 115 && My.tiji < 130) {
			My.r = 32;
		} else if (My.tiji >= 120 && My.tiji < 135) {
			My.r = 33;
		} else if (My.tiji >= 125 && My.tiji < 140) {
			My.r = 34;
		} else if (My.tiji >= 130 && My.tiji < 145) {
			My.r = 35;
		} else if (My.tiji >= 135 && My.tiji < 150) {
			My.r = 36;
		} else if (My.tiji >= 140 && My.tiji < 155) {
			My.r = 38;
		} else if (My.tiji >= 145 && My.tiji < 160) {
			My.r = 39;
		} else if (My.tiji >= 150 && My.tiji < 165) {
			My.r = 40;
		} else if (My.tiji >= 155 && My.tiji < 170) {
			My.r = 41;
		} else if (My.tiji >= 160 && My.tiji < 175) {
			My.r = 42;
		} else if (My.tiji >= 165 && My.tiji < 180) {
			My.r = 43;
		} else if (My.tiji >= 170 && My.tiji < 185) {
			My.r = 44;
		} else if (My.tiji >= 175 && My.tiji < 190) {
			My.r = 45;
		} else if (My.tiji >= 180 && My.tiji < 195) {
			My.r = 46;
		} else if (My.tiji >= 185 && My.tiji < 200) {
			My.r = 47;
		} else if (My.tiji >= 190 && My.tiji < 205) {
			My.r = 48;
		} else if (My.tiji >= 195 && My.tiji < 210) {
			My.r = 49;
		} else if (My.tiji >= 200 && My.tiji < 215) {
			My.r = 50;
		} else if (My.tiji >= 205 && My.tiji < 220) {
			My.r = 52;
		} else if (My.tiji >= 210 && My.tiji < 225) {
			My.r = 54;
		} else if (My.tiji >= 215 && My.tiji < 230) {
			My.r = 56;
		} else if (My.tiji >= 220 && My.tiji < 235) {
			My.r = 58;
		} else if (My.tiji >= 225 && My.tiji < 240) {
			My.r = 60;
		} else if (My.tiji >= 230 && My.tiji < 245) {
			My.r = 62;
		} else if (My.tiji >= 235 && My.tiji < 250) {
			My.r = 64;
		} else if (My.tiji >= 240 && My.tiji < 255) {
			My.r = 66;
		} else if (My.tiji >= 245 && My.tiji < 260) {
			My.r = 68;
		} else if (My.tiji >= 250 && My.tiji < 265) {
			My.r = 70;
		} else if (My.tiji >= 255 && My.tiji < 270) {
			My.r = 72;
		} else if (My.tiji >= 260 && My.tiji < 275) {
			My.r = 74;
		} else if (My.tiji >= 265 && My.tiji < 280) {
			My.r = 76;
		} else if (My.tiji >= 270 && My.tiji < 285) {
			My.r = 78;
		} else if (My.tiji >= 275 && My.tiji < 290) {
			My.r = 80;
		} else if (My.tiji >= 280 && My.tiji < 295) {
			My.r = 82;
		} else if (My.tiji >= 285 && My.tiji < 300) {
			My.r = 84;
		} else if (My.tiji >= 290 && My.tiji < 305) {
			My.r = 86;
		} else if (My.tiji >= 295 && My.tiji < 310) {
			My.r = 88;
		} else if (My.tiji >= 300 && My.tiji < 315) {
			My.r = 90;
		} else if (My.tiji >= 305 && My.tiji < 320) {
			My.r = 92;
		} else if (My.tiji >= 310 && My.tiji < 325) {
			My.r = 94;
		} else if (My.tiji >= 315 && My.tiji < 330) {
			My.r = 96;
		} else if (My.tiji >= 320 && My.tiji < 335) {
			My.r = 98;
		} else if (My.tiji >= 325 && My.tiji < 340) {
			My.r = 100;
		} else if (My.tiji >= 330 && My.tiji < 345) {
			My.r = 102;
		} else if (My.tiji >= 335 && My.tiji < 350) {
			My.r = 104;
		} else if (My.tiji >= 340 && My.tiji < 355) {
			My.r = 106;
		} else if (My.tiji >= 345 && My.tiji < 360) {
			My.r = 108;
		} else if (My.tiji >= 350 && My.tiji < 365) {
			My.r = 110;
		}

		role(My.x, My.y, My.r, "#fff", 20);

		//console.log(My.y)
	}

	window.onload = canvasN;
});
