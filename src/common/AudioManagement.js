/**
 * 音频管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @website http://zhongjyuan.club
 */
export default class AudioManagement {
	/**
	 * 音频管理对象
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} url 音频文件链接
	 * @param {*} loop 是否循环播放
	 */
	constructor(url, loop) {
		const AudioCtx = AudioContext || webkitAudioContext || mozAudioContext || msAudioContext;
		/**音频上下文对象 */
		this.context = new AudioCtx();
		/**音频文件链接 */
		this.url = url;
		/**事件处理对象 */
		this.handle = {};
		/**循环播放 */
		this.loop = loop || false;
		/**音频源缓存 */
		this.source = null;
		/**音频Buffer缓存 */
		this.audioBuffer = null;
		/**装载音频 */
		this.load();
	}

	/**
	 * 暂停
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 */
	pause() {
		if (this.source) {
			this.source.stop();
			this.source.playStatus = 1;
		}
	}

	/**
	 * 播放[0:未播放;1:已暂停;2:播放中]
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @returns
	 */
	play() {
		if (this.source) {
			switch (this.source.playStatus) {
				case 0:
					this.source.start();
					break;
				case 1:
					this.setSource(this.audioBuffer); // 重新设置buffer
					this.source.start();
					break;
				case 2:
					return false;
			}
			this.source.playStatus = 2;
		}
	}

	/**
	 * 监听事件[load、error]
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} eventName 事件名称
	 * @param {*} callback 回调函数
	 */
	addEventListener(eventName, callback) {
		if (!this.handle[eventName]) {
			this.handle[eventName] = [];
		}
		this.handle[eventName].push(callback);
	}

	/**
	 * 设置读取Source
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} buffer 音频解密Buffer数据
	 */
	setSource(buffer) {
		this.audioBuffer = buffer;
		this.source = null;
		this.source = this.context.createBufferSource();
		this.source.buffer = buffer;
		this.source.loop = this.loop;
		this.source.connect(this.context.destination);
		this.source.playStatus = 0;
		this.source.onended = () => {
			this.source.playStatus = 1;
		};
	}

	/**
	 * 读取Source
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 * @param {*} arrayBuffer 音频加密Buffer数据
	 */
	readSource(arrayBuffer) {
		const that = this;

		/**解码音频数据 */
		that.context.decodeAudioData(
			arrayBuffer,
			function (buffer) {
				that.setSource(buffer);
				const event = that.handle["load"];
				if (event) event.map((v) => v.call(that));
			},
			function (error) {
				const event = that.handle["error"];
				if (event) event.map((v) => v.call(that, error));
			}
		);
	}

	/**
	 * 转载音频文件[XMLHttpRequest]
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @website http://zhongjyuan.club
	 */
	load() {
		const that = this;

		const xhr = new XMLHttpRequest();
		xhr.open("GET", that.url, true);
		xhr.responseType = "arraybuffer";
		xhr.send();

		/**加载完成订阅 */
		xhr.addEventListener("load", function (e) {
			that.readSource(e.target.response);
		});

		/**加载异常订阅 */
		xhr.addEventListener("error", function (error) {
			const event = that.handle["error"];
			if (event) event.map((v) => v.call(that, error));
		});
	}
}
