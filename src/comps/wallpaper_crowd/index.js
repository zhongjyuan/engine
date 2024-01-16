import logger from "@common/logManagement";
import { queryParentElement } from "@common/utils/dom";

import { comp_wallpaper_crowd as htmlTemplate } from "./html";

/**
 * 人群 - 组件 - ZHONGJYUAN
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年9月1日14:12:03
 */
export default (() => {
	/**
	 * 人对象
	 */
	class People {
		/**
		 * People类的构造函数
		 */
		constructor({ image, rect }) {
			this.image = image; // 保存人物图像的源文件
			this.setRect(rect); // 设置绘制人物图像的矩形区域

			this.x = 0; // 人物在画布上的x坐标
			this.y = 0; // 人物在画布上的y坐标
			this.anchorY = 0; // 人物图像的y轴锚点位置
			this.scaleX = 1; // 人物图像的水平缩放比例
			this.walk = null; // 用于控制人物行走动画的变量
		}

		/**
		 * 设置绘制人物图像的矩形区域
		 * @param {*} rect 矩形配置
		 */
		setRect(rect) {
			this.rect = rect; // 保存矩形区域
			this.width = rect[2]; // 矩形区域的宽度
			this.height = rect[3]; // 矩形区域的高度

			this.drawArgs = [this.image, ...rect, 0, 0, this.width, this.height]; // 绘制人物图像所需的参数数组
		}

		/**
		 * 在画布上渲染人物图像
		 * @param {*} ctx Canvas 2D绘图环境
		 */
		render(ctx) {
			ctx.save(); // 保存当前状态
			ctx.translate(this.x, this.y); // 平移画布坐标系到人物的位置
			ctx.scale(this.scaleX, 1); // 水平缩放画布坐标系
			ctx.drawImage(...this.drawArgs); // 绘制人物图像
			ctx.restore(); // 恢复之前保存的状态
		}
	}

	/**
	 * 生成指定范围内的随机数
	 * @param {number} min - 随机数的最小值
	 * @param {number} max - 随机数的最大值
	 * @returns {number} - 在指定范围内的随机数
	 */
	var random = (min, max) => min + Math.random() * (max - min);

	/**
	 * 从数组中随机选择一个元素的索引
	 * @param {Array} array - 待选择元素的数组
	 * @returns {number} - 随机选择的元素的索引
	 */
	var randomIndex = (array) => random(0, array.length) | 0;

	/**
	 * 从数组中随机选择一个元素并返回
	 * @param {Array} array - 待选择元素的数组
	 * @returns {*} - 随机选择的元素
	 */
	var randomArray = (array) => array[randomIndex(array) | 0];

	/**
	 * 从数组中删除指定位置的元素并返回该元素
	 * @param {Array} array - 待操作的数组
	 * @param {number} i - 要删除的元素的索引
	 * @returns {*} - 被删除的元素
	 */
	var removeArray = (array, i) => array.splice(i, 1)[0];

	/**
	 * 从数组中删除指定元素并返回删除结果
	 * @param {Array} array - 待删除元素的数组
	 * @param {*} item - 要删除的元素
	 * @returns {boolean} - 删除结果，true 表示成功删除，false 表示未找到元素
	 */
	var removeArrayItem = (array, item) => removeArray(array, array.indexOf(item));

	/**
	 * 从数组中随机删除一个元素并返回删除结果
	 * @param {Array} array - 待删除元素的数组
	 * @returns {boolean} - 删除结果，true 表示成功删除，false 表示数组为空
	 */
	var removeRandomArray = (array) => removeArray(array, randomIndex(array));

	/**
	 * 初始化人物位置和方向并返回初始位置信息
	 * @param {object} options - 选项对象，包含舞台和人物精灵对象
	 * @param {object} options.stage - 舞台对象，包含 width 和 height 属性，表示舞台宽度和高度
	 * @param {object} options.people - 人物精灵对象，包含 width 和 height 属性，表示人物宽度和高度
	 * @returns {object} 包含人物初始位置的 startX 和 startY 属性，以及结束位置的 endX 属性
	 */
	var resetPeople = ({ stage, people }) => {
		// 随机生成偏移量和方向
		var direction = Math.random() > 0.5 ? 1 : -1;
		var offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());

		// 根据方向计算起点和终点坐标，并设置水平方向缩放比例
		let startX;
		let endX;
		if (direction === 1) {
			startX = -people.width;
			endX = stage.width;
			people.scaleX = 1;
		} else {
			startX = stage.width + people.width;
			endX = 0;
			people.scaleX = -1;
		}

		// 计算起始垂直坐标，并设置垂直方向锚点
		var startY = stage.height - people.height + offsetY;
		people.x = startX;
		people.y = startY;
		people.anchorY = startY;

		// 返回初始位置信息
		return {
			startX,
			startY,
			endX,
		};
	};

	/**
	 * 控制人物进行普通行走动画
	 * @param {object} options - 选项对象，包含人物精灵对象和起始位置信息
	 * @param {object} options.people - 人物精灵对象
	 * @param {object} options.props - 包含人物初始位置的 startX 和 startY 属性，以及结束位置的 endX 属性
	 * @returns {object} 返回动画时间线对象
	 */
	var normalWalk = ({ people, props }) => {
		// 从 props 中获取初始位置信息
		var { startX, startY, endX } = props;

		// 设置水平和垂直方向移动的速度和间隔时间
		var xDuration = 10;
		var yDuration = 0.25;

		// 创建时间线对象
		var tl = gsap.timeline();
		// 设置时间线播放速度
		tl.timeScale(random(0.5, 1.5));

		// 水平方向移动动画
		tl.to(
			people,
			{
				duration: xDuration,
				x: endX,
				ease: "none",
			},
			0
		);

		// 垂直方向移动动画
		tl.to(
			people,
			{
				duration: yDuration,
				repeat: xDuration / yDuration,
				yoyo: true,
				y: startY - 10,
			},
			0
		);

		// 返回时间线
		return tl;
	};

	/**
	 * 从人群中移除指定的人物精灵对象并添加到可用人物数组中
	 * @param {object} people - 需要移除的人物精灵对象
	 */
	function removePeople(people) {
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;

		// 移除 onStagePeoples 数组中的指定人物精灵对象
		removeArrayItem(setting.onStagePeoples, people);

		// 将人物精灵对象添加到 offStagePeoples 数组中，供后续使用
		setting.offStagePeoples.push(people);
	}

	/**
	 * 将人物精灵对象添加到人群中
	 * @returns {object} - 返回添加到人群中的人物精灵对象
	 */
	function createPeople() {
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;
		var stage = setting.stage;

		// 从 offStagePeoples 数组中随机选择一个人物精灵对象
		var people = removeRandomArray(setting.offStagePeoples);

		// 从 walks 数组中随机选择一个行走动画函数，并调用它创建动画时间线对象
		var walk = randomArray(setting.peopleWalks)({ people, props: resetPeople({ people, stage }) }).eventCallback("onComplete", () => {
			removePeople(people);
			createPeople();
		});

		// 将动画时间线对象赋值给人物精灵对象的 walk 属性
		people.walk = walk;

		// 将人物精灵对象添加到 onStagePeoples 数组中，并根据 anchorY 进行排序
		setting.onStagePeoples.push(people);
		setting.onStagePeoples.sort((a, b) => a.anchorY - b.anchorY);

		return people;
	}

	/**
	 * 创建人群中的人物精灵对象
	 */
	function createPeoples() {
		var { getVariable } = window.zhongjyuan;
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;

		// 从 "setting-config" 变量中获取 rows 和 cols 属性
		var { rows, cols } = getVariable("crowd-config");

		// 获取人群图片对象的自然宽度和高度
		var { naturalWidth: width, naturalHeight: height } = setting.imgElement;

		// 计算人物精灵对象的总数、每个人物精灵对象的矩形宽度和高度
		var total = rows * cols;
		var rectWidth = width / rows;
		var rectHeight = height / cols;

		// 循环创建人物精灵对象并添加到人群中
		for (let i = 0; i < total; i++) {
			setting.peoples.push(
				new People({
					image: setting.imgElement,
					rect: [(i % rows) * rectWidth, ((i / rows) | 0) * rectHeight, rectWidth, rectHeight],
				})
			);
		}
	}

	/**
	 * 创建人群
	 */
	function createCrowd() {
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;

		// 循环直到 offStagePeoples 数组为空
		while (setting.offStagePeoples.length) {
			// 调用 createPeople 函数创建人物精灵对象，并随机设置行走动画的进度
			createPeople().walk.progress(Math.random());
		}
	}

	/**
	 * 调整大小
	 */
	function resize() {
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;

		// 设置人群舞台的宽度和高度
		setting.stage.width = setting.componentElement.clientWidth;
		setting.stage.height = setting.componentElement.clientHeight;

		// 设置人群组件元素的宽度和高度，乘以设备像素比
		setting.componentElement.width = setting.stage.width * devicePixelRatio;
		setting.componentElement.height = setting.stage.height * devicePixelRatio;

		// 停止显示中的人物精灵对象的行走动画
		setting.onStagePeoples.forEach((people) => {
			people.walk.kill();
		});

		// 清空显示中的人物精灵对象数组和可用的人物精灵对象数组
		setting.onStagePeoples.length = 0;
		setting.offStagePeoples.length = 0;

		// 将所有人物精灵对象添加到可用的人物精灵对象数组中
		setting.offStagePeoples.push(...setting.peoples);

		// 创建人群
		createCrowd();
	}

	/**
	 * 渲染
	 */
	function render() {
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;

		// 重新设置组件元素的宽度，以触发重新渲染
		setting.componentElement.width = setting.componentElement.width;

		// 获取绘图上下文对象
		var ctx = setting.componentElement.getContext("2d");

		// 保存当前绘图状态
		ctx.save();

		// 缩放绘图上下文，以适应设备像素比
		ctx.scale(devicePixelRatio, devicePixelRatio);

		// 遍历显示中的人物精灵对象数组，调用其 render 方法进行渲染
		setting.onStagePeoples.forEach((people) => {
			people.render(ctx);
		});

		// 恢复之前保存的绘图状态
		ctx.restore();
	}

	/**
	 * 显示人群组件
	 * @param {Element} dom - 组件要插入在哪个 DOM 节点下
	 */
	function show(dom) {
		hide();

		import(/* webpackChunkName: "comp_wallpaper_crowd" */ "./index.css");

		var { getVariable } = window.zhongjyuan;
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;

		// 从全局变量中获取人群组件配置对象
		var config = getVariable("crowd-config");

		// 将行走动画添加到人群对象的 peopleWalks 数组中
		setting.peopleWalks = [normalWalk];

		// 创建画布元素并设置其 ID 和类名
		setting.componentElement = document.createElement("canvas");
		setting.componentElement.innerHTML = htmlTemplate;
		setting.componentElement.setAttribute("id", setting.domId);
		setting.componentElement.setAttribute("class", setting.domId);

		// 创建图片元素，并根据配置对象中的 src 属性加载图片，在图片加载完成后创建人物和调整大小，启动渲染循环，并绑定 resize 事件处理函数
		setting.imgElement = document.createElement("img");
		setting.imgElement.onload = () => {
			createPeoples();
			resize();
			gsap.ticker.add(render);
			window.addEventListener("resize", resize);
		};
		setting.imgElement.src = config.src;

		// 获取组件要插入的父元素，并将画布元素添加到其内部
		var parentElement = queryParentElement(dom);
		parentElement.appendChild(setting.componentElement);
	}

	/**
	 * 隐藏人群组件
	 */
	function hide() {
		var { comp_wallpaper_crowd: setting } = window.zhongjyuan.runtime.setting;
		if (setting.componentElement) setting.componentElement.remove();
	}

	return {
		show: logger.decorator(show, "crowd-show"),
		hide: logger.decorator(hide, "crowd-hide"),
	};
})();
