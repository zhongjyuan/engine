# 全局静态配置详解
```js
ZHONGJYUAN.static = {
    
    /**站点名称 */
    name: 'window',

    /**站点版本号 */
    version: "1.0.0",

    /**作者 */
    author: 'zhongjyuan',

    /**邮箱 */
    email: 'zhongjyuan@outlook.com',

    /**官网 */
    website: 'http://zhongjyuan.club',

    /**信息 */
    information:{
        /**加载完毕控制台提示信息 */
		welcome: "zhongjyuan 强力驱动\n更多信息：http://zhongjyuan.club",

        /**版权详细信息 */
		copyright: "copyright@2023 zhongjyuan.club",

        /**其他信息(可留空) */
		statement: "接下来过的每一天,都是余生中最年轻的一天!",

        /**是否展示其他信息 */
		show_statement: true,
    },

    /**应用 */
	app: {
        /**锁定的应用(不允许被脚本修改) */
		locked: ["fa", "system", "browser", "color-picker"],
        
        /**受信任的应用(可以使用敏感API) */
		trusted: ["system"],
	},

    /**图标 */
	icon: {
        /**启动图标 */
		start: "html5",
	},

    /**存档 */
	storage: {
        /**基础数据 */
		basic: "basic.json",

        /**浏览器数据 */
		browser: "browse.json",
	},

    /**开关 */
	switch: {
        /**启用关闭前询问(打包app时请关闭防止出错) */
		ask_before_close: true,

        /**在IE下提示体验不佳信息 */
		remind_poor_experience: true,
        
        /**存档数据是否可被普通用户修改 */
		storage_change: true,
        
        /**是否展示数据管理中心 */
		show_datacenter: true,
	},

    /**启用更多调试信息 */
    debug: false,

    /**语言 */
    lang: 'zh-cn',

    /**推荐留空，自动从文件加载 */
    languages: {},

    /**授权信息 */
    authorization: '开发版',

    /**序列号 */
    serialNumber: null,/

  };
```