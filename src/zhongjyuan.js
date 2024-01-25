require("./base");
require("./common");
require("./comps");
// require("./weixin");
require("./window");

export default window.zhongjyuan;

// ========================================================================================================================

/**动态增加HTML元素 */
window.zhongjyuan.addLoad(() => {
	document.title = `${window.zhongjyuan.runtime.name} | ${window.zhongjyuan.runtime.version} | ${window.zhongjyuan.runtime.authorization}`;

	/**异步加载外部资源（gsap、jquery、fontawesome） */
	import(/* webpackChunkName: "jquery" */ "@extends/jquery/jquery.3.7.1.min.js").then((module) => {
		window.$ = module.default; /**将 jQuery 绑定到全局变量中 */
		window.jQuery = module.default; /**将 jQuery 绑定到全局变量中 */
		import(/* webpackChunkName: "jquery.slimscroll" */ "@extends/jquery/jquery.slimscroll.1.3.8.min.js");
		import(/* webpackChunkName: "fontawesome" */ "@extends/fontawesome-6.4.2/css/all.min.css");
		import(/* webpackChunkName: "gsap" */ "@extends/gsap/gsap.3.12.2.min.js");
	});

	const head = document.head;
	const body = document.body;

	/**创建 link 元素，用于设置网页图标 */
	const favicon = document.createElement("link");
	favicon.rel = "shortcut icon";
	favicon.type = "image/x-icon";
	favicon.href = "./favicon.ico";
	favicon.media = "screen";
	head.appendChild(favicon);

	const metaTags = [
		{ httpEquiv: "Expires", content: "0" } /**设置缓存过期时间为0，禁止缓存 */,
		{ httpEquiv: "Cache", content: "no-cache" } /**禁止缓存 */,
		{ httpEquiv: "Pragma", content: "no-cache" } /**禁止缓存 */,
		{ httpEquiv: "Cache-control", content: "no-cache" } /**禁止缓存 */,
		{ httpEquiv: "Content-Type", content: "text/html; charset=UTF-8" } /**设置内容类型和字符集为UTF-8 */,
		{ name: "X-UA-Compatible", content: "IE=edge,chrome=1" } /**在IE和Chrome浏览器中使用最新的渲染引擎 */,
		{ name: "renderer", content: "webkit" } /**使用Webkit渲染引擎 */,
		{ name: "HandheldFriendly", content: "True" } /**适配手持设备 */,
		{ name: "msapplication-tap-highlight", content: "no" } /**禁用触摸高亮效果 */,
		{ name: "apple-mobile-web-app-capable", content: "yes" } /**开启web app功能 */,
		{ name: "apple-mobile-web-app-title", content: "Title" } /**设置Web应用标题 */,
		{ name: "apple-mobile-web-app-status-bar-style", content: "black" } /**设置状态栏样式为黑色 */,
		{ name: "viewport", content: "width=device-width, initial-scale=1.0" } /**设置视口宽度及初始缩放比例 */,
		{ name: "description", content: window.zhongjyuan.statement },
		{ name: "keywords", content: `${window.zhongjyuan.name},${window.zhongjyuan.version},${window.zhongjyuan.authorization}` },
		{ name: "author", content: window.zhongjyuan.author },
		{ name: "google", content: "notranslate" },
	];

	/**遍历需要添加的 meta 标签数组 */
	for (const meta of metaTags) {
		/**创建 meta 元素 */
		const metaTag = document.createElement("meta");
		if (meta.httpEquiv) {
			/**如果 http-equiv 属性不为空，则将其添加到 meta 元素中 */
			metaTag.setAttribute("http-equiv", meta.httpEquiv);
		} else {
			/**否则将 name 属性添加到 meta 元素中 */
			metaTag.setAttribute("name", meta.name);
		}
		/**将 content 属性添加到 meta 元素中 */
		metaTag.setAttribute("content", meta.content);
		/**将 meta 元素添加到文档头部标签中 */
		head.appendChild(metaTag);
	}

	// Clarity
	var scriptElement = document.createElement("script");
	scriptElement.type = "text/javascript";
	scriptElement.innerHTML = `
		(function(c,l,a,r,i,t,y){
			c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
			t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
			y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
		})(window, document, "clarity", "script", "kqrcj25hll");
	`;
	head.appendChild(scriptElement);

	/**创建根元素 div */
	const rootElement = document.createElement("div");
	rootElement.setAttribute("id", window.zhongjyuan.runtime.setting.custom.rootElement);
	rootElement.setAttribute("class", window.zhongjyuan.runtime.setting.custom.rootElement);

	/**创建 Vue 根元素前的占位元素 div */
	const vueBeforeRootElement = document.createElement("div");
	vueBeforeRootElement.setAttribute("id", window.zhongjyuan.runtime.setting.custom.vueRootElementBefore);
	vueBeforeRootElement.setAttribute("class", window.zhongjyuan.runtime.setting.custom.vueRootElementBefore);

	rootElement.appendChild(vueBeforeRootElement);
	body.appendChild(rootElement);
});

/**开启水印组件 */
window.zhongjyuan.addLoad(() => {
	window.zhongjyuan.comp.watermark.set({
		author: window.zhongjyuan.runtime.author,
		website: window.zhongjyuan.runtime.website,
		email: window.zhongjyuan.runtime.email,
	});
});

/**事件订阅 */
window.zhongjyuan.addLoad(() => {
	window.zhongjyuan.notify.on(
		"load-finish",
		(name, age) => {
			console.log(`My name is ${name}, and I am ${age} years old.`);
		},
		this
	);

	window.zhongjyuan.notify.on(
		"load-exception",
		(name, age) => {
			console.log(`My name is ${name}, and I am ${age} years old.`);
		},
		this
	);
});
