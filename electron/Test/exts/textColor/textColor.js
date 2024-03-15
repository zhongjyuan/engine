/**
 * 使用神经网络来确定文本颜色
 * @param {Object} input - 包含 r、g、b 三个属性的输入对象
 * @returns {Object} - 最终输出代表了黑色文本的概率
 */
var runNetwork = function anonymous(input) {
	// 神经网络的权重和偏置数据结构
	var net = {
		layers: [
			{
				r: {},
				g: {},
				b: {},
			},
			{
				0: {
					bias: 14.176907520571566,
					weights: {
						r: -3.2764240497480652,
						g: -16.90247884718719,
						b: -2.9976364179397814,
					},
				},
				1: {
					bias: 9.086071102351246,
					weights: {
						r: -4.327474143397604,
						g: -15.780660155750773,
						b: 2.879230202567851,
					},
				},
				2: {
					bias: 22.274487339773476,
					weights: {
						r: -3.5830205067960965,
						g: -25.498384261673618,
						b: -6.998329189107962,
					},
				},
			},
			{
				black: {
					bias: 17.873962570788997,
					weights: {
						0: -15.542217788633987,
						1: -13.377152708685674,
						2: -24.52215186113144,
					},
				},
			},
		],
		outputLookup: true,
		inputLookup: true,
	};

	// 计算神经网络的输出
	for (var i = 1; i < net.layers.length; i++) {
		var layer = net.layers[i];
		var output = {};

		// 计算当前层中每个节点的输出
		for (var id in layer) {
			var node = layer[id];
			var sum = node.bias;

			// 计算输入和权重的乘积之和
			for (var iid in node.weights) {
				sum += node.weights[iid] * input[iid];
			}

			// 通过 sigmoid 函数计算输出值
			output[id] = 1 / (1 + Math.exp(-sum));
		}

		// 将当前层的输出作为下一层的输入
		input = output;
	}

	// 返回最终的输出
	return output;
};

module.exports = runNetwork; // 导出 runNetwork 函数，以便其他模块可以使用它
