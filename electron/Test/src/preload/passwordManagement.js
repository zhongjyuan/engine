/**自动填充用户名和密码 */
/**
 * 简单的用户名/密码字段检测器和自动填充工具。
 *
 * 页面加载时，我们尝试查找具有特定名称属性的输入字段。如果发现有用的内容，我们会发送一个IPC事件'password-autofill'来请求检查是否有自动填充数据可用。
 *
 * 当收到一个带有自动填充数据的IPC事件'password-autofill-match'时，我们会执行以下两种操作中的一种：
 *
 *      如果只有一个凭据匹配，我们将使用该数据填充输入字段。
 *
 *      如果有多个匹配，我们会在用户名/邮箱字段上添加一个焦点事件监听器，显示一个包含可用选项的小覆盖层。当用户选择其中一个选项时，我们会使用所选的凭据数据填充输入字段。
 *
 * 这段代码不适用于基于JavaScript的表单。我们不会监听所有DOM更改，而是期望登录表单在页面加载时出现在HTML代码中。我们可以向文档添加一个MutationObserver，或者DOMNodeInserted监听器，但我希望保持轻量化，尽量减少对浏览器性能的影响。
 */

/**密码图标(carbon:password) */
const keyIcon =
	'<svg width="22px" height="22px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M21 2a9 9 0 0 0-9 9a8.87 8.87 0 0 0 .39 2.61L2 24v6h6l10.39-10.39A9 9 0 0 0 30 11.74a8.77 8.77 0 0 0-1.65-6A9 9 0 0 0 21 2zm0 16a7 7 0 0 1-2-.3l-1.15-.35l-.85.85l-3.18 3.18L12.41 20L11 21.41l1.38 1.38l-1.59 1.59L9.41 23L8 24.41l1.38 1.38L7.17 28H4v-3.17L13.8 15l.85-.85l-.29-.95a7.14 7.14 0 0 1 3.4-8.44a7 7 0 0 1 10.24 6a6.69 6.69 0 0 1-1.09 4A7 7 0 0 1 21 18z" fill="currentColor"/><circle cx="22" cy="10" r="2" fill="currentColor"/></svg>';

/**当前解锁按钮对象 */
var currentUnlockButton = null;

/**当前自动填充列表 */
var currentAutoCompleteList = null;

/**
 * 移除自动填充列表
 */
function removeAutocompleteList() {
	// 如果当前自动填充列表存在且已附加到DOM中，则从DOM中删除它
	if (currentAutoCompleteList && currentAutoCompleteList.parentNode) {
		currentAutoCompleteList.parentNode.removeChild(currentAutoCompleteList);
	}
}

/**
 * 检查元素的属性值是否包含匹配数组中的至少一个值
 * @param {HTMLElement} element 元素
 * @param {string[]} attributes 属性列表
 * @param {string[]} matches 匹配数组
 * @returns {boolean} 如果元素的属性值包含匹配数组中的至少一个值，则返回true，否则返回false
 */
function checkAttributes(element, attributes, matches) {
	// 遍历属性列表
	for (const attribute of attributes) {
		// 获取属性值
		const value = element.getAttribute(attribute);

		// 如果属性值为空，则继续下一次循环
		if (value == null) {
			continue;
		}

		// 检查属性值是否包含匹配数组中的至少一个值
		if (matches.some((match) => value.toLowerCase().includes(match))) {
			return true;
		}
	}

	return false;
}

/**
 * 获取页面上包含提供的字符串之一的名称属性的所有输入框
 * @param {string[]} names 包含的字符串列表
 * @param {string[]} exclusionNames 排除的字符串列表
 * @param {string[]} types 类型列表
 * @returns {HTMLInputElement|null} 返回找到的最佳输入字段，如果没有找到则返回null
 */
function getBestInput(names, exclusionNames, types) {
	// 获取页面上的所有输入字段
	const allFields = [...(document.querySelectorAll("form input") || []), ...(document.querySelectorAll("input") || [])];

	// 此列表包含重复项，但我们只使用找到的第一个匹配项，因此无需去重

	// 遍历所有字段
	for (const field of allFields) {
		// 如果字段的类型不在指定的类型数组中，则继续下一次循环
		if (!types.includes(field.type)) {
			continue;
		}

		// 我们期望字段具有'name'、'formcontrolname'或'id'属性，用于标识它作为登录表单输入字段
		if (names.length === 0 || checkAttributes(field, ["name", "formcontrolname", "id", "placeholder", "aria-label"], names)) {
			// 如果字段不具有'name'、'formcontrolname'或'id'属性，并且不具有排除的属性值，并且不是隐藏字段，则返回该字段
			if (!checkAttributes(field, ["name", "formcontrolname", "id", "placeholder", "aria-label"], exclusionNames) && field.type !== "hidden") {
				return field;
			}
		}
	}

	// 没有找到符合条件的输入字段，则返回null
	return null;
}

