var achievementList = [
	{
		id: 1,
		title: "第一次投喂", // 勋章名称
		desc: "投喂1次小鸡", // 描述
		profit: "500", // 奖励
		complete: false, // 是否完成
		completeID: 0, // 未完成0，已完成1
		completeTypeId: 1, // 成就类别，1=投喂次数；2=获得金币数；3=解锁粮食数
		completeCurrCount: 0, // 当前已完成数量 - 进度
		completeNeedCount: 1, // 满足条件的数量
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 2,
		title: "投喂小能手", // 勋章名称
		desc: "投喂2次小鸡", // 描述
		profit: "1000", // 奖励
		complete: false, // 是否完成
		completeID: 0,
		completeTypeId: 1, // 成就类别，1=投喂次数；2=获得金币数；3=解锁粮食数
		completeCurrCount: 0, // 当前已完成数量 - 进度
		completeNeedCount: 5, // 满足条件的数量
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 3,
		title: "青铜饲养员",
		desc: "投喂20次小鸡",
		profit: "2000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 20,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 4,
		title: "白银饲养员",
		desc: "投喂40次小鸡",
		profit: "5000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 40,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 5,
		title: "黄金饲养员",
		desc: "投喂60次小鸡",
		profit: "8000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 60,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 6,
		title: "铂金饲养员",
		desc: "投喂80次小鸡",
		profit: "11000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 80,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 7,
		title: "钻石饲养员",
		desc: "投喂100次小鸡",
		profit: "15000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 100,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 8,
		title: "星耀饲养员",
		desc: "投喂150次小鸡",
		profit: "20000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 150,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
	{
		id: 9,
		title: "王者饲养员",
		desc: "投喂200次小鸡",
		profit: "25000",
		complete: false,
		completeID: 0,
		completeTypeId: 1,
		completeCurrCount: 0,
		completeNeedCount: 200,
		oncomplete(state, achievements) {
			popUp("解锁成就", achievements.title);
		},
	},
];
