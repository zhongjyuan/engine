```json
{
    /**标签集合 */
	"labels": [
		{ "code": "social", "name": "社交" },
		{ "code": "video", "name": "视频" },
		{ "code": "music", "name": "音乐" },
		{ "code": "tool", "name": "工具" },
		{ "code": "shopping", "name": "购物" },
		{ "code": "wallpaper", "name": "壁纸" },
		{ "code": "game", "name": "游戏" },
		{ "code": "plugin", "name": "插件" },
		{ "code": "study", "name": "学习" }
	],

    /**应用集合 */
	"apps": [
		{
            /**应用标题 */
			"title": "多玩盒子",

            /**应用标签 */
			"labels": ["study"],

            /**应用logo */
			"icon": "../../pages/study/img/icon.png",

            /**应用描述 */
			"desc": "包含demo + 游戏 + 组件 + 工具的合集。",

            /**应用打开 */
			"open": {
                /**应用标题 */
				"title": "多玩盒子",

                /**应用地址 */
				"url": "/pages/study/index.html",

                /**应用图标 */
				"icon": {
					"type": "img",
					"content": "/pages/study/img/icon.png",
					"bg": "#375980"
				},

                /**是否允许调整窗口大小。*/
				"resizable": false,

                /**窗口初始大小 */
				"size": {
					"height": "700",
					"width": "400"
				}
			},

            /**应用安装 */
			"setup": {

                /**应用集合(支持一键安装多个应用) */
				"apps": {

                    /**应用(唯一标识) */
					"studybox": {

                        /**应用名称 */
						"title": "多玩盒子",

                        /**应用地址 */
						"url": "/pages/study/index.html",

                        /**应用图标 */
						"icon": {
							"type": "img",
							"content": "/pages/study/img/icon.png",
							"bg": "#375980"
						},

                        /**是否允许调整窗口大小。*/
						"resizable": false,

                        /**窗口初始大小 */
						"size": {
							"height": "700",
							"width": "400"
						},

                        /**应用描述 */
						"desc": "包含demo + 游戏 + 组件 + 工具的合集。",

                        /**应用作者 */
						"poweredBy": "zhongjyuan"
					}
				},

                /**桌面图标数据 */
				"shortcuts": ["studybox"],

                /**桌面菜单 */
				"menu": {

                    /**应用 */
					"studybox": {

                        /**应用唯一标识 */
						"app": "studybox",
                        
                        /**应用标题 */
						"title": "多玩盒子",

                        /**应用参数 */
						"params": {},

						"hash": ""
					}
				}
			}
		}
	]
}
```