/**
 * 获取页面上最佳的用户名输入框
 * @returns {HTMLInputElement|null} 返回找到的最佳用户名输入字段，如果没有找到则返回null
 */
function getBestUserNameInput() {
	// 调用getBestInput函数，传入包含的字符串列表、排除的字符串列表和类型列表
	return getBestInput(
		// 包含的字符串列表
		["user", "name", "mail", "login", "auth", "identifier"],
		// 排除的字符串列表
		["confirm", "filename"],
		// 类型列表
		["text", "email"]
	);
}

/**
 * 获取页面上最佳的密码输入框
 * @returns {HTMLInputElement|null} 返回找到的最佳密码输入字段，如果没有找到则返回null
 */
function getBestPasswordInput() {
	// 调用getBestInput函数，传入空的包含的字符串列表、排除的字符串列表和类型列表为["password"]
	return getBestInput(
		// 包含的字符串列表
		[],
		// 排除的字符串列表
		[],
		// 类型列表
		["password"]
	);
}

/**
 * 请求自动填充凭证
 */
function requestAutofill() {
	// 获取最佳的用户名输入框和密码输入框
	const userNameInput = getBestUserNameInput(); // 获取最佳的用户名输入框
	const passwordInput = getBestPasswordInput(); // 获取最佳的密码输入框

	// 如果存在最佳的用户名输入框和密码输入框，则发送自动填充请求
	if (userNameInput && passwordInput) {
		// 发送自动填充请求给主进程
		ipcRenderer.send("password-autofill");
	}
}

/**
 * 创建解锁按钮
 * @param {HTMLElement} inputElement 输入框元素
 * @returns {HTMLElement} 解锁按钮的容器元素
 */
function createUnlockButton(inputElement) {
	// 获取输入框的位置信息
	var inputRect = inputElement.getBoundingClientRect();

	// 创建解锁按钮的容器元素
	var unlockDiv = document.createElement("div");

	// 设置容器元素的样式
	unlockDiv.style.width = "20px";
	unlockDiv.style.height = "20px";
	unlockDiv.style.zIndex = 999999999999999;

	// 设置容器元素的位置
	unlockDiv.style.position = "absolute";
	unlockDiv.style.left = window.scrollX + (inputRect.left + inputRect.width - 20 - 10) + "px";
	unlockDiv.style.top = window.scrollY + (inputRect.top + (inputRect.height - 20) / 2.0) + "px";

	// 创建按钮元素
	var button = document.createElement("div");

	// 设置按钮元素的样式
	button.style.width = "20px";
	button.style.height = "20px";
	button.style.opacity = 0.7;
	button.style.color = window.getComputedStyle(inputElement).color;
	button.style.transition = "0.1s color";
	button.innerHTML = keyIcon;

	// 按钮悬停效果
	button.addEventListener("mouseenter", (event) => {
		button.style.opacity = 1.0;
	});
	button.addEventListener("mouseleave", (event) => {
		button.style.opacity = 0.7;
	});

	// 按钮点击事件
	button.addEventListener("mousedown", (event) => {
		event.preventDefault();
		requestAutofill();
	});

	// 将按钮添加到容器元素中
	unlockDiv.appendChild(button);

	// 返回解锁按钮的容器元素
	return unlockDiv;
}

/**
 * 在指定的输入框下方添加解锁按钮（如果适用）
 * @param {Node} target 要添加解锁按钮的输入框元素
 */
function maybeAddUnlockButton(target) {
	// 只有在同时存在用户名和密码输入框时才进行操作，以减少误报率
	if (target instanceof Node && getBestUserNameInput() && getBestPasswordInput()) {
		// 如果目标元素是用户名或密码输入框，则添加解锁按钮
		if (getBestUserNameInput().isSameNode(target) || getBestPasswordInput().isSameNode(target)) {
			// 创建解锁按钮
			const unlockButton = createUnlockButton(target);

			// 将解锁按钮添加到页面中
			document.body.appendChild(unlockButton);

			// 更新当前解锁按钮
			currentUnlockButton = unlockButton;
		}
	}
}

/**
 * 使用提供的凭据填充用户名和密码字段
 * @param {object} credentials - 包含用户名和密码的对象
 */
