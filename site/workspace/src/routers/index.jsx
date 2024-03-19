import { Navigate } from "react-router-dom";

import Index from "../pages/index";
import Demo from "../pages/demo";

const router = [
	{
		path: "/",
		element: <Index />,
		children: [
			// 二级路由...
		],
	},
    {
        path: "/demo",
        element: <Demo />
    },

	// 配置路由重定向 可配置404页面
	{
		path: "*",
		element: <Navigate to="/" />,
	},
];

export default router;
