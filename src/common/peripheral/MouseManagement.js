import logger from "../logManagement";
import AudioManagement from "../AudioManagement";

/**
 * 鼠标管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class MouseManagement {
	/**是否移动 */
	move = false;
	/**移动X位置 */
	moveX = null;
	/**移动Y位置 */
	moveY = null;
	/**移动开始时间[单位：时间戳] */
	moveStartTimestamp = null;
	/**移动结束时间[单位：时间戳] */
	moveEndTimestamp = null;
	/**移动阈值速度[单位：像素/毫秒] */
	moveThresholdSpeed = 10;

	/**是否按住 */
	press = false;
	/**按住X位置 */
	pressX = null;
	/**按住Y位置 */
	pressY = null;
	/**按住开始时间[单位：时间戳] */
	pressStartTimestamp = null;
	/**按住阈值时间[单位：毫秒] */
	pressThresholdTime = 2000;
	/**单击阈值时间[单位：毫秒] */
	singleClickThresholdTime = 300;

	/**上次按住类型[单位：按钮] */
	lastPressType = null;
	/**上次按住时间[单位：时间戳] */
	lastPressTimestamp = null;

	/**是否拖拽 */
	drag = false;
	/**拖拽X位置 */
	dragX = null;
	/**拖拽Y位置 */
	dragY = null;
	/**拖拽开始时间[单位：时间戳] */
	dragStartTimestamp = null;
	/**拖拽结束时间[单位：时间戳] */
	dragEndTimestamp = null;
	/**拖拽阈值速度[单位：像素/毫秒] */
	dragThresholdSpeed = 10;

	/**音频加载完成 */
	audioLoad = false;
	/**移动音频 */
	moveAudio = null;
	/**左击音频 */
	leftClickAudio = null;
	/**右击音频 */
	rightClickAudio = null;

	/**
	 * 鼠标管理对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} options 配置对象
	 */
	constructor(options) {
		/**移动|左击|中击|右击|左双击|中双击|右双击|左短按|中短按|右短按|左长按|中长按|右长按|左拖拽|中拖拽|右拖拽
         * 
		/**
		 * click：当鼠标在元素上按下并释放时触发。
		 * dblclick：当鼠标双击元素时触发。
		 * mouseenter：当鼠标进入元素边界时触发。
		 * mouseleave：当鼠标离开元素边界时触发。
		 * mouseover：当鼠标移动到元素上方时触发。
		 * mouseout：当鼠标从元素上方移出时触发。
		 * contextmenu：当用户右键点击元素时触发。
		 * mousemove：当鼠标在元素上移动时持续触发。
		 * mousedown：当鼠标按下任意按钮时触发。
		 * mouseup：当鼠标释放按钮时触发。
		 */
		this.loadAudio();

		document.addEventListener("mouseenter", this.handleEnter.bind(this));
		document.addEventListener("mouseleave", this.handleLeave.bind(this));

		document.addEventListener("mouseover", this.handleOver.bind(this));
		document.addEventListener("mouseout", this.handleOut.bind(this));

		document.addEventListener("click", this.handleClick.bind(this));
		document.addEventListener("dblclick", this.handleDoubleClick.bind(this));

		document.addEventListener("mousedown", this.handleDown.bind(this));
		document.addEventListener("mouseup", this.handleUp.bind(this));
		document.addEventListener("mousemove", this.handleMove.bind(this));

		document.addEventListener("contextmenu", this.handleContextMenu.bind(this));
	}

	/**装载音频 */
	loadAudio() {
		if (!this.audioLoad) {
			this.moveAudio = new AudioManagement("./resources/audios/mouse-move.ogg", false);
			this.leftClickAudio = new AudioManagement("./resources/audios/mouse-left-click.mp3", false);
			this.rightClickAudio = new AudioManagement("./resources/audios/mouse-right-click.ogg", false);
			this.audioLoad = !this.audioLoad;
		}
	}

	/**鼠标按钮[-1:未知;0:左;1:中;2:右] */
	buttonType(event) {
		if ("buttons" in event) {
			/**兼容支持 buttons 属性的现代浏览器 */
			return event.buttons === 1 ? 0 : event.buttons === 2 ? 2 : event.buttons === 4 ? 1 : -1;
		} else if ("which" in event) {
			/**兼容支持 which 属性的旧版 IE 浏览器 */
			return event.which === 1 ? 0 : event.which === 2 ? 1 : event.which === 3 ? 2 : -1;
		} else {
			/**兼容其它浏览器 */
			return event.button === 0 ? 0 : event.button === 1 ? 1 : event.button === 2 ? 2 : -1;
		}
	}

	/**
	 * 当鼠标进入元素边界时触发
	 * @param {*} event
	 */
	handleEnter(event) {
		logger.trace("mouse enter.");

		this.move = true;
	}

	/**
	 * 当鼠标离开元素边界时触发
	 * @param {*} event
	 */
	handleLeave(event) {
		logger.trace("mouse leave.");

		this.move = false;
	}

	/**
	 * 当鼠标移动到元素上方时触发
	 * @param {*} event
	 */
	handleOver(event) {
		logger.trace("mouse over.");

		this.move = true;
	}

	/**
	 * 当鼠标从元素上方移出时触发
	 * @param {*} event
	 */
	handleOut(event) {
		logger.trace("mouse out.");

		this.move = false;
	}

	/**
	 * 当鼠标在元素上按下并释放时触发。
	 * @param {*} event
	 */
	handleClick(event) {
		logger.trace("mouse click.");

		this.move = true;
		this.leftClickAudio.play();
	}

	/**
	 * 当鼠标双击元素时触发。
	 * @param {*} event
	 */
	handleDoubleClick(event) {
		logger.trace("mouse dblclick.");

		this.move = true;
	}

	/**
	 * 当鼠标按下任意按钮时触发。
	 * @param {*} event
	 */
	handleDown(event) {
		logger.trace("mouse down.");

		this.move = true;
		this.press = true;
		this.pressX = event.clientX;
		this.pressY = event.clientY;
		this.pressStartTimestamp = Date.now();

		const currentPressType = this.buttonType(event);
		const currentPressTimestamp = this.pressStartTimestamp;
		const isDoubleClick = currentPressType === this.lastPressType && currentPressTimestamp - this.lastPressTimestamp < this.singleClickThresholdTime;
		if (isDoubleClick) {
			switch (currentPressType) {
				case 0:
					logger.trace("mousedown left double click.");
					break;
				case 1:
					logger.trace("mousedown middle double click.");
					break;
				case 2:
					logger.trace("mousedown right double click.");
					break;
			}
		} else {
			switch (currentPressType) {
				case 0:
					logger.trace("mousedown left click.");
					break;
				case 1:
					logger.trace("mousedown middle click.");
					break;
				case 2:
					logger.trace("mousedown right click.");
					break;
			}
		}

		this.lastPressType = currentPressType;
		this.lastPressTimestamp = currentPressTimestamp;
	}

	/**
	 * 当鼠标释放按钮时触发。
	 * @param {*} event
	 */
	handleUp(event) {
		logger.trace("mouse up.");

		this.move = true;
		this.press = false;
		this.pressEndTimestamp = Date.now();
	}

	/**
	 * 当鼠标在元素上移动时持续触发。
	 * @param {*} event
	 */
	handleMove(event) {
		logger.trace("mouse move.");

		this.move = true;
		const currX = event.clientX;
		const currY = event.clientY;
		const currTime = Date.now();

		if (this.audioLoad && this.moveX !== null && this.moveY !== null && this.moveEndTimestamp !== null) {
			const distance = Math.sqrt((currX - this.moveX) ** 2 + (currY - this.moveY) ** 2);
			const speed = distance / (currTime - this.moveEndTimestamp); /**移动速度，单位：像素/毫秒 */

			if (speed > this.moveThresholdSpeed) this.moveAudio.play();
		}

		this.moveX = currX;
		this.moveY = currY;
		this.moveEndTimestamp = currTime;
	}

	/**
	 * 当用户右键点击元素时触发。
	 * @param {*} event
	 */
	handleContextMenu(event) {
		logger.trace("mouse contextmenu.");

		this.move = true;
	}
}
