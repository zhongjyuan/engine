// 要执行的脚本数组
var scriptsToRun = [];

// 重新实现 window.close，因为内置的函数无法正常工作
window.addEventListener("message", function (e) {
	if (e.data === "close-window") {
		// 使用 ipcRenderer 发送消息给主进程，关闭窗口
		ipcRenderer.send("close-window");
	}
});

// 主进程逻辑
if (process.isMainFrame) {
	// 只在主框架中启用，这样从 iframe 中调用 window.close() 不会关闭整个标签页
	scriptsToRun.push(`
        window.close = function () {
            postMessage('close-window', '*')
        }
    `);
}

// 处理特定的网站

// Google 网站
if (
	window.location.hostname !== "drive.google.com" &&
	window.location.hostname !== "hangouts.google.com" &&
	(window.location.hostname === "google.com" || window.location.hostname.endsWith(".google.com"))
) {
	/*
	 * 重新定义 window.chrome 对象，因为某些网站（如 Google Drive 文件查看器）检查 Chrome 用户代理，然后根据条件执行一些操作（如 if(chrome.<module>) {}）
	 * 所以我们需要创建一个 chrome 对象来避免错误
	 * （https://github.com/electron/electron/issues/16587）
	 *
	 * 然而，如果 window.chrome 存在，Hangouts 将尝试连接到一个扩展程序并导致错误
	 * （https://github.com/minbrowser/min/issues/1051）
	 * 所以在 Hangouts 上禁用它
	 *
	 * 截至 2022 年 7 月 2 日，这也会导致 Drive 出错，所以在 Drive 上禁用它
	 */

	scriptsToRun.push(`
        window.chrome = {
            runtime: {
                connect: () => {
                    return {
                        onMessage: {
                            addListener: () => {console.warn('chrome.runtime is not implemented')},
                            removeListener: () => {console.warn('chrome.runtime is not implemented')},
                        },
                        postMessage: () => {console.warn('chrome.runtime is not implemented')},
                        disconnect: () => {console.warn('chrome.runtime is not implemented')},
                    }
                }
            }
        }
    `);
}

// drive.google.com - 修复点击文件打开的问题
if (window.location.hostname === "drive.google.com") {
	scriptsToRun.push(`
        var realWindowOpen = window.open

        window.open = function (url) {
            if (url) {
                return realWindowOpen(url)
            }
            
            return {
                document: new Proxy({}, {
                    get: function () {
                        return function () {
                            return document.createElement('div')
                        }
                    },
                    set: function () {
                        console.warn('unpatched set', arguments)
                    }
                }),
                location: {
                    replace: function (location) {
                        realWindowOpen(location)
                    }
                }
            }
        }
    `);
}

// news.google.com - 修复点击新闻文章的问题
if (window.location.hostname === "news.google.com") {
	scriptsToRun.push(`
        window.open = null
    `);
}

// calendar.google.com - 修复事件描述中的链接点击问题
if (window.location.hostname === "calendar.google.com") {
	scriptsToRun.push(`
        window.open = null
    `);
}

// 执行脚本
if (scriptsToRun.length > 0) {
	setTimeout(function () {
		webFrame.executeJavaScript(scriptsToRun.join(";"));
	}, 0);
}
