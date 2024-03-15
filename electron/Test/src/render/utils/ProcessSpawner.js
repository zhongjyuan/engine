const { spawn, spawnSync } = require("child_process");

const worker = new Worker("/src/utils/processWorker.js");

/**设置进程环境路径 */
let processPath = process.env.PATH;

// 在开发环境中通常存在于 path 中，但在打包后启动应用程序时不会存在
if (window.platformType === "mac" && !processPath.includes("/usr/local/bin")) {
	processPath += ":/usr/local/bin";
}

/**
 * ProcessSpawner 类，用于控制子进程输出。
 * 缓冲 stdout 和 stderr 的输出，等待进程退出，
 * 然后使用已收集的数据解析 Promise。
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年12月19日19:22:07
 */
class ProcessSpawner {
	/**
	 * 构造函数
	 *
	 * @param {string} command - 要执行的命令
	 * @param {Array<string>} args - 命令行参数
	 * @param {Object} env - 进程环境变量
	 * @param {number} timeout - 进程运行超时时间（毫秒）
	 */
	constructor(command, args, env = {}, timeout = undefined) {
		this.command = command;
		this.args = args;
		this.data = "";
		this.error = "";
		this.timeout = timeout;

		/**设置最大缓冲区大小：25 MB */
		this.maxBufferSize = 25 * 1024 * 1024;

		/**将自定义 env 和 PATH 合并成一个对象 */
		this.customEnv = Object.assign({}, process.env, { PATH: processPath });
		
		// 将自定义 env 合并成一个对象
		this.env = Object.assign({}, this.customEnv, env);
	}

	/**
	 * 同步执行子进程
	 *
	 * @param {string} input - 输入字符串
	 * @returns {string} 子进程输出的字符串
	 */
	execute(input) {
		// 生成子进程对象
		const process = spawnSync(this.command, this.args, {
			input: input,
			encoding: "utf8",
			env: this.env,
			maxBuffer: this.maxBufferSize,
			timeout: this.timeout,
		});

		// 返回 stderr 的数据，去除末尾可能存在的换行符
		return process.output[1].slice(0, -1);
	}

	/**
	 * 异步执行子进程
	 *
	 * @returns {Promise<string>} 子进程输出的字符串
	 */
	async execute() {
		return new Promise((resolve, reject) => {
			// 生成子进程对象
			const process = spawn(this.command, this.args, { env: this.env, maxBuffer: this.maxBufferSize });

			// 注册 stdout 的 data 事件处理程序
			process.stdout.on("data", (data) => {
				this.data += data;
			});

			// 注册 stderr 的 data 事件处理程序
			process.stderr.on("data", (data) => {
				this.error += data;
			});

			// 注册 close 事件处理程序
			process.on("close", (code) => {
				if (code !== 0) {
					// 如果进程退出时返回非零代码，则拒绝 Promise 并返回错误信息和已收集的数据
					reject({ error: this.error, data: this.data });
				} else {
					// 否则，解析 Promise 并返回已收集的数据
					resolve(this.data);
				}
			});

			// 注册 error 事件处理程序
			process.on("error", (data) => {
				// 拒绝 Promise 并返回错误信息
				reject({ error: data });
			});
		});
	}

	/**
	 * 在异步上下文中同步执行子进程
	 *
	 * @param {string} input - 输入字符串
	 * @returns {Promise<string>} 子进程输出的字符串
	 */
	executeSyncInAsyncContext(input) {
		return new Promise((resolve, reject) => {
			const taskId = Math.random();

			// 注册 worker 的消息处理程序
			worker.onmessage = function (e) {
				if (e.data.taskId === taskId) {
					if (e.data.error) {
						// 如果有错误，则拒绝 Promise 并返回错误信息
						reject(e.data.error);
					} else {
						// 否则，解析 Promise 并返回已收集的数据
						resolve(e.data.result);
					}
				}
			};

			// 向 worker 发送消息，包含需要执行的命令、参数、输入字符串、环境变量、缓冲区大小、任务 ID 和超时时间
			worker.postMessage({
				command: this.command,
				args: this.args,
				input: input,
				customEnv: this.env,
				maxBuffer: this.maxBufferSize,
				taskId: taskId,
				timeout: this.timeout,
			});
		});
	}

	/**
	 * 检查命令是否存在
	 *
	 * @returns {Promise<boolean>} 如果存在则返回 true，否则返回 false
	 */
	checkCommandExists() {
		return new Promise((resolve, reject) => {
			// 根据操作系统选择不同的命令来检查命令是否存在
			const checkCommand = window.platformType === "windows" ? "where" : "which";

			// 生成子进程对象
			const process = spawn(checkCommand, [this.command], { env: this.env, timeout: this.timeout });

			// 注册 stdout 的 data 事件处理程序
			process.stdout.on("data", (data) => {
				if (data.length > 0) {
					// 如果有输出，则认为命令存在
					resolve(true);
				}
			});

			// 注册 close 事件处理程序
			process.on("close", (code) => {
				// 如果我们没有得到任何输出，则认为命令不存在
				resolve(false);
			});

			// 注册 error 事件处理程序
			process.on("error", (data) => {
				resolve(false);
			});
		});
	}
}

module.exports = ProcessSpawner;
