const { spawnSync } = require("child_process");

/**
 * 监听消息事件，执行系统命令并返回结果
 * @param {object} e - 包含任务信息的事件对象
 */
onmessage = function (e) {
	// 从事件数据中获取任务相关信息

	/**
	 * 获取任务标识符
	 */
	const taskId = e.data.taskId;

	/**
	 * 获取要执行的命令
	 */
	const command = e.data.command;

	/**
	 * 获取命令的参数数组
	 */
	const args = e.data.args;

	/**
	 * 获取传递给命令的输入内容
	 */
	const input = e.data.input;

	/**
	 * 获取自定义环境变量对象
	 */
	const customEnv = e.data.customEnv;

	/**
	 * 获取最大缓冲区大小（字节数）
	 */
	const maxBuffer = e.data.maxBuffer;

	/**
	 * 获取命令执行的超时时间（毫秒）
	 */
	const timeout = e.data.timeout;

	try {
		/**执行系统命令 */
		const process = spawnSync(command, {
			args: args,
			input: input,
			encoding: "utf8",
			env: customEnv,
			maxBuffer: maxBuffer,
			timeout: timeout,
		});

		// 检查执行结果
		if (process.error || process.signal || process.status) {
			// 如果出现错误或进程被终止，则抛出异常
			throw new Error("Process terminated: " + process.stderr + ", " + process.signal + ", " + process.error + ", " + process.status);
		}

		/**获取命令执行的输出内容 */
		let output = process.output[1];

		// 去除输出末尾可能存在的换行符
		if (output.slice(-1) === "\n") {
			output = output.slice(0, -1);
		}

		// 将任务结果发送回主线程
		window.postMessage({ taskId: taskId, result: output });
	} catch (e) {
		console.log(e);
		// 捕获异常，并发送错误消息回主线程
		window.postMessage({ taskId: taskId, error: e.toString() });
	}
};
