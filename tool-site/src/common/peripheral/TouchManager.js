import logger from "@base/logger";
import AudioManager from "@base/AudioManager";

/**
 * 触摸管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class TouchManager {
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

	/**上次按住类型[单位：多点] */
	lastPressType = null;
	/**上次按住时间[单位：时间戳] */
	lastPressTimestamp = null;
	/**上一次按住结束的位置 */
	lastPressEndPosition;

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
	 * 触摸管理对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} options 配置对象
	 */
	constructor(options) {
		/**
		 * 触屏事件
		 * touchcancel：当触摸被取消时触发，例如突然有来电或弹出框等情况。
		 * touchenter：当手指触摸元素边界进入时触发，类似鼠标的 mouseenter 事件。
		 * touchleave：当手指触摸元素边界离开时触发，类似鼠标的 mouseleave 事件。
		 * touchstart：当手指触摸屏幕时触发，类似鼠标的 mousedown 事件。
		 * touchend：当手指从屏幕上离开时触发，类似鼠标的 mouseup 事件。
		 * touchmove：当手指在屏幕上滑动时触发，类似鼠标的 mousemove 事件。
		 */
		this.loadAudio();

		document.addEventListener("touchcancel", this.handleCancel.bind(this));
		document.addEventListener("touchenter", this.handleEnter.bind(this));
		document.addEventListener("touchleave", this.handleLeave.bind(this));
		document.addEventListener("touchstart", this.handleStart.bind(this));
		document.addEventListener("touchend", this.handleEnd.bind(this));
		document.addEventListener("touchmove", this.handleMove.bind(this));
	}

	/**装载音频 */
	loadAudio() {
		if (!this.audioLoad) {
			this.moveAudio = new AudioManager("./resources/audios/mouse-move.ogg", false);
			this.leftClickAudio = new AudioManager("./resources/audios/mouse-left-click.mp3", false);
			this.rightClickAudio = new AudioManager("./resources/audios/mouse-right-click.ogg", false);
			this.audioLoad = !this.audioLoad;
		}
	}

	/**
	 * 当触摸被取消时触发，例如突然有来电或弹出框等情况。
	 * @param {*} event
	 */
	handleCancel(event) {
		logger.trace("touch cancel.");

		this.move = false;
		this.press = false;
	}

	/**
	 * 当手指触摸元素边界进入时触发，类似鼠标的 mouseenter 事件。
	 * @param {*} event
	 */
	handleEnter(event) {
		logger.trace("touch enter.");

		this.move = true;
		this.press = true;
	}

	/**
	 * 当手指触摸元素边界离开时触发，类似鼠标的 mouseleave 事件。
	 * @param {*} event
	 */
	handleLeave(event) {
		logger.trace("touch leave.");

		this.move = false;
		this.press = false;
	}

	/**
	 * 当手指触摸屏幕时触发，类似鼠标的 mousedown 事件。
	 * @param {*} event
	 */
	handleStart(event) {
		logger.trace("touch start.");

		this.move = true;
		this.press = true;
		this.pressX = event.touches[0].clientX;
		this.pressY = event.touches[0].clientY;
		this.pressStartTimestamp = Date.now();

		const currentPressType = event.touches.length;
		const currentPressTimestamp = this.pressStartTimestamp;
		const currentPressEndPosition = event.touches[0].clientX;

		const isDoubleClick =
			currentPressType === this.lastPressType &&
			Math.abs(this.lastPressEndPosition - currentPressEndPosition) < 30 &&
			currentPressTimestamp - this.lastPressTimestamp < this.singleClickThresholdTime;

		if (isDoubleClick) {
			switch (currentPressType) {
				case 1:
					logger.trace("touchstart left double click.");
					break;
				case 3:
					logger.trace("touchstart middle double click.");
					break;
				case 2:
					logger.trace("touchstart right double click.");
					break;
			}
		} else {
			switch (currentPressType) {
				case 1:
					logger.trace("touchstart left click.");
					break;
				case 3:
					logger.trace("touchstart middle click.");
					break;
				case 2:
					logger.trace("touchstart right click.");
					break;
			}
		}

		this.lastPressType = currentPressType;
		this.lastPressTimestamp = currentPressTimestamp;
		this.lastPressEndPosition = currentPressEndPosition;
	}

	/**
	 * 当手指从屏幕上离开时触发，类似鼠标的 mouseup 事件。
	 * @param {*} event
	 */
	handleEnd(event) {
		logger.trace("touch end.");

		this.move = false;
		this.press = false;
	}

	/**
	 * 当手指在屏幕上滑动时触发，类似鼠标的 mousemove 事件。
	 * @param {*} event
	 */
	handleMove(event) {
		logger.trace("touch move.");

		this.move = true;
		this.press = true;
		const currX = event.touches[0].clientX;
		const currY = event.touches[0].clientY;
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
}