function fillCredentials(credentials) {
	const { username, password } = credentials;
	const inputEvents = ["keydown", "keypress", "keyup", "input", "change"];

	// 获取最佳用户名字段
	const userNameInput = getBestUserNameInput();
	if (userNameInput) {
		// 设置用户名字段的值
		userNameInput.value = username;

		// 模拟输入事件，以触发自动完成机制
		for (const event of inputEvents) {
			userNameInput.dispatchEvent(new Event(event, { bubbles: true }));
		}
	}

	// 获取最佳密码字段
	const passwordInput = getBestPasswordInput();
	if (passwordInput) {
		// 设置密码字段的值
		passwordInput.value = password;

		// 模拟输入事件，以触发自动完成机制
		for (const event of inputEvents) {
			passwordInput.dispatchEvent(new Event(event, { bubbles: true }));
		}
	}
}

// 为用户名输入框添加焦点和点击事件监听器。
//
// 当发生这些事件时，我们在输入框下方添加一个小的覆盖层，显示匹配的凭证列表。
// 在列表中点击一个项目，将选中的用户名/密码填充到输入框中。
//
// - element: 要添加监听器的输入框元素
// - credentials: 包含 { username, password } 对象的数组

/**
 * 为输入框添加焦点和点击事件监听器
 * @param {HTMLElement} element 输入框元素
 * @param {Array} credentials 凭证数组
 */
function addInputFocusListener(element, credentials) {
	// 获取输入框的位置和大小
	const inputRect = element.getBoundingClientRect();

	/**
	 * 创建选项列表容器
	 * @returns {HTMLElement} 选项列表容器
	 */
	function buildContainer() {
		// 创建一个新的 div 元素作为选项列表容器
		const suggestionsDiv = document.createElement("div");

		// 设置选项列表容器的样式
		suggestionsDiv.style = `
			position: absolute;
			border: 1px solid #d4d4d4;
			z-index: 999999;
			border-bottom: none;
			background: #FFFFFF;
			transform: scale(0);
			opacity: 0;
			transform-origin: top left;
			transition: 0.15s;
			color: #000000;
		`;
		suggestionsDiv.style.top = inputRect.y + inputRect.height + "px";
		suggestionsDiv.style.left = inputRect.x + "px";
		suggestionsDiv.id = "password-autocomplete-list";

		// 异步地设置选项列表容器的样式，以实现动画效果
		requestAnimationFrame(function () {
			suggestionsDiv.style.opacity = "1";
			suggestionsDiv.style.transform = "scale(1)";
		});

		return suggestionsDiv;
	}

	/**
	 * 向列表容器中添加选项
	 * @param {HTMLElement} parent 列表容器元素
	 * @param {string} username 用户名
	 */
	function addOption(parent, username) {
		// 创建一个新的 div 元素作为选项
		const suggestionItem = document.createElement("div");
		suggestionItem.textContent = username;
		suggestionItem.style = `
			padding: 10px;
			cursor: pointer;
			background-color: #fff;
			border-bottom: 1px solid #d4d4d4;
		`;

		// 鼠标悬停效果
		suggestionItem.addEventListener("mouseenter", (event) => {
			suggestionItem.style.backgroundColor = "#e4e4e4";
		});

		suggestionItem.addEventListener("mouseleave", (event) => {
			suggestionItem.style.backgroundColor = "#fff";
		});

		// 当用户点击选项时，将选中的凭证填充到表单输入框中，并移除选项列表容器
		suggestionItem.addEventListener("click", function (e) {
			const selectedCredentials = credentials.filter((el) => {
				return el.username === username;
			})[0];

			fillCredentials(selectedCredentials);

			removeAutocompleteList();

			element.focus();
		});

		parent.appendChild(suggestionItem);
	}

	/**
	 * 显示自动完成选项列表
	 * @param {Event} e 事件对象
	 */
	function showAutocompleteList(e) {
		// 移除之前的选项列表容器
		removeAutocompleteList();

		// 创建新的选项列表容器并添加选项
		const container = buildContainer();
		for (const cred of credentials) {
			addOption(container, cred.username);
		}

		// 将选项列表容器添加到页面中
		document.body.appendChild(container);

		currentAutoCompleteList = container;
	}

	// 添加焦点和点击事件监听器来显示自动完成选项列表
	element.addEventListener("focus", showAutocompleteList);
	element.addEventListener("click", showAutocompleteList);

	// 添加事件监听器，以在用户点击输入框之外的位置时隐藏选项列表容器
	document.addEventListener("click", function (e) {
		if (e.target !== element) {
			removeAutocompleteList();
		}
	});

	// 如果输入框已经获得焦点，立即显示自动完成列表。
	// 对于在加载页面时自动聚焦输入框的登录页面非常有用。
	if (element === document.activeElement) {
		showAutocompleteList();
	}
}

/**
 * 检查页面加载时是否存在已获得焦点的输入框，并在其下方添加解锁按钮（如果适用）
 */
