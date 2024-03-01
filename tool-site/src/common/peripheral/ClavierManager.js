import logger from "@base/logger";
import AudioManager from "@base/AudioManager";

/**
 * 键盘管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class ClavierManager {
	/**音频加载完成 */
	audioLoad = false;
	/**按键音频 */
	keydownAudio = null;
	/**按键音频 */
	keyUpAudio = null;

	/**
	 * 键盘管理对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} options 配置对象
	 */
	constructor(options) {
		this.loadAudio(options);

		/**键盘按下 */
		document.addEventListener("keydown", this.handleDown.bind(this));

		/**键盘抬起 */
		document.addEventListener("keyup", this.handleUp.bind(this));
	}

	/**装载音频 */
	loadAudio(options) {
		if (!this.audioLoad) {
			this.keydownAudio = new AudioManager("./resources/audios/key-down.mp3", false);
			this.keyUpAudio = new AudioManager("./resources/audios/key-down.mp3", false);
			this.audioLoad = !this.audioLoad;
		}
	}

	/**
	 * 按下事件
	 * @param {*} event 事件对象
	 */
	handleDown(event) {
		logger.trace(`keydown：${event.key}`);

		this.keydownAudio.play();
	}

	/**
	 * 抬起事件
	 * @param {*} event 事件对象
	 */
	handleUp(event) {
		logger.trace(`keyup：${event.key}`);

		this.keydownAudio.pause();
	}
}
