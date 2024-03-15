const labels = document.querySelectorAll(".form-control label");

labels.forEach((label) => {
	label.innerHTML = label.innerText
		// 放一个空字符串，作用是将一串字符串拆分成字符串数组
		.split("")
		// map会返回一个新数组，返回的新数组是原数组处理后的值，transition-delay是指等待多少时间后切换效果开始
		.map(
			(letter, idx) =>
				`<span style="transition-delay:${idx * 50}ms">${letter}</span>`
		)
		// join是把数组中的所有元素转换成一个字符串
		.join("");
});
