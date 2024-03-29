import React, { useEffect } from "react";

export const Fallback = ({ error, resetErrorBoundary }) => {
	useEffect(() => {
		// 在组件挂载时加载 JavaScript 文件
		const script = document.createElement("script");
		script.src = "static/js/error.js";
		document.body.appendChild(script);

		// 在组件卸载时清除资源
		return () => {
			document.body.removeChild(script);
		};
	}, []); // 只在组件挂载和卸载时执行一次

	return (
		<div>
			<meta charSet="UTF-8" />
			<title>404 - Page</title>
			<link rel="stylesheet" href="static/css/error.css" />
			<div id="page">
				<div id="container">
					<h1>:(</h1>
					<h2>Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</h2>
					<h2>
						<span id="percentage">0</span>% complete
					</h2>
					<div id="details">
						<div id="qr">
							<div id="image">
								<img src="static/image/wechat.png" alt="QR Code" />
							</div>
						</div>
						<div id="stopcode">
							<h4>
								For more information about this issue and possible fixes, visit
								<br /> <a href="https://gitee.com/zhongjyuan">https://gitee.com/zhongjyuan</a>
							</h4>
							<h5>
								If you call a support person, give them this info:
								<br />
								Stop Code: {error.message}
							</h5>
							<button onClick={resetErrorBoundary}>Try again</button>
						</div>
					</div>
				</div>
			</div>
			{/* partial */}
		</div>
	);
};

export default Fallback;
