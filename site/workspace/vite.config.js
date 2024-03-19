import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa"; // 导入 Vite PWA 插件
import { createStyleImportPlugin, AntdResolve } from "vite-plugin-style-import";

import path from "path"; // 导入 Node.js 的 path 模块
import react from "@vitejs/plugin-react";

// 定义 Vite 配置
const config = (
	{ mode } // 使用箭头函数定义配置对象
) =>
	defineConfig({
		base: "./", //相对路径

		define: {
			"process.env.NODE_ENV": `"${mode}"`, // 定义 process.env.NODE_ENV 变量为当前模式值
		},

		build: {
			outDir: "build", // 设置输出目录为 "build"

			rollupOptions: {
				output: {
					manualChunks: (id) => "vendor", // 将所有模块打包到名为 "vendor" 的 chunk 中
				},
			},
		},

		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
				},
			},
		},

		plugins: [
			react(), // 使用 @vitejs/plugin-react 插件，处理 React 代码

			createStyleImportPlugin({ resolve: [AntdResolve] }),

			VitePWA({
				registerType: "autoUpdate", // 使用 VitePWA 插件，并配置 PWA 注册类型为 "autoUpdate"

				appleMobileWebAppCapable: true, // 设置苹果 WebApp 支持

				manifest: {
					name: "WorkSpace", // 应用名称
					short_name: "WorkSpace", // 应用短名称
					description: "一个集中化平台，用于组织和管理工作，提供统一界面和工具，以增进效率、协作和任务管理。", // 应用描述
					lang: "zh-CN", // 语言设置
					theme_color: "#723E03", // 主题颜色设置

					icons: [
						{ src: "favicon.ico", sizes: "128x128", type: "image/x-icon" }, // 添加图标
						{ src: "pwa-128x128.png", sizes: "128x128", type: "image/png" },
						{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
						{ src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
						{ src: "pwa-650x650.png", sizes: "650x650", type: "image/png" },
					],
				},

				workbox: {
					globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // 缓存相关静态资源

					runtimeCaching: [
						{
							method: "GET", // HTTP 请求方法
							handler: "CacheFirst", // 缓存策略
							urlPattern: /^https:\/\/jsonplaceholder/, // 缓存的 URL 匹配规则

							options: {
								cacheName: "test-external-api", // 创建缓存名称
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365, // 缓存有效期 365 天
								},
								cacheableResponse: {
									statuses: [0, 200], // 缓存响应状态码
								},
							},
						},
					],
				},

				devOptions: {
					enabled: true, // 是否支持开发模式下也使 PWA 生效
				},
			}),
		],

		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"), // 设置别名 @ 指向 src 目录
			},
		},

		server: {
			host: "localhost", // 主机设置
			port: 8080, // 端口设置
			open: true, // 启动后是否自动打开浏览器
			https: false, // 是否启用 HTTPS

			proxy: {
				"/api": {
					changeOrigin: true, // 更改请求来源
					target: "https://mock.apifox.com/m1/4184586-0-default", // 代理目标地址
					rewrite: (path) => path.replace(/^\api/, "/"), // 重写路径
				},
			},
		},
	});

export default config; // 导出配置对象
