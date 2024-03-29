// 获取百分比元素
var percentageElement = document.getElementById("percentage");
// 初始化百分比
var percentage = 0;

/**
 * 模拟处理函数，每次增加随机百分比并更新 UI
 */
function process() {
	// 增加随机百分比
	percentage += parseInt(Math.random() * 10);
	// 如果百分比超过 100，则设为 100
	if (percentage > 100) {
		percentage = 100;
	}
	// 更新 UI 中的百分比显示
	percentageElement.innerText = percentage;
	// 继续下一次处理
	processInterval();
}

/**
 * 定时调用模拟处理函数
 */
function processInterval() {
	// 随机时间间隔调用 process 函数
	setTimeout(process, Math.random() * (1000 - 500) + 500);
}

// 初始调用，开始模拟处理
processInterval();
