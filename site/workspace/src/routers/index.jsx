import { Navigate } from "react-router-dom";

import Demo from "@/components/demo";

import Index from "@/pages/index";
import Window from "@/pages/window";

const router = [
	{
		path: "/",
		element: <Index />,
		children: [
			// 二级路由...
		],
	},
	{
		path: "/window",
		element: <Window />,
		children: [
			// 二级路由...
		],
	},
	{
		path: "/demo",
		element: <Demo />,
	},

	// 配置路由重定向 可配置404页面
	{
		path: "*",
		element: <Navigate to="/" />,
	},
];

export default router;