function checkInitialFocus() {
	// 在当前获得焦点的输入框下方添加解锁按钮（如果适用）
	maybeAddUnlockButton(document.activeElement);
}

/**
 * 处理失去焦点事件，移除当前解锁按钮（如果存在）
 * @param {Event} event 失去焦点事件对象
 */
function handleUnlockButtonBlur(event) {
	// 如果当前存在解锁按钮并且其父元素不为空，则移除解锁按钮
	if (currentUnlockButton !== null && currentUnlockButton.parentElement != null) {
		// 移除当前解锁按钮
		currentUnlockButton.parentElement.removeChild(currentUnlockButton);

		// 重置当前解锁按钮为空
		currentUnlockButton = null;
	}
}

/**
 * 处理焦点事件，根据焦点元素在其下方添加解锁按钮（如果适用）
 * @param {Event} event 焦点事件对象
 */
function handleUnlockButtonFocus(event) {
	// 在焦点元素下方添加解锁按钮（如果适用）
	maybeAddUnlockButton(event.target);
}

// 处理从后端获取的凭据。预期凭据为一个包含{ username, password, manager }对象的数组。
ipcRenderer.on("password-autofill-match", (event, data) => {
	// 检查凭据来源是否与当前页面一致
	if (data.hostname !== window.location.hostname) {
		throw new Error("password origin must match current page origin");
	}

	// 如果凭据数组为空
	if (data.credentials.length === 0) {
		// 如果当前解锁按钮存在且有子元素
		if (currentUnlockButton && currentUnlockButton.children.length > 0) {
			currentUnlockButton.children[0].style.color = "rgb(180, 0, 0)";
		}
	}

	// 如果凭据数组长度为1
	else if (data.credentials.length === 1) {
		// 填充凭据
		fillCredentials(data.credentials[0]);

		// 获取最佳密码字段
		const firstPasswordField = getBestPasswordInput();
		if (firstPasswordField) {
			// 将焦点设置在最佳密码字段上
			firstPasswordField.focus();
		}
	}

	// 如果凭据数组长度大于1
	else {
		// 获取最佳用户名字段
		const firstField = getBestUserNameInput();
		if (firstField) {
			// 添加焦点监听器
			addInputFocusListener(firstField, data.credentials);

			// 将焦点设置在最佳用户名字段上
			firstField.focus();
		}
	}
});

/**
 * 将密码发送回主进程，以便保存到存储中
 */
function handleFormSubmit() {
	// 获取最佳的用户名和密码字段的值
	var usernameValue = getBestUserNameInput()?.value;
	var passwordValue = getBestPasswordInput()?.value;

	// 如果用户名和密码字段都有值，则将其发送回主进程以保存到存储中
	if (usernameValue && usernameValue.length > 0 && passwordValue && passwordValue.length > 0) {
		// 将密码发送回主进程
		ipcRenderer.send("password-form-filled", [window.location.hostname, usernameValue, passwordValue]);
	}
}

// 监听密码自动填充的快捷键事件，并触发自动填充检查
ipcRenderer.on("password-autofill-shortcut", (event) => {
	// 触发自动填充检查
	requestAutofill();
});

// 监听自动填充已启用事件，为输入字段初始化焦点监听器
ipcRenderer.on("password-autofill-enabled", (event) => {
	// 检查初始焦点
	checkInitialFocus();

	// 添加默认焦点事件监听器
	window.addEventListener("blur", handleUnlockButtonBlur, true); // 添加失去焦点事件监听器
	window.addEventListener("focus", handleUnlockButtonFocus, true); // 添加获得焦点事件监听器
});

// 检查密码自动填充是否配置，并发送检查请求
window.addEventListener("load", function (event) {
	// 发送密码自动填充检查请求
	ipcRenderer.send("password-autofill-check");
});

// 监听表单提交事件，并调用处理函数
window.addEventListener("submit", handleFormSubmit);

// 监听消息事件，处理表单提交
window.addEventListener("message", function (e) {
	if (e.data && e.data.message && e.data.message === "formSubmit") {
		handleFormSubmit();
	}
});

// 监听按钮[type=submit]的点击事件，并调用处理函数
window.addEventListener(
	"click",
	function (e) {
		const path = e.path || (e.composed && e.composedPath());
		if (!path) return;

		path.forEach(function (el) {
			if (el.tagName === "BUTTON" && el.getAttribute("type") === "submit" && !el.disabled) {
				handleFormSubmit();
			}
		});
	},
	true
);

// 执行JavaScript代码以修改表单提交行为
webFrame.executeJavaScript(`
    var origSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
        window.postMessage({message: 'formSubmit'})
        origSubmit.apply(this, arguments)
    }
`);
