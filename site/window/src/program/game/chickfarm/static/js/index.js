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
	new Vue({
		el: "#app",
		data: {
			troughTitle: "鸡碗",
			effects: 2,
			isLoad: true,
			editUserName: false,
			modalUser: false,
			skinBox: false,
			modalAchievement: false,
			modalShop: false,
			modalUnlock: false,
			modalFood: false,
			modalGood: false,
			goodDetails: false,
			isSubject: false,
			sellNum: 1, // 物品出售默认值
			skin: "skin",
			shop: "shop",
			bag: "bag",
			study: "study",
			isSkin: false,
			isShop: false,
			isBag: false,
			isStudy: false,
			buttonSize: "small",
			newUserName: "",
			formUser: {
				// 用户信息填写表单
				name: "",
			},
			clothes: clothList,
			hats: hatList,
			suits: suitList,
			shoppingNum: 0, // 购物数量
		},
		store, // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
		computed: {
			// 计算已完成成就的数量
			targetList() {
				let target = this.$store.state.achievements.filter((obj) => obj.complete);
				console.log("target:" + target);
				return target.length;
			},
			user() {
				return this.$store.state.user;
			},
			chick() {
				return this.$store.state.chick;
			},
			foods() {
				return this.$store.state.foods;
			},
			goods() {
				return this.$store.state.goods;
			},
			subjects() {
				return this.$store.state.subjects;
			},
			eat() {
				return this.$store.state.eat;
			},
			setTime() {
				return this.$store.state.setTime;
			},
			startDate() {
				return this.$store.state.startDate;
			},
			endDate() {
				return this.$store.state.endDate;
			},
			content() {
				return this.$store.state.content;
			},
			currFood() {
				return this.$store.state.currFood;
			},
			currGood() {
				return this.$store.state.currGood;
			},
			achievements() {
				return this.$store.state.achievements;
			},
			modalLevel() {
				return this.$store.state.modalLevel;
			},
			value() {
				return this.$store.state.value;
			},
		},
		mounted() {
			this.init(); // 初始化
		},
		methods: {
			// 初始化
			init() {
				this.$nextTick(function() {
					var self = this;

					// 页面加载读取缓存
					self.$store.dispatch("loadgame");

					// 判断是否是新的一天
					// self.isNewDay(new date());

					// 判断是否在进食
					self.chickIsEat();
				});
				this.hideLoading();
			},
			isNewDay: function(time) {},
			// 判断是否正在进食
			chickIsEat: function() {
				// 页面加载获取当前时间
				let loadDate = new Date().getTime();
				// 判断上一次是否进食结束
				let isEat = this.$store.state.endDate - loadDate;
				if (isEat > 0) {
					this.$store.state.chick.eat = true;
					this.countdown(loadDate);
				} else {
					this.$store.commit("CHICK_IS_EAT");
					return;
				}
			},
			hideFood: function() {
				this.modalFood = !this.modalFood;
			},
			showFood: function(index) {
				this.modalFood = !this.modalFood;
				this.$store.state.currFood = this.$store.state.foods[index];
			},
			// 点击食物进行喂食
			feedClick: function() {
				// 判断是否在进食
				if (this.$store.state.chick.eat) {
					this.error("我还在吃着呢");
					return;
				} else if (this.$store.state.currFood.num > 0) {
					let startDate = new Date().getTime();
					let endDate = startDate + this.$store.state.currFood.eatTime;
					this.$store.commit("FEED_CLICK", endDate);
					this.countdown(startDate);
				} else {
					this.error("你没有" + this.state.currFood.name + "食物了");
				}
				this.hideFood();
				this.hidePopup();
				this.success("喂食成功");
			},
			// 喂食倒计时方法
			countdown(startdate) {
				let self = this;
				let es = self.$store.state.endDate - startdate;
				let delay = (100 / self.$store.state.currFood.eatTime) * 1000; // 计算每秒走的进度
				console.log("计算每秒走的进度:" + delay + "%");
				if (es > 0) {
					let timer = setInterval(function() {
						let nowTime = new Date().getTime();
						let t = self.$store.state.endDate - nowTime;
						let value = ((self.$store.state.currFood.eatTime - t) / 1000) * delay; // 计算进度条
						console.log("计算进度条:" + value + "%");
						if (value <= 100) {
							self.$store.state.value = value;
						} else {
							self.$store.state.value = 100;
						}
						console.log("t:" + t + "进度条：" + value + "%");
						if (t > 0) {
							self.$store.state.chick.eat = true;
							let day = Math.floor(t / 86400000);
							let hour = Math.floor((t / 3600000) % 24);
							let min = Math.floor((t / 60000) % 60);
							let sec = Math.floor((t / 1000) % 60);
							hour = hour < 10 ? "0" + hour : hour;
							min = min < 10 ? "0" + min : min;
							sec = sec < 10 ? "0" + sec : sec;
							let format = "";
							if (day > 0) {
								format = `${day}天${hour}小时${min}分${sec}秒`;
							}
							if (day <= 0 && hour > 0) {
								format = `${hour}小时${min}分${sec}秒`;
							}
							if (day <= 0 && hour <= 0) {
								format = `${min}分${sec}秒`;
							}
							self.$store.state.content = format; // 显示倒计时
							self.$store.dispatch("savegame");
						} else {
							clearInterval(timer); // 清除定时器
							// 喂食结束
							self.$store.dispatch("endeat");
							// 弹出鸡蛋加成
							self.$refs.paper.popAdd(self.$store.state.chick.egg.addEggExps + "%");
						}
					}, 1000);
				}
			},
			showShop: function(name) {
				this.$store.commit("shopFood", name);
				this.modalShop = true;
			},
			hideShop: function() {
				this.modalShop = false;
			},
			shopReduce: function() {
				this.shoppingNum--;
			},
			shopAdd: function() {
				this.shoppingNum++;
			},
			showGood: function(name) {
				this.$store.dispatch("shopGood", name);
				this.modalGood = true;
			},
			hideGood: function() {
				this.modalGood = false;
			},
			setSell: function() {
				this.goodDetails = !this.goodDetails;
			},
			sellAdd: function() {
				if (this.sellNum == this.$store.state.currGood.num) {
					this.error("不能再加了");
					return;
				} else {
					this.sellNum++;
				}
			},
			sellReduce: function() {
				if (this.sellNum == 1) {
					this.error("不能再减了");
					return;
				} else {
					this.sellNum--;
				}
			},
			commitSell: function() {
				this.goodDetails = !this.goodDetails;
				//var price = this.$store.state.currGood.price*this.selNum;
				this.success("出售了" + this.$store.state.currGood.num + "个" + this.$store.state.currGood.name);
				this.$store.dispatch("sellgood", this.sellNum);
				this.modalGood = false;
			},
			showUnlock: function(name) {
				this.$store.commit("shopFood", name);
				this.modalUnlock = true;
			},
			hideUnlock: function() {
				this.modalUnlock = false;
			},
			commitUnlock: function() {
				var food = this.$store.state.currFood.name;
				var unlockPrice = this.$store.state.currFood.unlockPrice;
				console.log("解锁需要金币：" + unlockPrice);
				if (this.$store.state.user.money < unlockPrice) {
					this.error("不够金币解锁");
					this.modalUnlock = false;
					return false;
				} else {
					this.$store.dispatch("unlockfood", unlockPrice);
					this.success("成功解锁了" + food);
				}
				this.hideUnlock();
			},
			showAchievement: function() {
				this.modalAchievement = true;
			},
			hideAchievement: function() {
				this.modalAchievement = false;
			},
			// 领取成就奖励
			receiveAwards: function(val) {
				this.$store.dispatch("receiveawards", val);
			},
			// 点击学习课程
			onSubject: function(val, pid) {
				console.log("pid:" + pid);
				this.$store.state.currSubject = val;
				if (val.learning == 0) {
					console.log(val.name + "-未开始学习");
					this.$store.dispatch("startsubject", pid);
				} else if (val.learning == 2) {
					console.log(val.name + "-已学习完成");
				} else {
					console.log(val.name + "-正在学习");
					this.isSubject = true;
				}
				console.log(this.$store.state.currSubject);
			},
			// 关闭题目界面
			hideSubject: function(val) {
				this.isSubject = val;
			},
			// 打开功能菜单弹窗
			showPopup: function(val) {
				this.skinBox = true;
				if (val == "skin") {
					this.isSkin = true;
				} else if (val == "shop") {
					this.isShop = true;
				} else if (val == "study") {
					this.isStudy = true;
				} else {
					this.isBag = true;
				}
			},
			// 关闭功能菜单弹窗
			hidePopup: function() {
				this.skinBox = false;
				var that = this;
				setTimeout(function() {
					that.isSkin = false;
					that.isShop = false;
					that.isBag = false;
					that.isStudy = false;
				}, 400);
			},
			// 打开用户信息面板
			showUser: function() {
				this.modalUser = true;
			},
			editUser: function() {
				this.editUserName = !this.editUserName;
			},
			saveUser: function() {
				if (this.newUserName == "") {
					console.log("请输入用户名称");
					this.error("请输入用户名称");
					return false;
				} else {
					this.success("修改成功");
					this.editUserName = !this.editUserName;
					this.$store.dispatch("setusername", this.newUserName);
					//this.$store.dispatch('savegame');
				}
			},
			// 设置服装
			replaceDress: function(type, pid) {
				this.$store.dispatch("replacedress", { type: type, pid: pid });
			},
			keepUser: function() {
				this.$store.dispatch("keepuser");
			},
			// 升级弹窗确认按钮，确认后再检测是否可以继续升级
			levelUser: function() {
				var self = this;
				self.$store.state.modalLevel = false;
				setTimeout(function() {
					self.$store.dispatch("settlelevel", self.$store.state.chick.exp);
				}, 500);
			},
			shopSettle: function() {
				var num = this.shoppingNum;
				var name = this.$store.state.currFood.name;
				if (num == 0) {
					this.error("请输入购买数量");
					this.modalShop = false;
					return false;
				} else if (this.$store.state.user.money < this.$store.state.currFood.price * num) {
					this.error("不够金币购买");
					this.modalShop = false;
					return false;
				} else {
					this.success("成功购买了" + num + "个" + name);
					this.hidePopup();
				}
				this.$store.dispatch("shopsettle", num);
				this.hideShop();
				this.shoppingNum = 0;
			},
			// 公共成功提示
			success: function(val) {
				this.$Message.success(val);
			},
			// 公共失败提示
			error: function(val) {
				this.$Message.error(val);
			},
			hideLoading: function() {
				var that = this;
				//定义2秒后隐藏loading
				setInterval(function() {
					that.isLoad = false;
				}, 2000);
			},
		},
		// 过滤器
		filters: {
			// 格式化显示时间 毫秒转：天-小时-分钟-秒
			SecondToDate(value) {
				var time = value;
				if (null != time && "" != time) {
					if (time > 60 * 1000 && time < 60 * 60 * 1000) {
						time = parseInt(time / 1000 / 60.0) + "分钟" + parseInt((parseFloat(time / 1000 / 60.0) - parseInt(time / 1000 / 60.0)) * 60) + "秒";
					} else if (time >= 60 * 60 * 1000 && time < 60 * 60 * 24 * 1000) {
						time =
							parseInt(time / 1000 / 3600.0) +
							"小时" +
							parseInt((parseFloat(time / 1000 / 3600.0) - parseInt(time / 1000 / 3600.0)) * 60) +
							"分钟" +
							parseInt(
								(parseFloat((parseFloat(time / 1000 / 3600.0) - parseInt(time / 1000 / 3600.0)) * 60) -
									parseInt((parseFloat(time / 1000 / 3600.0) - parseInt(time / 1000 / 3600.0)) * 60)) *
									60
							) +
							"秒";
					} else if (time >= 60 * 60 * 24 * 1000) {
						time =
							parseInt(time / 1000 / 3600.0 / 24) +
							"天" +
							parseInt((parseFloat(time / 1000 / 3600.0 / 24) - parseInt(time / 1000 / 3600.0 / 24)) * 24) +
							"小时" +
							parseInt((parseFloat(time / 1000 / 3600.0) - parseInt(time / 1000 / 3600.0)) * 60) +
							"分钟" +
							parseInt(
								(parseFloat((parseFloat(time / 1000 / 3600.0) - parseInt(time / 1000 / 3600.0)) * 60) -
									parseInt((parseFloat(time / 1000 / 3600.0) - parseInt(time / 1000 / 3600.0)) * 60)) *
									60
							) +
							"秒";
					} else {
						time = Math.round((time % (1000 * 60)) / 1000) + "秒";
					}
				}
				return time;
			},
		},
	});
});
